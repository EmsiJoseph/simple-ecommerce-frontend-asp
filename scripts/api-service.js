const ApiService = {
    baseUrl: 'simple-ecommerce-backend-d4cqfhayfrhphag0.southeastasia-01.azurewebsites.net/api/',

    async post(endpoint, data) {
        try {
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async delete(endpoint, id) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
                method: 'DELETE'
            });


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if there's content before trying to parse JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                // Return a simple success object if no JSON
                return { success: true, status: response.status };
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async get(endpoint, id) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async update(endpoint, id, data) {
        console.log("Updating", endpoint, id, data);
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("Response", response);

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Generic create method
    async createEntity(entityType, entityData) {
        return await this.post(entityType, entityData);
    },

    // Entity specific methods
    async deleteEntity(entityType, id) {
        return await this.delete(entityType, id);
    },

    async getEntity(entityType, id) {
        return await this.get(entityType, id);
    },

    async updateEntity(entityType, id, entityData) {
        return await this.update(entityType, id, entityData);
    }
};

// Make it available globally
window.ApiService = ApiService;
