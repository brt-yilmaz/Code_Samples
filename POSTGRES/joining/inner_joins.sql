select 
-- id, this will throw error , both table has id. use like posts.id or users.id
users.name,
posts.title
from
 posts inner join users on users.id = posts.user_id