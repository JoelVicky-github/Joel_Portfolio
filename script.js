document.addEventListener("DOMContentLoaded", () => {
    // --- 1. SCROLL XP BAR & NAVBAR EFFECT ---
    window.addEventListener("scroll", () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
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

    // --- 4. AUDIO: SFX & BGM TOGGLES (BOTH ON BY DEFAULT) ---
    let soundEnabled = true;
    let bgmEnabled = true;

    const soundToggleBtn = document.getElementById("soundToggle");
    const bgmToggleBtn = document.getElementById("bgmToggle");
    const bgMusic = document.getElementById("bgMusic");

    if (bgMusic) {
        bgMusic.volume = 0.25; // Comfortable background volume (25%)
    }

    // Try starting BGM immediately; if browser blocks autoplay, start on first user tap/click
    function tryPlayBGM() {
        if (bgmEnabled && bgMusic && bgMusic.paused) {
            bgMusic.play().catch(() => {
                // Waiting for user gesture
            });
        }
    }
    tryPlayBGM();

    const unlockAudioOnFirstGesture = () => {
        if (bgmEnabled && bgMusic && bgMusic.paused) {
            bgMusic.play().catch(() => {});
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        document.removeEventListener("click", unlockAudioOnFirstGesture);
        document.removeEventListener("touchstart", unlockAudioOnFirstGesture);
        document.removeEventListener("keydown", unlockAudioOnFirstGesture);
    };

    document.addEventListener("click", unlockAudioOnFirstGesture);
    document.addEventListener("touchstart", unlockAudioOnFirstGesture, { passive: true });
    document.addEventListener("keydown", unlockAudioOnFirstGesture);

    // Web Audio API Synthesizer for Retro SFX
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = AudioContextClass ? new AudioContextClass() : null;

    function playBeep(frequency = 440, duration = 0.05) {
        if (!soundEnabled || !audioCtx) return;
        try {
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = "square";
            oscillator.frequency.value = frequency;
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Ignore if audio context not yet unlocked
        }
    }

    // BGM Button Toggle
    if (bgmToggleBtn) {
        bgmToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevents double-triggering unlock listener
            bgmEnabled = !bgmEnabled;
            if (bgmEnabled) {
                bgmToggleBtn.textContent = "🎵 BGM: ON";
                bgmToggleBtn.classList.add("active");
                if (bgMusic) bgMusic.play().catch(() => {});
                playBeep(523.25, 0.08);
            } else {
                bgmToggleBtn.textContent = "🎵 BGM: OFF";
                bgmToggleBtn.classList.remove("active");
                if (bgMusic) bgMusic.pause();
                playBeep(329.63, 0.08);
            }
        });
    }

    // SFX Button Toggle
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggleBtn.textContent = "🔊 SFX: ON";
                soundToggleBtn.classList.add("active");
                playBeep(587.33, 0.1);
            } else {
                soundToggleBtn.textContent = "🔊 SFX: OFF";
                soundToggleBtn.classList.remove("active");
            }
        });
    }

    // Attach click SFX to all interactive buttons & links
    document.querySelectorAll(".arcade-btn, .hud-link, .social-btn, .quest-link-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            playBeep(440, 0.05);
        });
    });

    // --- 5. EASTER EGG: KONAMI CODE ---
    const konamiCodeString = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
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
        overlay.style.padding = "1.5rem";
        overlay.style.background = "rgba(10, 11, 16, 0.9)";
        overlay.style.zIndex = "9999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.textAlign = "center";
        overlay.style.fontFamily = "var(--font-heading)";
        overlay.style.fontSize = "clamp(1.5rem, 5vw, 3rem)";
        overlay.style.color = "var(--neon-cyan)";
        overlay.style.textShadow = "0 0 20px var(--neon-magenta)";
        overlay.innerHTML = "✨ LEVEL UP! SECRET EASTER EGG UNLOCKED ✨";
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 3000);
    }
});
