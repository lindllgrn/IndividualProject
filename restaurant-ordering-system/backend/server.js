const express = require('express');
const mysql = require('mysql2');
const WebSocket = require('ws');
const app = express();
const port = 5000;
const cors = require('cors');


// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Update this to match your frontend URL
}));

// MySQL database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'my_restaurant_db', // Replace with your database name
});

// Test MySQL database connection
db.connect((err) => {
  if (err) {
    console.error('Could not connect to DB:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// WebSocket setup
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.send('Hello from server!');
});

// Root route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// API endpoint to retrieve orders (GET)
app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    res.json(results);
  });
});

// API endpoint to add new orders (POST)
app.post('/api/orders', express.json(), (req, res) => {
  const { customer_id, total_amount } = req.body; // Remove order_date and status from here
  const order_status = 'Pending'; // Default status
  const created_at = new Date().toISOString(); // Set created_at as the current date-time
  const updated_at = created_at; // Updated at same as created_at initially

  // Ensure all fields are included in the insert statement
  const query = 'INSERT INTO orders (customer_id, order_status, total_amount, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [customer_id, order_status, total_amount, created_at, updated_at], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err); // Log error for more details
      return res.status(500).json({ message: 'Error inserting order' });
    }
    res.status(201).json({ order_id: result.insertId, message: 'Order created successfully' });
  });
});


// API endpoint to add order items (POST)
app.post('/api/order_items', express.json(), (req, res) => {
  const { order_id, menu_item_id, quantity, price, special_instructions } = req.body;
  const created_at = new Date().toISOString(); // Set created_at to current time

  const query = `
    INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions, created_at)
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [order_id, menu_item_id, quantity, price, special_instructions, created_at], (err, result) => {
    if (err) {
      console.error('Error inserting order item:', err);
      return res.status(500).json({ message: 'Error inserting order item' });
    }
    res.status(201).json({ message: 'Order item inserted successfully', order_item_id: result.insertId });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
