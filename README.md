# 🟢 Why Not Data? — Gerenciador de Produtos  
Projeto desenvolvido para a disciplina **Desenvolvimento de Sistemas Web (DSW)** — Turma 4B — Senac.

Este sistema implementa um **webservice REST** em **Spring Boot 3.x**, consumido por páginas simples em **HTML + CSS + JavaScript (Fetch API)**, seguindo rigorosamente o padrão do professor Fernando Tsuda e o modelo do projeto **dados-pessoais**.

---

## 🚀 Funcionalidades Implementadas

- Listagem de produtos com indicação de **estoque baixo** (≤ 3 unidades)  
- Cadastro de novos produtos  
- Alteração de produtos existentes  
- Exclusão com **confirmação obrigatória**  
- Validações completas no back-end com **Jakarta Validation**  
- Persistência dos dados em **H2 Database**  
- Comunicação front/back feita via **Fetch API**  
- Exibição de mensagens de sucesso e erro conforme exigido no PDF da atividade  
- Rodapé em todas as telas com identificação dos integrantes da dupla

---

## 🧱 Tecnologias Utilizadas

### Back-end
- Java 17+
- Spring Boot 3.4+
- Spring Web
- Spring Data JPA
- H2 Database
- Jakarta Bean Validation
- Lombok (opcional)

### Front-end
- HTML5
- CSS3
- JavaScript (ES6)
- Fetch API

---

## 📦 Estrutura do Projeto (Back-end)
src/main/java/br/senac/tads/dsw/wnd/
├── produto/
│ ├── ProdutoEntity.java
│ ├── Produto.java (DTO)
│ ├── ProdutoRepository.java
│ ├── ProdutoService.java
│ ├── ProdutoServiceImpl.java
│ └── ProdutoRestController.java
└── WhyNotDataApplication.java


---

## 🗄️ Banco de Dados (H2)
Console acessível em: http://localhost:8080/h2-console


Configurações padrão:
- JDBC URL: `jdbc:h2:mem:wnd`
- User: `sa`
- Password: *(vazio)*

---

## 🧪 Como executar o projeto

1. Clonar o repositório:  
   ```bash
   git clone https://github.com/<seu-usuario>/why-not-data
Abrir o projeto em uma IDE (VS Code, IntelliJ, Eclipse)
Executar a classe: WhyNotDataApplication
Abrir o front-end no navegador (arquivos HTML da pasta public)

## Rotas da API REST

| Método | Rota                 | Descrição                |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/produtos`      | Lista todos os produtos  |
| GET    | `/api/produtos/{id}` | Busca produto por ID     |
| POST   | `/api/produtos`      | Cadastra um novo produto |
| PUT    | `/api/produtos/{id}` | Atualiza um produto      |
| DELETE | `/api/produtos/{id}` | Exclui um produto        |


## 👥 Integrantes da Dupla

Nayra Rocha
Wendy Pedrosa

Turma 4B — 2025
