// functions/api.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const serverless = require('serverless-http');

const app = express();
app.use(bodyParser.json());

const DATA_FILE = 'data.json';

// Helper function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all items
app.get('/items', (req, res) => {
  const data = readData();
  res.json(data);
});

// Add a new item
app.post('/items', (req, res) => {
  const data = readData();
  const newItem = req.body;
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Update an item
app.put('/items/:id', (req, res) => {
  const data = readData();
  const { id } = req.params;
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = req.body;
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete an item
app.delete('/items/:id', (req, res) => {
  let data = readData();
  const { id } = req.params;
  const initialLength = data.length;
  data = data.filter(item => item.id !== id);
  if (data.length < initialLength) {
    writeData(data);
    res.json({ message: 'Item deleted' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Export the handler
module.exports.handler = serverless(app);
