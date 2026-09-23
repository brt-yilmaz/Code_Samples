-- after grouping we can't use where so we should use HAVING(filter for groups)
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(total) AS total_revenue
FROM orders
GROUP BY customer_id
HAVING COUNT(*) > 2 AND SUM(total) > 400;

SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(total) AS total_revenue
FROM orders
WHERE total >= 100 -- eleminate in first place
GROUP BY customer_id
HAVING SUM(total) > 300; -- eleminate after grouping
