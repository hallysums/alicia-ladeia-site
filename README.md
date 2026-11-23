# Site — Dra. Alicia Ladeia | Odontologia Estética

Site institucional de página única da Dra. Alicia Ladeia (CROSP 144.937), focado em **lentes de resina realistas** no Tatuapé, São Paulo - SP.

- **Demonstração (GitHub Pages):** https://hallysums.github.io/alicia-ladeia-site/
- **Tecnologia:** HTML, CSS e JavaScript puros, sem etapa de build obrigatória. Funciona em qualquer hospedagem estática (GitHub Pages, Hostinger, etc.).
- **Animações:** [Motion](https://motion.dev) (a biblioteca do Framer Motion para JavaScript puro), em versão reduzida e local em `assets/js/motion.min.js`. Respeita a configuração "reduzir movimento" do dispositivo.
- **Fontes:** Cormorant Garamond (títulos) e Jost (textos), hospedadas no próprio site (sem Google Fonts, melhor para LGPD e desempenho).

## Estrutura

```
index.html                    Página principal (GERADA — edite tools/index.src.html)
politica-de-privacidade.html  Política de privacidade (modelo LGPD)
404.html                      Página de erro
robots.txt / sitemap.xml      SEO
.htaccess                     Configuração para Hostinger (HTTPS, cache, segurança)
.nojekyll                     Necessário para o GitHub Pages servir os arquivos como estão
assets/
  css/style.css               Todo o visual (tokens de cor e fonte no :root)
  js/config.js                ⭐ CONFIGURAÇÃO: WhatsApp, endereço, horários, analytics, casos, depoimentos
  js/main.js                  Interações e animações
  js/motion.min.js            Biblioteca de animação
  fonts/                      Fontes .woff2
  img/                        Favicon e imagens próprias (casos, retrato)
tools/
  index.src.html              Fonte do index.html (textos e estrutura)
  build_html.py               Gera o index.html com imagens responsivas (srcset)
docs/MIGRACAO-HOSTINGER.md    Passo a passo da migração
```

## O que configurar (tudo em `assets/js/config.js`)

| Campo | Situação atual | Efeito |
|---|---|---|
| `whatsapp` | **vazio** | Enquanto vazio, todos os botões "Agendar" abrem o Direct do Instagram. Ao preencher (ex.: `"5511999999999"`), passam a abrir o WhatsApp com mensagem pronta e o botão flutuante vira WhatsApp. |
| `address` | **vazio** | Mapa e rota usam "Tatuapé, São Paulo - SP". Preencha o endereço completo. |
| `hours` | **vazio** | Exibe "Horários a informar". |
| `googleAnalyticsId` / `metaPixelId` | vazios | Ao preencher, aparece o aviso de cookies; os scripts só carregam após o aceite. |
| `cases` | vazio | O comparador antes/depois mostra a área preparada. Adicione casos reais autorizados. |
| `testimonials` | vazio | Mostra um card "Modelo · depoimento a inserir". Adicione depoimentos reais autorizados. |

### Retrato da Dra. Alicia
Salve a foto em `assets/img/dra-alicia.webp` (proporção 4:5, ~900×1125 px) e siga o comentário dentro de `tools/index.src.html` na seção "Sobre". Depois rode `python3 tools/build_html.py`.

### Editando textos
Edite `tools/index.src.html` e rode:
```bash
python3 tools/build_html.py
```
(Se preferir, também é possível editar o `index.html` diretamente, mas a próxima geração sobrescreverá.)

## Pendências de conteúdo — validar com a Dra. Alicia

- [ ] Número oficial de WhatsApp
- [ ] Endereço completo e horários de atendimento
- [ ] Retrato profissional
- [ ] Texto de apresentação, formação e especializações (nada foi inventado)
- [ ] Casos de antes e depois **reais**, com autorização por escrito (TCLE)
- [ ] Depoimentos reais e autorizados
- [ ] Confirmar os "diferenciais" (seção "Cada detalhe faz diferença") — são descrições de abordagem de atendimento, sem citar equipamentos ou técnicas específicas
- [ ] Confirmar o uso do número "+5.000 novos sorrisos" (fonte: Instagram)
- [ ] Revisão jurídica da Política de Privacidade

## Observações éticas (CFO)

- O site usa "atuação dedicada às lentes de resina realistas", **não** "especialista". O termo "especialista" só deve ser usado se houver especialidade registrada no CRO; se houver, ajuste o texto e inclua o número de registro da especialidade (RQE).
- Nome e número de inscrição no CRO aparecem no rodapé e na seção "Sobre", como exige a publicidade odontológica.
- Não há promessas de resultado; há aviso de que resultados variam e que a indicação depende de avaliação clínica.
- Todas as fotos atuais são **ilustrativas** (Unsplash) e estão sinalizadas como tal. Nenhuma representa a Dra. Alicia ou pacientes dela.

## Imagens
As fotos ilustrativas são carregadas do Unsplash (licença gratuita para uso comercial) com tamanhos responsivos. Ao substituí-las por fotos próprias, salve-as em `assets/img/` em `.webp` e troque os marcadores `IMG[...]` no `tools/index.src.html` por `<img>` locais.
