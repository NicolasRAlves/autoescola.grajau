# Site — Auto Escola Grajaú (Instrutor Autônomo Grajaú)

Site estático (HTML, CSS e JS puros, sem framework). Usa a mesma arquitetura do site da Auto Escola Ariane: um `config.js` com tudo o que a escola muda, e o WhatsApp abrindo com a mensagem pronta.

A diferença: aqui as páginas são **geradas** pelo `scripts/gerar-paginas.mjs`. Cabeçalho, rodapé, preços, casos e FAQ ficam num lugar só, então mudar um preço ou um caso atualiza todas as páginas.

## Páginas

| Endereço | O que tem |
|---|---|
| `/` | Hero com vídeo, faixa de diferenciais, **"Qual é o seu caso?"** (7 casos), preços, aula no local da prova, Nova CNH, vídeos, o instrutor, estrada do passo a passo, gerador de placa APROVADO, orçamento rápido, FAQ e mapa |
| `/orcamento/` | **Formulário por caso**: cada caso tem as próprias perguntas e opções de preço, e termina no WhatsApp |
| `/aula-no-local-da-prova/` | O diferencial: por que funciona, como funciona, preços e FAQ |
| `/categoria-b/` | Carro (VW up!) |
| `/categoria-a/` | Moto |
| `/habilitados/` | Quem tem CNH e não dirige, e adição de categoria (`#adicao`) |
| `/instrutor-autonomo/` | Guia da Nova CNH 2026, tabela antes × agora, simulador de pontos da prova prática e fontes |
| `/videos/` | Reels e canal do YouTube (o player só carrega no clique) |
| `/404.html` | Página de erro |

## O formulário de orçamento (o coração do site)

Os 7 casos ficam em `data/config.js > casos`:

| Caso | Perguntas extras | Opções sugeridas |
|---|---|---|
| Nunca dirigi | categoria (A, B, A+B), etapa do processo | 10 aulas, 20 aulas, avulsa |
| Já sei dirigir | categoria, etapa, quanto já dirige | 2 aulas + veículo, 4 aulas + veículo, aula no local |
| Prova marcada | categoria, data e local da prova, se precisa do veículo | aula no local, só aluguel, 2 ou 4 aulas |
| Reprovei | categoria, tentativas, o que pegou, próxima data | aula no local, 4 aulas, avulsas |
| Tenho CNH e não dirijo | o que quer voltar a dirigir, tempo parado, o que treinar | avulsas (com quantidade) |
| Adicionar categoria | qual categoria quer adicionar, etapa | 10 aulas, 4 aulas, 2 aulas |
| Só preciso do veículo | categoria, data e local da prova | aluguel do carro (ou da moto), aula no local |

Etapas: **caso → perguntas → opção e preço → sobre você (nome, bairro, horário) → resumo e WhatsApp.**

As opções são filtradas pela categoria: quem escolhe moto não vê aluguel de carro. Um link pode abrir o formulário com o caso já escolhido: `/orcamento/?caso=reprovei&cat=B`.

Para criar uma pergunta, acrescente um item em `perguntas` do caso. Os tipos são `radio`, `multi`, `data` e `texto`.

## Abrir no computador

```bash
cd site/scripts
npm install        # só na primeira vez
npm run servidor   # http://localhost:8080
```

## Como mudar as coisas

1. Edite `data/config.js`. Todos os campos têm comentário.
2. Rode `npm run gerar` dentro de `site/scripts`.
3. Rode `npm run links`. O resultado precisa ser "Nenhum arquivo local quebrado".

| O quê | Onde |
|---|---|
| Preços | `planos.itens` (`preco: null` = "Sob consulta") |
| Casos e perguntas | `casos` |
| Contato, endereço e bairros | `whatsapp`, `endereco`, `regioes` |
| Serviços oferecidos | `servicos`: `true` aparece, `false` some, `null` só aparece na prévia com "[confirmar]" |
| Vídeos | `videos` |
| Perguntas que a escola ainda precisa responder | `faqEscola` |

Os preços também se atualizam no navegador sem gerar de novo, pelo `data-preco`. Mesmo assim, rode `npm run gerar` para o título, a descrição e os dados do Google ficarem certos.

## Fotos e vídeos

- **Fotos do site:** os originais ficam em `../fotos-para-o-site/fotos/`. Rode `npm run imagens`. Os recortes estão listados em `scripts/preparar-imagens.mjs`.
- **Aprovados:** salve em `../fotos-para-o-site/aprovados/moto/` ou `/carro/`, com a data no começo do nome (`2026-11-03-ana.jpg`), e rode `npm run imagens`. O mural aparece nas páginas de carro, moto e vídeos. **Nunca publique aluno sem autorização.**
- **Vídeo novo:** `npm run videos -- "caminho/video.mp4" nome-do-video 3`. O `3` é o segundo do vídeo usado na capa. Depois acrescente o vídeo em `config.js > videos` e rode `npm run gerar`.

Os vídeos originais ficam em `../videos/`, fora de `site`. As versões do site passaram de 95 MB para 11 MB.

## Antes de publicar

1. Em `data/config.js`, troque `modoRascunho: true` para **`false`**. Isso esconde as marcas amarelas e a faixa de prévia.
2. Troque o domínio provisório `autoescolagrajau.com.br` em `config.js > siteUrl` e rode `npm run gerar`. Isso atualiza canonical, sitemap e robots.
3. Rode `npm run links`.
4. Publique **o conteúdo da pasta `site`, menos a pasta `scripts`**.

## Depois de publicar

- Troque o link da bio do Instagram (hoje vai para o `wa.me`) pelo site. O botão de WhatsApp continua a um toque.
- Cadastre o domínio no Google Search Console e envie o `sitemap.xml`.
- Coloque o site no Perfil da Empresa no Google.
- Revise `/instrutor-autonomo/` a cada 3 meses e atualize `regrasAtualizadasEm`.

## Estrutura

```
site/
├── index.html, 404.html, sitemap.xml, robots.txt, favicon.*      (gerados)
├── orcamento/ aula-no-local-da-prova/ categoria-a/ categoria-b/
│   habilitados/ instrutor-autonomo/ videos/                       (gerados)
├── assets/
│   ├── css/style.css
│   ├── js/main.js        contatos, menu, preços, vídeos, YouTube, mapa, FAQ, mural
│   ├── js/orcamento.js   formulário por caso + orçamento rápido
│   ├── js/placa.js       placa APROVADO (canvas)
│   ├── js/pontuacao.js   simulador de pontos da prova prática
│   ├── js/estrada.js     carro e moto andando na estrada
│   ├── fonts/            Barlow Condensed, Inter, Cinzel (OFL)
│   ├── img/  video/
├── data/config.js        TUDO o que a escola muda
├── data/aprovados.js     gerado pelo script de imagens
└── scripts/              (não publicar)
    ├── gerar-paginas.mjs + gerador/base.mjs + gerador/blocos.mjs
    ├── preparar-imagens.mjs, preparar-videos.mjs, checar-links.mjs
```

## Observações técnicas

- Nenhum dado de formulário vai para servidor: tudo vira texto no `wa.me`.
- O mapa, o player do YouTube e os vídeos só carregam no clique. O vídeo do topo carrega depois da página e não toca quando a pessoa ativou "reduzir movimento" ou a economia de dados.
- As fontes ficam no próprio site.
- Testado em 360, 390, 768 e 1280 px: sem rolagem horizontal, sem erro de JS, sem imagem quebrada, e o axe-core (WCAG A/AA) não encontrou violações.
