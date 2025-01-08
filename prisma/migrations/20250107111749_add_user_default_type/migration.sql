-- This is an empty migration.
UPDATE "UserTeam"
SET "type" = 'OWNER'
WHERE "type" IS NULL;