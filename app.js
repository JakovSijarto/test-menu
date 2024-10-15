const menuList = document.getElementById('menu-list');
const addMenuForm = document.getElementById('add-menu-form');
const menuItemInput = document.getElementById('menu-item-input');

// Modal Elements
const editModal = document.getElementById('edit-modal');
const closeModal = document.getElementById('close-modal');
const editMenuForm = document.getElementById('edit-menu-form');
const editMenuInput = document.getElementById('edit-menu-input');

let currentEditId = null;

// Fetch and display menu items in real-time
db.collection('menu').onSnapshot((snapshot) => {
    menuList.innerHTML = '';
    snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.data().name;

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit');
        editBtn.onclick = () => openEditModal(doc.id, doc.data().name);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete');
        deleteBtn.onclick = () => deleteMenuItem(doc.id);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        menuList.appendChild(li);
    });
});

// Add new menu item
addMenuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = menuItemInput.value.trim();
    if (name) {
        db.collection('menu').add({ name })
            .then(() => {
                menuItemInput.value = '';
            })
            .catch(error => console.error("Error adding document: ", error));
    }
});

// Delete menu item
function deleteMenuItem(id) {
    db.collection('menu').doc(id).delete()
        .catch(error => console.error("Error deleting document: ", error));
}

// Open Edit Modal
function openEditModal(id, currentName) {
    currentEditId = id;
    editMenuInput.value = currentName;
    editModal.style.display = "block";
}

// Close Modal
closeModal.onclick = function() {
    editModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}

// Edit menu item
editMenuForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedName = editMenuInput.value.trim();
    if (updatedName && currentEditId) {
        db.collection('menu').doc(currentEditId).update({ name: updatedName })
            .then(() => {
                editModal.style.display = "none";
                currentEditId = null;
            })
            .catch(error => console.error("Error updating document: ", error));
    }
});
