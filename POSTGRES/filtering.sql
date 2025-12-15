-- 1. OPERATOR PRECEDENCE (AND vs. OR)
-- -----------------------------------------------------------------
-- PROBLEM: Without parentheses, AND is executed before OR.
-- This query returns EVERY user named 'berat', regardless of their status.
SELECT * FROM users 
WHERE name = 'berat' OR age > 45 AND status = 'active';

-- SOLUTION: Always use parentheses to group logic explicitly.
-- This ensures that the status check applies to both conditions.
SELECT * FROM users 
WHERE (name = 'berat' OR age > 45) AND status = 'active';


-- 2. THE 'IN' OPERATOR & LISTS
-- -----------------------------------------------------------------
-- Bad Practice: Repetitive OR statements are hard to read and maintain.
SELECT * FROM users 
WHERE id = 1 OR id = 2 OR id = 3;

-- Best Practice: Use the IN operator for a list of values.
SELECT * FROM users 
WHERE id IN (1, 2, 3);

-- Advanced: Using IN with a Subquery.
-- Fetch users whose IDs match the ID found in the subquery.
SELECT * FROM users 
WHERE id IN (
    SELECT id FROM users WHERE email = 'beratyilmaz3102@gmail.com'
);


-- 3. STRING MATCHING (LIKE vs. ILIKE)
-- -----------------------------------------------------------------
-- SYNTAX NOTE: Never write 'WHERE LIKE column ='. Correct is 'WHERE column LIKE'.

-- Case Sensitive Matching
-- Will match 'apple' but NOT 'Apple'.
SELECT * FROM users 
WHERE email LIKE 'a%';

-- Case Insensitive Matching (Specific to PostgreSQL)
-- Will match both 'apple' and 'Apple'.
SELECT * FROM users 
WHERE email ILIKE 'a%'; 
-- Note: In MySQL, the standard LIKE is usually case-insensitive by default.


-- 4. HANDLING NULL VALUES
-- -----------------------------------------------------------------
-- IMPORTANT: NULL is not a value, it is a state of "unknown".
-- You cannot use '=' to compare NULL.

-- Correct Way:
SELECT * FROM users WHERE phonenumber IS NULL;

-- Wrong Way (Returns nothing):
-- SELECT * FROM users WHERE phonenumber = NULL;

-- COALESCE FUNCTION
-- Returns the first non-null value in the list.
-- Logic: If name is null, try username. If both are null, return 'Anonym'.
SELECT *, COALESCE(name, username, 'Anonym') AS display_name 
FROM users;


-- 5. GROUP BY & AGGREGATION
-- -----------------------------------------------------------------
-- Rule: Every non-aggregated column in SELECT must be in GROUP BY.
-- Rule: Use HAVING to filter results *after* aggregation (WHERE is for *before*).

SELECT 
    customer_id, 
    COUNT(*) AS order_count,            
    SUM(total) AS total_revenue,        
    EXTRACT(year FROM created_at) AS year 
FROM orders 
GROUP BY 
    customer_id, 
    EXTRACT(year FROM created_at) 
HAVING 
    EXTRACT(year FROM created_at) > 2023;