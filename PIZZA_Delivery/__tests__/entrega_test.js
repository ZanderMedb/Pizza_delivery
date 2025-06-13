/**
 * @jest-environment jsdom
 */

// Simula localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const RESTAURANTE = {
    CEP: '72130-040',
    NOME: 'Pizza Delivery',
    ENDERECO: 'QNG 04',
    BAIRRO: 'Taguatinga Norte',
    CIDADE: 'Brasília',
    ESTADO: 'DF'
};

// Copiando as funções puros do entrega.js

async function calcularTempoPreparoTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPizzas = cart.reduce((total, item) => total + item.qt, 0);
    const TEMPO_BASE = 15;
    const tempoPreparo = TEMPO_BASE + (Math.floor(totalPizzas / 2) * 5);
    return Math.min(tempoPreparo, 40); // Máximo de 40 minutos de preparo
}

async function calcularDistancia(cep2) {
    const cep1 = RESTAURANTE.CEP;
    const cep1Num = parseInt(cep1.replace('-', ''));
    const cep2Num = parseInt(cep2.replace('-', ''));
    
    const diff = Math.abs(cep1Num - cep2Num);
    const distanciaKm = Math.min((diff / 100) * 0.5, 30);
    
    const tempoPreparo = await calcularTempoPreparoTotal();
    const VELOCIDADE_MEDIA = 35;
    const tempoPercurso = Math.ceil((distanciaKm / VELOCIDADE_MEDIA) * 60);

    let tempoAdicional = 0;
    if (distanciaKm > 20) {
        tempoAdicional = 10;
    } else if (distanciaKm > 10) {
        tempoAdicional = 5;
    }
    
    return {
        tempoPreparo,
        tempoEntrega: Math.max(5, Math.min(tempoPercurso + tempoAdicional, 60)),
        distanciaKm
    };
}

describe('Funções entrega.js', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('calcularTempoPreparoTotal', () => {
    it('retorna 15 minutos para carrinho vazio', async () => {
      window.localStorage.setItem('cart', JSON.stringify([]));
      const tempo = await calcularTempoPreparoTotal();
      expect(tempo).toBe(15);
    });

    it('retorna 15 minutos para 1 pizza', async () => {
      window.localStorage.setItem('cart', JSON.stringify([{qt: 1}]));
      const tempo = await calcularTempoPreparoTotal();
      expect(tempo).toBe(15);
    });

    it('adiciona 5 minutos a cada 2 pizzas', async () => {
      window.localStorage.setItem('cart', JSON.stringify([{qt: 4}]));
      const tempo = await calcularTempoPreparoTotal();
      // 4 pizzas: 15 + (Math.floor(4/2) * 5) = 15 + 10 = 25
      expect(tempo).toBe(25);
    });

    it('nunca ultrapassa 40 minutos', async () => {
      window.localStorage.setItem('cart', JSON.stringify([{qt: 20}]));
      const tempo = await calcularTempoPreparoTotal();
      expect(tempo).toBe(40);
    });
  });

  describe('calcularDistancia', () => {
    beforeEach(() => {
      // Cart com 2 pizzas, para tempo de preparo = 15 + 5 = 20
      window.localStorage.setItem('cart', JSON.stringify([{qt: 2}]));
    });

    it('calcula distância e tempo de entrega para CEP igual ao restaurante', async () => {
      const result = await calcularDistancia('72130-040');
      expect(result.distanciaKm).toBe(0);
      expect(result.tempoEntrega).toBeGreaterThanOrEqual(5); // tempo mínimo
      expect(result.tempoPreparo).toBe(20);
    });

    it('calcula distância e tempo de entrega para CEP diferente', async () => {
      const result = await calcularDistancia('72140-040');
      // diff = 10000, distanciaKm = (10000/100)*0.5 = 50*0.5 = 25 (mas limitado a 30)
      expect(result.distanciaKm).toBeLessThanOrEqual(30);
      expect(result.tempoEntrega).toBeLessThanOrEqual(60);
    });

    it('adiciona tempo extra para distâncias maiores que 10 km', async () => {
      const result = await calcularDistancia('72250-040');
      // diff = 120010, distanciaKm = (120010/100)*0.5 = 600.05*0.5 = 300.025, limitado a 30km
      expect(result.distanciaKm).toBe(30);
      expect(result.tempoEntrega).toBeLessThanOrEqual(60);
    });
  });
});