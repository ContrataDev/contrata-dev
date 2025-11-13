### Core entities

- **User:** Conta base com autenticação, perfil e preferências.
- **Developer:** Especialização de User com habilidades, stack, senioridade e portfólio.
- **Client:** Especialização de User com empresa, orçamento e histórico de contratação.
- **Organization/Team:** Agrupamento de Users com papéis e permissões.

---

### Marketplace workflow entities

- **Project:** Escopo, descrição, orçamento, prazo, status e anexos.
- **Job posting:** Vaga pública com requisitos, faixa de preço, modelo de contratação e nível.
- **Proposal/Bid:** Oferta do dev com preço, prazo, plano de execução e mensagens iniciais.
- **Contract:** Acordo formal com termos, taxa, datas e participantes.
- **Milestone:** Entregas intermediárias com valor e critérios de aceitação.
- **Deliverable:** Artefatos enviados (código, documentação, links de repositório).
- **Timesheet/Work log:** Registro de horas e atividades, se o modelo for hourly.

---

### Financial entities

- **Escrow:** Valor depositado pelo cliente e liberado por aceite de milestones.
- **Payment:** Transações, método de pagamento e status.
- **Invoice:** Fatura detalhando itens e impostos.
- **Payout:** Repasse ao dev, taxas e método de recebimento.
- **Fee:** Taxas da plataforma (serviço, conversão, saque).
- **Tax profile:** Dados fiscais, notas e retenções conforme país.

---

### Profile and qualification entities

- **Skill:** Lista normalizada de competências (ex.: React, Node.js).
- **Technology stack:** Conjunto de skills com níveis e anos de experiência.
- **Certification:** Certificados, cursos e validações externas.
- **Portfolio item:** Projetos anteriores com evidências e links.
- **Availability:** Horários, fuso, carga semanal e início possível.
- **Rate card:** Preços por hora/projeto e moedas suportadas.

---

### Communication and trust entities

- **Message/Thread:** Chat entre cliente e dev, com anexos e histórico.
- **Review/Rating:** Avaliações pós-contrato com comentários e estrelas.
- **Dispute:** Registro de conflito, evidências e mediação.
- **Report:** Denúncias de comportamento ou conteúdo indevido.
- **Notification:** Eventos do sistema por e-mail, push ou in-app.

---

### Platform governance entities

- **Role/Permission:** Papéis (admin, client, dev, support) e escopos.
- **Verification/KYC:** Identidade, empresa e verificação de pagamento.
- **Policy/Terms consent:** Aceite de termos, privacidade e mudanças.
- **Audit log:** Histórico de ações críticas para conformidade.
- **API token:** Acesso programático para integrações.

---

### Relacionamentos essenciais

- **Client cria Job posting → Dev envia Proposal → vira Contract → Milestones com Escrow → Deliverables → Payment/Payout.**
- **Developer possui Skills, Portfolio e Reviews; Client possui Reviews e Invoices.**
- **Messages vinculam-se a Proposal, Contract ou Project.**
