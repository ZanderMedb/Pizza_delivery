// dbManager.js

// Certifique-se de que pizzaJson está disponível no escopo global (window.pizzaJson)
const pizzas = window.pizzaJson || [];

class DatabaseManager {
    constructor() {
        this.users = this.loadUsers();
        this.orders = this.loadOrders();
        this.pizzas = pizzas;
    }

    loadUsers() {
        try {
            return JSON.parse(localStorage.getItem('users')) || [];
        } catch {
            return [];
        }
    }

    loadOrders() {
        try {
            return JSON.parse(localStorage.getItem('orders')) || [];
        } catch {
            return [];
        }
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    addUser(userData) {
        if (this.findUserByEmail(userData.email)) {
            throw new Error('Email já cadastrado');
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            orders: [],
            favorites: [],
            lastLogin: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Email ou senha inválidos');
        }

        user.lastLogin = new Date().toISOString();
        this.saveUsers();
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    findUserById(id) {
        return this.users.find(user => user.id === id);
    }

    addOrder(userId, orderData) {
        const user = this.findUserById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const order = {
            id: Date.now(),
            userId,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        this.orders.push(order);
        user.orders.push(order.id);
        this.saveOrders();
        this.saveUsers();
        return order;
    }

    getUserOrders(userId) {
        return this.orders.filter(order => order.userId === userId);
    }

    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        const allowedUpdates = ['name', 'phone', 'address', 'city', 'password'];
        const updatedUser = { ...this.users[userIndex] };

        allowedUpdates.forEach(field => {
            if (updates[field]) {
                updatedUser[field] = updates[field];
            }
        });

        this.users[userIndex] = updatedUser;
        this.saveUsers();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id === userId) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        return updatedUser;
    }

    deleteUser(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        this.users.splice(userIndex, 1);
        this.orders = this.orders.filter(order => order.userId !== userId);
        this.saveUsers();
        this.saveOrders();

        if (JSON.parse(localStorage.getItem('currentUser'))?.id === userId) {
            this.logout();
        }
    }

    updateOrderStatus(orderId, status) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            throw new Error('Pedido não encontrado');
        }

        this.orders[orderIndex].status = status;
        this.saveOrders();
        return this.orders[orderIndex];
    }

    addToFavorites(userId, pizzaId) {
        const user = this.findUserById(userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (!user.favorites) {
            user.favorites = [];
        }

        if (!user.favorites.includes(pizzaId)) {
            user.favorites.push(pizzaId);
            this.saveUsers();
        }
    }

    removeFromFavorites(userId, pizzaId) {
        const user = this.findUserById(userId);
        if (!user || !user.favorites) {
            return;
        }

        user.favorites = user.favorites.filter(id => id !== pizzaId);
        this.saveUsers();
    }

    getFavorites(userId) {
        const user = this.findUserById(userId);
        if (!user || !user.favorites) {
            return [];
        }
        return user.favorites.map(id => this.pizzas.find(p => p.id === id));
    }

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch {
            return null;
        }
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }
}

// Cria uma instância global para uso nos scripts
window.db = new DatabaseManager();