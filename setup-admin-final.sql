-- Step 1: Verify the user exists
SELECT id, email FROM auth.users WHERE email = 'admin@reveclothingxnobody.com';

-- Step 2: If the user exists, insert them into user_roles as admin
-- Replace USER_ID_HERE with the id from step 1
INSERT INTO user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify the admin role was added
SELECT * FROM user_roles WHERE role = 'admin';
