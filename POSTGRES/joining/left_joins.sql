select 
-- id, this will throw error , both table has id. use like posts.id or users.id
users.name,
posts.title
from
 posts left join users on users.id = posts.user_id -- users who has posts or no posts. but post only has user_id

