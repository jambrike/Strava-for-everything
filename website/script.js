/**
 * Proof Landing Page
 * Clean vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // Mobile Menu
    // ============================================
    
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
    
    // ============================================
    // Smooth Scroll
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // Account for fixed nav
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
    
    // ============================================
    // Waitlist Form
    // ============================================
    
    const form = document.getElementById('waitlist-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const input = form.querySelector('input[type="email"]');
            const btn = form.querySelector('button');
            const email = input.value;
            const originalHTML = btn.innerHTML;
            
            // Loading state
            btn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="30 60"/>
                </svg>
                <span>Joining...</span>
            `;
            btn.disabled = true;
            
            // Simulate API call
            await new Promise(r => setTimeout(r, 1200));
            
            // Success state
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>You're in!</span>
            `;
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            
            // Store email
            const waitlist = JSON.parse(localStorage.getItem('proof_waitlist') || '[]');
            if (!waitlist.includes(email)) {
                waitlist.push(email);
                localStorage.setItem('proof_waitlist', JSON.stringify(waitlist));
            }
            
            // Confetti burst
            createConfetti();
            
            // Reset after delay
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 4000);
        });
    }
    
    // ============================================
    // Confetti Effect
    // ============================================
    
    function createConfetti() {
        const colors = ['#8b5cf6', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6'];
        const container = document.querySelector('.cta-card');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: 50%;
                top: 50%;
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                pointer-events: none;
                z-index: 100;
            `;
            container.appendChild(confetti);
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = Math.random() * 200 + 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            confetti.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0, 0.5, 0.5, 1)'
            }).onfinish = () => confetti.remove();
        }
    }
    
    // ============================================
    // Intersection Observer for Animations
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .pillar-card, .step').forEach(el => {
        observer.observe(el);
    });
    
    // ============================================
    // Navbar Background on Scroll
    // ============================================
    
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(5, 5, 5, 0.95)';
            nav.style.borderColor = '#333';
        } else {
            nav.style.background = 'rgba(5, 5, 5, 0.8)';
            nav.style.borderColor = 'var(--border-subtle)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // Pillar Card Hover Effect
    // ============================================
    
    document.querySelectorAll('.pillar-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // ============================================
    // Parallax for Phone Mockup
    // ============================================
    
    const phone = document.querySelector('.phone-wrapper');
    
    if (phone && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.15;
            phone.style.transform = `translateY(${-rate}px)`;
        });
        
        // Subtle mouse parallax
        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            
            const x = (e.clientX - window.innerWidth / 2) / 50;
            const y = (e.clientY - window.innerHeight / 2) / 50;
            
            phone.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    
    // ============================================
    // Typing Effect for Hero (optional enhancement)
    // ============================================
    
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.style.opacity = '1';
    }
    
    // ============================================
    // Add spinner animation style
    // ============================================
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================
    // Console Easter Egg
    // ============================================
    
    console.log('%c🎯 Proof', 'font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
    console.log('%cStop saying you did it. Prove it.', 'font-size: 14px; color: #a0a0a0;');
    console.log('%c→ We\'re hiring! hello@proof.app', 'font-size: 12px; color: #666;');
    
    // ============================================
    // Konami Code Easter Egg
    // ============================================
    
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Rainbow mode!
                document.body.style.animation = 'rainbow 2s linear infinite';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
                konamiIndex = 0;
                
                // Extra confetti
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => createConfetti(), i * 200);
                }
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // ============================================
    // Stats Counter Animation
    // ============================================
    
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => statsObserver.observe(stat));
    
    function animateValue(element) {
        const text = element.textContent;
        if (text.includes('k')) {
            const num = parseFloat(text);
            let current = 0;
            const increment = num / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= num) {
                    element.textContent = text;
                    clearInterval(timer);
                } else {
                    element.textContent = current.toFixed(1) + 'k+';
                }
            }, 30);
        }
    }
    
});
