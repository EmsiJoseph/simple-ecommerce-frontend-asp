let products = [];
let currentPage = 1;

function fetchProducts() {
    $.ajax({
        url: `${ApiService.baseUrl}products`,
        method: 'GET',
        success: function(response) {
            products = response;
            populateProductTable(products);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching products:', error);
            alert('Failed to load products. Please try again later.');
        }
    });
}

async function fetchCategories() {
    try {
        const categories = await $.ajax({
            url: `${ApiService.baseUrl}categories`,
            method: 'GET'
        });
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories. Please try again later.');
        return [];
    }
}

function populateCategorySelect(categories) {
    const categorySelect = document.getElementById('productCategory');
    categorySelect.innerHTML = '<option value="">Select a category</option>';
    categories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });
}

function populateProductTable(products) {
    const tableBody = $("#productTableBody");
    tableBody.empty();

    // Sort products by created_at in descending order
    const sortedProducts = products.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    );
    
    // Paginate the sorted products
    const paginatedProducts = PaginationUtils.paginate(sortedProducts, currentPage);
    
    paginatedProducts.forEach((product) => {
        const formattedDate = new Date(product.created_at).toLocaleString();
        tableBody.append(`
            <tr>
                <td>${product.name}</td>
                <td title="${product.description || 'N/A'}">${TextUtils.truncateText(product.description)}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.category?.name || 'N/A'}</td>
                <td>${product.stock}</td>
                <td>${formattedDate}</td>
                <td>${TableActions.getActionButtons(product.id)}</td>
            </tr>
        `);
    });

    // Setup pagination
    PaginationUtils.setupPagination(sortedProducts.length, currentPage, (page) => {
        currentPage = page;
        populateProductTable(products);
    });
}

function showAddProductModal() {
    const template = document.getElementById('productFormTemplate');
    const modalOptions = {
        title: 'Add New Product',
        content: template.innerHTML,
        saveButtonText: 'Add Product',
        onSave: async function() {
            try {
                const name = document.getElementById('productName').value;
                const description = document.getElementById('productDescription').value;
                const price = parseFloat(document.getElementById('productPrice').value);
                const category_id = document.getElementById('productCategory').value;
                const stock = parseInt(document.getElementById('productStock').value);

                if (name && price && category_id && stock) {
                    const productData = {
                        name,
                        description,
                        price,
                        category_id,
                        stock
                    };
                    await ApiService.createEntity('products', productData);
                    const modal = bootstrap.Modal.getInstance(document.getElementById('dynamicModal'));
                    modal.hide();
                    document.getElementById('productForm').reset();
                    fetchProducts();
                } else {
                    alert('Please fill all required fields');
                }
            } catch (error) {
                alert('Error creating product: ' + error.message);
            }
        }
    };
    
    initializeModal(modalOptions);
    const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
    modal.show();

    // Fetch and populate categories after modal is shown
    fetchCategories().then(categories => {
        populateCategorySelect(categories);
    });
}


$(document).ready(function() {
    fetchProducts();

    // Modify search to work with pagination
    $("#searchProduct").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(value) || 
            (product.description && product.description.toLowerCase().includes(value)) ||
            (product.category && product.category.name.toLowerCase().includes(value))
        );
        currentPage = 1; // Reset to first page when searching
        populateProductTable(filteredProducts);
    });

    // ...rest of the ready function code...
    TableActions.initializeTableActions('productTableBody', {
        onView: (id) => {
            window.location.href = `product-details.html?id=${id}`;
        },
        onEdit: (id) => {
            window.location.href = `product-details.html?id=${id}&edit=true`;
        },
        onDelete: async (id) => {
            return await TableActions.handleDelete('products', id, 'Are you sure you want to delete this product?');
        },
        onDeleteSuccess: () => {
            fetchProducts();
        }
    });

    $(document).on('click', '[data-bs-target="#addProductModal"]', function(e) {
        e.preventDefault();
        showAddProductModal();
    });
});
