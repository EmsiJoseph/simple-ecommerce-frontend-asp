let categories = [];
let currentPage = 1;

function fetchCategories() {
    $.ajax({
        url: `${ApiService.baseUrl}categories`,
        method: 'GET',
        success: function(response) {
            categories = response;
            populateCategoryTable(categories);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching categories:', error);
            alert('Failed to load categories. Please try again later.');
        }
    });
}

function populateCategoryTable(categories) {
    const tableBody = $("#categoryTableBody");
    tableBody.empty();

    // Sort categories by created_at in descending order
    const sortedCategories = categories.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    );
    
    // Paginate the sorted categories
    const paginatedCategories = PaginationUtils.paginate(sortedCategories, currentPage);
    
    paginatedCategories.forEach((category) => {
        const formattedDate = new Date(category.created_at).toLocaleString();
        tableBody.append(`
            <tr>
                <td>${category.name}</td>
                <td title="${category.description || 'N/A'}">${TextUtils.truncateText(category.description)}</td>
                <td>${formattedDate}</td>
                <td>${TableActions.getActionButtons(category.id)}</td>
            </tr>
        `);
    });

    // Setup pagination
    PaginationUtils.setupPagination(sortedCategories.length, currentPage, (page) => {
        currentPage = page;
        populateCategoryTable(categories);
    });
}

async function showViewCategoryModal(id) {
    try {
        const category = await ApiService.getEntity('categories', id);
        const template = document.getElementById('categoryViewTemplate');
        const modalOptions = {
            title: 'View Category',
            content: template.innerHTML,
            saveButtonText: 'Close',
            onLoad: function() {
                document.getElementById('viewCategoryName').textContent = category.name;
                document.getElementById('viewCategoryDescription').textContent = category.description || 'N/A';
                document.getElementById('viewCreatedAt').textContent = new Date(category.created_at)
                    .toLocaleString('en-US');
            }
        };
        
        initializeModal(modalOptions);
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        modal.show();
    } catch (error) {
        alert('Error loading category: ' + error.message);
    }
}

async function showEditCategoryModal(id) {
    try {
        const category = await ApiService.getEntity('categories', id);
        const template = document.getElementById('categoryFormTemplate');
        const modalOptions = {
            title: 'Edit Category',
            content: template.innerHTML,
            saveButtonText: 'Update Category',
            onLoad: function() {
                document.getElementById('categoryName').value = category.name;
                document.getElementById('categoryDescription').value = category.description || '';
            },
            onSave: async function() {
                try {
                    const name = document.getElementById('categoryName').value;
                    const description = document.getElementById('categoryDescription').value;

                    if (name) {
                        const categoryData = { name, description };
                        await ApiService.updateEntity('categories', id, categoryData);
                        const modal = bootstrap.Modal.getInstance(document.getElementById('dynamicModal'));
                        modal.hide();
                        fetchCategories();
                    } else {
                        alert('Please fill all required fields');
                    }
                } catch (error) {
                    alert('Error updating category: ' + error.message);
                }
            }
        };
        
        initializeModal(modalOptions);
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        modal.show();
    } catch (error) {
        alert('Error loading category: ' + error.message);
    }
}

function showAddCategoryModal() {
    const template = document.getElementById('categoryFormTemplate');
    const modalOptions = {
        title: 'Add New Category',
        content: template.innerHTML,
        saveButtonText: 'Add Category',
        onSave: async function() {
            try {
                const categoryData = {
                    name: document.getElementById('categoryName').value,
                    description: document.getElementById('categoryDescription').value
                };

                await ApiService.createEntity('categories', categoryData);
                const modal = bootstrap.Modal.getInstance(document.getElementById('dynamicModal'));
                modal.hide();
                fetchCategories();
            } catch (error) {
                alert('Error creating category: ' + error.message);
            }
        }
    };
    
    initializeModal(modalOptions);
    const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
    modal.show();
}

$(document).ready(function() {
    fetchCategories();

    TableActions.initializeTableActions('categoryTableBody', {
        onView: (id) => {
            window.location.href = `category-details.html?id=${id}`;
        },
        onDelete: async (id) => {
            return await TableActions.handleDelete('categories', id, 'Are you sure you want to delete this category?');
        },
        onDeleteSuccess: () => {
            fetchCategories();
        }
    });

    $("#searchCategory").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        $("#categoryTableBody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $(document).on('click', '[data-bs-target="#addCategoryModal"]', function(e) {
        e.preventDefault();
        showAddCategoryModal();
    });
});
