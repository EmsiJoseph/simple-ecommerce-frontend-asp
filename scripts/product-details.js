let originalProduct = null;
const productId = new URLSearchParams(window.location.search).get('id');

async function fetchProductDetails() {
    try {
        const product = await ApiService.getEntity('products', productId);
        originalProduct = product;
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        alert('Failed to load product details');
    }
}

async function fetchCategories() {
    try {
      const categories = await $.ajax({
        url: `${ApiService.baseUrl}categories`,
        method: "GET",
      });
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories. Please try again later.");
      return [];
    }
  }

async function populateCategoriesSelect() {
    try {
        const categories = await fetchCategories();
        const select = document.getElementById('editCategory');
        select.innerHTML = '<option value="">Select a category</option>';
        categories.forEach(category => {
            select.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function displayProductDetails(product) {
    // Display basic info
    document.getElementById('viewName').textContent = product.name;
    document.getElementById('viewCategory').textContent = product.category?.name || 'N/A';
    
    // Fix the description handling
    const descriptionElement = document.getElementById('viewDescription');
    descriptionElement.textContent = TextUtils.truncateText(product.description, 100);
    descriptionElement.setAttribute('title', product.description || 'N/A');

    document.getElementById('viewPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('viewStock').textContent = product.stock;

    // Display status info
    document.getElementById('viewCreatedAt').textContent = new Date(product.created_at).toLocaleString();
    document.getElementById('viewUpdatedAt').textContent = new Date(product.updated_at).toLocaleString();
    
    const statusBadge = document.getElementById('viewStatus');
    if (product.is_deleted) {
        statusBadge.textContent = 'Deleted';
        statusBadge.className = 'badge bg-danger';
    } else {
        statusBadge.textContent = 'Active';
        statusBadge.className = 'badge bg-success';
    }

    // Set edit form values
    document.getElementById('editName').value = product.name;
    document.getElementById('editDescription').value = product.description || '';
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editStock').value = product.stock;
    if (product.category_id) {
        document.getElementById('editCategory').value = product.category_id;
    }
}

function toggleEditMode(isEditing) {
    const viewElements = document.querySelectorAll('.view-mode');
    const editElements = document.querySelectorAll('.edit-mode');
    const editButtons = document.getElementById('editButtons');
    const saveButtons = document.getElementById('saveButtons');

    viewElements.forEach(el => el.style.display = isEditing ? 'none' : '');
    editElements.forEach(el => el.style.display = isEditing ? '' : 'none');
    editButtons.style.display = isEditing ? 'none' : '';
    saveButtons.style.display = isEditing ? '' : 'none';
}

async function saveChanges() {
    const updatedProduct = {
        name: document.getElementById('editName').value,
        description: document.getElementById('editDescription').value,
        price: parseFloat(document.getElementById('editPrice').value),
        stock: parseInt(document.getElementById('editStock').value),
        category_id: document.getElementById('editCategory').value
    };

    try {
        const result = await ApiService.updateEntity('products', productId, updatedProduct);
        originalProduct = result;
        displayProductDetails(result);
        toggleEditMode(false);
        alert('Product updated successfully');
        fetchProductDetails();
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchProductDetails();
    populateCategoriesSelect();

    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'product-management.html';
    });

    document.getElementById('editProductBtn').addEventListener('click', () => {
        toggleEditMode(true);
    });

    document.getElementById('saveProductBtn').addEventListener('click', saveChanges);

    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        displayProductDetails(originalProduct);
        toggleEditMode(false);
    });
});
