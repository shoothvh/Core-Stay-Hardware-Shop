const API_URL = 'http://localhost:5000/api/produtos';
const formProduto = document.getElementById('form-produto');
const listaProdutos = document.getElementById('lista-produtos');

// Carregar Lista de Produtos
async function carregarListaAdmin() {
    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();

        listaProdutos.innerHTML = ''; // Limpa tabela

        produtos.forEach(produto => {
            const tr = document.createElement('tr');

            // Formatador de Moeda
            const preco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco);

            tr.innerHTML = `
                <td>#${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${preco}</td>
                <td>
                    <button class="btn-delete" onclick="deletarProduto(${produto.id})">
                        Excluir
                    </button>
                </td>
            `;
            listaProdutos.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Cadastrar Produto
formProduto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const produto = {
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value),
        categoria: document.getElementById('categoria').value,
        imagemUrl: document.getElementById('imagemUrl').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        if (response.ok) {
            alert('Produto cadastrado!');
            formProduto.reset();
            carregarListaAdmin(); // Atualiza a lista
        } else {
            alert('Erro ao cadastrar.');
        }
    } catch (error) {
        console.error(error);
    }
});

// Deletar Produto
// Nota: A função precisa estar no escopo global (window) para o onclick funcionar
window.deletarProduto = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarListaAdmin(); // Atualiza a lista
        } else {
            alert('Erro ao excluir produto.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
    }
};

// Iniciar
carregarListaAdmin();
