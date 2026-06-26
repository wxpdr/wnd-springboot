<h1 align="center">📊 Why Not Data — Gerenciador de Produtos</h1>

<p align="center">
  API REST para gerenciamento de produtos, desenvolvida com Java, Spring Boot, H2 e front-end em HTML, CSS e JavaScript.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Finalizado-ff69b4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Back--End-Java%20%7C%20Spring%20Boot-ff69b4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Banco-H2-black?style=for-the-badge" />
</p>

---

## ✨ Sobre o projeto

O **Why Not Data** é um projeto de gerenciamento de produtos desenvolvido com **Java e Spring Boot**, utilizando uma API REST para comunicação entre back-end e front-end.

A aplicação permite cadastrar, listar, alterar e excluir produtos, além de indicar itens com estoque baixo. O front-end foi construído com HTML, CSS e JavaScript, consumindo os dados da API por meio da Fetch API.

Este projeto foi desenvolvido em dupla como parte da disciplina de Desenvolvimento de Sistemas Web, com foco em criação de webservice REST, validações no back-end, persistência de dados e integração entre front-end e back-end.

---

## 🎯 Objetivo

Criar uma aplicação web para gerenciamento de produtos, praticando a construção de uma API REST com Spring Boot e a integração com uma interface front-end simples.

O projeto teve como foco aplicar conceitos de desenvolvimento web, organização em camadas, validação de dados, persistência com banco em memória e consumo de API via JavaScript.

---

## 🧩 Funcionalidades

* Listagem de produtos
* Indicação de estoque baixo
* Cadastro de novos produtos
* Alteração de produtos existentes
* Exclusão de produtos com confirmação
* Validações no back-end com Jakarta Validation
* Persistência de dados com H2 Database
* Comunicação entre front-end e back-end com Fetch API
* Exibição de mensagens de sucesso e erro
* Estrutura com separação entre entidade, DTO, repository, service e controller

---

## 🛠️ Tecnologias utilizadas

<p align="left">
  <img src="https://skillicons.dev/icons?i=java,spring,html,css,js,git,github,vscode" />
</p>

* **Java 17+** — linguagem principal do back-end
* **Spring Boot** — framework utilizado para construção da API
* **Spring Web** — criação das rotas REST
* **Spring Data JPA** — camada de persistência
* **H2 Database** — banco de dados em memória
* **Jakarta Bean Validation** — validação dos dados
* **HTML5** — estrutura das páginas
* **CSS3** — estilização da interface
* **JavaScript** — consumo da API e interações
* **Fetch API** — comunicação entre front-end e back-end
* **Git e GitHub** — versionamento e hospedagem do código

---

## 📁 Estrutura do projeto

```text
wnd-springboot/
├── wnd-api/
│   └── src/
│       └── main/
│           ├── java/
│           │   └── br/senac/tads/dsw/wnd/
│           │       ├── produto/
│           │       │   ├── ProdutoEntity.java
│           │       │   ├── Produto.java
│           │       │   ├── ProdutoRepository.java
│           │       │   ├── ProdutoService.java
│           │       │   ├── ProdutoServiceImpl.java
│           │       │   └── ProdutoRestController.java
│           │       └── WhyNotDataApplication.java
│           └── resources/
│               └── arquivos de configuração e recursos da aplicação
├── .gitignore
└── README.md
```

### Principais arquivos

* `ProdutoEntity.java` — entidade relacionada aos dados do produto
* `Produto.java` — DTO utilizado na transferência de dados
* `ProdutoRepository.java` — interface de persistência
* `ProdutoService.java` — contrato da camada de serviço
* `ProdutoServiceImpl.java` — implementação das regras de serviço
* `ProdutoRestController.java` — controller responsável pelas rotas da API
* `WhyNotDataApplication.java` — classe principal da aplicação Spring Boot

---

## 🗄️ Banco de dados

O projeto utiliza **H2 Database**, um banco de dados em memória utilizado para facilitar testes e execução local.

Console H2:

```text
http://localhost:8080/h2-console
```

Configurações padrão:

```text
JDBC URL: jdbc:h2:mem:wnd
User: sa
Password: 
```

---

## 🔗 Rotas da API REST

| Método | Rota                 | Descrição                     |
| ------ | -------------------- | ----------------------------- |
| GET    | `/api/produtos`      | Lista todos os produtos       |
| GET    | `/api/produtos/{id}` | Busca um produto por ID       |
| POST   | `/api/produtos`      | Cadastra um novo produto      |
| PUT    | `/api/produtos/{id}` | Atualiza um produto existente |
| DELETE | `/api/produtos/{id}` | Exclui um produto             |

---

## ⚙️ Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/wxpdr/wnd-springboot.git
```

### 2. Acesse a pasta do projeto

```bash
cd wnd-springboot/wnd-api
```

### 3. Execute a aplicação

Abra o projeto em uma IDE como VS Code, IntelliJ IDEA ou Eclipse e execute a classe principal:

```text
WhyNotDataApplication.java
```

Ou, caso esteja utilizando Maven pelo terminal:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

### 4. Acesse a aplicação

Com o back-end em execução, acesse:

```text
http://localhost:8080
```

Para acessar o console do H2:

```text
http://localhost:8080/h2-console
```

---

## 🖼️ Preview

Caso queira adicionar capturas futuramente, uma sugestão de estrutura seria:

```md
## 🖼️ Preview

### Listagem de produtos

![Preview da listagem](./imagens-readme/preview-listagem.png)

### Cadastro de produto

![Preview do cadastro](./imagens-readme/preview-cadastro.png)

### Edição de produto

![Preview da edição](./imagens-readme/preview-edicao.png)
```

---

## 💼 Tipo de projeto

Este é um projeto acadêmico com foco em desenvolvimento back-end e integração front-end/back-end.

Ele representa uma prática de construção de API REST com Java e Spring Boot, utilizando banco H2, validações no back-end e uma interface simples em HTML, CSS e JavaScript para consumir os dados.

---

## 🧠 Aprendizados

Durante o desenvolvimento deste projeto, pratiquei:

* criação de API REST com Spring Boot;
* organização de projeto em camadas;
* criação de entidades, DTOs, repositories, services e controllers;
* validação de dados com Jakarta Validation;
* persistência com H2 Database;
* integração entre front-end e back-end;
* consumo de API com Fetch API;
* criação de CRUD completo;
* estruturação de README técnico no GitHub.

---

## 🔮 Possíveis melhorias futuras

Algumas melhorias possíveis para versões futuras:

* adicionar deploy da aplicação;
* trocar H2 por MySQL ou PostgreSQL;
* melhorar a responsividade da interface;
* adicionar autenticação;
* criar testes automatizados;
* melhorar tratamento visual de erros;
* adicionar paginação e filtros;
* documentar a API com Swagger/OpenAPI;
* separar melhor os recursos estáticos do front-end;
* aprimorar a acessibilidade das telas.

---

## 👩‍💻 Desenvolvedoras

Projeto desenvolvido em dupla por **Wendy Pedrosa** e **Nayra Rocha**.

---

<p align="center">
  Projeto finalizado, feito com Java, Spring Boot, H2 e uma boa dose de integração front/back ✨
</p>
