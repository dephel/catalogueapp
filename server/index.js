const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql');

const app = express();
const port = 3001;

// LOCALHOST
const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'catalogue',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
});

pool.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to database!');
  }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/api/test', async (req, res) => {
  res.send('API TEST!');
});
// add item
app.post('/api/items-add', async (req, res) => {
  try {
    let itemName = req.body.name;
    let itemPrice = req.body.price;
    let itemType = req.body.itemType;
    let itemCode = req.body.itemCode;
    let userId = req.body.userId;

    // console.log(itemCode, itemType, itemPrice, itemName);

    if (!itemName || !itemType || !itemPrice || !itemCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const insertQuery =
      'INSERT INTO items (itemCode,itemPrice,itemType,itemName,userId,createdAt,updatedAt) VALUES (?, ?, ?, ?, ?,?, ?)';
    const insertResult = pool.query(insertQuery, [
      itemCode,
      itemPrice,
      itemType,
      itemName,
      userId,
      new Date(),
      new Date(),
    ]);

    res.status(201).json({ id: insertResult.insertId, ...req.body });
  } catch (error) {
    console.log('Error adding item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get items
app.get('/api/get-items', async (req, res) => {
  try {
    let user = req.query.user;

    // console.log('userr', user);
    const selectItems = `SELECT * FROM items WHERE userId = ?`;

    pool.query(selectItems, [user], (err, result) => {
      if (err) {
        return;
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    console.error('Error retrieving items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// update item
app.post('/api/item-edit', async (req, res) => {
  try {
    const itemId = req.body.id;

    let itemName = req.body.name;
    let itemPrice = req.body.price;
    let itemType = req.body.itemType;
    let itemCode = req.body.itemCode;

    console.log(itemCode, itemType, itemPrice, itemName);

    if (!itemName || !itemType || !itemPrice || !itemCode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updateQuery =
      'UPDATE items SET itemName = ?, itemType = ?, itemPrice = ?, itemCode = ?, updatedAt = ? WHERE id = ?';
    pool.query(updateQuery, [
      itemName,
      itemType,
      itemPrice,
      itemCode,
      new Date(),
      itemId,
    ]);

    res.status(200).json({ id: itemId, ...req.body });
  } catch (error) {
    console.error('Error editing item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// delete item
app.post('/api/item-delete', async (req, res) => {
  try {
    const itemId = req.body.id;

    var stm = "DELETE FROM items WHERE id = '" + itemId + "'";

    pool.query(stm, [], (err, result) => {
      if (err) {
        return;
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// REGISTER;
app.post('/api/register', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        return res
          .status(200)
          .json({ message: 'User registered successfully', email: email });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const email = req.body.email;
    const pwd = req.body.password;

    const selectQuery = 'SELECT id, password FROM users WHERE email = ?';
    pool.query(selectQuery, [email], async (err, result) => {
      if (err) {
        console.error('Error loginin user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.length == 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // console.log('=====', result);
      const [{ password }] = result;

      const hashedPassword = password;
      const passwordMatch = await bcrypt.compare(pwd, hashedPassword);
      // console.log('=====', passwordMatch);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      return res
        .status(200)
        .json({ message: 'Login successful', email: email });
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
