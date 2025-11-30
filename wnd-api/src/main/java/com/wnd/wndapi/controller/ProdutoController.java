package com.wnd.wndapi.controller;

import com.wnd.wndapi.model.Produto;
import com.wnd.wndapi.service.ProdutoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller responsável pelos endpoints REST relacionados a Produto.
 * Tudo que entra e sai via HTTP (JSON) passa por aqui.
 */
@RestController // Diz para o Spring que essa classe expõe endpoints REST (JSON na resposta por padrão)
@RequestMapping("/api/produtos") // Prefixo de rota: tudo aqui dentro começa com /api/produtos
@CrossOrigin(origins = "*") // Libera o acesso da API para qualquer origem (importante para o front em HTML/JS)
public class ProdutoController {

    // Referência para o service de produtos.
    // O Service é quem conversa com o Repository e aplica regras de negócio.
    private final ProdutoService produtoService;

    /**
     * Construtor que recebe o ProdutoService.
     * O Spring injeta automaticamente uma instância de ProdutoService aqui.
     */
    public ProdutoController(ProdutoService produtoService) {
        // Guarda a instância recebida em um atributo da classe para usar nos métodos abaixo
        this.produtoService = produtoService;
    }

    /* ========== LISTAR TODOS OS PRODUTOS ========== */

    /**
     * Endpoint: GET /api/produtos
     * Função: devolver a lista de todos os produtos cadastrados no banco.
     * Usado na tela de listagem (lista-produtos.html).
     */
    @GetMapping // Quando chega um GET em /api/produtos, este método é chamado
    public List<Produto> listar() {
        // Chama o método listarTodos() do ProdutoService.
        // Lá dentro, o service chama produtoRepository.findAll() para buscar na tabela.
        return produtoService.listarTodos();
        // A lista retornada aqui é serializada em JSON automaticamente e enviada para o front.
    }

    /* ========== BUSCAR UM ÚNICO PRODUTO POR ID ========== */

    /**
     * Endpoint: GET /api/produtos/{id}
     * Função: buscar um produto específico pelo ID.
     * Usado principalmente para preencher o formulário de edição (editar-produto.html).
     */
    @GetMapping("/{id}") // {id} é um parâmetro de caminho, ex: /api/produtos/5
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        // @PathVariable vincula o {id} da URL ao parâmetro Long id deste método.
        try {
            // Pede para o service buscar o produto com este ID.
            // Dentro do service, é chamado produtoRepository.findById(id).
            // Se não encontrar, o service lança EntityNotFoundException.
            Produto produto = produtoService.buscarPorId(id);

            // Se chegou aqui, o produto foi encontrado.
            // ResponseEntity.ok(produto) monta uma resposta HTTP 200 (OK) com o JSON do produto.
            return ResponseEntity.ok(produto);
        } catch (EntityNotFoundException e) {
            // Se o service não encontrar o produto, cai neste catch.
            // Aqui devolvemos uma resposta HTTP 404 (Not Found) sem corpo.
            return ResponseEntity.notFound().build();
        }
    }

    /* ========== CADASTRAR NOVO PRODUTO ========== */

    /**
     * Endpoint: POST /api/produtos
     * Função: cadastrar um novo produto com base nos dados recebidos em JSON.
     * Usado no formulário de cadastro (cadastro-produto.html).
     */
    @PostMapping // Quando chega um POST em /api/produtos, este método é chamado
    public ResponseEntity<?> criar(
            @Valid @RequestBody Produto produto, // @RequestBody converte o JSON recebido em um objeto Produto.
                                                 // @Valid dispara as validações da entidade (Bean Validation).
            BindingResult bindingResult          // BindingResult guarda o resultado da validação (@Valid).
    ) {
        // Primeiro passo: checar se a validação encontrou algum erro nos campos do Produto.
        if (bindingResult.hasErrors()) {
            // Se chegou aqui, alguma validação falhou (ex: descrição curta, preço zero, etc.).
            // Em vez de salvar, chamamos um método auxiliar que monta um JSON com os erros.
            return tratarErrosValidacao(bindingResult);
            // O front vai ler esse JSON, extrair as mensagens e exibir na tela de cadastro.
        }

        // Se não houve erro de validação, podemos prosseguir com o cadastro.
        // Chamamos o ProdutoService para salvar o novo produto.
        // Lá dentro, o service chama produtoRepository.save(produto) para gravar no H2.
        Produto salvo = produtoService.salvar(produto);

        // ResponseEntity.status(HttpStatus.CREATED) define o status HTTP 201 (Created).
        // .body(salvo) envia o produto salvo (com ID preenchido) no corpo da resposta.
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    /* ========== ATUALIZAR UM PRODUTO EXISTENTE ========== */

    /**
     * Endpoint: PUT /api/produtos/{id}
     * Função: atualizar um produto já existente com os novos dados enviados em JSON.
     * Usado no formulário de edição (editar-produto.html).
     */
    @PutMapping("/{id}") // Quando chega um PUT em /api/produtos/algumId, esse método é chamado
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,               // ID do produto que será atualizado (vem da URL).
            @Valid @RequestBody Produto produto, // Novos dados do produto, vindos do JSON (com validação).
            BindingResult bindingResult          // Resultado da validação dos novos dados.
    ) {
        // Antes de atualizar, validamos os dados recebidos.
        if (bindingResult.hasErrors()) {
            // Se tiver erro, não atualiza nada, só devolve os erros para o front.
            return tratarErrosValidacao(bindingResult);
        }

        try {
            // Se os dados são válidos, chamamos o service para fazer a atualização.
            // O service primeiro busca o produto existente pelo ID.
            // Se encontrar, copia os novos dados para o objeto existente e salva.
            // Se não encontrar, lança EntityNotFoundException.
            Produto atualizado = produtoService.atualizar(id, produto);

            // Se chegou aqui, o produto foi atualizado com sucesso.
            // Devolvemos HTTP 200 (OK) com o produto já atualizado no corpo.
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            // Se o ID não existir no banco, o service lança a exception e caímos aqui.
            // Nesse caso, devolvemos HTTP 404 (Not Found) para o front tratar como quiser.
            return ResponseEntity.notFound().build();
        }
    }

    /* ========== EXCLUIR UM PRODUTO ========== */

    /**
     * Endpoint: DELETE /api/produtos/{id}
     * Função: excluir um produto pelo ID.
     * Usado quando o usuário confirma a exclusão no modal da tela de listagem.
     */
    @DeleteMapping("/{id}") // Quando chega um DELETE em /api/produtos/algumId, este método é chamado
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        // Antes de tentar excluir, verificamos se esse produto existe no banco.
        // O service chama produtoRepository.existsById(id) para fazer essa checagem.
        if (!produtoService.existePorId(id)) {
            // Se não existir, já respondemos 404 (Not Found) e não tentamos excluir nada.
            return ResponseEntity.notFound().build();
        }

        // Se existe, chamamos o service para excluir.
        // Dentro do service, será chamado produtoRepository.deleteById(id).
        produtoService.excluir(id);

        // Se deu tudo certo, devolvemos HTTP 204 (No Content).
        // 204 indica que a operação foi bem-sucedida, mas não temos conteúdo no corpo da resposta.
        return ResponseEntity.noContent().build();
    }

    /* ========== TRATAMENTO DE ERROS DE VALIDAÇÃO ========== */

    /**
     * Método auxiliar para padronizar a resposta quando há erros de validação.
     * Ele lê todos os erros do BindingResult, monta um mapa com:
     *   "Nome do campo" -> "Mensagem de erro"
     * e devolve isso em um JSON no corpo da resposta com status 400 (Bad Request).
     */
    private ResponseEntity<Map<String, Object>> tratarErrosValidacao(BindingResult bindingResult) {
        // Mapa que vai guardar os erros de cada campo, na ordem em que aparecem.
        Map<String, String> erros = new LinkedHashMap<>();

        // Percorre todos os erros de campo encontrados pela validação.
        for (FieldError fe : bindingResult.getFieldErrors()) {
            // fe.getField() retorna o nome técnico do atributo na classe Produto (ex: "descricao").
            String nomeCampo = fe.getField();

            // Chamamos traduzCampo para transformar "descricao" em "Descrição", por exemplo.
            String campoApresentacao = traduzCampo(nomeCampo);

            // fe.getDefaultMessage() é a mensagem de erro configurada na anotação (@NotBlank, @Size, etc.).
            String mensagemErro = fe.getDefaultMessage();

            // Adiciona no mapa: "Descrição" -> "Informe a descrição do produto", por exemplo.
            erros.put(campoApresentacao, mensagemErro);
        }

        // Cria um objeto de resposta mais geral, com a chave "erros" apontando para o mapa de erros.
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("erros", erros);

        // Monta uma resposta HTTP 400 (Bad Request) com esse JSON no corpo.
        return ResponseEntity.badRequest().body(body);
    }

    /**
     * Traduz o nome do atributo da entidade (nome, descricao, preco...)
     * para um rótulo mais amigável, igual ao que aparece nos labels da tela.
     */
    private String traduzCampo(String field) {
        // Usa um switch expression para mapear o nome técnico para um nome de exibição.
        // Isso é usado no JSON de erros, para a tela poder exibir "Nome", "Descrição", etc.
        return switch (field) {
            case "nome" -> "Nome";
            case "descricao" -> "Descrição";
            case "preco" -> "Preço";
            case "quantidadeEstoque" -> "Quantidade";
            case "fabricante" -> "Fabricante";
            // Se o campo não estiver mapeado, devolvemos o próprio nome técnico como fallback.
            default -> field;
        };
    }
}
