update addresses
SET address_one = ${address_one},
address_two = ${address_two},
city = ${city},
state = ${state},
zipcode = ${zipcode}
where user_id = ${user_id} and address_id = ${address_id};


select a.address_id, a.user_id, a.address_one, a.address_two, a.city, a.state, a.zipcode, u.username as username, u.first_name as first_name, u.last_name as last_name,  u.email as email, u.image_url as image_url from addresses a 
join users u on a.user_id = u.user_id 
where a.address_id =${address_id};

