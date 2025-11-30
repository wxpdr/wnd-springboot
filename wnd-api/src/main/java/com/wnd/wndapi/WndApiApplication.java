package com.wnd.wndapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da nossa aplicação Spring Boot.
 *
 * Ela é responsável por:
 *  - iniciar o servidor embutido (Tomcat)
 *  - escanear todos os pacotes (controller, service, repository...)
 *  - configurar automaticamente os componentes do Spring
 *  - carregar a aplicação inteira na memória
 *
 * Sem essa classe, nada funciona — ela é literalmente o "start" do projeto.
 */
@SpringBootApplication
public class WndApiApplication {

    //   ===   MÉTODO PRINCIPAL (main) — PONTO DE ENTRADA DO PROJETO   ===
    //
    // Quando clicamos em "Run", "Start Debugging" ou rodamos o projeto pelo terminal,
    // este método é executado primeiro.
    //
    // O Spring Boot se encarrega de subir todos os serviços necessários.
    public static void main(String[] args) {

        //   ===   INICIALIZAÇÃO DA APLICAÇÃO SPRING BOOT   ===
        //
        // SpringApplication.run() faz TODA a mágica:
        //
        //  1. Inicia o servidor embutido (Tomcat) na porta 8080
        //  2. Faz o "scan" dos pacotes buscando:
        //        - @RestController
        //        - @Service
        //        - @Repository
        //        - @Entity
        //
        //  3. Configura o acesso ao banco H2 (SQL)
        //  4. Prepara o ambiente web
        //  5. Deixa os endpoints prontos em:
        //        http://localhost:8080/api/...
        //
        // Depois disso, sua API fica rodando e pronta para receber requisições.
        SpringApplication.run(WndApiApplication.class, args);
    }

}
