ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS convenience_fee numeric(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS promo_eligible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS promo_rank integer,
  ADD COLUMN IF NOT EXISTS promo_qualified_at timestamptz,
  ADD COLUMN IF NOT EXISTS free_souvenir_shirt boolean NOT NULL DEFAULT false;
CREATE TABLE IF NOT EXISTS event_souvenir_promo_counters (
  event_id uuid PRIMARY KEY REFERENCES events(id) ON DELETE CASCADE,
  awarded integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_promo_rank_uidx ON event_registrations (event_id, promo_rank)
WHERE promo_rank IS NOT NULL;
CREATE OR REPLACE FUNCTION assign_event_souvenir_promo(
    p_registration_id uuid,
    p_limit integer DEFAULT 150
  ) RETURNS SETOF event_registrations LANGUAGE plpgsql AS $$
DECLARE r event_registrations;
next_rank integer;
is_promo_category boolean;
BEGIN
SELECT * INTO r
FROM event_registrations
WHERE id = p_registration_id FOR
UPDATE;
IF NOT FOUND THEN RETURN;
END IF;
IF r.payment_status IS DISTINCT
FROM 'paid' THEN RETURN NEXT r;
RETURN;
END IF;
r.paid_at := COALESCE(r.paid_at, now());
is_promo_category := (
  regexp_replace(
    lower(coalesce(r.ticket_slug, '')),
    '\s+',
    '',
    'g'
  ) IN ('12km', '25km')
  OR regexp_replace(
    lower(coalesce(r.ticket_name, '')),
    '\s+',
    '',
    'g'
  ) IN ('12km', '25km')
);
IF r.promo_rank IS NOT NULL THEN
UPDATE event_registrations
SET paid_at = COALESCE(event_registrations.paid_at, r.paid_at),
  promo_eligible = is_promo_category,
  free_souvenir_shirt = is_promo_category
  AND event_registrations.promo_rank <= p_limit,
  updated_at = now()
WHERE id = r.id
RETURNING * INTO r;
RETURN NEXT r;
RETURN;
END IF;
IF NOT is_promo_category THEN
UPDATE event_registrations
SET paid_at = COALESCE(event_registrations.paid_at, r.paid_at),
  promo_eligible = false,
  free_souvenir_shirt = false,
  updated_at = now()
WHERE id = r.id
RETURNING * INTO r;
RETURN NEXT r;
RETURN;
END IF;
INSERT INTO event_souvenir_promo_counters (event_id, awarded, updated_at)
VALUES (r.event_id, 0, now()) ON CONFLICT (event_id) DO NOTHING;
UPDATE event_souvenir_promo_counters
SET awarded = awarded + 1,
  updated_at = now()
WHERE event_id = r.event_id
RETURNING awarded INTO next_rank;
UPDATE event_registrations
SET paid_at = COALESCE(event_registrations.paid_at, r.paid_at),
  promo_eligible = true,
  promo_rank = next_rank,
  promo_qualified_at = COALESCE(event_registrations.promo_qualified_at, now()),
  free_souvenir_shirt = next_rank <= p_limit,
  updated_at = now()
WHERE id = r.id
RETURNING * INTO r;
RETURN NEXT r;
END;
$$;
UPDATE event_registrations
SET paid_at = COALESCE(paid_at, updated_at, created_at)
WHERE payment_status = 'paid'
  AND paid_at IS NULL;
INSERT INTO event_souvenir_promo_counters (event_id, awarded)
SELECT DISTINCT event_id,
  0
FROM event_registrations ON CONFLICT (event_id) DO NOTHING;
WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY event_id
      ORDER BY COALESCE(paid_at, updated_at, created_at),
        id
    ) AS n
  FROM event_registrations
  WHERE payment_status = 'paid'
    AND promo_rank IS NULL
    AND (
      regexp_replace(lower(coalesce(ticket_slug, '')), '\s+', '', 'g') IN ('12km', '25km')
      OR regexp_replace(lower(coalesce(ticket_name, '')), '\s+', '', 'g') IN ('12km', '25km')
    )
)
UPDATE event_registrations r
SET promo_rank = ranked.n,
  promo_eligible = true,
  free_souvenir_shirt = ranked.n <= 150,
  promo_qualified_at = COALESCE(
    r.promo_qualified_at,
    r.paid_at,
    r.updated_at,
    r.created_at
  )
FROM ranked
WHERE r.id = ranked.id;
UPDATE event_registrations
SET promo_eligible = false,
  free_souvenir_shirt = false
WHERE (
    regexp_replace(lower(coalesce(ticket_slug, '')), '\s+', '', 'g') NOT IN ('12km', '25km')
    AND regexp_replace(lower(coalesce(ticket_name, '')), '\s+', '', 'g') NOT IN ('12km', '25km')
  )
  AND promo_rank IS NULL;
UPDATE event_souvenir_promo_counters c
SET awarded = COALESCE(
    (
      SELECT MAX(r.promo_rank)
      FROM event_registrations r
      WHERE r.event_id = c.event_id
        AND r.promo_rank IS NOT NULL
    ),
    0
  ),
  updated_at = now();