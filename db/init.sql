create table if not exists users (
user_id serial primary key,
auth0_id text not null,
username varchar(30),
first_name varchar(50),
last_name varchar(50),
email text,
image_url text
);

create table if not exists addresses (
address_id serial primary key,
user_id integer reference users(user_id),
address_one text,
address_two text,
city text,
state varchar(2),
zipcode integer
);

create table if not exists orders (
order_id serial primary key,
address_id text
);

create table if not exists line_items (
line_item_id serial primary key,
order_id integer,
item_name text,
item_price numeric(6,2),
quantity integer
);


-- Following table is just for connect-pg-simple package
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;