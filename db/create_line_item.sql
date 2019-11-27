insert into line_items 
(order_id, item_name, item_price, quantity)
values ($1, $2, $3, $4)
returning *;