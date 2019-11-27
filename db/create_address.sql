insert into addresses 
(address_one, address_two, city, state, zipcode, user_id)
values (${address_one}, ${address_two}, ${city}, ${state},${zipcode}, ${user_id})
-- where user_id = ${user_id}
returning *;

-- select a.address_id, a.user_id, a.address_one, a.address_two, a.city, a.state, a.zipcode, u.username as username, u.first_name as first_name, u.last_name as last_name,  u.email as email, u.image_url as image_url from addresses a 
-- join users u on a.user_id = u.user_id 
-- where a.address_id =${address_id}


--to be able to pull the join table need to wait for the user to enter address so it can display.