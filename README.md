# Meu Projeto Nest.js

Este é o meu incrível projeto desenvolvido com o framework Nest.js. Este README fornece instruções para configurar e executar o projeto em seu ambiente local.

## Pré-requisitos

Antes de começar, certifique-se de que você tenha instalado:

- Node.js (v16+ recomendado): [Baixar Node.js](https://nodejs.org/)
- npm (gerenciador de pacotes do Node.js): Normalmente é instalado automaticamente com o Node.js.

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-projeto.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd seu-projeto
   ```

3. Instale as dependências do projeto:

   ```bash
   npm install
   ```

## Configuração

Altere o nome do arquivo `.env.example` para `.env` e altere as informações do banco e da aplicação que serão necessárias.

## Executando o Projeto

Agora que o projeto está configurado, você pode executá-lo:

```
  bash npm install
```

O servidor Nest.js será iniciado e você verá mensagens no console indicando que o servidor está em execução. Por padrão, o servidor estará disponível em http://localhost:3000

## Docker

Caso você possua o docker é possível executar o projeto em um container.
Para isso configure o host do banco para `db` na variável de ambiente e execute o seguinte comando:

```
  docker compose up
```
