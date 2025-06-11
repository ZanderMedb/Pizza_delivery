-- CREATE DATABASE pizzadb CHARACTER SET utf8mb4 COLLATE ;performance_schema

USE pizzadb;

-- CREATE TABLE pedidos (
    -- id INT AUTO_INCREMENT PRIMARY KEY,
    -- nome VARCHAR(100),
    -- telefone VARCHAR(20),
    -- cep VARCHAR(10),
    -- endereco VARCHAR(120),
    -- numero VARCHAR(10),
    -- complemento VARCHAR(50),
    -- bairro VARCHAR(60),
    -- pagamento VARCHAR(20),
    -- carrinho TEXT,
    -- criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE USER 'root'@'localhost' IDENTIFIED BY '1234';

-- GRANT ALL PRIVILEGES ON pizzadb.* TO 'pizzauser'@'localhost';
-- FLUSH PRIVILEGES;
SHOW TABLES;

SELECT * FROM pedidos;