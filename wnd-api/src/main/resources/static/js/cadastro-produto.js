document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formProduto");
  const mensagensDiv = document.getElementById("mensagens");

  function limparMensagens() {
    mensagensDiv.innerHTML = "";
  }

  function mostrarMensagem(texto, tipo = "success", isHtml = false) {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add(tipo === "success" ? "alert-success" : "alert-error");

    if (isHtml) {
      div.innerHTML = texto;
    } else {
      div.textContent = texto;
    }

    mensagensDiv.appendChild(div);
  }

  async function salvarProduto(event) {
    event.preventDefault();
    limparMensagens();

    const produto = {
      nome: document.getElementById("nome").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      preco: document.getElementById("preco").value
        ? Number(document.getElementById("preco").value)
        : null,
      quantidadeEstoque: document.getElementById("quantidade").value
        ? Number(document.getElementById("quantidade").value)
        : null,
      fabricante: document.getElementById("fabricante").value.trim()
    };

    try {
      const resposta = await fetch("/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
      });

      if (!resposta.ok) {
        let detalheHtml =
          "<strong>Ops, preencha os campos abaixo corretamente:</strong>";

        try {
          const erroBody = await resposta.json();

          const labels = {
            nome: "Nome",
            descricao: "Descrição",
            preco: "Preço",
            quantidadeEstoque: "Quantidade",
            fabricante: "Fabricante"
          };

          if (erroBody && Array.isArray(erroBody.errors) && erroBody.errors.length > 0) {
            const errosFormatados = erroBody.errors.map((e) => {
              const campo = e.field || e.objectName;
              const label = labels[campo] || campo;
              return `${label}: ${e.defaultMessage}`;
            });

            detalheHtml =
              "<strong>Ops, preencha os campos abaixo corretamente:</strong><br>" +
              errosFormatados.join("<br>");
          }
        } catch (e) {
          // se não conseguir ler JSON de erro, mantém só a mensagem genérica acima
        }

        mostrarMensagem(detalheHtml, "error", true);
        return;
      }

      const salvo = await resposta.json();

      mostrarMensagem("Produto salvo com sucesso! ID: " + salvo.id, "success");
      form.reset();
    } catch (erro) {
      console.error("Erro ao salvar produto", erro);
      mostrarMensagem(
        "Erro de comunicação com o servidor. Tente novamente.",
        "error"
      );
    }
  }

  form.addEventListener("submit", salvarProduto);
});
