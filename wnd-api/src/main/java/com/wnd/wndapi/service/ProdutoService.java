package com.wnd.wndapi.service;

import com.wnd.wndapi.model.Produto;
import com.wnd.wndapi.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Classe responsável por concentrar a lógica de negócio do Produto.
 *
 * O Controller chama este Service para realizar operações como:
 * listar, buscar, salvar, atualizar e excluir.
 *
 * O Service, por sua vez, conversa diretamente com o ProdutoRepository,
 * que acessa o banco de dados.
 */
@Service
public class ProdutoService {

    //   ===   DEPENDÊNCIA: ProdutoRepository   ===
    //
    // O repository é quem realmente acessa o banco de dados.
    // O service apenas coordena as operações e aplica regras de negócio.
    private final ProdutoRepository produtoRepository;


    //   ===   CONSTRUTOR PARA INJEÇÃO DE DEPENDÊNCIA   ===
    //
    // O Spring passa automaticamente uma instância de ProdutoRepository aqui.
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }


    //   ===   LISTAR TODOS OS PRODUTOS   ===
    //
    // Chamado pelo Controller no GET /api/produtos.
    // Aqui apenas devolvemos todos os produtos cadastrados no banco.
    public List<Produto> listarTodos() {
        // findAll() é fornecido automaticamente pelo JpaRepository.
        return produtoRepository.findAll();
    }


    //   ===   BUSCAR UM PRODUTO POR ID   ===
    //
    // Usado na tela de edição, quando o usuário clica em “Alterar”.
    // O Controller chama este método antes de preencher os campos do formulário.
    public Produto buscarPorId(Long id) {

        // findById(id) retorna um Optional<Produto>.
        // orElseThrow() lança uma exceção caso o produto não exista.
        return produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        // Se cair na exceção, o Controller captura e devolve HTTP 404.
    }


    //   ===   SALVAR NOVO PRODUTO   ===
    //
    // Chamado pelo Controller no POST /api/produtos.
    // Recebe o objeto já validado e manda gravar no banco.
    public Produto salvar(Produto produto) {
        // save() insere um novo registro ou atualiza se já tiver ID.
        return produtoRepository.save(produto);
    }


    //   ===   ATUALIZAR PRODUTO EXISTENTE   ===
    //
    // Chamado pelo Controller no PUT /api/produtos/{id}.
    // Primeiro buscamos o produto existente. Depois atualizamos campo por campo.
    public Produto atualizar(Long id, Produto dadosAtualizados) {

        // 1️⃣ Buscar o produto existente no banco.
        // Se não existir, lançar EntityNotFoundException.
        Produto existente = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        // 2️⃣ Atualizar manualmente cada campo do produto existente
        //    com os novos valores enviados pelo front.
        existente.setNome(dadosAtualizados.getNome());
        existente.setDescricao(dadosAtualizados.getDescricao());
        existente.setPreco(dadosAtualizados.getPreco());
        existente.setQuantidadeEstoque(dadosAtualizados.getQuantidadeEstoque());
        existente.setFabricante(dadosAtualizados.getFabricante());

        // 3️⃣ Salvar o produto atualizado no banco.
        return produtoRepository.save(existente);
    }


    //   ===   EXCLUIR PRODUTO   ===
    //
    // Chamado pelo Controller no DELETE /api/produtos/{id}.
    public void excluir(Long id) {
        // deleteById() remove o registro da tabela.
        // Se o ID não existir, o Controller já terá tratado antes.
        produtoRepository.deleteById(id);
    }


    //   ===   CHECAR SE O PRODUTO EXISTE PELO ID   ===
    //
    // Usado antes de excluir, para evitar erro caso o ID não exista.
    public boolean existePorId(Long id) {
        // existsById() verifica diretamente no banco.
        return produtoRepository.existsById(id);
    }
}
