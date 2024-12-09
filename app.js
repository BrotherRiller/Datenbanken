const express = require('express');
const pool = require('./db'); // Database connection
const app = express();

app.use(express.json()); // Middleware to parse JSON

// Fetch Available Rides
app.get('/rides', async (req, res) => {
    const { latitude, longitude, radius } = req.query;

    try {
        console.log('Query Parameters:', { latitude, longitude, radius });

        const rides = await pool.query(`
            SELECT r.*, l.latitude, l.longitude
            FROM rides r
            JOIN locations l ON r.pickup_location_id = l.id
            WHERE r.status = 'requested'
            AND ST_DistanceSphere(
                ST_MakePoint(l.longitude, l.latitude),
                ST_MakePoint($1, $2)
            ) <= $3;
        `, [longitude, latitude, radius]);

        console.log('SQL Query Result:', rides.rows); // Log the result
        res.json(rides.rows);
    } catch (err) {
        console.error('SQL Error:', err.message); // Log SQL errors
        res.status(500).json({ error: err.message });
    }
});

// Request a Ride
app.post('/rides', async (req, res) => {
    const { user_id, pickup_address, dropoff_address, price } = req.body;

    try {
        // Validate user existence
        const userCheck = await pool.query(`SELECT id FROM users WHERE id = $1;`, [user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid user_id: User does not exist.' });
        }

        // Insert or get pickup location ID
        const pickupLocation = await pool.query(`
            INSERT INTO locations (address, latitude, longitude)
            VALUES ($1, 0, 0)
            ON CONFLICT (address) DO UPDATE SET address = EXCLUDED.address
            RETURNING id;
        `, [pickup_address]);

        // Insert or get dropoff location ID
        const dropoffLocation = await pool.query(`
            INSERT INTO locations (address, latitude, longitude)
            VALUES ($1, 0, 0)
            ON CONFLICT (address) DO UPDATE SET address = EXCLUDED.address
            RETURNING id;
        `, [dropoff_address]);

        // Insert the ride
        const newRide = await pool.query(`
            INSERT INTO rides (user_id, status, price, pickup_location_id, dropoff_location_id)
            VALUES ($1, 'requested', $2, $3, $4) RETURNING *;
        `, [user_id, price, pickupLocation.rows[0].id, dropoffLocation.rows[0].id]);

        res.json(newRide.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Accept a Ride
app.put('/rides/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedRide = await pool.query(`
            UPDATE rides SET status = 'accepted'
            WHERE id = $1 RETURNING *;
        `, [id]);
        if (updatedRide.rows.length === 0) {
            return res.status(404).json({ error: 'Ride not found.' });
        }
        res.json(updatedRide.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View Ride History
app.get('/rides/history', async (req, res) => {
    const { user_id } = req.query;
    try {
        const history = await pool.query(`
            SELECT * FROM rides
            WHERE user_id = $1 AND status = 'completed';
        `, [user_id]);
        res.json(history.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a Vehicle
app.post('/vehicles', async (req, res) => {
    const { user_id, make, model, licensePlate } = req.body;
    try {
        // Validate user existence
        const userCheck = await pool.query(`SELECT id FROM users WHERE id = $1;`, [user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid user_id: User does not exist.' });
        }

        // Insert vehicle
        const newVehicle = await pool.query(`
            INSERT INTO vehicles (user_id, make, model, licensePlate)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `, [user_id, make, model, licensePlate]);

        res.json(newVehicle.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Join a Ride-sharing Group
app.post('/groups/:id/join', async (req, res) => {
    const { id } = req.params;
    const { ride_id } = req.body;

    try {
        // Validate group existence
        const groupCheck = await pool.query(`SELECT id FROM groups WHERE id = $1;`, [id]);
        if (groupCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid group_id: Group does not exist.' });
        }

        // Add ride to group
        const newRideGroup = await pool.query(`
            INSERT INTO ride_groups (ride_id, group_id)
            VALUES ($1, $2) RETURNING *;
        `, [ride_id, id]);

        res.json(newRideGroup.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(4000, () => console.log('Server running on port 4000'));