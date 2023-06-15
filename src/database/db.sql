-- CREATE DATABASE user_details_service;
-- \c user_details_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_details (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    first_name varchar(255) ,
    last_name varchar(255),
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(255),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favourites (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    card_number varchar(255) NOT NULL,
    cvv varchar(4) NOT NULL,
    card_holder varchar(255) NOT NULL,
    expiration_date varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    country varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    street varchar(255) NOT NULL,
    house_number varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);