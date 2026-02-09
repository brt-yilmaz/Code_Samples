
--------------------------- Inner Join
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


---------------------- Left join
SELECT
    users.name,    -- This column will always be populated because 'users' is the Left Table
    posts.title    -- This column will be NULL if the user has not written a post
FROM
    users          -- LEFT TABLE: get all users 
LEFT JOIN posts    -- RIGHT TABLE: only matched ones
    ON users.id = posts.user_id
ORDER BY
    users.id;


SELECT
    users.name,
    users.email
FROM
    users          -- We start with all users
LEFT JOIN posts 
    ON users.id = posts.user_id
WHERE
    posts.id IS NULL; 
                      -- Since LEFT JOIN returns NULL for non-matching rows, 
                      -- only the users WITHOUT posts.

---------------------  Right Join
---------------------- Just use left join, no ninja code, no show off