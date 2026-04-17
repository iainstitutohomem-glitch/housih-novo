// Service Worker minimalista para permitir a instalação do PWA
self.addEventListener('install', (event) => {
    console.log('[Housih] Service Worker instalado');
});

self.addEventListener('fetch', (event) => {
    // Apenas pass-through, necessário para os critérios de PWA do Chrome/Android
});
