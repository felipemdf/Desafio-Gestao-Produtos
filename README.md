# Gesafio Gestão Produtos

## Pré-requisitos

Antes de começar, certifique-se de que você tenha instalado:

- Node.js (v16+ recomendado): [Baixar Node.js](https://nodejs.org/)
- npm (gerenciador de pacotes do Node.js): Normalmente é instalado automaticamente com o Node.js.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/felipemdf/desafio-gestao-produtos-backend.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd desafio-gestao-produtos-backend
   ```

3. Instale as dependências do projeto:

   ```bash
   npm install
   ```

## Configuração

1. Altere o nome do arquivo `.env.example` para `.env` e altere as informações do banco e da aplicação que serão necessárias.

2. Crie uma banco de dados com o mesmo nome da variável de ambiente `DB_NAME`

3. Execute as migrations para criar as tabelas com o comando:
   ```bash
   npm run migration:run
   ```

## Executando o Projeto

Agora que o projeto está configurado, você pode executá-lo:

```
  bash npm run start
```

O servidor Nest.js será iniciado e você verá mensagens no console indicando que o servidor está em execução. Por padrão, o servidor estará disponível em http://localhost:3000

## Docker

Caso você possua o docker é possível executar o projeto utilizando-o.Para isso configure o host do banco para `db` na variável de ambiente e execute o seguinte comando:

```
  docker compose up
```
