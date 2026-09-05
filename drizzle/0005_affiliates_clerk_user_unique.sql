-- Enforce one Clerk user → one affiliate row (invites may leave clerk_user_id null)
DROP INDEX IF EXISTS affiliates_clerk_user_id_idx;
CREATE UNIQUE INDEX IF NOT EXISTS affiliates_clerk_user_id_uidx ON affiliates (clerk_user_id)
WHERE clerk_user_id IS NOT NULL;