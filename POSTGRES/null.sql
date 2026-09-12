-- null not a value , not a false , nothing. 
-- it is a blackbox, it is unknown
-- 5 = NULL --> unknown
-- NULL = NULL --> unknown
-- strict equality against null returns nothing even if the value is null.
-- if you want to get NULL column "IS" should be used
-- you can feed the null column with the "COALESCE"
-- you can also coalesce different column 

-- Evaluates to UNKNOWN (returns 0 rows):
SELECT * FROM users WHERE middle_name = NULL;

-- Evaluates to TRUE/FALSE (returns rows where middle_name is missing):
SELECT * FROM users WHERE middle_name IS NULL;

-- Evaluates to TRUE/FALSE (returns rows where middle_name has a value):
SELECT * FROM users WHERE middle_name IS NOT NULL;

-- Option A: Filling with a Hardcoded Fallback Value
SELECT 
    id, 
    username, 
    COALESCE(phone_number, 'N/A') AS contact_phone
FROM users;

-- Option B: Coalescing Across Multiple Columns (Fallbacks in Order)
SELECT 
    id, 
    username, 
    -- Checks work_phone first; if NULL, falls back to mobile_phone; if both are NULL, uses 'No Phone'
    COALESCE(work_phone, mobile_phone, home_phone, 'No Phone') AS primary_contact
FROM user_contacts;