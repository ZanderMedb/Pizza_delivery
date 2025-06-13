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

  // Simulação do seu código de produção
  function displayUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      alert("Dados de entrega não encontrados. Redirecionando para o cadastro...");
      window.location.assign('register.html');
      return;
    }
    // Exemplo de renderização (ajuste conforme seu código real)
    document.getElementById('user-info').innerHTML = `
      <p>Nome: ${userInfo.nome}</p>
      <p>Telefone: ${userInfo.telefone}</p>
      <p>Endereço: ${userInfo.endereco}</p>
      <p>Complemento: ${userInfo.complemento}</p>
    `;
  }

  it('mostra informações do usuário se houver userInfo', () => {
    const userInfo = {
      nome: 'José',
      telefone: '11111-2222',
      endereco: 'Av. Teste, 100',
      complemento: 'apto 1'
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    displayUserInfo();

    const html = document.getElementById('user-info').innerHTML;
    expect(html).toContain('José');
    expect(html).toContain('11111-2222');
    expect(html).toContain('Av. Teste, 100');
    expect(html).toContain('apto 1');
    expect(global.alert).not.toHaveBeenCalled();
  });

  it('mostra alerta se não houver userInfo', () => {
    localStorage.removeItem('userInfo');
    expect(() => displayUserInfo()).not.toThrow();
    expect(global.alert).toHaveBeenCalledWith(
      "Dados de entrega não encontrados. Redirecionando para o cadastro..."
    );
    // NÃO teste window.location.assign!
  });
});