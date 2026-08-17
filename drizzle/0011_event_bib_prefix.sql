DROP INDEX IF EXISTS event_registrations_event_runner_number_uidx;
UPDATE event_registrations
SET runner_number = NULL
WHERE runner_number IS NOT NULL;
WITH numbered AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY event_id,
      COALESCE(ticket_slug, '')
      ORDER BY created_at,
        id
    ) AS n
  FROM event_registrations
  WHERE payment_status = 'paid'
)
UPDATE event_registrations r
SET runner_number = numbered.n
FROM numbered
WHERE r.id = numbered.id;
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_ticket_runner_number_uidx ON event_registrations (
  event_id,
  COALESCE(ticket_slug, ''),
  runner_number
)
WHERE runner_number IS NOT NULL;