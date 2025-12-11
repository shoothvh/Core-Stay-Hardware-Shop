const API_URL = 'http://localhost:5000/api/produtos';
const formProduto = document.getElementById('form-produto');
const listaProdutos = document.getElementById('lista-produtos');
const searchInput = document.getElementById('search-admin');

// Elementos do Form
const inputId = document.getElementById('produtoId');
const inputNome = document.getElementById('nome');
const inputDescricao = document.getElementById('descricao');
const inputPreco = document.getElementById('preco');
const inputEstoque = document.getElementById('estoque');
const inputCategoria = document.getElementById('categoria');
const inputImagem = document.getElementById('imagemUrl');
const btnSave = document.getElementById('btn-save');
const btnCancel = document.getElementById('btn-cancel');
const formTitle = document.getElementById('form-title');

let allProducts = [];

// Carregar Lista de Produtos
async function carregarListaAdmin() {
    try {
        const response = await fetch(API_URL);
        allProducts = await response.json();
        renderAdminList(allProducts);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Renderizar Tabela
function renderAdminList(produtos) {
    listaProdutos.innerHTML = ''; // Limpa tabela

    if (produtos.length === 0) {
        listaProdutos.innerHTML = '<tr><td colspan="4">Nenhum produto encontrado.</td></tr>';
        return;
    }

    produtos.forEach(produto => {
        const tr = document.createElement('tr');

        // Formatador de Moeda
        const preco = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco);

        tr.innerHTML = `
            <td>#${produto.id}</td>
            <td>
                <div style="font-weight: bold;">${produto.nome}</div>
                <small style="color: #888;">${produto.categoria} | Estoque: ${produto.estoque}</small>
            </td>
            <td>${preco}</td>
            <td style="display: flex; gap: 8px;">
                <button class="btn-edit" onclick="editarProduto(${produto.id})">
                    ✏️
                </button>
                <button class="btn-delete" onclick="deletarProduto(${produto.id})">
                    🗑️
                </button>
            </td>
        `;
        listaProdutos.appendChild(tr);
    });
}

// Search Filter
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p =>
            p.nome.toLowerCase().includes(term) ||
            p.categoria.toLowerCase().includes(term) ||
            p.id.toString().includes(term)
        );
        renderAdminList(filtered);
    });
}

// Cadastrar ou Editar Produto
formProduto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputId.value;
    const isEdit = !!id;

    const produto = {
        id: isEdit ? parseInt(id) : 0,
        nome: inputNome.value,
        descricao: inputDescricao.value,
        preco: parseFloat(inputPreco.value),
        estoque: parseInt(inputEstoque.value) || 0,
        categoria: inputCategoria.value,
        imagemUrl: inputImagem.value
    };

    try {
        const url = isEdit ? `${API_URL}/${id}` : API_URL;
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        if (response.ok) {
            alert(isEdit ? 'Produto atualizado!' : 'Produto cadastrado!');
            resetForm();
            carregarListaAdmin();
        } else {
            const errText = await response.text();
            alert(`Erro: ${response.status} - ${errText}`);
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão ao salvar produto.');
    }
});

// Preparar Edição
window.editarProduto = (id) => {
    const produto = allProducts.find(p => p.id === id);
    if (!produto) return;

    // Scroll to form (useful on mobile)
    document.querySelector('.admin-layout').scrollIntoView({ behavior: 'smooth' });

    // Populate fields
    inputId.value = produto.id;
    inputNome.value = produto.nome;
    inputDescricao.value = produto.descricao || '';
    inputPreco.value = produto.preco;
    inputEstoque.value = produto.estoque;
    inputCategoria.value = produto.categoria;
    inputImagem.value = produto.imagemUrl;

    // Update UI state
    formTitle.textContent = `Editar Produto #${produto.id}`;
    btnSave.textContent = 'Atualizar';
    btnCancel.style.display = 'inline-block';

    // Highlight form
    formProduto.parentElement.style.borderColor = 'var(--accent-color)';
};

// Reset Form
window.resetForm = () => {
    formProduto.reset();
    inputId.value = '';
    formTitle.textContent = 'Novo Produto';
    btnSave.textContent = 'Cadastrar';
    btnCancel.style.display = 'none';
    formProduto.parentElement.style.borderColor = '#333';
};

// Deletar Produto
window.deletarProduto = async (id) => {
    if (!confirm(`Tem certeza que deseja excluir o produto #${id}?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            carregarListaAdmin();
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
