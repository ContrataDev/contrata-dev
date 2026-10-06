<br />
<div align="center">
  <a href="https://github.com/ContrataDev/contrata-dev">
    <img src="docs/images/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">ContrataDev</h3>
<p align="center">
    Marketplace que conecta clientes a desenvolvedores freelancers.
    <br />
    Projeto final do curso de Desenvolvimento de Sistemas — Etec de Carapicuíba
</p>
</div>

---

## Sobre o projeto

O **ContrataDev** é uma plataforma web onde **clientes** publicam solicitações de projetos de software e **desenvolvedores** se candidatam a elas. A ideia é simplificar o contato entre quem precisa de um projeto e quem tem as habilidades para entregá-lo.

### Para clientes

- Cadastro e login como cliente.
- Criação de solicitações de projeto com título, descrição, tecnologias, orçamento e prazo.
- Dashboard com as solicitações criadas e os desenvolvedores que se candidataram.
- Exclusão das próprias solicitações.
- Perfil próprio com edição de dados e avatar.

### Para desenvolvedores

- Cadastro e login como desenvolvedor.
- Dashboard com os projetos abertos.
- Candidatura a projetos, gerando uma proposta para o cliente.
- Perfil com stack de tecnologias, senioridade (júnior, pleno ou sênior), disponibilidade, valor por hora, portfólio, certificações e avatar.
- Página pública de perfil em `/developer/:id`.

### Páginas públicas

- `/` — página inicial.
- `/solicitacao/:id` — detalhes de uma solicitação, incluindo os desenvolvedores já aceitos.
- `/developer/:id` — perfil público de um desenvolvedor.

---

## Tecnologias

| Camada          | Tecnologia                                         |
| --------------- | -------------------------------------------------- |
| Backend         | Node.js, Express (ES Modules)                      |
| Views           | EJS, JavaScript e CSS vanilla                      |
| Banco de dados  | MySQL com Sequelize (ORM)                          |
| Autenticação    | Passport (estratégia local), express-session, bcrypt |
| Upload          | Multer                                             |
| Infraestrutura  | Docker, Docker Compose, GitHub Actions             |
| Testes          | Supertest                                          |

---

## Estrutura do projeto

```
contrata-dev/
├── bin/                # Ponto de entrada (www)
├── docs/               # Documentação e imagens
├── public/             # Arquivos estáticos (CSS, JS, imagens)
├── scripts/            # Scripts SQL (popular e resetar o banco)
├── src/
│   ├── config/         # Banco de dados e autenticação (Passport)
│   ├── controllers/    # Lógica das rotas
│   ├── middlewares/    # Controle de acesso (isClient, isDeveloper)
│   ├── models/         # Models do Sequelize
│   │   ├── core/         # User, Client, Developer, Organization
│   │   ├── marketplace/  # Project, JobPosting, Proposal, Contract...
│   │   └── profile/      # Skill, TechnologyStack, Certification...
│   ├── routers/
│   │   ├── web/        # Rotas das páginas
│   │   └── api/        # API REST (/api/v1)
│   ├── utils/
│   ├── views/          # Templates EJS (client, develop, public)
│   └── app.js
├── tests/
├── Dockerfile
└── docker-compose.yml
```

---

## Como executar

### Com Docker (recomendado)

```bash
docker compose up --build
```

A aplicação ficará disponível em `http://localhost:3000` e o MySQL na porta `3307` do host.

### Localmente

**Pré-requisitos:** Node.js e uma instância do MySQL.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo e preencha as variáveis:

   ```bash
   cp .env.example .env
   ```

   | Variável      | Descrição                          |
   | ------------- | ---------------------------------- |
   | `NODE_ENV`    | Ambiente (`development`, `production`) |
   | `PORT`        | Porta da aplicação (padrão `3000`) |
   | `APP_NAME`    | Nome da aplicação                  |
   | `APP_URL`     | URL base da aplicação              |
   | `DB_HOST`     | Host do MySQL                      |
   | `DB_PORT`     | Porta do MySQL (padrão `3306`)     |
   | `DB_NAME`     | Nome do banco                      |
   | `DB_USER`     | Usuário do banco                   |
   | `DB_PASSWORD` | Senha do banco                     |

3. Inicie a aplicação:

   ```bash
   npm start
   ```

As tabelas são criadas automaticamente na primeira execução. Para popular o banco com dados de exemplo, use o script `scripts/Encher banco de dados.sql`.

---

## API

A API REST fica sob `/api/v1`:

| Recurso               | Rota base                 |
| --------------------- | ------------------------- |
| Usuários              | `/api/v1/users`           |
| Desenvolvedores       | `/api/v1/developers`      |
| Clientes              | `/api/v1/clients`         |
| Projetos              | `/api/v1/projects`        |
| Stacks de tecnologia  | `/api/v1/technologyStacks`|

As páginas de perfil do desenvolvedor (`/develop/perfil` e `/develop/edit-perfil`) consomem esses endpoints. A edição usa `PUT /api/v1/developers/:id`.

### Upload de avatar

O avatar do desenvolvedor é enviado em `POST /api/v1/developers/:id/avatar` (`multipart/form-data`, campo `avatar`). Mais detalhes em [docs/Avatar upload.md](docs/Avatar%20upload.md).

---

## Modelo de dados

O banco foi pensado para cobrir todo o ciclo de contratação:

**Cliente cria uma vaga → Desenvolvedor envia proposta → Proposta vira contrato → Milestones → Entregas**

Entidades principais:

- **Core:** User, Client, Developer, Organization
- **Marketplace:** Project, JobPosting, Proposal, Contract, Milestone, Deliverable, Timesheet
- **Perfil:** Skill, TechnologyStack, Certification, PortfolioItem, Availability, RateCard

O planejamento completo, incluindo entidades futuras como pagamentos, escrow, avaliações e chat, está em [docs/Banco de dados.md](docs/Banco%20de%20dados.md).

---

## Testes

```bash
npm test
```

Executa um teste de sanidade simples da API.

---

## Licença

Distribuído sob a licença MIT.
