const API_URL = 'http://localhost:5000/api/produtos';

document.getElementById('form-produto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const categoria = document.getElementById('categoria').value;
    const imagemUrl = document.getElementById('imagemUrl').value;

    const produto = {
        nome,
        preco,
        categoria,
        imagemUrl
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });

        if (response.ok) {
            alert('Produto Cadastrado com Sucesso!');
            document.getElementById('form-produto').reset(); // Limpa o formulário
        } else {
            alert('Erro ao cadastrar produto.');
            console.error('Erro API:', response.statusText);
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        alert('Erro de conexão com o servidor.');
    }
});
