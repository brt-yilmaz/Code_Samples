--- COUNT
-- select count (*) is the fastest way to count rows, instead of giving spesific column name
-- for columns use select count (phone_numbers) ** non null values will be counted
-- you can count also null values with
select count (id) as id_count, count(phone_number) as phone_count -- difference is null phone_numbers
 

 --- SUM, MIN, MAX ...
 -- ignoring nulls , you don't need to think

select customer_id,
count(*) as order_count,
sum(total) as total_revenue
from orders
group by customer_id 

-- you can also subgroup
select customer_id,
count(*) as order_count,
exract(YEAR FROM created_at) as year,
from orders
group by customer_id , exract(YEAR FROM created_at)
