// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Habilita CORS para permitir requisições do frontend
app.use(require('cors')());

// Habilita JSON no corpo das requisições
app.use(express.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',          // ou 'pizzauser' se preferir
    password: '1234',
    database: 'pizzadb',
    port: 3307
});

// Testa conexão ao iniciar
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados pizzadb!');
});

// Rota principal de teste
app.get('/', (req, res) => {
    res.send('API da Pizzaria está funcionando!');
});

// Rota para salvar um novo pedido
app.post('/api/pedidos', (req, res) => {
    const {
        nome, telefone, cep, endereco, numero, complemento, bairro, pagamento, carrinho
    } = req.body;

    if (!nome || !telefone || !cep || !endereco || !numero || !bairro || !pagamento || !Array.isArray(carrinho) || carrinho.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Dados incompletos do pedido.' 
        });
    }

    const carrinhoStr = JSON.stringify(carrinho);

    db.query(
        'INSERT INTO pedidos (nome, telefone, cep, endereco, numero, complemento, bairro, pagamento, carrinho) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nome, telefone, cep, endereco, numero, complemento, bairro, pagamento, carrinhoStr],
        (err, result) => {
            if (err) {
                console.error('Erro ao salvar pedido:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Erro ao salvar pedido'
                });
            }
            res.json({ 
                success: true, 
                id: result.insertId,
                message: 'Pedido registrado com sucesso!'
            });
        }
    );
});

// Rota para listar todos os pedidos (opcional)
app.get('/api/pedidos', (req, res) => {
    db.query('SELECT * FROM pedidos ORDER BY criado_em DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        // Desfaz o JSON do carrinho antes de enviar
        rows.forEach(row => {
            try {
                row.carrinho = JSON.parse(row.carrinho);
            } catch {
                row.carrinho = [];
            }
        });
        res.json(rows);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://127.0.0.1:${PORT}`);
});