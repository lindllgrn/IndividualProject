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

  app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' }); // ✅ Change to JSON format
  });
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

// GET all menu items
app.get('/api/menu', async (req, res) => { 
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        menu_item_id AS id, 
        name, 
        description, 
        CAST(price AS DECIMAL(10,2)) AS price, 
        image_url AS image 
      FROM menu_items
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// API to fetch order items
app.post('/api/order_items', async (req, res) => {
  const { order_id, menu_item_id, quantity, price, special_instructions } = req.body;
  const created_at = new Date().toISOString();

  if (!order_id || !menu_item_id || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.promise().query(
      `INSERT INTO order_items (order_id, menu_item_id, quantity, price, special_instructions, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [order_id, menu_item_id, quantity, price, special_instructions || '', created_at]
    );

    res.status(201).json({ message: 'Order item added successfully', order_item_id: result.insertId });
  } catch (error) {
    console.error('Error inserting order item:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/order_items/:order_item_id', async (req, res) => {
  const { order_item_id } = req.params;
  const { quantity, price, special_instructions } = req.body;
  const updated_at = new Date().toISOString();

  try {
    const [result] = await db.promise().query(
      `UPDATE order_items SET quantity = ?, price = ?, special_instructions = ?, updated_at = ? WHERE order_item_id = ?`,
      [quantity, price, special_instructions || '', updated_at, order_item_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    res.json({ message: 'Order item updated successfully' });
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
