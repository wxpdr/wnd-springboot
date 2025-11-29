document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = (window.API_BASE ?? location.origin) + "/api";

  const mensagensDiv = document.getElementById("mensagensEditar");
  const form = document.getElementById("formProdutoEditar");

  const inputNome = document.getElementById("nome");
  const inputDescricao = document.getElementById("descricao");
  const inputPreco = document.getElementById("preco");
  const inputQuantidade = document.getElementById("quantidadeEstoque");
  const inputFabricante = document.getElementById("fabricante");
  const btnCancelar = document.getElementById("btnCancelar");

  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  function limparMensagens() {
    mensagensDiv.innerHTML = "";
  }

  function mostrarMensagem(texto, tipo = "success", manter = false) {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add(tipo === "success" ? "alert-success" : "alert-error");
    div.textContent = texto;
    mensagensDiv.appendChild(div);

    if (!manter) {
      setTimeout(() => {
        div.remove();
      }, 7000);
    }
  }

  function mostrarErrosValidacao(erros) {
    limparMensagens();

    const header = document.createElement("div");
    header.classList.add("alert", "alert-error");
    header.textContent = "Ops, preencha os campos abaixo corretamente:";
    mensagensDiv.appendChild(header);

    if (erros && typeof erros === "object") {
      Object.entries(erros).forEach(([campo, msg]) => {
        const linha = document.createElement("div");
        linha.classList.add("alert", "alert-error");
        linha.textContent = `${campo}: ${msg}`;
        mensagensDiv.appendChild(linha);
      });
    }
  }

  function carregarProduto() {
    if (!id) {
      mostrarMensagem("ID do produto não informado na URL.", "error", true);
      form.querySelector("button[type='submit']").disabled = true;
      return;
    }

    fetch(`${API_BASE}/produtos/${id}`)
      .then((resp) => {
        if (resp.status === 404) {
          throw new Error("Produto não encontrado.");
        }
        if (!resp.ok) {
          throw new Error("Erro ao buscar produto. Código: " + resp.status);
        }
        return resp.json();
      })
      .then((produto) => {
        inputNome.value = produto.nome ?? "";
        inputDescricao.value = produto.descricao ?? "";
        inputPreco.value = produto.preco != null ? produto.preco : "";
        inputQuantidade.value =
          produto.quantidadeEstoque != null ? produto.quantidadeEstoque : "";
        inputFabricante.value = produto.fabricante ?? "";
      })
      .catch((erro) => {
        console.error(erro);
        mostrarMensagem(
          erro.message || "Erro ao carregar dados do produto.",
          "error",
          true
        );
        form.querySelector("button[type='submit']").disabled = true;
      });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    limparMensagens();

    if (!id) {
      mostrarMensagem("ID do produto não informado.", "error");
      return;
    }

    const produtoAtualizado = {
      nome: inputNome.value.trim(),
      descricao: inputDescricao.value.trim(),
      preco: inputPreco.value !== "" ? Number(inputPreco.value) : null,
      quantidadeEstoque:
        inputQuantidade.value !== "" ? Number(inputQuantidade.value) : null,
      fabricante: inputFabricante.value.trim()
    };

    try {
      const resp = await fetch(`${API_BASE}/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produtoAtualizado)
      });

      if (resp.status === 400) {
        // mesmo padrão do cadastro
        const body = await resp.json().catch(() => null);
        if (body && body.erros) {
          mostrarErrosValidacao(body.erros);
        } else {
          mostrarMensagem(
            "Dados inválidos. Verifique os campos do formulário.",
            "error"
          );
        }
        return;
      }

      if (!resp.ok) {
        throw new Error("Erro ao atualizar produto. Código: " + resp.status);
      }

      mostrarMensagem("Produto atualizado com sucesso!", "success", true);

      setTimeout(() => {
        window.location.href = "lista-produtos.html";
      }, 4000);
    } catch (erro) {
      console.error(erro);
      mostrarMensagem(
        "Erro de comunicação com o servidor ao atualizar o produto.",
        "error"
      );
    }
  });

  btnCancelar.addEventListener("click", () => {
    window.location.href = "lista-produtos.html";
  });

  carregarProduto();
});