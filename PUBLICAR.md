# Como publicar o site

O site é publicado sozinho: toda alteração enviada ao GitHub (branch `main`)
entra no ar em 1 a 2 minutos, pelo fluxo `.github/workflows/publicar-site.yml`.

## No dia a dia

1. Edite os arquivos nesta pasta (você mesmo, no VS Code, ou pedindo ao Claude).
2. Abra o **GitHub Desktop**: as alterações aparecem na coluna da esquerda.
3. Escreva um resumo em *Summary* (ex.: "Novo telefone no rodapé") e clique em **Commit to main**.
4. Clique em **Push origin**.
5. Pronto. O andamento aparece em GitHub > repositório > aba **Actions**
   (bolinha verde = publicado; vermelha = erro, clique para ver o motivo).

Para desfazer uma publicação: no GitHub Desktop, aba *History*, clique com o
botão direito na alteração > **Revert changes in commit** e faça o Push.

## Dicas

- Ao mudar `css/style.css` ou `js/main.js`, aumente o número `?v=` nas páginas
  (ex.: `style.css?v=6` → `?v=7`) para os navegadores pegarem a versão nova.
- Imagens e vídeos novos: use um nome novo de arquivo em vez de substituir o antigo.
- Para publicar de novo sem alterar nada: aba **Actions** > *Publicar site* > **Run workflow**.
