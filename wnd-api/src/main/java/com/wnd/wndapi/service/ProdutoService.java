package com.wnd.wndapi.service;

import com.wnd.wndapi.model.Produto;
import com.wnd.wndapi.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
    }

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto dadosAtualizados) {
        Produto existente = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        existente.setNome(dadosAtualizados.getNome());
        existente.setDescricao(dadosAtualizados.getDescricao());
        existente.setPreco(dadosAtualizados.getPreco());
        existente.setQuantidadeEstoque(dadosAtualizados.getQuantidadeEstoque());
        existente.setFabricante(dadosAtualizados.getFabricante());

        return produtoRepository.save(existente);
    }

    public void excluir(Long id) {
        produtoRepository.deleteById(id);
    }

    public boolean existePorId(Long id) {
        return produtoRepository.existsById(id);
    }
}
