// Sistema centralizado de animaciones para Portfolio PBN
// Todas las animaciones están aquí para fácil gestión y preview

export const animations = {
  // ===== FADE ANIMATIONS =====
  fadeIn: {
    name: 'Aparecer Suave',
    description: 'El elemento aparece gradualmente',
    className: 'animate-fade-in',
    css: `
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 0.6s ease-out;
      }
    `,
    preview: '💫 Aparece de 0% a 100% opacidad'
  },
  
  fadeInUp: {
    name: 'Aparecer desde Abajo',
    description: 'Aparece subiendo suavemente',
    className: 'animate-fade-in-up',
    css: `
      @keyframes fade-in-up {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out;
      }
    `,
    preview: '⬆️ Sube mientras aparece'
  },

  fadeInDown: {
    name: 'Aparecer desde Arriba',
    description: 'Aparece bajando suavemente',
    className: 'animate-fade-in-down',
    css: `
      @keyframes fade-in-down {
        from { 
          opacity: 0; 
          transform: translateY(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      .animate-fade-in-down {
        animation: fade-in-down 0.8s ease-out;
      }
    `,
    preview: '⬇️ Baja mientras aparece'
  },

  fadeInLeft: {
    name: 'Aparecer desde Izquierda',
    description: 'Entra deslizándose desde la izquierda',
    className: 'animate-fade-in-left',
    css: `
      @keyframes fade-in-left {
        from { 
          opacity: 0; 
          transform: translateX(-30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      .animate-fade-in-left {
        animation: fade-in-left 0.8s ease-out;
      }
    `,
    preview: '⬅️ Entra desde la izquierda'
  },

  fadeInRight: {
    name: 'Aparecer desde Derecha',
    description: 'Entra deslizándose desde la derecha',
    className: 'animate-fade-in-right',
    css: `
      @keyframes fade-in-right {
        from { 
          opacity: 0; 
          transform: translateX(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateX(0); 
        }
      }
      .animate-fade-in-right {
        animation: fade-in-right 0.8s ease-out;
      }
    `,
    preview: '➡️ Entra desde la derecha'
  },

  // ===== SCALE ANIMATIONS =====
  scaleIn: {
    name: 'Crecer',
    description: 'Aparece creciendo desde el centro',
    className: 'animate-scale-in',
    css: `
      @keyframes scale-in {
        from { 
          opacity: 0; 
          transform: scale(0.8); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      .animate-scale-in {
        animation: scale-in 0.5s ease-out;
      }
    `,
    preview: '🎯 Crece desde pequeño'
  },

  scaleInPop: {
    name: 'Aparecer con Rebote',
    description: 'Crece con un efecto de rebote divertido',
    className: 'animate-scale-in-pop',
    css: `
      @keyframes scale-in-pop {
        0% { 
          opacity: 0; 
          transform: scale(0.5); 
        }
        50% { 
          transform: scale(1.05); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      .animate-scale-in-pop {
        animation: scale-in-pop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
    `,
    preview: '🎈 Crece con rebote'
  },

  // ===== SLIDE ANIMATIONS =====
  slideInLeft: {
    name: 'Deslizar desde Izquierda',
    description: 'Se desliza entrando desde la izquierda',
    className: 'animate-slide-in-left',
    css: `
      @keyframes slide-in-left {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      .animate-slide-in-left {
        animation: slide-in-left 0.6s ease-out;
      }
    `,
    preview: '⬅️ Desliza completamente'
  },

  slideInRight: {
    name: 'Deslizar desde Derecha',
    description: 'Se desliza entrando desde la derecha',
    className: 'animate-slide-in-right',
    css: `
      @keyframes slide-in-right {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      .animate-slide-in-right {
        animation: slide-in-right 0.6s ease-out;
      }
    `,
    preview: '➡️ Desliza completamente'
  },

  // ===== ROTATE ANIMATIONS =====
  rotateIn: {
    name: 'Girar Entrando',
    description: 'Aparece girando',
    className: 'animate-rotate-in',
    css: `
      @keyframes rotate-in {
        from { 
          opacity: 0; 
          transform: rotate(-180deg) scale(0.5); 
        }
        to { 
          opacity: 1; 
          transform: rotate(0deg) scale(1); 
        }
      }
      .animate-rotate-in {
        animation: rotate-in 0.8s ease-out;
      }
    `,
    preview: '🌀 Gira mientras aparece'
  },

  // ===== BOUNCE ANIMATIONS =====
  bounceIn: {
    name: 'Rebotar',
    description: 'Aparece con un rebote enérgico',
    className: 'animate-bounce-in',
    css: `
      @keyframes bounce-in {
        0% { 
          opacity: 0; 
          transform: scale(0.3) translateY(-50px); 
        }
        50% { 
          transform: scale(1.05) translateY(0); 
        }
        70% { 
          transform: scale(0.9); 
        }
        100% { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      .animate-bounce-in {
        animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
    `,
    preview: '🏀 Rebota al aparecer'
  },

  // ===== FLIP ANIMATIONS =====
  flipIn: {
    name: 'Voltear',
    description: 'Da una vuelta mostrándose',
    className: 'animate-flip-in',
    css: `
      @keyframes flip-in {
        from { 
          opacity: 0; 
          transform: perspective(1000px) rotateY(-90deg); 
        }
        to { 
          opacity: 1; 
          transform: perspective(1000px) rotateY(0deg); 
        }
      }
      .animate-flip-in {
        animation: flip-in 0.8s ease-out;
      }
    `,
    preview: '🔄 Voltea como una carta'
  },

  // ===== ZOOM ANIMATIONS =====
  zoomIn: {
    name: 'Acercar Zoom',
    description: 'Aparece acercándose rápidamente',
    className: 'animate-zoom-in',
    css: `
      @keyframes zoom-in {
        from { 
          opacity: 0; 
          transform: scale(0); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }
      .animate-zoom-in {
        animation: zoom-in 0.5s ease-out;
      }
    `,
    preview: '🔍 Zoom desde muy pequeño'
  },

  // ===== BLUR ANIMATIONS =====
  blurIn: {
    name: 'Enfocar',
    description: 'Aparece enfocándose gradualmente',
    className: 'animate-blur-in',
    css: `
      @keyframes blur-in {
        from { 
          opacity: 0; 
          filter: blur(20px); 
        }
        to { 
          opacity: 1; 
          filter: blur(0); 
        }
      }
      .animate-blur-in {
        animation: blur-in 0.8s ease-out;
      }
    `,
    preview: '🌫️ Desenfocado a enfocado'
  },

  // ===== SPECIAL ANIMATIONS =====
  typewriter: {
    name: 'Máquina de Escribir',
    description: 'Texto aparece letra por letra',
    className: 'animate-typewriter',
    css: `
      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }
      .animate-typewriter {
        overflow: hidden;
        white-space: nowrap;
        animation: typewriter 2s steps(40) forwards;
      }
    `,
    preview: '⌨️ Escribe letra por letra'
  },

  glow: {
    name: 'Brillo Pulsante',
    description: 'Pulsa con un brillo suave',
    className: 'animate-glow',
    css: `
      @keyframes glow {
        0%, 100% { 
          box-shadow: 0 0 5px rgba(236, 72, 153, 0.5); 
        }
        50% { 
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.8), 0 0 30px rgba(147, 51, 234, 0.6); 
        }
      }
      .animate-glow {
        animation: glow 2s ease-in-out infinite;
      }
    `,
    preview: '✨ Brilla suavemente'
  },

  float: {
    name: 'Flotar',
    description: 'Flota arriba y abajo suavemente',
    className: 'animate-float',
    css: `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
    `,
    preview: '🎈 Flota arriba/abajo'
  },

  shake: {
    name: 'Sacudir',
    description: 'Sacude de lado a lado',
    className: 'animate-shake',
    css: `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `,
    preview: '🤝 Sacude de lado a lado'
  },

  heartbeat: {
    name: 'Latido',
    description: 'Late como un corazón',
    className: 'animate-heartbeat',
    css: `
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        10%, 30% { transform: scale(1.1); }
        20%, 40% { transform: scale(1); }
      }
      .animate-heartbeat {
        animation: heartbeat 1.5s ease-in-out infinite;
      }
    `,
    preview: '💗 Late como corazón'
  },

  // ===== DELAYS =====
  delay100: {
    name: 'Retraso 0.1s',
    description: 'Espera 0.1 segundos antes de animar',
    className: 'animation-delay-100',
    css: `.animation-delay-100 { animation-delay: 0.1s; }`,
    preview: '⏱️ +0.1s'
  },
  delay200: {
    name: 'Retraso 0.2s',
    description: 'Espera 0.2 segundos antes de animar',
    className: 'animation-delay-200',
    css: `.animation-delay-200 { animation-delay: 0.2s; }`,
    preview: '⏱️ +0.2s'
  },
  delay300: {
    name: 'Retraso 0.3s',
    description: 'Espera 0.3 segundos antes de animar',
    className: 'animation-delay-300',
    css: `.animation-delay-300 { animation-delay: 0.3s; }`,
    preview: '⏱️ +0.3s'
  },
  delay500: {
    name: 'Retraso 0.5s',
    description: 'Espera 0.5 segundos antes de animar',
    className: 'animation-delay-500',
    css: `.animation-delay-500 { animation-delay: 0.5s; }`,
    preview: '⏱️ +0.5s'
  },
}

// Generar todo el CSS de una vez
export function generateAnimationCSS() {
  return Object.values(animations)
    .map(anim => anim.css)
    .join('\n\n')
}

// Obtener lista de animaciones para el selector
export function getAnimationList() {
  return Object.entries(animations).map(([key, anim]) => ({
    id: key,
    name: anim.name,
    description: anim.description,
    className: anim.className,
    preview: anim.preview,
  }))
}

// Combinar múltiples animaciones
export function combineAnimations(...keys: string[]) {
  return keys
    .map(key => animations[key as keyof typeof animations]?.className)
    .filter(Boolean)
    .join(' ')
}
