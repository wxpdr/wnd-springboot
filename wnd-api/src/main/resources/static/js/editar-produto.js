// Quando todo o HTML terminar de carregar, executa essa função
document.addEventListener("DOMContentLoaded", () => {

  //   ===   BASE DA API (URL DO BACK-END)   ===
  //
  // Se existir window.API_BASE, usa ela. Senão, usa o próprio domínio da página (location.origin).
  // Exemplo final: http://localhost:8080/api
  const API_BASE = (window.API_BASE ?? location.origin) + "/api";

  //   ===   ELEMENTOS DO HTML QUE VAMOS MANIPULAR AQUI   ===
  //
  // Div onde serão exibidas mensagens de erro/sucesso na tela de edição
  const mensagensDiv = document.getElementById("mensagensEditar");

  // Formulário de edição de produto (form id="formProdutoEditar")
  const form = document.getElementById("formProdutoEditar");

  // Campos de entrada (inputs) do formulário de edição
  const inputNome = document.getElementById("nome");
  const inputDescricao = document.getElementById("descricao");
  const inputPreco = document.getElementById("preco");
  const inputQuantidade = document.getElementById("quantidadeEstoque");
  const inputFabricante = document.getElementById("fabricante");

  // Botão de cancelar, que volta para a lista de produtos
  const btnCancelar = document.getElementById("btnCancelar");

  //   ===   PEGANDO O ID DO PRODUTO A PARTIR DA URL   ===
  //
  // A URL de edição vem assim: editar-produto.html?id=3
  // URLSearchParams lê os parâmetros depois do "?".
  const params = new URLSearchParams(location.search);
  const id = params.get("id"); // aqui pegamos o valor de "id"

  //   ===   FUNÇÃO: limparMensagens   ===
  //
  // Apaga todas as mensagens que estiverem dentro da div de mensagens.
  function limparMensagens() {
    mensagensDiv.innerHTML = "";
  }

  //   ===   FUNÇÃO: mostrarMensagem   ===
  //
  // Mostra uma mensagem de sucesso ou erro na tela.
  //
  //  - texto: conteúdo da mensagem
  //  - tipo: "success" ou "error"
  //  - manter: se true, não some automaticamente
  function mostrarMensagem(texto, tipo = "success", manter = false) {
    const div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add(tipo === "success" ? "alert-success" : "alert-error");
    div.textContent = texto;
    mensagensDiv.appendChild(div);

    // Se não for para manter a mensagem, remove depois de 7 segundos
    if (!manter) {
      setTimeout(() => {
        div.remove();
      }, 7000);
    }
  }

  //   ===   FUNÇÃO: mostrarErrosValidacao   ===
  //
  // Exibe uma mensagem geral de erro + cada erro de campo retornado pelo back-end.
  //
  // Espera receber um objeto no formato:
  // {
  //   "Nome": "mensagem de erro...",
  //   "Preço": "mensagem de erro..."
  // }
  function mostrarErrosValidacao(erros) {
    limparMensagens();

    // Mensagem de topo
    const header = document.createElement("div");
    header.classList.add("alert", "alert-error");
    header.textContent = "Ops, preencha os campos abaixo corretamente:";
    mensagensDiv.appendChild(header);

    // Para cada campo com erro, cria uma linha de mensagem
    if (erros && typeof erros === "object") {
      Object.entries(erros).forEach(([campo, msg]) => {
        const linha = document.createElement("div");
        linha.classList.add("alert", "alert-error");
        linha.textContent = `${campo}: ${msg}`;
        mensagensDiv.appendChild(linha);
      });
    }
  }

  //   ===   FUNÇÃO: carregarProduto   ===
  //
  // Essa função é chamada logo que a página abre.
  //
  // Fluxo:
  //  1. Lê o ID da URL (já feito lá em cima)
  //  2. Faz um GET no back-end: GET /api/produtos/{id}
  //  3. Se encontrar, preenche os campos do formulário com os dados do produto
  //  4. Se não encontrar, mostra erro e desabilita o botão de salvar
  function carregarProduto() {
    // Se não tiver ID na URL, nem adianta tentar buscar nada
    if (!id) {
      mostrarMensagem("ID do produto não informado na URL.", "error", true);
      // desabilita o botão de submit para evitar erro
      form.querySelector("button[type='submit']").disabled = true;
      return;
    }

    //   ===   CHAMADA AO BACK-END: GET /api/produtos/{id}   ===
    //
    // No back:
    //   - Controller: ProdutoController.buscarPorId(Long id)
    //   - Service: ProdutoService.buscarPorId(id)
    //   - Repository: ProdutoRepository.findById(id)
    //
    // Se o produto existir:
    //   → volta JSON com os dados do produto.
    //
    // Se NÃO existir:
    //   → o Service lança EntityNotFoundException
    //   → o Controller devolve HTTP 404
    fetch(`${API_BASE}/produtos/${id}`)
      .then((resp) => {
        // Trata o caso específico de não encontrado
        if (resp.status === 404) {
          throw new Error("Produto não encontrado.");
        }
        // Se deu outro erro qualquer (500, por exemplo)
        if (!resp.ok) {
          throw new Error("Erro ao buscar produto. Código: " + resp.status);
        }
        // Se deu tudo certo, transforma o JSON da resposta em objeto JavaScript
        return resp.json();
      })
      .then((produto) => {
        //   ===   PREENCHENDO OS CAMPOS DO FORMULÁRIO COM OS DADOS DO BACK   ===
        //
        // Aqui ligamos: BACK-END → JS → HTML
        inputNome.value = produto.nome ?? "";
        inputDescricao.value = produto.descricao ?? "";
        inputPreco.value = produto.preco != null ? produto.preco : "";
        inputQuantidade.value =
          produto.quantidadeEstoque != null ? produto.quantidadeEstoque : "";
        inputFabricante.value = produto.fabricante ?? "";
      })
      .catch((erro) => {
        // Qualquer erro na busca cai aqui
        console.error(erro);
        mostrarMensagem(
          erro.message || "Erro ao carregar dados do produto.",
          "error",
          true
        );
        // desabilita o submit porque não faz sentido alterar se não carregou o produto
        form.querySelector("button[type='submit']").disabled = true;
      });
  }

  //   ===   EVENTO DE SUBMIT DO FORMULÁRIO DE EDIÇÃO   ===
  //
  // Quando o usuário clica em "Salvar" na tela de alteração,
  // esse listener captura o evento e chama a lógica de atualização.
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede o envio padrão do form
    limparMensagens();  // limpa mensagens antigas

    if (!id) {
      // Se por algum motivo não tivermos ID, não prossegue
      mostrarMensagem("ID do produto não informado.", "error");
      return;
    }

    //   ===   MONTA O OBJETO COM OS DADOS ATUALIZADOS   ===
    //
    // Pega os valores atuais dos campos e monta o JSON que vai para o back-end.
    const produtoAtualizado = {
      nome: inputNome.value.trim(),
      descricao: inputDescricao.value.trim(),
      preco: inputPreco.value !== "" ? Number(inputPreco.value) : null,
      quantidadeEstoque:
        inputQuantidade.value !== "" ? Number(inputQuantidade.value) : null,
      fabricante: inputFabricante.value.trim()
    };

    try {
      //   ===   CHAMADA AO BACK-END: PUT /api/produtos/{id}   ===
      //
      // No back:
      //   - Controller: ProdutoController.atualizar(Long id, @RequestBody Produto produto)
      //   - Service: ProdutoService.atualizar(id, produto)
      //       → Service busca o produto existente
      //       → atualiza campo por campo
      //       → chama produtoRepository.save(existente)
      //
      // A validação @Valid também roda no Controller na entrada deste método.
      const resp = await fetch(`${API_BASE}/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json" // informando que o corpo é JSON
        },
        body: JSON.stringify(produtoAtualizado) // enviando o produto atualizado para o back-end
      });

      //   ===   TRATAMENTO DE ERRO DE VALIDAÇÃO (HTTP 400)   ===
      if (resp.status === 400) {
        // Esperamos que, em caso de erro de validação, o back retorne um JSON
        // com a chave "erros" (mesmo padrão usado no cadastro).
        const body = await resp.json().catch(() => null);
        if (body && body.erros) {
          // Exibe os erros específicos de cada campo
          mostrarErrosValidacao(body.erros);
        } else {
          // Se não vier no formato esperado, mostra uma mensagem genérica
          mostrarMensagem(
            "Dados inválidos. Verifique os campos do formulário.",
            "error"
          );
        }
        return; // não continua para o fluxo de sucesso
      }

      // Se não for sucesso (2xx) e também não for 400, é algum outro erro
      if (!resp.ok) {
        throw new Error("Erro ao atualizar produto. Código: " + resp.status);
      }

      //   ===   SE DER CERTO: MOSTRA MENSAGEM DE SUCESSO E REDIRECIONA   ===
      mostrarMensagem("Produto atualizado com sucesso!", "success", true);

      // Aguarda 4 segundos para deixar a pessoa ver a mensagem
      setTimeout(() => {
        // Redireciona para a página de listagem
        // Lá, lista-produtos.js vai chamar GET /api/produtos e mostrar os produtos atualizados
        window.location.href = "lista-produtos.html";
      }, 4000);

    } catch (erro) {
      // Erro de rede, servidor fora do ar, etc.
      console.error(erro);
      mostrarMensagem(
        "Erro de comunicação com o servidor ao atualizar o produto.",
        "error"
      );
    }
  });

  //   ===   BOTÃO CANCELAR   ===
  //
  // Se o usuário clicar em "Cancelar", ele volta para a tela de listagem
  // sem salvar nenhuma alteração.
  btnCancelar.addEventListener("click", () => {
    window.location.href = "lista-produtos.html";
  });

  //   ===   CARREGA OS DADOS DO PRODUTO ASSIM QUE A PÁGINA ABRE   ===
  //
  // Fluxo completo dessa tela:
  //
  //  1. HTML abre editar-produto.html?id=ALGUM_ID
  //  2. JS lê o id da URL
  //  3. JS chama carregarProduto()
  //  4. carregarProduto → GET /api/produtos/{id} (Controller → Service → Repository)
  //  5. Preenche o formulário com os dados trazidos do banco
  //  6. Usuário altera e envia (submit)
  //  7. JS manda PUT /api/produtos/{id} com os dados novos
  //  8. Controller valida e chama Service.atualizar(...)
  //  9. Repository.save(...) grava no H2
  // 10. JS mostra mensagem e volta para lista-produtos.html
  carregarProduto();
});
