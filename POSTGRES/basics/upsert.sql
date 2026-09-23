-- *********** First write select statement if you ok with the results , then delete select and write update

-- UPSERT
INSERT INTO site_visitors (user_id, visit_count, last_visit_date)
VALUES 
    (101, 1, '2023-10-27') -- We try to insert User 101
ON CONFLICT (user_id)      -- The "Trigger": If 'user_id' 101 already exists...
DO UPDATE SET 
    visit_count = site_visitors.visit_count + 1,  -- Increment existing count
    last_visit_date = EXCLUDED.last_visit_date;   -- Update date to the new value

