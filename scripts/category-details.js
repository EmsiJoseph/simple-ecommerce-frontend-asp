let currentCategory = null;

$(document).ready(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    if (!categoryId) {
        alert('No category ID provided');
        window.location.href = 'category-management.html';
        return;
    }

    try {
        const category = await ApiService.getEntity('categories', categoryId);
        populateCategoryDetails(category);
    } catch (error) {
        console.error('Error loading category:', error);
        alert('Error loading category details');
    }

    $('#backBtn').click(() => {
        window.location.href = 'category-management.html';
    });

    $('#editCategoryBtn').click(() => {
        toggleEditMode(true);
    });

    $('#cancelEditBtn').click(() => {
        toggleEditMode(false);
        populateCategoryDetails(currentCategory);
    });

    $('#saveCategoryBtn').click(async () => {
        try {
            const updatedData = {
                name: $('#editName').val(),
                description: $('#editDescription').val()
            };

            const updatedCategory = await ApiService.updateEntity('categories', currentCategory.id, updatedData);
            currentCategory = updatedCategory;
            populateCategoryDetails(updatedCategory);
            toggleEditMode(false);
            alert('Category updated successfully');
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Error updating category details');
        }
    });
});

function toggleEditMode(isEdit) {
    $('.view-mode').toggle(!isEdit);
    $('.edit-mode').toggle(isEdit);
    $('#editButtons').toggle(!isEdit);
    $('#saveButtons').toggle(isEdit);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function populateCategoryDetails(category) {
    currentCategory = category;

    console.log('Category:', category);
    
    // View mode elements
    $('#viewName').text(category.name || 'N/A');
    $('#viewDescription')
        .text((category.description))
        .attr('title', category.description || 'N/A');

    $('#viewCreatedAt').text(formatDate(category.created_at));
    $('#viewUpdatedAt').text(formatDate(category.updated_at));

    // Edit mode elements
    $('#editName').val(category.name || '');
    $('#editDescription').val(category.description || '');
}
