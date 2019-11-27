select * from users where auth0_id = $1;

select u.user_id, u.auth0_id, u.username, u.first_name, u.last_name, u.email, u.image_url, a.address_one as address_one, a.address_two as address_two, a.city as address_city, a.state as address_state, a.zipcode as address_zipcode, a.address_id from users u 
join addresses a on u.user_id = a.user_id
where u.auth0_id = $1





