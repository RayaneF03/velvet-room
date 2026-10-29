# Velvet Room ♡

Um mini site pessoal inspirado em páginas de internet/Y2K, com estética dark, rosa e roxa, K-pop, BTS e um cantinho especial para Jungkook. Feito com **HTML, CSS e JavaScript puro**, sem framework.

## Como executar

1. Extraia o arquivo ZIP.
2. Abra a pasta no VS Code.
3. Abra `index.html` no navegador — ou use a extensão **Live Server** para testar.
4. Para publicar, envie os três arquivos principais (`index.html`, `style.css`, `script.js`) para um repositório GitHub e ative o GitHub Pages, ou faça deploy na Vercel/Netlify.

## O que já funciona

- Layout responsivo para desktop, tablet e celular.
- Navegação entre seções com destaque automático.
- Seletor de humor que lembra a escolha no navegador.
- Cards de interesses que podem ser favoritados.
- Player oficial incorporável do Spotify: cole o link de uma playlist, álbum, música ou artista público.
- Links para pesquisar Jungkook, BTS e K-pop no Spotify.
- Mini diário salvo no `localStorage` do navegador.
- Guestbook de corações com contador local.
- Botão de voltar ao topo e pequenas notificações.
- Painel de personalização com edição de textos, links, imagem de perfil, temas e preferência de animações.
- Scrapbook com adição de imagens por URL ou upload local, persistência no navegador e backup em JSON.
- Exportação, importação e restauração das configurações pessoais.
- Editor organizado por abas (textos, links, visual e backup), temas extras, upload de imagens, validação de links, relógio ao vivo, favicon e metadados para compartilhamento.
- Scrapbook com prévia ampliada, edição visual de memórias personalizadas, filtros e exclusão protegida das memórias originais.
- Personalização visual de cor de destaque e cursor normal/estrela, além de tradução das abas do editor para português, espanhol e inglês.
- Barra de progresso da leitura, botão de voltar ao topo contextual, entrada suave das seções e brilho interativo nos cards.

## Personalização

Clique no botão de lápis no canto inferior direito para abrir o painel de configurações. O painel permite editar textos diretamente na página, trocar tema, alterar links, carregar uma imagem de perfil, adicionar memórias ao scrapbook e escolher se as animações ficam ativas.

Depois de fazer qualquer alteração no editor, clique em **SALVAR TODAS AS ALTERAÇÕES**. O editor mostra um aviso enquanto houver mudanças pendentes e confirma quando tudo foi guardado. As configurações são salvas apenas no `localStorage` do navegador. Use **exportar** para criar um backup JSON e **importar** para restaurá-lo em outro navegador. Imagens carregadas do computador são armazenadas dentro desse backup como dados locais; use imagens pequenas para evitar arquivos muito grandes.

As memórias originais do scrapbook ficam protegidas. Memórias adicionadas pelo editor podem ser abertas, ampliadas, editadas e excluídas pelo próprio site.

## Spotify: o que é necessário?

Este projeto usa o **Spotify Embed oficial**, que funciona sem client secret ou login OAuth próprio para exibir conteúdo público. O que a pessoa consegue ouvir depende do Spotify, do conteúdo e da conta dela.

Se depois você quiser uma integração avançada — por exemplo, mostrar a música que está tocando na conta da pessoa, controlar playback ou exibir playlists privadas — será necessário criar um app no [Spotify for Developers](https://developer.spotify.com/dashboard), configurar OAuth e implementar o fluxo exigido pela API. **Nunca coloque `client_secret` ou tokens privados no JavaScript do navegador.** Para esse tipo de integração, use um backend seguro.

## Personalização

- Cores e fontes: `style.css`, no começo do arquivo (`:root`).
- Textos, seções e links: `index.html`.
- Comportamentos: `script.js`.
- As artes de capa são feitas com CSS, então o projeto não depende de imagens externas para o layout principal.
