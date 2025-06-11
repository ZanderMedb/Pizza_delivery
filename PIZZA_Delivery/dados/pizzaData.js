// pizzaData.js
const pizzaJson = [
    {
        id: 1,
        name: 'Mussarela',
        img: '../images/pizza.png', // Caminho correto relativo à raiz
        price: 20.50,
        sizes: ['100g', '530g', '860g'],
        description: 'Molho de tomate, camada dupla de mussarela e orégano'
    },
    {
        id: 2,
        name: 'Calabresa',
        img: '../images/pizza2.png', // Caminho correto relativo à raiz
        price: 18.00,
        sizes: ['320g', '530g', '860g'],
        description: 'Molho de tomate, mussarela, calabresa fatiada, cebola e orégano'
    },
    {
        id: 3,
        name: 'Quatro Queijos',
        img: '../images/pizza3.png', // Caminho correto relativo à raiz
        price: 17.45,
        sizes: ['320g', '530g', '860g'],
        description: 'Molho de tomate, camadas de mussarela, provolone, parmesão e gorgonzola'
    },
    {
        id: 4,
        name: 'Americana',
        img: '../images/pizza4.png', // Caminho correto relativo à raiz
        price: 19.99,
        sizes: ['320g', '530g', '860g'],
        description: 'Molho de tomate, mussarela, pepperoni e orégano'
    },
    {
        id: 5,
        name: 'Sorvete',
        img: '../images/pizza5.png', // Caminho correto relativo à raiz
        price: 21.50,
        sizes: ['320g', '530g', '860g'],
        description: 'Molho de tomate, mussarela, presunto, ovos, cebolas, azeitonas'
    },
    {
        id: 6,
        name: 'Moda da Casa',
        img: '../images/pizza6.png', // Caminho correto relativo à raiz
        price: 18.00,
        sizes: ['320g', '530g', '860g'],
        description: 'Molho de tomate, mussarela, carne de sol, tomates em cubos, coentro'
    },
    {
        id: 7,
        name: 'Chocolate',
        img: '../images/pizza7.png', // Caminho correto relativo à raiz
        price: 23.50,
        sizes: ['320g', '530g', '860g'],
        description: 'Chocolate derretido, pedaços de chocolate e granulado'
    }
];

// Verificador de imagens
window.addEventListener('load', () => {
    pizzaJson.forEach((pizza, index) => {
        const img = new Image();
        img.onload = () => console.log(`✅ Imagem ${pizza.name} carregada com sucesso`);
        img.onerror = () => console.error(`❌ Erro ao carregar imagem ${pizza.name}`);
        img.src = pizza.img;
    });
});
window.pizzaJson = pizzaJson;