// registerUtils.test.js

const { validarDadosEntrega } = require('../utils/registerUtils');

describe('validarDadosEntrega', () => {
  it('retorna true para dados completos e carrinho não vazio', () => {
    const dados = {
      nome: 'João',
      telefone: '11999999999',
      cep: '01234567',
      endereco: 'Rua Teste',
      numero: '123',
      complemento: '',
      bairro: 'Centro',
      pagamento: 'dinheiro',
      carrinho: [{ id: 1, qt: 2 }]
    };
    expect(validarDadosEntrega(dados)).toBe(true);
  });

  it('retorna false se faltar algum campo obrigatório', () => {
    const dados = {
      nome: 'João',
      telefone: '', // faltando telefone
      cep: '01234567',
      endereco: 'Rua Teste',
      numero: '123',
      complemento: '',
      bairro: 'Centro',
      pagamento: 'dinheiro',
      carrinho: [{ id: 1, qt: 2 }]
    };
    expect(validarDadosEntrega(dados)).toBe(false);
  });

  it('retorna false se carrinho estiver vazio', () => {
    const dados = {
      nome: 'João',
      telefone: '11999999999',
      cep: '01234567',
      endereco: 'Rua Teste',
      numero: '123',
      complemento: '',
      bairro: 'Centro',
      pagamento: 'dinheiro',
      carrinho: []
    };
    expect(validarDadosEntrega(dados)).toBe(false);
  });

  it('retorna false se carrinho não for array', () => {
    const dados = {
      nome: 'João',
      telefone: '11999999999',
      cep: '01234567',
      endereco: 'Rua Teste',
      numero: '123',
      complemento: '',
      bairro: 'Centro',
      pagamento: 'dinheiro',
      carrinho: null
    };
    expect(validarDadosEntrega(dados)).toBe(false);
  });
});