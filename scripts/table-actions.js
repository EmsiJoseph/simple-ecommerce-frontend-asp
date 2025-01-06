const TableActions = {
    getActionButtons(id, options = {}) {
        const defaultOptions = {
            view: true,
            edit: false, // Changed to false to remove edit button
            delete: true,
            custom: []
        };
        const settings = { ...defaultOptions, ...options };
        
        let buttons = [];

        if (settings.view) {
            buttons.push(`
                <button class="btn btn-sm btn-outline-primary view-item" data-id="${id}">
                    <i class="bi bi-eye"></i>
                </button>
            `);
        }

        if (settings.edit) {
            buttons.push(`
                <button class="btn btn-sm btn-outline-primary edit-item" data-id="${id}">
                    <i class="bi bi-pencil"></i>
                </button>
            `);
        }

        if (settings.delete) {
            buttons.push(`
                <button class="btn btn-sm btn-outline-danger delete-item" data-id="${id}">
                    <i class="bi bi-trash"></i>
                </button>
            `);
        }

        // Add custom buttons
        if (settings.custom) {
            settings.custom.forEach(btn => {
                buttons.push(btn(id));
            });
        }

        return buttons.join(' ');
    },

    async handleDelete(entityType, id, confirmMessage = 'Are you sure you want to delete this item?') {
        if (confirm(confirmMessage)) {
            try {
                await ApiService.deleteEntity(entityType, id);
                console.log("id", id);
                return true;
            } catch (error) {
                alert('Error deleting item: ' + error.message);
                return false;
            }
        }
        return false;
    },

    initializeTableActions(tableId, options = {}) {
        const table = document.getElementById(tableId);
        if (!table) return;

        // View action
        table.addEventListener('click', (e) => {
            if (e.target.closest('.view-item')) {
                const id = e.target.closest('.view-item').dataset.id;
                if (options.onView) options.onView(id);
            }
        });

        // Edit action
        table.addEventListener('click', (e) => {
            if (e.target.closest('.edit-item')) {
                const id = e.target.closest('.edit-item').dataset.id;
                if (options.onEdit) options.onEdit(id);
            }
        });

        // Delete action
        table.addEventListener('click', async (e) => {
            if (e.target.closest('.delete-item')) {
                const id = e.target.closest('.delete-item').dataset.id;
                if (options.onDelete) {
                    const success = await options.onDelete(id);
                    if (success && options.onDeleteSuccess) {
                        options.onDeleteSuccess();
                    }
                }
            }
        });
    }
};

window.TableActions = TableActions;
