// Initial Menu Data
let menuData = {
    "menu": {
        "categories": [
            {
                "name": "Starters",
                "items": [
                    {
                        "name": "Garlic Bread",
                        "description": "Grilled garlic bread with a side of marinara sauce.",
                        "price": 5.99,
                        "available": true
                    },
                    {
                        "name": "Bruschetta",
                        "description": "Toasted bread topped with fresh tomatoes, basil, and olive oil.",
                        "price": 6.99,
                        "available": true
                    }
                ]
            },
            {
                "name": "Main Course",
                "items": [
                    {
                        "name": "Grilled Chicken",
                        "description": "Marinated grilled chicken breast served with vegetables.",
                        "price": 12.99,
                        "available": true
                    },
                    {
                        "name": "Spaghetti Carbonara",
                        "description": "Classic spaghetti with pancetta, egg, and Parmesan cheese.",
                        "price": 10.99,
                        "available": false
                    }
                ]
            },
            {
                "name": "Desserts",
                "items": [
                    {
                        "name": "Tiramisu",
                        "description": "Traditional Italian dessert made with mascarpone and espresso.",
                        "price": 7.99,
                        "available": true
                    },
                    {
                        "name": "Cheesecake",
                        "description": "Creamy cheesecake with a graham cracker crust and fresh berries.",
                        "price": 6.99,
                        "available": false
                    }
                ]
            }
        ]
    }
};

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const categorySelect = document.getElementById('category');
const menuForm = document.getElementById('menu-form');
const actionRadios = document.getElementsByName('action');
const itemNameInput = document.getElementById('item-name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const availableSelect = document.getElementById('available');
const itemFields = document.getElementById('item-fields');

// Function to Display Menu
function displayMenu() {
    menuContainer.innerHTML = '';
    menuData.menu.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.name;
        categoryDiv.appendChild(categoryTitle);
        
        category.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `item ${item.available ? 'available' : 'unavailable'}`;
            
            const itemName = document.createElement('h4');
            itemName.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            itemDiv.appendChild(itemName);
            
            const itemDesc = document.createElement('p');
            itemDesc.textContent = item.description;
            itemDiv.appendChild(itemDesc);
            
            const availability = document.createElement('p');
            availability.textContent = `Available: ${item.available ? 'Yes' : 'No'}`;
            itemDiv.appendChild(availability);
            
            categoryDiv.appendChild(itemDiv);
        });
        
        menuContainer.appendChild(categoryDiv);
    });
}

// Function to Populate Category Select
function populateCategories() {
    categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
    menuData.menu.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Function to Handle Form Actions
function handleFormSubmit(event) {
    event.preventDefault();
    
    const action = Array.from(actionRadios).find(radio => radio.checked).value;
    const categoryName = categorySelect.value;
    const itemName = itemNameInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = parseFloat(priceInput.value);
    const available = availableSelect.value === 'true';

    if (!categoryName) {
        alert('Please select a category.');
        return;
    }

    const category = menuData.menu.categories.find(cat => cat.name === categoryName);
    if (!category) {
        alert('Selected category does not exist.');
        return;
    }

    if (action === 'add') {
        if (!itemName || isNaN(price)) {
            alert('Please provide valid item name and price.');
            return;
        }
        // Check if item already exists
        const existingItem = category.items.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (existingItem) {
            alert('Item already exists in this category.');
            return;
        }
        const newItem = {
            name: itemName,
            description: description || '',
            price: price,
            available: available
        };
        category.items.push(newItem);
        alert('Item added successfully!');
    } else if (action === 'update') {
        const item = category.items.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (!item) {
            alert('Item not found in the selected category.');
            return;
        }
        if (description) item.description = description;
        if (!isNaN(price)) item.price = price;
        item.available = available;
        alert('Item updated successfully!');
    } else if (action === 'delete') {
        const itemIndex = category.items.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (itemIndex === -1) {
            alert('Item not found in the selected category.');
            return;
        }
        category.items.splice(itemIndex, 1);
        alert('Item deleted successfully!');
    }

    // Reset form
    menuForm.reset();
    displayMenu();
}

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    displayMenu();
    populateCategories();
});

menuForm.addEventListener('submit', handleFormSubmit);
