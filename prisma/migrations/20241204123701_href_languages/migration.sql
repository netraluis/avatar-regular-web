-- This is an empty migration.

INSERT INTO "HrefLanguages" ("id", "text", "href", "language", "textHrefId")
SELECT
    gen_random_uuid(),                      -- Generar un UUID único para cada registro
    COALESCE("text", ''),
    COALESCE("href", ''),
    COALESCE("language", 'EN'),
    "id"
FROM "TextHref";

UPDATE "TextHref" SET "text" = NULL, "href" = NULL, "language" = NULL;

