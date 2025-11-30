// Aguarda todo o HTML ser carregado antes de rodar o JavaScript
document.addEventListener("DOMContentLoaded", () => {
  //   ===   REFERÊNCIAS A ELEMENTOS DO HTML   ===
  //
  // Pega o formulário de cadastro de produto (form id="formProduto" no HTML)
  const form = document.getElementById("formProduto");

  // Pega a div onde as mensagens de erro/sucesso serão exibidas (div id="mensagens")
  const mensagensDiv = document.getElementById("mensagens");

  //   ===   FUNÇÃO: limparMensagens   ===
  //
  // Remove qualquer mensagem anterior exibida na tela.
  // É chamada sempre antes de mostrar novas mensagens.
  function limparMensagens() {
    mensagensDiv.innerHTML = "";
  }

  //   ===   FUNÇÃO: mostrarMensagem   ===
  //
  // Exibe uma mensagem de erro ou sucesso dentro da div de mensagens.
  //
  //  - texto: conteúdo da mensagem
  //  - tipo: "success" (padrão) ou "error"
  //  - isHtml: se true, usa innerHTML (permite <br>, <strong>, etc.)
  function mostrarMensagem(texto, tipo = "success", isHtml = false) {
    const div = document.createElement("div"); // cria um <div> novo
    div.classList.add("alert"); // classe base de alerta
    // escolhe a classe CSS de sucesso ou erro de acordo com o tipo
    div.classList.add(tipo === "success" ? "alert-success" : "alert-error");

    if (isHtml) {
      // se for HTML, permite tags (strong, br etc.)
      div.innerHTML = texto;
    } else {
      // se for texto simples, não interpreta HTML
      div.textContent = texto;
    }

    // adiciona a mensagem dentro da área de mensagens
    mensagensDiv.appendChild(div);
  }

  //   ===   FUNÇÃO PRINCIPAL: salvarProduto   ===
  //
  // Essa função é chamada quando o usuário envia o formulário.
  // Fluxo:
  //  1. Impede o envio padrão do formulário (para não recarregar a página)
  //  2. Monta um objeto "produto" com os valores dos campos do HTML
  //  3. Envia esse objeto em JSON para o back-end (POST /api/produtos)
  //  4. Trata erros de validação vindos do back-end
  //  5. Se der certo, mostra mensagem e redireciona para a listagem
  async function salvarProduto(event) {
    // Impede o comportamento padrão do form (submit tradicional)
    event.preventDefault();

    // Limpa mensagens antigas antes de processar um novo envio
    limparMensagens();

    //   ===   MONTA O OBJETO PRODUTO COM OS VALORES DO FORMULÁRIO   ===
    //
    // Aqui pegamos os valores digitados nos inputs do HTML.
    // Esses values formam o corpo da requisição que vai para o back-end.
    const produto = {
      // pega o valor do input com id="nome" e remove espaços extras dos lados
      nome: document.getElementById("nome").value.trim(),

      // pega o valor do textarea com id="descricao"
      descricao: document.getElementById("descricao").value.trim(),

      // se o campo de preço tiver valor, converte para número; senão envia null
      preco: document.getElementById("preco").value
        ? Number(document.getElementById("preco").value)
        : null,

      // mesma lógica para a quantidade: número ou null
      quantidadeEstoque: document.getElementById("quantidade").value
        ? Number(document.getElementById("quantidade").value)
        : null,

      // fabricante vindo do input id="fabricante"
      fabricante: document.getElementById("fabricante").value.trim()
    };

    try {
      //   ===   CHAMADA AO BACK-END: POST /api/produtos   ===
      //
      // Aqui o JavaScript conversa com o back.
      //
      // Endpoint no back-end:
      //   - Controller: ProdutoController
      //   - Método: criar(...)
      //   - URL: POST /api/produtos
      //
      // No back:
      //   1. O JSON enviado aqui vira um objeto Produto (@RequestBody Produto produto)
      //   2. O @Valid roda as validações da entidade Produto
      //   3. Se estiver tudo ok, o service chama produtoRepository.save(...)
      //   4. Se tiver erro de validação, o Controller devolve uma resposta 400 com os detalhes
      const resposta = await fetch("/api/produtos", {
        method: "POST", // método HTTP de criação
        headers: {
          "Content-Type": "application/json" // indica que estamos enviando JSON
        },
        body: JSON.stringify(produto) // converte o objeto produto em JSON
      });

      // Se a resposta NÃO for status 2xx, tratamos como erro (validação ou outro problema)
      if (!resposta.ok) {
        // Mensagem base que será mostrada ao usuário em caso de erros de validação
        let detalheHtml =
          "<strong>Ops, preencha os campos abaixo corretamente:</strong>";

        try {
          // Tentamos ler o corpo da resposta como JSON.
          // A ideia aqui é pegar as mensagens detalhadas do back-end.
          const erroBody = await resposta.json();

          // Mapeamento interno de campos técnicos para labels amigáveis (nome → Nome, etc.)
          const labels = {
            nome: "Nome",
            descricao: "Descrição",
            preco: "Preço",
            quantidadeEstoque: "Quantidade",
            fabricante: "Fabricante"
          };

          // Aqui estamos assumindo uma estrutura de erros em forma de array.
          // Exemplo esperado:
          // erroBody.errors = [
          //   { field: "nome", defaultMessage: "O nome é obrigatório" },
          //   ...
          // ]
          if (erroBody && Array.isArray(erroBody.errors) && erroBody.errors.length > 0) {
            // Para cada erro, montamos uma string "Nome: mensagem"
            const errosFormatados = erroBody.errors.map((e) => {
              const campo = e.field || e.objectName; // identifica o campo que deu erro
              const label = labels[campo] || campo;  // converte o campo para label amigável
              return `${label}: ${e.defaultMessage}`;
            });

            // Monta o HTML final com a mensagem principal + lista de erros com <br>
            detalheHtml =
              "<strong>Ops, preencha os campos abaixo corretamente:</strong><br>" +
              errosFormatados.join("<br>");
          }
        } catch (e) {
          // Se der erro ao tentar ler o JSON de erro,
          // ficamos só com a mensagem genérica de validação.
        }

        // Mostra as mensagens de erro (como HTML, para poder usar <br> e <strong>)
        mostrarMensagem(detalheHtml, "error", true);
        return; // interrompe a função, não continua para o fluxo de sucesso
      }

      // Se chegou aqui, a resposta foi bem-sucedida (status 2xx).
      // Lemos o corpo de resposta para pegar o produto salvo (que vem com ID gerado no banco).
      const salvo = await resposta.json();

      //   ===   MENSAGEM DE SUCESSO NA TELA   ===
      //
      // Aqui avisamos o usuário que deu tudo certo, mostramos o ID que veio do back
      // e informamos que ele será redirecionado.
      //
      // O ID que aparece aqui é o mesmo ID da tabela "produtos" no H2.
      mostrarMensagem(
        "Produto salvo com sucesso! ID: " + salvo.id + ". Você será redirecionado em breve!"
      );

      // Limpa os campos do formulário após o sucesso
      form.reset();

      //   ===   REDIRECIONAMENTO APÓS SALVAR   ===
      //
      // Espera 3 segundos para o usuário ler a mensagem
      // e depois manda ele para a tela de listagem.
      //
      // Na lista-produtos.html, o JavaScript faz um GET /api/produtos
      // para buscar todos os produtos (incluindo esse que acabamos de salvar).
      setTimeout(() => {
        window.location.href = "lista-produtos.html";
      }, 3000);

    } catch (erro) {
      // Se cair aqui, provavelmente foi erro de comunicação:
      // servidor fora do ar, endpoint indisponível, problema de rede etc.
      console.error("Erro ao salvar produto", erro);
      mostrarMensagem(
        "Erro de comunicação com o servidor. Tente novamente.",
        "error"
      );
    }
  }

  //   ===   LIGANDO O FORMULÁRIO À FUNÇÃO salvarProduto   ===
  //
  // Quando o usuário clicar em "Salvar" (submit do formulário),
  // ao invés do HTML fazer um POST tradicional, essa função será chamada.
  //
  // Fluxo completo:
  //   HTML (form submit)
  //      → JavaScript (salvarProduto)
  //      → Back-end (POST /api/produtos no ProdutoController)
  //      → Service (ProdutoService.salvar)
  //      → Repository (ProdutoRepository.save no banco H2)
  //      → Resposta volta para o JS
  //      → JS mostra mensagem e redireciona para lista-produtos.html
  form.addEventListener("submit", salvarProduto);
});
