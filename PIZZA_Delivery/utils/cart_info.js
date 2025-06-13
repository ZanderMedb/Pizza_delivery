/**
 * @jest-environment jsdom
 */

describe('displayUserInfo', () => {
  beforeAll(() => {
    global.alert = jest.fn();
  });

  beforeEach(() => {
    global.alert.mockClear();
    localStorage.clear();
    document.body.innerHTML = `<div id="user-info"></div>`;
  });

  function displayUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      alert("Dados de entrega não encontrados. Redirecionando para o cadastro...");
      window.location.assign('register.html');
      return;
    }
    // seu código normal...
  }

  it('mostra informações do usuário', () => {
    const userInfo = {
      nome: 'José',
      telefone: '11111-2222',
      endereco: 'Av. Teste, 100',
      complemento: 'apto 1'
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    displayUserInfo();

    // Teste seu HTML normalmente, exemplo:
    // const html = document.getElementById('user-info').innerHTML;
    // expect(html).toContain('José');
  });

  it('mostra alerta se não houver userInfo', () => {
    localStorage.removeItem('userInfo');
    expect(() => displayUserInfo()).not.toThrow();
    expect(global.alert).toHaveBeenCalledWith(
      "Dados de entrega não encontrados. Redirecionando para o cadastro..."
    );
    // NÃO teste window.location.assign
  });
});