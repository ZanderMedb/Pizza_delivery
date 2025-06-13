/**
 * @jest-environment jsdom
 */

describe('Finalizar Pedido', () => {
  beforeAll(() => {
    global.alert = jest.fn();
  });

  beforeEach(() => {
    global.alert.mockClear();
    localStorage.clear();
  });

  // Copie sua função de produção aqui para o teste ou importe
  function finalizarPedido() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      alert("Dados de entrega não encontrados. Redirecionando para o cadastro...");
      window.location.assign('register.html'); // Ou window.location.href = ...
      return;
    }
    return true;
  }

  it('deve mostrar alerta se não houver userInfo', () => {
    localStorage.removeItem('userInfo');
    expect(() => finalizarPedido()).not.toThrow();

    expect(global.alert).toHaveBeenCalledWith(
      "Dados de entrega não encontrados. Redirecionando para o cadastro..."
    );
    // NÃO teste redirecionamento!
  });

  it('deve finalizar pedido com sucesso quando há userInfo', () => {
    const fakeUser = { nome: "Zé", endereco: "Rua 1" };
    localStorage.setItem('userInfo', JSON.stringify(fakeUser));
    const result = finalizarPedido();

    expect(global.alert).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});