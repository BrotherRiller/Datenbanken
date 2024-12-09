# Datenbanken

Access Patterns:

1. Fetch Available Rides:
- As a rider, I want to see all available rides within a certain radius so I can choose one.
- Input: location (latitude, longitude), radius.
- Output: List of rides with details.

2. Request a Ride:
- As a rider, I want to request a new ride by providing pickup and drop-off locations.
- Input: Pickup location, drop-off location, ride preferences.
- Output: Ride confirmation details.

3. Accept a Ride:
- As a driver, I want to accept a ride request to start providing service.
- Input: Ride ID.
- Output: Updated ride status.

4. View Ride History:
- As a user, I want to view my past rides for reference.
- Input: User ID.
- Output: List of completed rides.

5. Add a Vehicle:
- As a driver, I want to register my vehicle in the system so I can accept rides.
- Input: Vehicle details.
- Output: Vehicle registration confirmation.

6. Join a Ride-sharing Group:
- As a user, I want to join a ride-sharing group to split the cost with others.
- Input: Group ID.
- Output: Group joining confirmation.

Steps to test Postman:

Access Pattern 1: Fetch Available Rides
Method: GET
URL: http://localhost:4000/rides
Params:
latitude	37.7749
longitude	-122.4194
radius	    5000

Access Pattern 2: Request a Ride
Method: POST
URL: http://localhost:4000/rides
Body:
{
    "user_id": 1,
    "pickup_address": "123 Main St",
    "dropoff_address": "456 Elm St",
    "price": 20.5
}

Access Pattern 3: Accept a Ride
Method: PUT
URL: http://localhost:4000/rides/:id (ride id so probably something like 5-6)

Access Pattern 4: View Ride History
Method: GET
URL: http://localhost:4000/rides/history
Params:
user_id	    1

Access Pattern 5: Add a Vehicle
Method: POST
URL: http://localhost:4000/vehicles
Body:
{
    "user_id": 1,
    "make": "Toyota",
    "model": "Corolla",
    "licensePlate": "ABC-123"
}

Access Pattern 6: Join a Ride-Sharing Group
Method: POST
URL: http://localhost:4000/groups/:id/join (Group ID is 1, because there is only 1 group)
Body:
{
    "ride_id": ride_id
}

Enter PostgreSQL Shell:
docker exec -it datenbanken-postgres-1 psql -U postgres -d ridesharing

look at rides:
SELECT * FROM rides;

Complete a ride:
UPDATE rides
SET status = 'completed',
    endtime = NOW()
WHERE id = 1; -- Replace 1 with the ride ID you want to complete

Insert Ride with Command:
INSERT INTO locations (address, latitude, longitude)
VALUES ('Test Pickup', 37.7749, -122.4194), ('Test Dropoff', 37.7750, -122.4183);

Restart Docker:
docker-compose restart