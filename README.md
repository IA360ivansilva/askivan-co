# askivan.co — Portal multilíngue

Landing page estática (um arquivo) publicada via GitHub Pages no domínio **askivan.co**.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Portal completo — EN / PT / ES, hero com slot de vídeo, produto $37, afiliados 50%, radar |
| `radar.json` | Fonte do Radar de Oportunidades — **é este arquivo que o Hermes atualiza** |
| `CNAME` | `askivan.co` — não apagar, sem isso o domínio cai |
| `edson-david-lower-payment.html` | Página neutra que substitui o link já enviado por SMS. Sem PII, `noindex` |
| `terms/index.html` | Termos de Uso (EN/PT/ES) → `https://askivan.co/terms/` |
| `privacy/index.html` | Política de Privacidade (EN/PT/ES) → `https://askivan.co/privacy/` |
| `thank-you/index.html` | Pós-compra (`noindex`) → `https://askivan.co/thank-you/` |
| `assets/doc.css` + `assets/doc.js` | Estilos e troca de idioma compartilhados pelas 3 páginas de documento |

## Configurar na Whop

- **URL de redirect pós-compra** → `https://askivan.co/thank-you/`
- Nos Termos e na Política estão descritos: garantia de 7 dias, comissão de 50%,
  processamento pela Whop e contato `ia360ivansilva@gmail.com` / +1 (954) 860-0537.
- Se mudar a garantia, mude **nos 3 idiomas** em `terms/index.html`
  (chaves `t.s6p` em EN/PT/ES).


## Conectar o checkout (Whop)

Editar o bloco `CONFIG` no fim do `index.html`:

```js
const CONFIG = {
  checkoutUrl:  "",   // <- URL de checkout da Whop
  affiliateUrl: "",   // <- URL de cadastro de afiliado
  heroVideo:    "",   // <- "assets/avatar.mp4" ou link do YouTube
  whatsapp:     "19548600537",
  radarPath:    "radar.json",
  defaultLang:  "en"
};
```

Enquanto vazios, os botões abrem um modal que manda para o WhatsApp — nada fica quebrado.

## Como o Hermes atualiza o radar

O GitHub Pages é estático: o Hermes não "empurra" conteúdo em tempo real. Ele **commita** o `radar.json`:

```bash
curl -X PUT -H "Authorization: Bearer $GH_TOKEN" \
  https://api.github.com/repos/IA360ivansilva/askivan-co/contents/radar.json \
  -d "$(printf '{"message":"radar: semana X","content":"%s","sha":"%s"}' \
      "$(base64 < radar.json | tr -d '\n')" \
      "$(curl -s https://api.github.com/repos/IA360ivansilva/askivan-co/contents/radar.json | jq -r .sha)")"
```

Publica em ~1 minuto. Schema: `{ updated, items[ {tag, title, desc, url} ] }` — máximo 3 itens.

## Deploy

```bash
git add -A && git commit -m "update" && git push
```

Pages rebuilda sozinho a cada push na `main`.
