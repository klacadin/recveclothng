ALTER TABLE event_registrations
ADD COLUMN IF NOT EXISTS runner_number integer;

WITH numbered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY created_at, id) - 1 AS n
  FROM event_registrations
  WHERE payment_status = 'paid'
    AND runner_number IS NULL
)
UPDATE event_registrations r
SET runner_number = numbered.n
FROM numbered
WHERE r.id = numbered.id;

CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_event_runner_number_uidx
ON event_registrations (event_id, runner_number);
