# ClickNews - Projeto de exemplo (Vite + React + Tailwind)

Este é um **projeto pronto** para você ver o template do site *ClickNews Brasil* funcionar localmente.  
O código do site (o arquivo principal) foi mantido exatamente como você pediu.

## O que tem aqui
- Projeto Vite + React
- Tailwind CSS configurado (diretivas básicas)
- `src/App.jsx` contém todo o código do template (não removi nada)

## Passo a passo (super simples) — Windows / macOS / Linux

1. **Instalar o Node.js**  
   Baixe e instale o Node.js (versão LTS) em: https://nodejs.org/  
   Depois de instalar, abra o terminal (Prompt de Comando / PowerShell no Windows, Terminal no macOS/Linux).

2. **Descompacte o arquivo que você baixou** (se estiver usando o zip) e entre na pasta do projeto:
   ```bash
   cd clicknews
   ```

3. **Instalar dependências**
   ```bash
   npm install
   ```
   Esse comando baixa React, Vite e Tailwind.

4. **Rodar o site localmente**
   ```bash
   npm run dev
   ```
   Depois do comando, o terminal vai mostrar um endereço (geralmente `http://localhost:5173` ou `http://127.0.0.1:5173`). Abra esse endereço no navegador.

5. **Ver e editar o código**
   - Abra a pasta `src/` e edite `App.jsx`. Salve as alterações e o navegador atualizará automaticamente.
   - Se quiser ver o CSS principal: `src/index.css`.

## Problemas comuns
- **Comando 'npm' não encontrado** → provavelmente o Node.js não foi instalado corretamente.
- **Porta em uso** → feche outros servidores (ou use `npm run dev -- --port 3000` para trocar a porta).
- **Imagens de exemplo não aparecem** → elas vêm de `https://picsum.photos` (requer internet).

## Observações
- O projeto usa classes do Tailwind. Se quiser um visual melhor, confirme que o `npm install` completou sem erros.
- Para deploy em produção, veja `npm run build` e hospede a pasta `dist` em um serviço (Vercel, Netlify, Surge, etc.).

---

Pronto — depois de seguir esses passos, você verá o site funcionando no navegador.  
Se quiser, eu já deixei tudo pronto para baixar: basta baixar o ZIP, extrair e seguir os passos acima.
