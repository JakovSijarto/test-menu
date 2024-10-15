// public/script.js

const apiBase = '/.netlify/functions/api';

document.addEventListener('DOMContentLoaded', () => {
  fetchItems();

  const form = document.getElementById('add-item-form');
  form.addEventListener('submit', addItem);
});

async function fetchItems() {
  try {
    const response = await fetch(`${apiBase}/items`);
    const items = await response.json();
    renderItems(items);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

function renderItems(items) {
  const list = document.getElementById('items-list');
  list.innerHTML = '';

  items.forEach(item => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `ID: ${item.id}, Name: ${item.name}`;
    li.appendChild(span);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editItem(item);
    li.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteItem(item.id);
    li.appendChild(deleteButton);

    list.appendChild(li);
  });
}

async function addItem(event) {
  event.preventDefault();
  const id = document.getElementById('item-id').value.trim();
  const name = document.getElementById('item-name').value.trim();

  if (!id || !name) {
    alert('Please provide both ID and Name.');
    return;
  }

  const newItem = { id, name };

  try {
    const response = await fetch(`${apiBase}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });

    if (response.ok) {
      fetchItems();
      event.target.reset();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('Error adding item:', error);
  }
}

function editItem(item) {
  const newName = prompt('Enter new name:', item.name);
  if (newName === null) return; // Cancelled

  const updatedItem = { ...item, name: newName };

  updateItem(updatedItem);
}

async function updateItem(item) {
  try {
    const response = await fetch(`${apiBase}/items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      fetchItems();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating item:', error);
  }
}

async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const response = await fetch(`${apiBase}/items/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchItems();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}
