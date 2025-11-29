document.addEventListener("DOMContentLoaded", () => {
  const listaDiv = document.getElementById("listaProdutos");
  const mensagensDiv = document.getElementById("mensagensLista");

  // elementos do modal
  const modal = document.getElementById("modalExcluir");
  const modalIdProduto = document.getElementById("modalIdProduto");
  const btnConfirmarExcluir = document.getElementById("btnConfirmarExcluir");
  const btnCancelarExcluir = document.getElementById("btnCancelarExcluir");

  let idParaExcluir = null;

  function limparMensagens() {
    mensagensDiv.innerHTML = "";
  }

  function mostrarMensagem(texto, tipo = "success") {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add(tipo === "success" ? "alert-success" : "alert-error");
    div.textContent = texto;
    mensagensDiv.appendChild(div);
  }

  function formatarPreco(valor) {
    if (valor == null) return "";
    return Number(valor).toFixed(2).replace(".", ",");
  }

  function abrirModalExcluir(id) {
    idParaExcluir = id;
    modalIdProduto.textContent = id; // mostra o ID dentro do modal
    modal.classList.remove("hidden");
  }

  function fecharModalExcluir() {
    modal.classList.add("hidden");
    idParaExcluir = null;
  }

  function carregarProdutos() {
    limparMensagens();
    listaDiv.innerHTML = "<p>Carregando produtos...</p>";

    fetch("/api/produtos")
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Erro ao buscar produtos. Código: " + resp.status);
        }
        return resp.json();
      })
      .then((produtos) => {
        if (!Array.isArray(produtos) || produtos.length === 0) {
          listaDiv.innerHTML = "<p>Nenhum produto cadastrado.</p>";
          return;
        }

        listaDiv.innerHTML = "";

        produtos.forEach((p) => {
          const card = document.createElement("article");
          card.classList.add("produto-card");

          const precoFormatado = formatarPreco(p.preco);
          const estoqueBaixo =
            p.quantidadeEstoque != null && p.quantidadeEstoque <= 3;

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

          listaDiv.appendChild(card);
        });

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

  function configurarBotoes() {
    // abrir modal ao clicar em EXCLUIR
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        if (!id) return;

        abrirModalExcluir(id);
      });
    });

    // futuro fluxo de edição
    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        if (!id) return;

        window.location.href = `editar-produto.html?id=${id}`;
      });
    });
  }

  // Botão CANCELAR do modal
  btnCancelarExcluir.addEventListener("click", () => {
    fecharModalExcluir();
  });

  // Botão EXCLUIR do modal
  btnConfirmarExcluir.addEventListener("click", async () => {
    if (!idParaExcluir) return;

    try {
      const resp = await fetch(`/api/produtos/${idParaExcluir}`, {
        method: "DELETE"
      });

      if (resp.status === 204) {
        mostrarMensagem("Produto excluído com sucesso!", "success");
        carregarProdutos();
      } else if (resp.status === 404) {
        mostrarMensagem("Produto não encontrado para exclusão.", "error");
      } else {
        mostrarMensagem(
          "Erro ao excluir produto. Código: " + resp.status,
          "error"
        );
      }
    } catch (erro) {
      console.error(erro);
      mostrarMensagem(
        "Erro de comunicação com o servidor ao excluir.",
        "error"
      );
    } finally {
      fecharModalExcluir();
    }
  });

  carregarProdutos();
});
