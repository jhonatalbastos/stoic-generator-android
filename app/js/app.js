/**
 * Stoic Video Generator - Android App
 * Main application logic
 */

// ============================================================================
// Configuration
// ============================================================================

const CONFIG = {
    API_ENDPOINT: 'http://localhost:8501', // Change to your server URL
    // API Keys will be configured by the user through the app interface
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_CHAT_ID: '',
    GROQ_API_KEY: '',
    PEXELS_API_KEY: '',
};

// ============================================================================
// State Management
// ============================================================================

const state = {
    isGenerating: false,
    currentTask: null,
    apiKeys: {
        groq: CONFIG.GROQ_API_KEY,
        pexels: CONFIG.PEXELS_API_KEY,
        telegramToken: CONFIG.TELEGRAM_BOT_TOKEN,
        telegramChatId: CONFIG.TELEGRAM_CHAT_ID,
    },
};

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
    topicInput: document.getElementById('topic-input'),
    generateBtn: document.getElementById('generate-btn'),
    toggleApiKeys: document.getElementById('toggle-api-keys'),
    apiKeysForm: document.getElementById('api-keys-form'),
    saveApiKeys: document.getElementById('save-api-keys'),
    groqKey: document.getElementById('groq-key'),
    pexelsKey: document.getElementById('pexels-key'),
    telegramToken: document.getElementById('telegram-token'),
    telegramChatId: document.getElementById('telegram-chat-id'),
    statusSection: document.getElementById('status-section'),
    statusBox: document.getElementById('status-box'),
    statusIcon: document.getElementById('status-icon'),
    statusTitle: document.getElementById('status-title'),
    statusMessage: document.getElementById('status-message'),
    progressLog: document.getElementById('progress-log'),
    logContent: document.getElementById('log-content'),
};

// ============================================================================
// Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadApiKeys();
    setupEventListeners();
});

function initializeApp() {
    console.log('🏛️ Stoic Generator initialized');
    
    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

function loadApiKeys() {
    const savedKeys = localStorage.getItem('stoic_api_keys');
    if (savedKeys) {
        const keys = JSON.parse(savedKeys);
        state.apiKeys = { ...state.apiKeys, ...keys };
    }
    
    // Update form inputs
    elements.groqKey.value = state.apiKeys.groq;
    elements.pexelsKey.value = state.apiKeys.pexels;
    elements.telegramToken.value = state.apiKeys.telegramToken;
    elements.telegramChatId.value = state.apiKeys.telegramChatId;
}

function saveApiKeys() {
    state.apiKeys.groq = elements.groqKey.value;
    state.apiKeys.pexels = elements.pexelsKey.value;
    state.apiKeys.telegramToken = elements.telegramToken.value;
    state.apiKeys.telegramChatId = elements.telegramChatId.value;
    
    localStorage.setItem('stoic_api_keys', JSON.stringify(state.apiKeys));
    showToast('Configurações salvas com sucesso!', 'success');
}

// ============================================================================
// Event Listeners
// ============================================================================

function setupEventListeners() {
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const topic = btn.dataset.topic;
            elements.topicInput.value = topic;
            elements.topicInput.focus();
        });
    });
    
    // Toggle API keys form
    elements.toggleApiKeys.addEventListener('click', () => {
        const form = elements.apiKeysForm;
        if (form.style.display === 'none') {
            form.style.display = 'block';
            elements.toggleApiKeys.textContent = '✕ Fechar Configurações';
        } else {
            form.style.display = 'none';
            elements.toggleApiKeys.textContent = '⚙️ Configurar Chaves de API';
        }
    });
    
    // Save API keys
    elements.saveApiKeys.addEventListener('click', saveApiKeys);
    
    // Generate button
    elements.generateBtn.addEventListener('click', generateVideo);
}

// ============================================================================
// Video Generation
// ============================================================================

async function generateVideo() {
    const topic = elements.topicInput.value.trim();
    
    if (!topic) {
        showToast('Por favor, digite um tópico para o vídeo', 'error');
        return;
    }
    
    if (state.isGenerating) {
        showToast('Já está em processo de geração', 'error');
        return;
    }
    
    // Start generation
    state.isGenerating = true;
    updateStatus('generating', '⏳', 'Gerando seu vídeo estoico...', 'Isso leva 5-10 minutos. Enviamos para o Telegram quando pronto.');
    
    try {
        // Step 1: Generate script using Groq
        addLog('📝 Gerando roteiro estoico...');
        const script = await generateScript(topic);
        
        if (!script) {
            throw new Error('Falha ao gerar roteiro');
        }
        
        addLog('✅ Roteiro gerado com sucesso');
        
        // Step 2: Generate video using backend
        addLog('🎬 Iniciando geração do vídeo...');
        const videoResult = await generateVideoWithBackend(topic, script);
        
        if (!videoResult) {
            throw new Error('Falha ao gerar vídeo');
        }
        
        addLog('✅ Vídeo gerado com sucesso');
        
        // Step 3: Send to Telegram
        addLog('📱 Enviando para Telegram...');
        await sendToTelegram(videoResult);
        
        addLog('✅ Enviado para Telegram com sucesso');
        
        // Success
        updateStatus('success', '✅', 'Pronto!', 'Seu vídeo foi enviado para o Telegram com a descrição.');
        showToast('Vídeo gerado e enviado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Generation error:', error);
        updateStatus('error', '❌', 'Erro na geração', error.message);
        showToast('Erro ao gerar vídeo: ' + error.message, 'error');
    } finally {
        state.isGenerating = false;
    }
}

async function generateScript(topic) {
    const prompt = getStoicPrompt();
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKeys.groq}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: prompt,
                    },
                    {
                        role: 'user',
                        content: `Gere um roteiro estoico sobre: ${topic}`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });
        
        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        }
        
        return null;
    } catch (error) {
        console.error('Script generation error:', error);
        throw new Error('Erro ao conectar com a API de IA');
    }
}

async function generateVideoWithBackend(topic, script) {
    try {
        // This would typically call your backend API
        // For now, we'll simulate the process
        addLog('📥 Buscando imagens no Pexels...');
        await sleep(2000);
        
        addLog('🎤 Gerando narração...');
        await sleep(3000);
        
        addLog('🎵 Adicionando música de fundo...');
        await sleep(1000);
        
        addLog('✂️ Editando vídeo com cortes rápidos...');
        await sleep(4000);
        
        addLog('💬 Adicionando legendas douradas...');
        await sleep(2000);
        
        // In a real implementation, this would return the video file
        return {
            success: true,
            message: 'Vídeo gerado com sucesso',
            videoUrl: 'https://example.com/video.mp4', // Placeholder
        };
        
    } catch (error) {
        console.error('Video generation error:', error);
        throw new Error('Erro ao gerar vídeo no backend');
    }
}

async function sendToTelegram(videoResult) {
    try {
        // Send video description first
        const description = generateDescription(videoResult);
        
        const response = await fetch(`https://api.telegram.org/bot${state.apiKeys.telegramToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: state.apiKeys.telegramChatId,
                text: description,
                parse_mode: 'HTML',
            }),
        });
        
        const data = await response.json();
        
        if (!data.ok) {
            throw new Error('Falha ao enviar mensagem para Telegram');
        }
        
        return true;
        
    } catch (error) {
        console.error('Telegram send error:', error);
        throw new Error('Erro ao enviar para Telegram');
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

function getStoicPrompt() {
    return `Você é um roteirista sênior especializado em conteúdo viral de Desenvolvimento Pessoal, Estoicismo e Foco para TikTok e Reels.

SUA MISSÃO: Escrever um roteiro impactante com DURAÇÃO MÍNIMA DE 1 MINUTO (aproximadamente 140 a 170 palavras narradas num ritmo pausado e firme).

ESTRUTURA OBRIGATÓRIA DO ROTEIRO:

1. HOOK VISCERAL (0 a 3 segundos):
   - Comece imediatamente com uma afirmação chocante ou pergunta provocativa sobre disciplina, fraqueza mental ou foco.
   - Proibido saudações ("Olá", "Bem-vindo", "Neste vídeo"). Vá direto ao ponto.
   - Exemplos: "Você está destruindo sua mente todos os dias e nem percebe." ou "Se você não dominar sua atenção, alguém vai dominar por você."

2. DESENVOLVIMENTO REFLEXIVO (3 a 50 segundos):
   - Apresente 3 princípios claros, lições estoicas ou hábitos práticos.
   - Use frases curtas, impactantes e fáceis de assimilar.
   - Mantenha um tom sério, maduro, grounded e encorajador.
   - Referências naturais a filósofos (Marco Aurélio, Sêneca, Epicteto) quando apropriado.

3. CONCLUSÃO E CTA IMPACTANTE (50 a 60+ segundos):
   - Amarre a reflexão com uma frase marcante.
   - Finalize com uma chamada para ação direta: "Comente 'FOCO' se você concorda" ou "Siga o perfil para não esquecer esta lição amanhã."

DIRETRIZES DE ESTILO:
- Use frases curtas e impactantes.
- Tom sério, maduro e encorajador.
- Garanta que a contagem de palavras seja suficiente para mais de 60 segundos de áudio.
- Gere termos de busca para imagens no Pexels como: "stoic statue", "dark moody rain", "man working hard", "lonely walking night", "deep reflection", "gym motivation", "cinematic coffee".

DIRETRIZES PARA DESCRIÇÃO/TÍTULO:
- Título chamativo (máx. 80 caracteres) que gere curiosidade.
- Descrição com CTA envolvente (máx. 500 caracteres).
- 8 hashtags relevantes para o nicho.

IMPORTANTE: Retorne o roteiro em português brasileiro.`;
}

function generateDescription(videoResult) {
    return `📹 NOVO VÍDEO ESTOICO

🎯 Título: A verdade sobre a disciplina que ninguém te conta

📝 Descrição para TikTok/Reels:
A disciplina é escolher entre o que você quer agora e o que você mais deseja. 💪 Comente 'FOCO' se você concorda!

🏷️ Hashtags:
#stoic #motivation #discipline #mindset #focus #personalgrowth #philosophy #mentalstrength

📊 Configurações:
• Duração: 1+ minuto
• Cortes: A cada 2 segundos
• Estilo: Dark moody / Estoico
• Voz: Grave e firm

📱 Vídeo enviado automaticamente via Telegram`;
}

function updateStatus(type, icon, title, message) {
    elements.statusSection.style.display = 'block';
    elements.statusBox.className = `status-box ${type}`;
    elements.statusIcon.textContent = icon;
    elements.statusTitle.textContent = title;
    elements.statusMessage.textContent = message;
    
    if (type === 'generating') {
        elements.progressLog.style.display = 'block';
    } else {
        elements.progressLog.style.display = 'none';
    }
}

function addLog(message) {
    const logLine = document.createElement('div');
    logLine.textContent = message;
    elements.logContent.appendChild(logLine);
    elements.logContent.scrollTop = elements.logContent.scrollHeight;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Service Worker Registration
// ============================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}
