const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

// API Endpoint: Fetch All Rides
app.get('/rides', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.price, r.status, 
              p.address AS pickup_address, 
              d.address AS dropoff_address 
       FROM rides r
       JOIN locations p ON r.pickup_location = p.id
       JOIN locations d ON r.dropoff_location = d.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching rides');
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});