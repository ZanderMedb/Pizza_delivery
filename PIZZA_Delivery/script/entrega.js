// Constantes globais
const RESTAURANTE = {
    CEP: '72130-040',
    NOME: 'Pizza Delivery',
    ENDERECO: 'QNG 04',
    BAIRRO: 'Taguatinga Norte',
    CIDADE: 'Brasília',
    ESTADO: 'DF'
};

let entregaTimer;
let tempoTotalEntrega;
let tempoDecorrido = 0;
let statusAtual = 0;
const TEMPO_PREPARO = 15; // tempo base em minutos

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

function atualizarStatus(porcentagem) {
    const statusAtualElement = document.getElementById('statusAtual');
    
    if (tempoDecorrido <= TEMPO_PREPARO * 60) {
        document.querySelector('#preparo .step-circle').style.background = '#e23744';
        statusAtualElement.querySelector('.status-text').innerText = "Preparando seu pedido...";
        
        anime({
            targets: '#preparo .step-circle',
            scale: [1, 1.2],
            duration: 1000,
            direction: 'alternate',
            loop: true
        });
    } else if (porcentagem <= 90) {
        document.querySelector('#caminho .step-circle').style.background = '#e23744';
        statusAtualElement.querySelector('.status-text').innerText = "Entregador a caminho...";
        
        anime.remove('#preparo .step-circle');
        
        anime({
            targets: '#caminho .step-circle',
            translateX: ['-5px', '5px'],
            duration: 1000,
            direction: 'alternate',
            loop: true
        });
    } else {
        document.querySelector('#entregue .step-circle').style.background = '#e23744';
        statusAtualElement.querySelector('.status-text').innerText = "Pedido entregue!";
        
        anime.remove('#preparo .step-circle, #caminho .step-circle');
        
        anime({
            targets: '#entregue .step-circle',
            scale: [1, 1.5],
            opacity: [1, 0],
            duration: 1000,
            loop: true
        });
    }
}

function atualizarProgresso() {
    tempoDecorrido += 1;
    const porcentagem = (tempoDecorrido / tempoTotalEntrega) * 100;
    
    if (tempoDecorrido >= tempoTotalEntrega) {
        clearInterval(entregaTimer);
        document.getElementById('progress').style.width = '100%';
        document.getElementById('tempoRestante').innerText = 'Entrega concluída!';
        atualizarStatus(100);
        
        anime({
            targets: '#resultado',
            scale: [1, 1.02],
            duration: 500,
            direction: 'alternate'
        });
        return;
    }

    document.getElementById('progress').style.width = `${porcentagem}%`;
    const tempoRestante = tempoTotalEntrega - tempoDecorrido;
    document.getElementById('tempoRestante').innerText = 
        `Tempo restante: ${Math.floor(tempoRestante / 60)}min ${tempoRestante % 60}s`;
    
    atualizarStatus(porcentagem);
}

async function iniciarRastreamento() {
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            window.location.href = 'register.html';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalPizzas = cart.reduce((total, item) => total + item.qt, 0);
        
        const tempos = await calcularDistancia(userInfo.cep);
        tempoTotalEntrega = (tempos.tempoPreparo + tempos.tempoEntrega) * 60;

        const agora = new Date();
        const chegada = new Date(agora.getTime() + tempoTotalEntrega * 1000);

        document.getElementById('resultado').style.display = 'block';
        
        // Status container com todas as informações
        document.getElementById('statusAtual').innerHTML = `
            <div class="order-info">
                <div class="info-row">
                    <span class="info-icon">🍕</span>
                    <span class="info-text">${totalPizzas} pizza${totalPizzas > 1 ? 's' : ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">⏰</span>
                    <span class="info-text">Preparo: ${tempos.tempoPreparo} min</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">🚚</span>
                    <span class="info-text">Entrega: ${tempos.tempoEntrega} min</span>
                </div>
                <div class="info-row">
                    <span class="info-icon">📍</span>
                    <span class="info-text">Distância: ${tempos.distanciaKm.toFixed(1)} km</span>
                </div>
                <div class="status-text">Preparando seu pedido...</div>
            </div>
        `;

        document.getElementById('tempoEstimado').innerText = 
            `Chegada estimada: ${chegada.getHours()}:${String(chegada.getMinutes()).padStart(2, '0')}`;

        // Animação inicial
        anime({
            targets: '#resultado',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });

        // Animação para cada linha de informação
        anime({
            targets: '.info-row',
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutQuad'
        });

        entregaTimer = setInterval(atualizarProgresso, 1000);
        
    } catch (error) {
        console.error('Erro ao iniciar rastreamento:', error);
        alert('Erro ao iniciar rastreamento. Redirecionando...');
        window.location.href = 'index.html';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', iniciarRastreamento);