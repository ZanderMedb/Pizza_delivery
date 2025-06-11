import requests
import os

# Definir caminhos
entrada = r"C:\GIT\Pizza-Delivery-TESTSOFT-UCB\docs\Diagrams\Classes"
saida = r"C:\GIT\Pizza-Delivery-TESTSOFT-UCB\convert\PDF"

# Criar a pasta de saída se não existir
os.makedirs(saida, exist_ok=True)

# URL do Kroki para conversão PlantUML para PDF
kroki_url = "https://kroki.io/plantuml/pdf"

# Função para converter .puml para PDF usando o Kroki
def converter_com_kroki(arquivo):
    with open(arquivo, "r", encoding="utf-8") as file:
        puml_content = file.read()
    
    # Enviar para o Kroki
    response = requests.post(kroki_url, data=puml_content, headers={"Content-Type": "text/plain"}, timeout=10)

    if response.status_code == 200:
        # Salvar o arquivo PDF na pasta de saída
        nome_pdf = os.path.join(saida, os.path.basename(arquivo).replace(".puml", ".pdf"))
        with open(nome_pdf, "wb") as pdf_file:
            pdf_file.write(response.content)
        print(f"Arquivo {nome_pdf} gerado com sucesso!")
    else:
        print(f"Erro na conversão do arquivo {arquivo}: {response.status_code}")

# Listar arquivos .puml e converter
for arquivo in os.listdir(entrada):
    if arquivo.endswith(".puml"):
        caminho_entrada = os.path.join(entrada, arquivo)
        converter_com_kroki(caminho_entrada)

print("Conversão concluída!")
