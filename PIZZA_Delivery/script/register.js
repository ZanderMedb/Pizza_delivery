document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Coleta os dados do formulário
    const deliveryData = {
        nome: document.getElementById('name').value.trim(),
        telefone: document.getElementById('phone').value.trim(),
        cep: document.getElementById('cep').value.trim(),
        endereco: document.getElementById('address').value.trim(),
        numero: document.getElementById('number').value.trim(),
        complemento: document.getElementById('complement').value.trim(),
        bairro: document.getElementById('neighborhood').value.trim(),
        pagamento: document.getElementById('paymentMethod').value,
        carrinho: JSON.parse(localStorage.getItem('cart')) || []
    };

    // Validação dos campos obrigatórios e do carrinho
    if (
        !deliveryData.nome ||
        !deliveryData.telefone ||
        !deliveryData.cep ||
        !deliveryData.endereco ||
        !deliveryData.numero ||
        !deliveryData.bairro ||
        !deliveryData.pagamento ||
        !deliveryData.carrinho.length
    ) {
        alert('Preencha todos os campos obrigatórios e adicione pelo menos um item ao carrinho.');
        return;
    }

    // Envia os dados para o backend
    fetch('http://127.0.0.1:3000/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deliveryData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Cadastro realizado com sucesso!');
            localStorage.setItem('userInfo', JSON.stringify(deliveryData));
            window.location.href = 'cart.html';
        } else {
            alert('Erro ao cadastrar: ' + (data.message || 'Tente novamente.'));
        }
    })
    .catch(err => {
        alert('Erro ao enviar cadastro: ' + err.message);
    });

});

window.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
        document.getElementById('name').value = userInfo.nome || '';
        document.getElementById('phone').value = userInfo.telefone || '';
        document.getElementById('cep').value = userInfo.cep || '';
        document.getElementById('address').value = userInfo.endereco || '';
        document.getElementById('number').value = userInfo.numero || '';
        document.getElementById('complement').value = userInfo.complemento || '';
        document.getElementById('neighborhood').value = userInfo.bairro || '';
        document.getElementById('paymentMethod').value = userInfo.pagamento || '';
    }
});