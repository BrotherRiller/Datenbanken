-- User Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('rider', 'driver'))
);

-- Vehicle Table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    licensePlate VARCHAR(50) NOT NULL UNIQUE
);

-- Location Table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    address VARCHAR(255) UNIQUE, -- Add UNIQUE constraint
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);

-- Ride Table
CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('requested', 'accepted', 'completed')),
    price FLOAT NOT NULL,
    startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endTime TIMESTAMP,
    pickup_location_id INT REFERENCES locations(id) ON DELETE SET NULL,
    dropoff_location_id INT REFERENCES locations(id) ON DELETE SET NULL
);

-- Group Table
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Ride-Group Relationship
CREATE TABLE ride_groups (
    ride_id INT REFERENCES rides(id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (ride_id, group_id)
);

INSERT INTO users (name, role) VALUES ('Default Rider', 'rider');