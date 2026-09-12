-- you can combine archived table. 
-- Rules
---- same number of columns (you can fill with mock values but the type should be the same). you can add new column what ever column you want but it should be in both of the tables  
-- union by default remove duplicates, if you want to see duplicates command should be "union all" , this is also cheaper for postgresql
-- duplicate means every column in the rows should have the same values

-- METHOD 1: UNION ALL (Recommended: Faster, preserves duplicates, cheaper for PostgreSQL)
SELECT 
    id,
    user_id,
    order_amount,
    username,              -- String type in both SELECT statements
    'archive_2024' AS source_table -- New column added to both tables
FROM orders_2024_archive

UNION ALL

SELECT 
    id,
    user_id,
    order_amount,
    'Unknown' AS username, -- Mock value matching the string data type
    'archive_2023' AS source_table -- New column added to both tables
FROM orders_2023_archive;


------------------------------------------------------------------


-- METHOD 2: UNION (Removes duplicate rows, higher performance cost)
SELECT 
    id,
    user_id,
    order_amount,
    username,
    'archive_2024' AS source_table
FROM orders_2024_archive

UNION

SELECT 
    id,
    user_id,
    order_amount,
    'Unknown' AS username,
    'archive_2023' AS source_table
FROM orders_2023_archive;