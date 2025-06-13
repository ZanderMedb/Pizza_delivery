function calcularTotais(cart, pizzaJson) {
  let subtotal = 0;
  for (let item of cart) {
    let pizza = pizzaJson.find(p => p.id === item.id);
    if (pizza) {
      subtotal += pizza.price * item.qt;
    }
  }
  let desconto = subtotal * 0.1;
  let total = subtotal - desconto;
  return {
    subtotal,
    desconto,
    total
  };
}

function adicionarAoCarrinho(cart, pizza, size, qt) {
  let identifier = pizza.id + '@' + size;
  let key = cart.findIndex((item) => item.identifier === identifier);

  if (key > -1) {
    cart[key].qt += qt;
  } else {
    cart.push({
      identifier,
      id: pizza.id,
      size,
      qt: qt,
      price: pizza.price
    });
  }
  return cart;
}

// Adicione aqui a função de formatação de moeda
function formatCurrency(value) {
  return 'R$ ' + value.toFixed(2).replace('.', ',');
}

if (typeof module !== 'undefined') {
  module.exports = { 
    calcularTotais, 
    adicionarAoCarrinho,
    formatCurrency
  };
}