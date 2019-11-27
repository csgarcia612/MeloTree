insert into users 
(auth0_id, username, first_name, last_name, email, image_url)
values ($1, $2, $3, $4, $5, $6)
returning *;