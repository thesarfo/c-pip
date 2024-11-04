document.addEventListener('DOMContentLoaded', function() {
    const itemForm = document.getElementById('itemForm');
    const itemIdInput = document.getElementById('itemId');
    const itemNameInput = document.getElementById('itemName');
    const itemDescriptionInput = document.getElementById('itemDescription');
    const itemPriceInput = document.getElementById('itemPrice');
    const itemsList = document.getElementById('items');

    itemForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = itemIdInput.value;
        const item = {
            name: itemNameInput.value,
            description: itemDescriptionInput.value,
            price: itemPriceInput.value
        };

        if (id) {
            fetch(`/api/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Item updated:', data);
                    fetchItems();
                    resetForm();
                });
        } else {
            fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Item created:', data);
                    fetchItems();
                    resetForm();
                });
        }
    });

    function fetchItems() {
        fetch('/api/items')
            .then(response => response.json())
            .then(data => {
                itemsList.innerHTML = '';
                data.forEach(item => {
                    const card = document.createElement('div');
                    card.className = 'item-card';
                    card.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>Description: ${item.description}</p>
                        <p>Price: $${item.price}</p>
                        <div class="item-actions">
                            <button onclick="toggleDropdown(this)">⋮</button>
                            <div class="dropdown-content">
                                <button onclick="editItem(${item.id}, '${item.name}', '${item.description}', ${item.price})">Edit</button>
                                <button onclick="deleteItem(${item.id})">Delete</button>
                            </div>
                        </div>
                    `;
                    itemsList.appendChild(card);
                });
            });
    }

    window.deleteItem = function(id) {
        fetch(`/api/items/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    console.log(`Item with ID ${id} deleted`);
                    fetchItems();
                } else {
                    console.error('Error deleting item');
                }
            });
    };

    window.editItem = function(id, name, description, price) {
        itemIdInput.value = id;
        itemNameInput.value = name;
        itemDescriptionInput.value = description;
        itemPriceInput.value = price;
    };

    function resetForm() {
        itemIdInput.value = '';
        itemNameInput.value = '';
        itemDescriptionInput.value = '';
        itemPriceInput.value = '';
    }

    window.toggleDropdown = function(button) {
        const dropdown = button.nextElementSibling;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    };

    fetchItems();
});
