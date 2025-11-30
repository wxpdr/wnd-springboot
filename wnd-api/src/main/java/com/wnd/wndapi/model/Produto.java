package com.wnd.wndapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Classe que representa a entidade Produto.
 *
 * Ela define:
 *  - os atributos que viram colunas da tabela "produtos" no H2
 *  - as validações dos campos (requisitos do professor)
 *  - a estrutura do JSON enviado/recebido pela API
 */
@Entity
@Table(name = "produtos")
public class Produto {

    //   ===   CAMPO: ID (chave primária da tabela)   ===

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto-incrementado pelo banco H2
    private Long id;


    //   ===   CAMPO: Nome do Produto   ===

    @NotBlank(message = "O nome do produto é obrigatório.")
    // @NotBlank → não pode ser vazio e nem só espaços
    private String nome;


    //   ===   CAMPO: Descrição   ===

    @NotBlank(message = "A descrição é obrigatória.")
    @Size(min = 10, message = "A descrição deve ter no mínimo 10 caracteres.")
    // @Size(min=10) → requisito direto do professor (descrição maior que 10 caracteres)
    private String descricao;


    //   ===   CAMPO: Preço   ===

    @NotNull(message = "O preço é obrigatório.")
    @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero.")
    // BigDecimal é usado para valores financeiros (evita erros de precisão)
    private BigDecimal preco;


    //   ===   CAMPO: Quantidade em Estoque   ===

    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 1, message = "A quantidade deve ser maior que zero.")
    // @Min(1) → atende a regra: "estoque deve ser maior que zero"
    private Integer quantidadeEstoque;


    //   ===   CAMPO: Fabricante   ===

    @NotBlank(message = "O fabricante é obrigatório.")
    private String fabricante;


    //   ===   CONSTRUTOR PADRÃO (necessário para o JPA funcionar)   ===

    public Produto() {
        // Construtor vazio → usado pelo Spring/JPA na hora de montar objetos automaticamente
    }


    //   ===   GETTERS E SETTERS (acesso aos atributos)   ===
    // São usados pelo Spring, pelo JPA, pelo Jackson (conversão JSON),
    // e também pelo Service/Controller para manipular os dados.


    //   ===   GET/SET: ID   ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    //   ===   GET/SET: Nome   ===

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }


    //   ===   GET/SET: Descrição   ===

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    //   ===   GET/SET: Preço   ===

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }


    //   ===   GET/SET: Quantidade em Estoque   ===

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }


    //   ===   GET/SET: Fabricante   ===

    public String getFabricante() {
        return fabricante;
    }

    public void setFabricante(String fabricante) {
        this.fabricante = fabricante;
    }
}
