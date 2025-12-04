# adicionar Usuários
INSERT INTO Users (id, name, email, passwordHash, role, profilePicture, bio, location, language, preferences, createdAt, updatedAt)
VALUES
('da1ab4d1-ace1-4a77-b9b3-86cfac049ed0', 'Ana Silva', 'ana.silva@email.com', '$2b$10$N9qo8uLOickgx2ZMRZo5i.Ul8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'developer', NULL, 'Frontend developer apaixonada por React.', 'São Paulo', 'pt-BR', NULL, NOW(), NOW()),
('f2729f90-cbfe-11f0-ba9e-fabef9cf6cee', 'Carlos Souza', 'carlos.souza@email.com', '$2b$10$7s9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'client', NULL, 'Empresário buscando soluções digitais.', 'Rio de Janeiro', 'pt-BR', NULL, NOW(), NOW()),
('f2767d4d-cbfe-11f0-ba9e-fabef9cf6cee', 'Mariana Costa', 'mariana.costa@email.com', '$2b$10$3k9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'developer', NULL, 'Backend developer focada em Node.js.', 'Belo Horizonte', 'pt-BR', NULL, NOW(), NOW()),
('f2769153-cbfe-11f0-ba9e-fabef9cf6cee', 'João Pereira', 'joao.pereira@email.com', '$2b$10$5h9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'client', NULL, 'Gestor de projetos de TI.', 'Curitiba', 'pt-BR', NULL, NOW(), NOW()),
('f2769b1e-cbfe-11f0-ba9e-fabef9cf6cee', 'Fernanda Lima', 'fernanda.lima@email.com', '$2b$10$8k9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'developer', NULL, 'DevOps engineer com experiência em Docker.', 'Porto Alegre', 'pt-BR', NULL, NOW(), NOW()),
('f276ac60-cbfe-11f0-ba9e-fabef9cf6cee', 'Ricardo Alves', 'ricardo.alves@email.com', '$2b$10$4k9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'client', NULL, 'Consultor de tecnologia.', 'Recife', 'pt-BR', NULL, NOW(), NOW()),
('f276bbed-cbfe-11f0-ba9e-fabef9cf6cee', 'Paula Mendes', 'paula.mendes@email.com', '$2b$10$6k9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'developer', NULL, 'Fullstack developer apaixonada por GraphQL.', 'Florianópolis', 'pt-BR', NULL, NOW(), NOW()),
('f276c987-cbfe-11f0-ba9e-fabef9cf6cee', 'Felipe Rocha', 'felipe.rocha@email.com', '$2b$10$2k9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'client', NULL, 'Empreendedor digital.', 'Fortaleza', 'pt-BR', NULL, NOW(), NOW()),
('f276d4b1-cbfe-11f0-ba9e-fabef9cf6cee', 'Camila Torres', 'camila.torres@email.com', '$2b$10$1k9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'developer', NULL, 'Especialista em bancos de dados.', 'Manaus', 'pt-BR', NULL, NOW(), NOW()),
('f276e45c-cbfe-11f0-ba9e-fabef9cf6cee', 'Gustavo Nunes', 'gustavo.nunes@email.com', '$2b$10$9k9uQkQjYhQqJ8Zzj5QfF9Wl8b0xZ1jY7v1fQmYhQqJ8Zzj5QfF9W', 'client', NULL, 'Diretor de startup de tecnologia.', 'Brasília', 'pt-BR', NULL, NOW(), NOW());


# adicionar clientes
INSERT INTO Clients (userId, companyName, budgetRange, createdAt, updatedAt)
VALUES
('f2729f90-cbfe-11f0-ba9e-fabef9cf6cee', 'Tech Solutions Ltda', 'R$50.000 - R$100.000', NOW(), NOW()),
('f2769153-cbfe-11f0-ba9e-fabef9cf6cee', 'Inova Digital', 'R$20.000 - R$50.000', NOW(), NOW()),
('f276ac60-cbfe-11f0-ba9e-fabef9cf6cee', 'Consultoria Alves', 'R$10.000 - R$30.000', NOW(), NOW()),
('f276c987-cbfe-11f0-ba9e-fabef9cf6cee', 'Rocha Empreendimentos', 'R$100.000 - R$200.000', NOW(), NOW()),
('f276e45c-cbfe-11f0-ba9e-fabef9cf6cee', 'Startup Nunes Tech', 'R$200.000+', NOW(), NOW());

# adicionar desenvolvedores
INSERT INTO Developers (userId, seniority, availability, hourlyRate, createdAt, updatedAt)
VALUES
('da1ab4d1-ace1-4a77-b9b3-86cfac049ed0', 'Frontend (React, Vue)', 'pleno', 'Disponível 30h/semana', 120.00, NOW(), NOW()),
('f2767d4d-cbfe-11f0-ba9e-fabef9cf6cee', 'Backend (Node.js, PostgreSQL)', 'senior', 'Disponível 40h/semana', 150.00, NOW(), NOW()),
('f2769b1e-cbfe-11f0-ba9e-fabef9cf6cee', 'DevOps (Docker, Kubernetes)', 'pleno', 'Disponível 20h/semana', 130.00, NOW(), NOW()),
('f276bbed-cbfe-11f0-ba9e-fabef9cf6cee', 'Fullstack (GraphQL, React, Node.js)', 'junior', 'Disponível 25h/semana', 100.00, NOW(), NOW()),
('f276d4b1-cbfe-11f0-ba9e-fabef9cf6cee', 'Database (MongoDB, PostgreSQL)', 'senior', 'Disponível 35h/semana', 140.00, NOW(), NOW());

# adicionar projetos
INSERT INTO Projects (clientId, title, description, budget, deadline, status, createdAt, updatedAt)
VALUES
-- Cliente 1
(1, 'Plataforma E-commerce', 'Desenvolvimento de uma plataforma de vendas online com integração de pagamentos.', 80000, '2026-03-01', 'open', NOW(), NOW()),
(1, 'Aplicativo de Fidelidade', 'App mobile para programa de pontos e recompensas.', 25000, '2026-04-10', 'draft', NOW(), NOW()),

-- Cliente 2
(2, 'Aplicativo de Delivery', 'Aplicativo mobile para entregas rápidas com geolocalização.', 50000, '2026-04-15', 'draft', NOW(), NOW()),
(2, 'Sistema de Rastreamento', 'Sistema web para rastrear entregas em tempo real.', 40000, '2026-05-20', 'open', NOW(), NOW()),

-- Cliente 3
(3, 'Sistema de Gestão Empresarial', 'ERP para pequenas empresas com módulos de estoque e financeiro.', 30000, '2026-05-10', 'in_progress', NOW(), NOW()),
(3, 'Dashboard Financeiro', 'Painel de controle para análise de fluxo de caixa.', 20000, '2026-06-05', 'draft', NOW(), NOW()),

-- Cliente 4
(4, 'Plataforma de Cursos Online', 'Portal de ensino com videoaulas e certificações.', 120000, '2026-06-20', 'open', NOW(), NOW()),
(4, 'Sistema de Avaliação', 'Ferramenta para provas online e emissão de certificados.', 35000, '2026-07-15', 'in_progress', NOW(), NOW()),

-- Cliente 5
(5, 'Marketplace de Serviços', 'Marketplace para conectar freelancers e clientes.', 200000, '2026-07-30', 'draft', NOW(), NOW()),
(5, 'Ferramenta de Pagamentos', 'Integração de pagamentos recorrentes e split de valores.', 60000, '2026-08-25', 'open', NOW(), NOW());

# Adicionar Habilidades dos Devs
INSERT INTO Skills (name, category) VALUES
('JavaScript', 'frontend'),
('React', 'frontend'),
('Vue.js', 'frontend'),
('Node.js', 'backend'),
('Express', 'backend'),
('PostgreSQL', 'backend'),
('MongoDB', 'backend'),
('Docker', 'devops'),
('Kubernetes', 'devops'),
('AWS', 'devops');

