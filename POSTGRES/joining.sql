SELECT
    users.name,    -- full table names (no aliases) makes the source clear
    posts.title,
    users.id,      -- to avoid an "ambiguous column" error
    posts.user_id
FROM
    posts
INNER JOIN users   -- 'INNER' is the default, but writing it explicitly is a best practice
    ON posts.user_id = users.id -- Joins rows based on matching keys
LIMIT 10;