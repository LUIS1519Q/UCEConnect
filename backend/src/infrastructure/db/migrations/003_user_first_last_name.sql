ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);

UPDATE users SET
    first_name = CASE
        WHEN position(' ' in name) > 0 THEN split_part(name, ' ', 1)
        ELSE name
    END,
    last_name = CASE
        WHEN position(' ' in name) > 0 THEN trim(substring(name from position(' ' in name) + 1))
        ELSE ''
    END
WHERE first_name IS NULL;

ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
