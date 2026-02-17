WITH CustomerTotals AS (
    -- Step 1: Calculate total spending per user
    SELECT 
        user_id, 
        SUM(amount) as total_spent
    FROM orders
    GROUP BY user_id
),
AverageSpending AS (
    -- Step 2: Calculate the average of those totals
    SELECT AVG(total_spent) as avg_spent FROM CustomerTotals
)

SELECT 
    users.name,
    CustomerTotals.total_spent,
    AverageSpending.avg_spent
FROM 
    users
JOIN CustomerTotals 
    ON users.id = CustomerTotals.user_id
CROSS JOIN AverageSpending 
WHERE 
    CustomerTotals.total_spent > AverageSpending.avg_spent;

/*
  -------------------------------------------------------
  EXPECTED OUTPUT
  -------------------------------------------------------
  | name            | total_spent | avg_spent |
  |-----------------|-------------|-----------|
  | Alice Wonderland| 500.00      | 350.00    |
  | Bob Builder     | 850.00      | 350.00    |
  
  * Charlie (Total: 100.00) is hidden because he is below the average.
  -------------------------------------------------------
*/