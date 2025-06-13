// registerUtils.js

function coletarDadosFormulario() {
    return {
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
}

function validarDadosEntrega(data) {
    return (
        !!data.nome &&
        !!data.telefone &&
        !!data.cep &&
        !!data.endereco &&
        !!data.numero &&
        !!data.bairro &&
        !!data.pagamento &&
        Array.isArray(data.carrinho) && data.carrinho.length > 0
    );
}

module.exports = { coletarDadosFormulario, validarDadosEntrega };