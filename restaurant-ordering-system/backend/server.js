const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Enter your MySQL root password
  database: 'my_restaurant_db',
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error('Could not connect to DB:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Create an endpoint to retrieve orders
app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    res.json(results);
  });
});

// Create an endpoint to add new orders
app.post('/api/orders', express.json(), (req, res) => {
  const { customer_id, order_date, status } = req.body;
  const query = 'INSERT INTO orders (customer_id, order_date, status) VALUES (?, ?, ?)';
  db.query(query, [customer_id, order_date, status], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error inserting order' });
    }
    res.status(201).json({ order_id: result.insertId, message: 'Order created successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
