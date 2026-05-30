/**
 * ============================================
 * SMARTROOM - ANIMACIONES
 * Efectos visuales y transiciones con GSAP
 * ============================================
 */

class AnimationManager {
    constructor() {
        this.tl = gsap.timeline();
        this.cards = [];
        this.sensors = [];
        this.isAnimating = false;
    }

    /**
     * Inicializa todas las animaciones
     */
    init() {
        this.animatePageLoad();
        this.animateSensorCards();
        this.animateIndicators();
        this.startPulseAnimations();
    }

    /**
     * Animación de carga de página
     */
    animatePageLoad() {
        // Animar logo
        gsap.from('.logo', {
            duration: 0.8,
            opacity: 0,
            y: -20,
            ease: 'back.out'
        });

        // Animar elementos del header
        gsap.from('.header', {
            duration: 0.8,
            opacity: 0,
            y: -30,
            delay: 0.2,
            ease: 'power2.out'
        });

        // Animar sidebar
        gsap.from('.sidebar', {
            duration: 0.8,
            opacity: 0,
            x: -50,
            delay: 0.1,
            ease: 'power2.out'
        });

        // Animar elementos principales
        gsap.from('.indicators-grid > *', {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power2.out'
        });

        // Animar gráficas
        gsap.from('.chart-container', {
            duration: 0.8,
            opacity: 0,
            y: 40,
            stagger: 0.15,
            delay: 0.5,
            ease: 'power2.out'
        });
    }

    /**
     * Anima las tarjetas de sensores
     */
    animateSensorCards() {
        const cards = document.querySelectorAll('.sensor-card');
        cards.forEach((card, index) => {
            gsap.from(card, {
                duration: 0.6,
                opacity: 0,
                y: 30,
                delay: index * 0.1,
                ease: 'back.out'
            });

            // Efecto hover
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -10,
                    boxShadow: '0 0 25px rgba(0, 212, 255, 0.4)',
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: 0,
                    boxShadow: '0 0 0px rgba(0, 212, 255, 0)',
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Anima indicadores
     */
    animateIndicators() {
        const indicators = document.querySelectorAll('.indicator-card');
        indicators.forEach((indicator, index) => {
            gsap.from(indicator, {
                duration: 0.8,
                opacity: 0,
                y: 40,
                delay: index * 0.15,
                ease: 'back.out'
            });
        });
    }

    /**
     * Inicia animaciones pulsantes (como logo y estado)
     */
    startPulseAnimations() {
        // Pulso del logo
        gsap.to('.logo-icon', {
            duration: 2,
            scale: 1.1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Pulso de indicadores en tiempo real
        gsap.to('.indicator-fill', {
            duration: 0.5,
            opacity: 0.7,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    /**
     * Anima el cambio de sección
     */
    animateSectionChange(fromSection, toSection) {
        gsap.to(fromSection, {
            duration: 0.3,
            opacity: 0,
            y: 20,
            ease: 'power2.in',
            onComplete: () => {
                fromSection.classList.remove('active');
                toSection.classList.add('active');
                gsap.from(toSection, {
                    duration: 0.4,
                    opacity: 0,
                    y: 20,
                    ease: 'power2.out'
                });
            }
        });
    }

    /**
     * Anima notificaciones entrantes
     */
    animateNotification(element) {
        gsap.fromTo(element, 
            {
                opacity: 0,
                x: 50,
                scale: 0.8
            },
            {
                duration: 0.5,
                opacity: 1,
                x: 0,
                scale: 1,
                ease: 'back.out'
            }
        );
    }

    /**
     * Anima actualizaciones de valores
     */
    animateValueUpdate(element, newValue) {
        // Efecto de cambio de color
        gsap.to(element, {
            duration: 0.3,
            color: '#00ff88',
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(element, {
                    duration: 0.5,
                    color: 'var(--primary-color)',
                    delay: 0.2,
                    ease: 'power2.out'
                });
            }
        });

        // Efecto de escala
        gsap.to(element, {
            duration: 0.3,
            scale: 1.1,
            ease: 'back.out',
            yoyo: true,
            repeat: 1
        });
    }

    /**
     * Anima gráficas
     */
    animateChartEntrance(chartElement) {
        gsap.from(chartElement, {
            duration: 0.8,
            opacity: 0,
            y: 40,
            ease: 'power2.out'
        });
    }

    /**
     * Anima alertas
     */
    animateAlert(alertElement) {
        gsap.fromTo(alertElement,
            {
                opacity: 0,
                x: -50,
                rotate: -5
            },
            {
                duration: 0.5,
                opacity: 1,
                x: 0,
                rotate: 0,
                ease: 'back.out'
            }
        );

        // Efecto parpadeo para alertas críticas
        if (alertElement.classList.contains('danger')) {
            gsap.to(alertElement, {
                duration: 0.5,
                boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)',
                repeat: 2,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }
    }

    /**
     * Anima botones al hacer click
     */
    animateButtonClick(button) {
        gsap.to(button, {
            duration: 0.3,
            scale: 0.95,
            ease: 'back.inOut',
            yoyo: true,
            repeat: 1
        });
    }

    /**
     * Anima barra de carga
     */
    animateLoadingBar(element, duration = 1) {
        gsap.to(element, {
            duration: duration,
            width: '100%',
            ease: 'power2.inOut'
        });
    }

    /**
     * Anima el badge de notificaciones
     */
    animateNotificationBadge(element) {
        gsap.timeline()
            .to(element, {
                duration: 0.3,
                scale: 1.3,
                ease: 'back.out'
            })
            .to(element, {
                duration: 0.5,
                rotation: 360,
                ease: 'back.inOut'
            }, 0);
    }

    /**
     * Anima la apertura/cierre de menú
     */
    animateMenuToggle(menu, isOpen) {
        if (isOpen) {
            gsap.to(menu, {
                duration: 0.4,
                opacity: 1,
                x: 0,
                ease: 'power2.out'
            });
        } else {
            gsap.to(menu, {
                duration: 0.3,
                opacity: 0,
                x: -50,
                ease: 'power2.in'
            });
        }
    }

    /**
     * Anima scroll suave
     */
    smoothScroll(element, duration = 0.8) {
        gsap.to(window, {
            duration: duration,
            scrollTo: { y: element, autoKill: false },
            ease: 'power2.inOut'
        });
    }

    /**
     * Anima el toggle de dispositivos
     */
    animateDeviceToggle(button) {
        gsap.timeline()
            .to(button, {
                duration: 0.3,
                scale: 1.1,
                rotate: 180,
                ease: 'back.out'
            })
            .to(button, {
                duration: 0.2,
                backgroundColor: 'rgba(0, 212, 255, 0.3)',
                boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)',
                ease: 'power2.out'
            }, 0);
    }

    /**
     * Anima entrada de elementos de lista
     */
    animateListItems(items) {
        gsap.to(items, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: 'power2.out'
        });
    }

    /**
     * Anima la actualización de gráficas
     */
    animateChartUpdate() {
        gsap.to('.chart-container', {
            duration: 0.5,
            opacity: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to('.chart-container', {
                    duration: 0.5,
                    opacity: 1,
                    ease: 'power2.out'
                });
            }
        });
    }

    /**
     * Anima la desaparición de elementos
     */
    animateRemove(element, duration = 0.4) {
        return new Promise(resolve => {
            gsap.to(element, {
                duration: duration,
                opacity: 0,
                y: -20,
                ease: 'power2.in',
                onComplete: () => {
                    element.remove();
                    resolve();
                }
            });
        });
    }
}

// Instancia global del gestor de animaciones
const animationManager = new AnimationManager();
