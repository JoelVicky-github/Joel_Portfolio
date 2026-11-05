document.addEventListener("DOMContentLoaded", () => {
    // --- 1. SCROLL XP BAR & NAVBAR EFFECT ---
    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const xpBar = document.getElementById("xpBar");
        if (xpBar) {
            xpBar.style.width = scrolled + "%";
        }
    });

    // --- 2. TYPING / GLITCH EFFECT ON HEADLINE ---
    const headlineElement = document.getElementById("typedHeadline");
    const originalText = "> Aspiring AI-driven Full Stack Developer (learning in public)";
    if (headlineElement) {
        headlineElement.textContent = "";
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                headlineElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 35);
            }
        }
        // Start typing after a brief moment
        setTimeout(typeWriter, 400);
    }

    // --- 3. SKILL XP BARS ANIMATION ON SCROLL ---
    const observerOptions = {
        threshold: 0.2
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const xpFills = entry.target.querySelectorAll(".xp-fill");
                xpFills.forEach(fill => {
                    const targetWidth = fill.style.width;
                    fill.style.width = "0%";
                    setTimeout(() => {
                        fill.style.width = targetWidth;
                    }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }

    // --- 4. AUDIO / SFX TOGGLE (OFF BY DEFAULT) ---
    let soundEnabled = false;
    const soundToggleBtn = document.getElementById("soundToggle");
    
    // Simple synthesized Web Audio API beep generator for retro click feedback
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playBeep(frequency = 440, duration = 0.05) {
        if (!soundEnabled) return;
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = 'square';
            oscillator.frequency.value = frequency;
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed until user gesture
        }
    }

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggleBtn.textContent = "🔊 SFX: ON";
                soundToggleBtn.style.borderColor = "var(--neon-magenta)";
                soundToggleBtn.style.color = "var(--neon-magenta)";
                playBeep(587.33, 0.1); // High beep when turned on
            } else {
                soundToggleBtn.textContent = "🔊 SFX: OFF";
                soundToggleBtn.style.borderColor = "var(--neon-cyan)";
                soundToggleBtn.style.color = "var(--neon-cyan)";
            }
        });
    }

    // Attach click sound to interactive buttons
    document.querySelectorAll(".arcade-btn, .hud-link, .social-btn, .quest-link-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            playBeep(440, 0.05);
        });
    });

    // --- 5. EASTER EGG: KONAMI CODE ---
    let konamiCodeString = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let konamiIndex = 0;

    window.addEventListener("keydown", (e) => {
        if (e.key === konamiCodeString[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCodeString.length) {
                triggerEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function triggerEasterEgg() {
        playBeep(880, 0.3);
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0, 240, 255, 0.2)";
        overlay.style.zIndex = "9999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.fontFamily = "var(--font-heading)";
        overlay.style.fontSize = "3rem";
        overlay.style.color = "var(--neon-cyan)";
        overlay.style.textShadow = "0 0 20px var(--neon-magenta)";
        overlay.innerHTML = "✨ LEVEL UP! SECRET EASTER EGG UNLOCKED ✨";
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 3000);
    }
});