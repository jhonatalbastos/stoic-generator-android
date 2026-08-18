# 🏛️ Stoic Video Generator - Android App

Aplicativo Android para gerar vídeos estoicos virais para TikTok/Reels.

## 📱 Funcionalidades

- ✅ Geração de vídeos estoicos automaticamente
- ✅ Interface dark moody temática
- ✅ Tópicos pré-definidos virais
- ✅ Configurações de API integradas
- ✅ Envio automático para Telegram
- ✅ Suporte offline (PWA)
- ✅ Notificações push

## 🚀 Como Usar

### Opção 1: Instalar APK (Recomendado)

1. Baixe o APK mais recente em [Releases](https://github.com/seu-usuario/stoic-generator-android/releases)
2. Transfira para o celular
3. Ative "Instalar apps desconhecidos" nas configurações
4. Instale o APK

### Opção 2: Usar como PWA

1. Acesse a URL do app no navegador
2. Clique em "Adicionar à tela inicial"
3. O app funcionará como um aplicativo nativo

## ⚙️ Configuração

### Chaves de API

O app requer as seguintes chaves de API:

| Chave | Descrição | Como obter |
|-------|-----------|------------|
| **Groq** | Geração de roteiros com IA | [console.groq.com](https://console.groq.com) |
| **Pexels** | Busca de imagens e vídeos | [pexels.com/api](https://www.pexels.com/api/) |
| **Telegram Bot Token** | Envio de vídeos | [@BotFather](https://t.me/BotFather) |
| **Telegram Chat ID** | ID do chat de destino | [@userinfobot](https://t.me/userinfobot) |

### Configurar no App

1. Abra o app
2. Clique em "⚙️ Configurar Chaves de API"
3. Preencha as chaves
4. Clique em "💾 Salvar Configurações"

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
stoic-generator-android/
├── app/                          ← Código do app
│   ├── index.html                ← Página principal
│   ├── manifest.json             ← Configuração PWA
│   ├── sw.js                     ← Service Worker
│   ├── css/styles.css            ← Estilos
│   ├── js/app.js                 ← Lógica do app
│   └── icons/                    ← Ícones
├── .github/workflows/            ← CI/CD
│   └── build-apk.yml            ← Workflow de build
├── README.md                     ← Este arquivo
└── package.json                  ← Dependências
```

### Rodar Localmente

```bash
cd app
npm install
npm start
```

O app estará disponível em `http://localhost:3000`

### Gerar APK

1. Faça push para o GitHub
2. O GitHub Actions gerará automaticamente
3. Baixe o APK em Actions → Artifacts

## 📋 Configurações Pré-Definidas

| Configuração | Valor |
|--------------|-------|
| 📐 Proporção | 9:16 (TikTok/Reels) |
| ✂️ Cortes | A cada 2 segundos |
| 🎤 Voz | PT-BR Antonio (Grave) |
| ⚡ Velocidade | 0.9x (Pausado) |
| 🎵 Música | Automática (sutil) |
| 💬 Legendas | Douradas no centro |

## 🎨 Estilo Visual

- Dark moody cinematográfico
- Estátuas estoicas
- Chuva e noite
- Academia e reflexão
- Cores: Dourado (#FFD700) + Preto (#0a0a0f)

## 📱 Tópicos Pré-Definidos

- 🔥 A verdade sobre a disciplina
- 💀 Pare de fazer isso se quer mudar
- 🤫 O poder do silêncio
- 💪 Hábitos de pessoas disciplinadas
- ⚔️ Como pensar como um guerreiro
- 🪤 A armadilha do conforto
- 🧠 Domine sua atenção ou será dominado
- 🌙 A solidão fortalece

## 🔧 Solução de Problemas

### App não instala

- Ative "Instalar apps desconhecidos"
- Verifique se o APK está completo
- Reinicie o celular

### Vídeos não geram

- Verifique as chaves de API
- Teste a conexão com a internet
- Veja os logs no console

### Telegram não recebe

- Verifique o Bot Token
- Confirme o Chat ID
- Envie uma mensagem para o bot primeiro

## 📄 Licença

MIT License - Use como quiser!

## 🤝 Contribuição

Contribuições são bem-vindas! Abra uma issue ou PR.

---

**Feito com ❤️ para a comunidade estoica!**
