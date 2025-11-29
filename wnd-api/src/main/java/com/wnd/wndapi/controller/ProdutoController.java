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

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // se precisar acessar de outro host/porta
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    /* LISTAR TODOS */
    @GetMapping
    public List<Produto> listar() {
        return produtoService.listarTodos();
    }

    /* BUSCAR POR ID (TELA DE EDIÇÃO) */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        try {
            Produto produto = produtoService.buscarPorId(id);
            return ResponseEntity.ok(produto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* CADASTRAR NOVO PRODUTO */
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Produto produto,
                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return tratarErrosValidacao(bindingResult);
        }

        Produto salvo = produtoService.salvar(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    /* ATUALIZAR PRODUTO EXISTENTE */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody Produto produto,
                                       BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return tratarErrosValidacao(bindingResult);
        }

        try {
            Produto atualizado = produtoService.atualizar(id, produto);
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* EXCLUIR PRODUTO */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!produtoService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    /* ===== TRATAMENTO DE VALIDAÇÃO ===== */

    private ResponseEntity<Map<String, Object>> tratarErrosValidacao(BindingResult bindingResult) {
        Map<String, String> erros = new LinkedHashMap<>();

        for (FieldError fe : bindingResult.getFieldErrors()) {
            String campoApresentacao = traduzCampo(fe.getField());
            erros.put(campoApresentacao, fe.getDefaultMessage());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("erros", erros);

        return ResponseEntity.badRequest().body(body);
    }

    private String traduzCampo(String field) {
        // aqui mapeamos os nomes dos campos para os labels que você mostrou na tela
        return switch (field) {
            case "nome" -> "Nome";
            case "descricao" -> "Descrição";
            case "preco" -> "Preço";
            case "quantidadeEstoque" -> "Quantidade";
            case "fabricante" -> "Fabricante";
            default -> field;
        };
    }
}