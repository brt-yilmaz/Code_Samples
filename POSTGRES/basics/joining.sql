
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

---------------------- Full Outer Join

SELECT
    employees.name AS employee_name,
    projects.title AS project_title,
    employees.id AS emp_id,
    projects.id AS proj_id
FROM
    employees
FULL OUTER JOIN projects 
    ON employees.project_id = projects.id;

/*
  | employee_name | project_title      | emp_id | proj_id 
  |---------------|--------------------|--------|---------
  | John Doe      | Mobile App Revamp  | 101    | 50      
  | Jane Smith    | Website Migration  | 102    | 51      
  | Mike Ross     | NULL               | 103    | NULL    
  | NULL          | AI Integration     | NULL   | 52      
  
*/

--------------- handle orphaned data
SELECT
    posts.title AS post_title,
    posts.content AS post_body,
    -- COALESCE Function: Returns the first NON-NULL value in the list.
    -- If users.name is NULL (because the user was deleted), it returns 'Unknown User'.
    COALESCE(users.name, 'Unknown User') AS author_name,
    posts.user_id
FROM
    posts              -- LEFT TABLE (Child): We want to see ALL posts.
LEFT JOIN users        -- RIGHT TABLE (Parent): We try to find the matching user.
    ON posts.user_id = users.id;

/*
  | post_title       | post_body          | author_name    
  |------------------|--------------------|----------------
  | SQL Tutorial     | Intro to Select... | John Doe       
  | React Basics     | Components are...  | Jane Smith     
  | Legacy Thread    | Old discussion...  | Unknown User   
  */

-------------------------- union

SELECT 
    name AS contact_name,
    email AS contact_email,
    'Customer' AS source_type  
FROM 
    customers

UNION  -- 'UNION' removes duplicates. Use 'UNION ALL' to keep duplicates

SELECT 
    name,
    email,
    'Supplier' AS source_type
FROM 
    suppliers;
/*
| contact_name   | contact_email      | source_type 
|----------------|--------------------|-------------
| Alice Johnson  | alice@gmail.com    | Customer    
| Bob Smith      | bob@yahoo.com      | Customer    
| TechCorp Inc.  | sales@techcorp.com | Supplier    
| Office Depot   | contact@office.com | Supplier    
*/