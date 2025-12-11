// ========================================
// CORE STAY - AUTH GUARD
// Protege páginas que requerem autenticação
// ========================================

const AuthGuard = {
    // Verifica se usuário está logado
    isLoggedIn() {
        const user = localStorage.getItem('currentUser');
        return user !== null;
    },

    // Retorna usuário atual
    getUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    // Verifica se usuário é admin
    isAdmin() {
        const user = this.getUser();
        return user && user.isAdmin === true;
    },

    // Protege página - redireciona se não logado
    requireLogin(redirectTo = 'login.html') {
        if (!this.isLoggedIn()) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },

    // Protege página admin - redireciona se não for admin
    requireAdmin(redirectTo = 'index.html') {
        if (!this.isLoggedIn()) {
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'login.html';
            return false;
        }

        if (!this.isAdmin()) {
            alert('Acesso negado. Apenas administradores podem acessar esta página.');
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },

    // Cria usuário admin padrão se não existir
    ensureAdminExists() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const adminExists = users.some(u => u.isAdmin === true);

        if (!adminExists) {
            const adminUser = {
                id: 1,
                name: 'Administrador',
                email: 'admin@corestay.com',
                password: 'admin123',
                isAdmin: true,
                createdAt: new Date().toISOString()
            };
            users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Admin padrão criado: admin@corestay.com / admin123');
        }
    }
};

// Criar admin padrão ao carregar
AuthGuard.ensureAdminExists();

// Export
if (typeof window !== 'undefined') {
    window.AuthGuard = AuthGuard;
}
