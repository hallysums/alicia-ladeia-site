# Migração do GitHub Pages para a Hostinger

O site é 100% estático e usa apenas caminhos **relativos** (`assets/...`), então funciona igual em `usuario.github.io/alicia-ladeia-site/` e em `dominio.com.br/`. Não há nada exclusivo do GitHub Pages.

> Nada abaixo envolve compras. Contratar plano ou domínio é decisão sua.

## 1. Antes de migrar — trocar o endereço provisório
O endereço do GitHub Pages aparece em 4 lugares. Substitua `https://hallysums.github.io/alicia-ladeia-site/` pelo domínio final (ex.: `https://draalicialadeia.com.br/`):

- `tools/index.src.html` → `<link rel="canonical">`, `og:url` e o JSON-LD (`"url"`)
- `robots.txt` → linha `Sitemap:`
- `sitemap.xml` → as duas `<loc>`

Depois rode `python3 tools/build_html.py` e faça o commit.

## 2. Enviar os arquivos para a Hostinger
**Opção A — Gerenciador de Arquivos (mais simples)**
1. hPanel → Sites → Gerenciar → **Gerenciador de Arquivos**.
2. Abra a pasta `public_html` (apague o `default.php`/`index.php` de boas-vindas, se houver).
3. Envie **todo o conteúdo** da pasta do projeto (não a pasta em si): `index.html`, `politica-de-privacidade.html`, `404.html`, `robots.txt`, `sitemap.xml`, `.htaccess` e a pasta `assets/`.
   - As pastas `tools/` e `docs/` não são necessárias no servidor (e o `.htaccess` já bloqueia o acesso a elas).
   - O `.htaccess` é um arquivo oculto: confira se foi enviado.

**Opção B — Git (atualizações automáticas)**
1. hPanel → Avançado → **Git** → informe `https://github.com/hallysums/alicia-ladeia-site.git`, branch `main`, diretório `public_html` (vazio).
2. Use "Implantação automática" (webhook) para publicar a cada `git push`.

## 3. Domínio e HTTPS
1. Aponte o domínio para a Hostinger (nameservers da Hostinger ou registro A, conforme o hPanel indicar).
2. hPanel → Segurança → **SSL** → instale o certificado gratuito.
3. O `.htaccess` já força HTTPS e remove o `www` (ajuste se preferir manter o `www`).

## 4. Desligar o GitHub Pages (opcional)
Depois que o domínio estiver no ar: GitHub → repositório → Settings → Pages → Source: **None**. O código continua versionado no GitHub.
Se quiser manter o GitHub Pages com domínio próprio em vez de usar a Hostinger, basta criar um arquivo `CNAME` com o domínio — não faça isso se for usar a Hostinger.

## 5. Pós-migração — checklist
- [ ] `https://dominio/` abre com cadeado
- [ ] `https://dominio/pagina-inexistente` mostra a página 404
- [ ] Botões "Agendar" abrem o WhatsApp correto
- [ ] Mapa carrega e "Abrir rota" leva ao endereço certo
- [ ] Google Search Console: adicionar a propriedade e enviar `sitemap.xml`
- [ ] Se usar Analytics/Pixel: conferir se só carregam após aceitar os cookies
- [ ] Testar compartilhamento no WhatsApp (pré-visualização Open Graph)
