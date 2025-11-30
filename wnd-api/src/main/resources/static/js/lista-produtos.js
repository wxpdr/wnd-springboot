// Quando todo o HTML carregar, executa essa função principal
document.addEventListener("DOMContentLoaded", () => {

  //   ===   ELEMENTOS DA TELA: LISTA E MENSAGENS   ===

  // Div onde a lista de produtos será desenhada (cards)
  const listaDiv = document.getElementById("listaProdutos");

  // Div onde as mensagens de erro/sucesso da listagem serão exibidas
  const mensagensDiv = document.getElementById("mensagensLista");

  //   ===   ELEMENTOS DO MODAL DE EXCLUSÃO   ===

  // Caixa do modal (overlay) de confirmação de exclusão
  const modal = document.getElementById("modalExcluir");

  // Elemento onde mostramos o ID do produto dentro do modal
  const modalIdProduto = document.getElementById("modalIdProduto");

  // Botão "Excluir" dentro do modal (confirma a exclusão)
  const btnConfirmarExcluir = document.getElementById("btnConfirmarExcluir");

  // Botão "Cancelar" dentro do modal
  const btnCancelarExcluir = document.getElementById("btnCancelarExcluir");

  // Variável para guardar temporariamente o ID do produto que o usuário quer excluir
  let idParaExcluir = null;


  //   ===   FUNÇÃO: limparMensagens   ===
  //
  // Apaga todas as mensagens exibidas na área de mensagens da listagem.
  function limparMensagens() {
    mensagensDiv.innerHTML = "";
  }


  //   ===   FUNÇÃO: mostrarMensagem   ===
  //
  // Cria e exibe uma mensagem de sucesso ou erro no topo da listagem.
  //
  //  - texto: texto da mensagem
  //  - tipo: "success" ou "error"
  function mostrarMensagem(texto, tipo = "success") {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add(tipo === "success" ? "alert-success" : "alert-error");
    div.textContent = texto;
    mensagensDiv.appendChild(div);
  }


  //   ===   FUNÇÃO: formatarPreco   ===
  //
  // Recebe um valor numérico e devolve no formato 2 casas decimais com vírgula.
  // Ex: 10 -> "10,00"
  function formatarPreco(valor) {
    if (valor == null) return "";
    return Number(valor).toFixed(2).replace(".", ",");
  }


  //   ===   FUNÇÃO: abrirModalExcluir   ===
  //
  // Abre o modal de confirmação e guarda o ID do produto que o usuário quer excluir.
  function abrirModalExcluir(id) {
    idParaExcluir = id;                 // guarda o ID numa variável global
    modalIdProduto.textContent = id;    // mostra o ID dentro do modal
    modal.classList.remove("hidden");   // remove a classe .hidden para exibir o modal
  }


  //   ===   FUNÇÃO: fecharModalExcluir   ===
  //
  // Fecha o modal e limpa a variável de controle.
  function fecharModalExcluir() {
    modal.classList.add("hidden"); // esconde o modal
    idParaExcluir = null;         // limpa o ID em memória
  }


  //   ===   FUNÇÃO: carregarProdutos   ===
  //
  // Essa função é responsável por:
  //  1. Buscar os produtos no back-end (GET /api/produtos)
  //  2. Montar um card para cada produto
  //  3. Configurar os botões de "Alterar" e "Excluir"
  //
  // Fluxo back-end:
  //   - Controller: ProdutoController.listar()
  //   - Service: ProdutoService.listarTodos()
  //   - Repository: ProdutoRepository.findAll()
  function carregarProdutos() {
    limparMensagens();
    listaDiv.innerHTML = "<p>Carregando produtos...</p>";

    //   ===   CHAMADA AO BACK: GET /api/produtos   ===
    fetch("/api/produtos")
      .then((resp) => {
        if (!resp.ok) {
          // se deu algum erro (500, 404, etc.)
          throw new Error("Erro ao buscar produtos. Código: " + resp.status);
        }
        return resp.json(); // converte JSON em array de objetos
      })
      .then((produtos) => {
        // Se não vier array ou estiver vazio, mostra mensagem amigável
        if (!Array.isArray(produtos) || produtos.length === 0) {
          listaDiv.innerHTML = "<p>Nenhum produto cadastrado.</p>";
          return;
        }

        // Limpa qualquer conteúdo anterior
        listaDiv.innerHTML = "";

        // Para cada produto vindo do back-end, montamos um "card" na tela
        produtos.forEach((p) => {
          const card = document.createElement("article");
          card.classList.add("produto-card");

          const precoFormatado = formatarPreco(p.preco);

          // Regra visual do "Estoque baixo": se quantidade <= 3
          const estoqueBaixo =
            p.quantidadeEstoque != null && p.quantidadeEstoque <= 3;

          //   ===   HTML DO CARD DE CADA PRODUTO   ===
          //
          // Aqui mostramos:
          //  - ID
          //  - Nome
          //  - Fabricante
          //  - Preço (formatado)
          //  - Quantidade + badge "Estoque baixo" quando se aplica
          //  - Descrição
          //  - Botões Alterar / Excluir (com data-id para referência)
          card.innerHTML = `
            <div class="produto-header">
              <span class="produto-id">ID ${p.id}</span>
              <h3 class="produto-nome">${p.nome}</h3>
            </div>

            <div class="produto-linha">
              <span class="produto-label">Fabricante:</span>
              <span class="produto-valor">${p.fabricante}</span>
            </div>

            <div class="produto-linha">
              <span class="produto-label">Preço:</span>
              <span class="produto-valor">R$ ${precoFormatado}</span>
            </div>

            <div class="produto-linha">
              <span class="produto-label">Quantidade:</span>
              <span class="produto-valor">
                ${p.quantidadeEstoque}
                ${
                  estoqueBaixo
                    ? '<button class="badge-low-inline">Estoque baixo</button>'
                    : ""
                }
              </span>
            </div>

            <div class="produto-linha">
              <span class="produto-label">Descrição:</span>
              <span class="produto-valor produto-valor-descricao">
                ${p.descricao}
              </span>
            </div>

            <div class="produto-acoes">
              <button class="btn btn-table btn-edit" data-id="${p.id}">
                Alterar
              </button>
              <button class="btn btn-table btn-delete" data-id="${p.id}">
                Excluir
              </button>
            </div>
          `;

          // adiciona o card pronto na área de listagem
          listaDiv.appendChild(card);
        });

        // Depois de criar todos os cards, ligamos os cliques dos botões
        configurarBotoes();
      })
      .catch((erro) => {
        console.error(erro);
        listaDiv.innerHTML =
          "<p>Erro ao carregar a lista de produtos.</p>";
        mostrarMensagem(
          "Erro ao carregar a lista de produtos. Tente novamente.",
          "error"
        );
      });
  }


  //   ===   FUNÇÃO: configurarBotoes   ===
  //
  // Liga os eventos de clique dos botões "Alterar" e "Excluir" de cada card.
  //
  // Esse método é chamado depois que os cards são criados dinamicamente.
  function configurarBotoes() {
    //   — Botão EXCLUIR: abre o modal de confirmação —
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id"); // pega o ID armazenado no atributo data-id
        if (!id) return;

        // Chama a função que abre o modal, passando o ID do produto
        abrirModalExcluir(id);
      });
    });

    //   — Botão ALTERAR: vai para a página de edição com o ID na URL —
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        if (!id) return;

        // Redireciona para a página de edição, passando o ID como parâmetro
        //
        // Fluxo:
        //  1. HTML: lista-produtos.html com botão Alterar
        //  2. Clique → window.location.href = editar-produto.html?id={id}
        //  3. Em editar-produto.js, pegamos esse id da URL
        //  4. editar-produto.js faz GET /api/produtos/{id} para preencher o formulário
        //  5. Depois manda PUT /api/produtos/{id} ao salvar
        window.location.href = `editar-produto.html?id=${id}`;
      });
    });
  }


  //   ===   EVENTO: Botão CANCELAR do modal   ===
  //
  // Quando o usuário clica em "Cancelar" dentro do modal,
  // simplesmente fechamos o modal e não fazemos nada no back-end.
  btnCancelarExcluir.addEventListener("click", () => {
    fecharModalExcluir();
  });


  //   ===   EVENTO: Botão EXCLUIR do modal   ===
  //
  // Quando o usuário confirma a exclusão no modal:
  //
  //  1. Lemos o idParaExcluir
  //  2. Fazemos DELETE /api/produtos/{id}
  //  3. Back-end exclui pelo Repository.deleteById(id)
  //  4. Se der certo, recarregamos a lista
  btnConfirmarExcluir.addEventListener("click", async () => {
    if (!idParaExcluir) return; // se não tiver ID, não faz nada

    try {
      //   ===   CHAMADA AO BACK: DELETE /api/produtos/{idParaExcluir}   ===
      //
      // No back:
      //   - Controller: ProdutoController.excluir(Long id)
      //   - Service: ProdutoService.excluir(id)
      //   - Repository: ProdutoRepository.deleteById(id)
      const resp = await fetch(`/api/produtos/${idParaExcluir}`, {
        method: "DELETE"
      });

      // HTTP 204 = No Content → sucesso na exclusão
      if (resp.status === 204) {
        mostrarMensagem("Produto excluído com sucesso!", "success");
        carregarProdutos(); // recarrega a lista, agora sem o produto excluído
      } else if (resp.status === 404) {
        // Caso o produto já não exista mais no banco
        mostrarMensagem("Produto não encontrado para exclusão.", "error");
      } else {
        // Qualquer outro status diferente tratamos como erro genérico
        mostrarMensagem(
          "Erro ao excluir produto. Código: " + resp.status,
          "error"
        );
      }
    } catch (erro) {
      // Se der erro de rede, servidor fora, etc.
      console.error(erro);
      mostrarMensagem(
        "Erro de comunicação com o servidor ao excluir.",
        "error"
      );
    } finally {
      // Em qualquer caso (sucesso ou erro), fecha o modal no final
      fecharModalExcluir();
    }
  });


  //   ===   INICIALIZAÇÃO DA TELA: CARREGAR LISTA   ===
  //
  // Assim que a página lista-produtos.html carrega, essa função é chamada
  // para buscar todos os produtos no back-end e montar os cards.
  //
  // Fluxo geral dessa tela:
  //   1. HTML abre lista-produtos.html
  //   2. JS chama carregarProdutos()
  //   3. carregarProdutos → GET /api/produtos
  //   4. Controller.listar() → Service.listarTodos() → Repository.findAll()
  //   5. Resposta (lista de produtos) volta em JSON
  //   6. JS monta os cards
  //   7. Botão "Alterar" → editar-produto.html?id={id}
  //   8. Botão "Excluir" → abre modal → DELETE /api/produtos/{id}
  carregarProdutos();
});
