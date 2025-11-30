package com.wnd.wndapi.repository;

import com.wnd.wndapi.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface que representa o repositório de Produto.
 *
 * Ela faz a ponte entre a aplicação e o banco de dados.
 *
 * O Spring Data JPA cria automaticamente, em tempo de execução, todos os
 * métodos necessários para acessar a tabela "produtos".
 *
 * Não precisamos escrever SQL manual nem implementar nada aqui — o framework
 * gera tudo baseado nos tipos passados na interface.
 */
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    //   ===   SOBRE ESTA INTERFACE   ===
    //
    // Ao estender JpaRepository<Produto, Long>, automaticamente herdamos:
    //
    //  • findAll()              → retorna todos os produtos
    //  • findById(Long id)      → busca um produto por ID
    //  • save(Produto p)        → insere ou atualiza um produto
    //  • deleteById(Long id)    → exclui pelo ID
    //  • existsById(Long id)    → verifica se existe no banco
    //
    // A implementação desses métodos NÃO está aqui.
    // O Spring Data cria tudo sozinho usando reflexão + JPA + Hibernate.
    //
    // Por isso este arquivo fica vazio — ele só declara que queremos
    // usar todas as funcionalidades prontas do JpaRepository.
    //
    // Caso no futuro você queira criar buscas personalizadas, por exemplo:
    //
    //   List<Produto> findByNomeContaining(String nome);
    //
    // Basta declarar aqui dentro e o Spring cria automaticamente.
    //
    // No nosso CRUD, os métodos padrões já atendem 100% dos requisitos.
}
