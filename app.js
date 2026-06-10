document.addEventListener('DOMContentLoaded', () => {
  // 1. STATE MANAGEMENT & TARGETS
  const targetDate = new Date('2026-06-16T00:00:00'); // 16 June 2026
  let isUnlocked = false;
  let isSynthPlaying = false;
  let synthInterval = null;
  let audioContext = null;

  // Track currently unlocked scenes
  let highestUnlockedScene = 1;

  function getAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }

  // Smoothly lock body scroll during locked narratives
  function updateScrollPermission() {
    document.body.style.overflow = 'auto';
  }
  updateScrollPermission();

  // Helper to smooth scroll to element
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('scene-locked');
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // Helper to unlock next scene
  function unlockScene(sceneNum, sectionId) {
    if (sceneNum > highestUnlockedScene) {
      highestUnlockedScene = sceneNum;
      updateScrollPermission();
    }
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.remove('scene-locked');
      section.classList.remove('scene-hidden');
    }
  }

  // ==========================================================================
  // BACKGROUND CANVAS PARTICLE SYSTEM (STARRY NIGHT)
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const particleColors = [
    'rgba(231, 203, 169, 0.45)',  // Champagne Gold
    'rgba(220, 198, 224, 0.45)',  // Soft Lavender
    'rgba(166, 77, 121, 0.35)',   // Deep Rose
    'rgba(255, 255, 255, 0.5)'    // Bright White
  ];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class StarParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 3.5 + 1.2;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = Math.random() * 0.1 - 0.05;
      this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
      this.opacity = Math.random() * 0.6 + 0.4;
      this.blinkSpeed = Math.random() * 0.02 + 0.005;
      this.blinkDir = 1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Star twinkling
      this.opacity += this.blinkSpeed * this.blinkDir;
      if (this.opacity >= 0.95) this.blinkDir = -1;
      if (this.opacity <= 0.25) this.blinkDir = 1;

      if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Active Confetti burst array
  let confettis = [];
  class Confetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 4;
      this.color = `hsl(${Math.random() * 40 + 330}, 85%, 65%)`; // Rose to lavender tones
      if (Math.random() > 0.6) this.color = `hsl(45, 100%, 70%)`; // Gold tone
      this.speedY = Math.random() * -6 - 3;
      this.speedX = Math.random() * 8 - 4;
      this.gravity = 0.15;
      this.opacity = 1;
      this.spin = Math.random() * 360;
      this.spinSpeed = Math.random() * 10 - 5;
    }
    update() {
      this.speedY += this.gravity;
      this.y += this.speedY;
      this.x += this.speedX;
      this.spin += this.spinSpeed;
      this.opacity -= 0.015;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.spin * Math.PI / 180);
      ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      ctx.restore();
    }
  }

  const totalParticles = 65;
  for (let i = 0; i < totalParticles; i++) {
    particles.push(new StarParticle());
  }

  function burstConfetti(x, y) {
    for (let i = 0; i < 80; i++) {
      confettis.push(new Confetti(x, y));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cinematic midnight purple ambient gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0a0715'); // Very dark midnight purple
    grad.addColorStop(0.5, '#0e0b1f');
    grad.addColorStop(1, '#05040a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Confettis
    for (let i = confettis.length - 1; i >= 0; i--) {
      confettis[i].update();
      confettis[i].draw();
      if (confettis[i].opacity <= 0) {
        confettis.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================================================
  // SCENE 1: JAM DIGITAL & COUNTDOWN TIMER LOGIC
  // ==========================================================================
  function updateDigitalClock() {
    const clock = document.getElementById('digital-clock-display');
    if (!clock) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clock.innerText = `${h}:${m}:${s}`;
  }
  setInterval(updateDigitalClock, 1000);
  updateDigitalClock();

  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      
      document.getElementById('countdown-notice').innerHTML = 
        'Selamat Ulang Tahun Sabrina Zahra Tudinia! 🎂💙<br><strong>Midnight Memory milikmu siap dibuka.</strong>';
      document.getElementById('btn-unlock-birthday').style.display = 'inline-block';
    } else {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('days').innerText = String(d).padStart(2, '0');
      document.getElementById('hours').innerText = String(h).padStart(2, '0');
      document.getElementById('minutes').innerText = String(m).padStart(2, '0');
      document.getElementById('seconds').innerText = String(s).padStart(2, '0');
    }
  }

  // ==========================================================================
  // UNLOCK TRANSITION: ENTER SCENE 2
  // ==========================================================================
  const unlockApp = () => {
    if (isUnlocked) return;
    isUnlocked = true;
    
    // Play synthesized warm unlock swoop chime!
    playUnlockChime();
    
    // Fade out countdown screen smoothly
    const countdownScreen = document.getElementById('countdown-screen');
    countdownScreen.style.transition = 'opacity 1s ease, transform 1s ease';
    countdownScreen.style.opacity = '0';
    countdownScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      countdownScreen.style.display = 'none';
      
      const mainContent = document.getElementById('main-content');
      mainContent.style.display = 'block';
      
      document.getElementById('music-player-widget').style.display = 'flex';
      
      // Start ambient synth music
      playMusic();
      
      // Auto-unlock Scene 2 (Cake Blow)
      unlockScene(2, 'birthday-wish-reveal');
      scrollToSection('birthday-wish-reveal');
      
      // Initialize 3D tilting polaroid hover effects
      init3DTiltCards();

      // Start love anniversary clock
      setInterval(updateTogetherCounter, 1000);
      updateTogetherCounter();
      
    }, 1000);
  };

  document.getElementById('btn-unlock-birthday').addEventListener('click', unlockApp);
  document.getElementById('bypass-btn').addEventListener('click', unlockApp);

  // ==========================================================================
  // SCENE 2: INTERACTIVE CANDLE BLOW LOGIC
  // ==========================================================================
  const interactiveFlame = document.getElementById('interactive-flame');
  let isLilinMati = false;

  const matikanLilin = (e) => {
    if (isLilinMati) return;
    isLilinMati = true;
    
    // Hide flame
    interactiveFlame.style.display = 'none';
    document.getElementById('blow-hint-text').innerText = 'Lilin padam... Harapanmu sedang terbang ke bintang! 🌠';
    
    // Play beautiful success synthesizer arpeggio!
    playSuccessArpeggio();
    
    // Burst confettis at flame coordinate
    const rect = interactiveFlame.getBoundingClientRect();
    burstConfetti(rect.left + window.scrollX, rect.top + window.scrollY);
    
    // Open full-screen magical birthday greeting card
    setTimeout(() => {
      const bdayOverlay = document.getElementById('birthday-overlay-screen');
      bdayOverlay.classList.add('active');
    }, 800);
  };

  if (interactiveFlame) {
    interactiveFlame.addEventListener('click', matikanLilin);
    interactiveFlame.addEventListener('mouseenter', matikanLilin);
    interactiveFlame.addEventListener('touchstart', matikanLilin);
  }

  // Handle proceeding from greeting overlay card to Scene 3 (Letter)
  document.getElementById('btn-proceed-to-letter').addEventListener('click', () => {
    document.getElementById('birthday-overlay-screen').classList.remove('active');
    
    // Unlock Scene 3 (Letter)
    unlockScene(3, 'love-letter-reveal');
    scrollToSection('love-letter-reveal');
  });

  // ==========================================================================
  // SCENE 3: ENVELOPE OPENING & TYPEWRITER SURAT
  // ==========================================================================
  const envelope = document.getElementById('envelope-trigger');
  const letterSheet = document.getElementById('letter-content-sheet');
  const typedArea = document.getElementById('typed-letter-area');
  let isLetterOpened = false;

  const letterTextString = `Sabrina sayang...

Selamat ulang tahun yang ke-23. Di antara semua malam indah yang pernah berputar di semesta, malam ini adalah malam terfavoritku, karena dunia pernah melahirkan senyumanmu yang begitu hangat.

Terima kasih sudah lahir ke dunia ini. Terima kasih sudah tumbuh menjadi perempuan hebat, tangguh, dan penyayang yang selalu membuatku bangga setiap harinya. Kamu adalah rumah terindah tempatku berpulang, dan di umur barumu ini, aku berdoa agar semesta selalu melindungimu dan memberikan semua bahagia yang layak kamu dapatkan.

Aku akan selalu ada di sini, menemani langkahmu, dan mencintaimu di setiap ulang tahunmu yang akan datang. ❤️`;

  const openLetter = () => {
    if (isLetterOpened) return;
    isLetterOpened = true;
    
    // Play soft stamp click chime
    playBeepSound(550, 'triangle', 0.08);
    envelope.classList.add('open');
    
    setTimeout(() => {
      // Fade out envelope smoothly
      envelope.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      envelope.style.opacity = '0';
      envelope.style.transform = 'scale(0.8) translateY(-20px)';
      
      setTimeout(() => {
        envelope.style.display = 'none';
        letterSheet.style.display = 'block';
        
        // Start typing effect!
        startTypewriter();
      }, 600);
      
    }, 850);
  };

  if (envelope) {
    envelope.addEventListener('click', openLetter);
  }

  function startTypewriter() {
    let charIdx = 0;
    typedArea.innerText = '';
    
    function type() {
      if (charIdx < letterTextString.length) {
        typedArea.innerHTML += letterTextString.charAt(charIdx) === '\n' ? '<br>' : letterTextString.charAt(charIdx);
        charIdx++;
        
        // Play very quiet typing clicks on interval to avoid heavy DOM noise
        if (charIdx % 3 === 0) {
          playBeepSound(700 + Math.random()*200, 'sine', 0.015);
        }
        
        setTimeout(type, 35);
      } else {
        // Complete! Reveal proceed button
        document.getElementById('letter-unlock-btn-container').style.display = 'block';
      }
    }
    type();
  }

  // Handle proceeding from Letter to Scene 4 (VHS Replay)
  document.getElementById('btn-proceed-to-chat').addEventListener('click', () => {
    // Unlock Scene 4 (Chat VHS)
    unlockScene(4, 'vhs-chat-replay');
    scrollToSection('vhs-chat-replay');
    
    // Auto-trigger chat replay
    setTimeout(startChatReplay, 800);
  });

  // ==========================================================================
  // SCENE 4: FAKE CHAT VHS REPLAY
  // ==========================================================================
  const chatArea = document.getElementById('chat-replay-area');
  const typingBubble = document.getElementById('chat-typing-bubble');
  const proceedToJourneyBtn = document.getElementById('btn-proceed-to-journey');
  
  const chatScript = [
    { sender: 'right', text: 'Hai Sabrina, salam kenal ya! 😊' },
    { sender: 'left', text: 'Hai juga! Salam kenal... 🌸' },
    { sender: 'right', text: 'Nanti sore senggang nggak? Mau cari kopi bareng?' },
    { sender: 'left', text: 'Boleh banget! Mau ke kafe yang di deket taman itu?' },
    { sender: 'right', text: 'Deal! Sampai ketemu sore nanti ya.' },
    { sender: 'full', text: '...dan ternyata, obrolan kecil penuh senyum itu jadi awal dari semua petualangan romantis kita.' }
  ];

  let chatIndex = 0;

  function startChatReplay() {
    if (chatIndex >= chatScript.length) {
      typingBubble.style.display = 'none';
      proceedToJourneyBtn.style.display = 'inline-block';
      return;
    }

    const nextMsg = chatScript[chatIndex];
    
    // Show typing indicator
    typingBubble.style.display = 'flex';
    chatArea.appendChild(typingBubble); // Keep at bottom
    chatArea.scrollTop = chatArea.scrollHeight;

    setTimeout(() => {
      // Hide typing indicator
      typingBubble.style.display = 'none';

      // Create bubble
      const bubble = document.createElement('div');
      if (nextMsg.sender === 'full') {
        bubble.className = 'chat-bubble';
        bubble.style.maxWidth = '100%';
        bubble.style.textAlign = 'center';
        bubble.style.fontStyle = 'italic';
        bubble.style.background = 'rgba(231, 203, 169, 0.1)';
        bubble.style.borderColor = 'rgba(231, 203, 169, 0.3)';
        bubble.style.border = '1px solid';
        bubble.style.color = 'var(--secondary)';
        bubble.style.alignSelf = 'center';
      } else {
        bubble.className = `chat-bubble ${nextMsg.sender}`;
      }
      
      bubble.innerHTML = nextMsg.text;
      
      // Play pop message sound
      playBeepSound(480, 'triangle', 0.05);

      chatArea.appendChild(bubble);
      chatArea.scrollTop = chatArea.scrollHeight;
      
      chatIndex++;
      
      // Next msg delay
      setTimeout(startChatReplay, 2200);
      
    }, 1400); // Typing latency simulation
  }

  // Handle proceeding from chat to Scene 5 & 6 (Love timeline & cassettes)
  document.getElementById('btn-proceed-to-journey').addEventListener('click', () => {
    // Unlock Timeline (Scene 5) & Cassettes (Scene 6) together!
    unlockScene(5, 'love-journey');
    unlockScene(6, 'cassette-memories');
    unlockScene(7, 'virtual-photobooth'); // Also unblock photobooth for freedom!
    
    highestUnlockedScene = 7; // Lock releases to normal scrolling!
    updateScrollPermission();
    
    scrollToSection('love-journey');
  });

  // ==========================================================================
  // SCENE 5: TIME ELAPSED COOPERATIVE TICKER
  // ==========================================================================
  const firstDate = new Date('2024-04-12T17:00:00'); // Custom date: 12 April 2024

  function updateTogetherCounter() {
    const counterDisplay = document.getElementById('counter-display');
    if (!counterDisplay) return;
    
    const now = new Date();
    const diff = now - firstDate;
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    counterDisplay.innerHTML = `${d} Hari ${h} Jam ${m} Menit ${s} Detik`;
  }

  // Parallax 3D Polaroid Tilt effects
  function init3DTiltCards() {
    const cards = document.querySelectorAll('.polaroid-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x coordinate inside element
        const y = e.clientY - rect.top;  // y coordinate inside element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
        card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 35px rgba(0,0,0,0.65)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotate(-1.5deg)';
        if (card.parentElement.parentElement.classList.contains('right')) {
          card.style.transform = 'rotate(1.5deg)';
        }
        card.style.boxShadow = '0 15px 35px rgba(0,0,0,0.5)';
      });
    });
  }

  // ==========================================================================
  // SCENE 6: CASSETTE PLAYERS & SYNTH SOUNDS
  // ==========================================================================
  let activeCassetteId = null;
  let cassetteOscillators = [];
  let cassetteInterval = null;

  window.playCassette = function(id) {
    const card = document.getElementById(`cassette-${id}`);
    
    // If playing, pause it
    if (activeCassetteId === id) {
      stopAllCassetteAudio();
      return;
    }
    
    // Stop others
    stopAllCassetteAudio();
    
    activeCassetteId = id;
    card.classList.add('playing');
    card.querySelector('.btn-cassette-play').innerText = '⏸';
    
    // Synthesize unique cute music box arpeggio melody for each kaset!
    const actx = getAudioContext();
    let melody = [];
    
    if (id === 1) {
      // Proud of you warm melody
      melody = [392.00, 440.00, 493.88, 587.33, 493.88, 587.33, 659.25, 587.33];
    } else if (id === 2) {
      // Gratitude soft chords
      melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 392.00];
    } else {
      // Sayang banget high chime
      melody = [523.25, 587.33, 659.25, 783.99, 659.25, 783.99, 880.00, 783.99];
    }
    
    let noteIdx = 0;
    cassetteInterval = setInterval(() => {
      const freq = melody[noteIdx % melody.length];
      
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      
      osc.type = 'sine'; // Pure music box sound
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      
      gain.gain.setValueAtTime(0.01, actx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, actx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      
      osc.start();
      osc.stop(actx.currentTime + 0.6);
      
      noteIdx++;
    }, 380);
  };

  function stopAllCassetteAudio() {
    clearInterval(cassetteInterval);
    activeCassetteId = null;
    document.querySelectorAll('.cassette-card').forEach(card => {
      card.classList.remove('playing');
      card.querySelector('.btn-cassette-play').innerText = '▶';
    });
  }

  // ==========================================================================
  // SCENE 8: RELATIONSHIP COMPATIBILITY QUIZ
  // ==========================================================================
  let quizScore = 0;
  const quizFeedback = document.getElementById('quiz-feedback-text');

  window.submitQuizAnswer = function(questionNum, optionSelected) {
    let isCorrect = false;
    let feedback = '';

    if (questionNum === 1) {
      if (optionSelected === 'B') {
        isCorrect = true;
        feedback = 'Betul! Sunset yang hangat di tepi pantai itu nggak akan pernah terlupakan... 🌊';
      } else {
        feedback = 'Sayang sekali salah. Masa lupa kencan pantai kita? Coba lagi!';
      }
    } else if (questionNum === 2) {
      if (optionSelected === 'A') {
        isCorrect = true;
        feedback = 'Hahaha betul banget! Ngambek menggemaskanmu itu bumbu cinta kita! 🐱';
      } else {
        feedback = 'Hmm kurang tepat. Siapa sih yang pipinya gemoy pas cemberut? Coba lagi!';
      }
    } else if (questionNum === 3) {
      if (optionSelected === 'B') {
        isCorrect = true;
        feedback = 'Tepat sekali! Tanggal lahir paling bersejarah yang merubah hidupku... 💙';
      } else {
        feedback = 'Lho, masa kamu lupa hari ulang tahunmu sendiri?! Pilih B!';
      }
    }

    const currentCard = document.getElementById(`q-card-${questionNum}`);
    const btns = currentCard.querySelectorAll('.option-btn');
    
    // Highlight answer
    btns.forEach(btn => {
      const label = btn.innerText.charAt(0);
      if (label === optionSelected) {
        btn.classList.add(isCorrect ? 'correct' : 'wrong');
      }
      btn.disabled = true;
    });

    if (isCorrect) {
      playBeepSound(880, 'sine', 0.08);
      quizFeedback.innerHTML = `<span style="color:#4caf50;">${feedback}</span>`;
      
      // Advance to next q or complete
      setTimeout(() => {
        quizFeedback.innerHTML = '';
        currentCard.classList.remove('active');
        
        if (questionNum < 3) {
          const nextCard = document.getElementById(`q-card-${questionNum + 1}`);
          nextCard.classList.add('active');
        } else {
          // Quiz completed!
          playSuccessArpeggio();
          document.getElementById('quiz-wrapper-card').style.display = 'none';
          document.getElementById('quiz-reward-unlocked').style.display = 'flex';
        }
      }, 2500);
    } else {
      playBeepSound(180, 'sawtooth', 0.15);
      quizFeedback.innerHTML = `<span style="color:#f44336;">${feedback}</span>`;
      
      setTimeout(() => {
        // Reset buttons to retry
        btns.forEach(btn => {
          btn.classList.remove('wrong');
          btn.disabled = false;
        });
        quizFeedback.innerHTML = '';
      }, 2000);
    }
  };

  // Handle proceeding from Quiz to Scene 9 (Constellation)
  document.getElementById('btn-proceed-to-constellation').addEventListener('click', () => {
    unlockScene(9, 'constellation-memories');
    scrollToSection('constellation-memories');
    
    // Draw and init constellation starry nodes!
    initConstellationStars();
  });

  // ==========================================================================
  // SCENE 9: CONSTELLATION OF MEMORIES (SZT INITIALS ALIGNMENT)
  // ==========================================================================
  const sky = document.getElementById('sky-constellation-container');
  const svg = document.getElementById('constellation-svg');
  const popupCard = document.getElementById('constellation-popup-card');
  const memoTitle = document.getElementById('star-memo-title');
  const memoText = document.getElementById('star-memo-text');
  
  // 5 memories star nodes
  const starData = [
    { id: 1, name: 'Pertemuan Pertama', text: 'Obrolan pertama kali kita yang membuatku yakin kamu adalah sosok yang berbeda.', tx: 25, ty: 28 },
    { id: 2, name: 'Kencan Pertama', text: 'Langkah kaki kita beriringan menyusuri pasir pantai yang hangat di kala sunset.', tx: 42, ty: 58 },
    { id: 3, name: 'Senyuman Indahmu', text: 'Senyum termanismu yang selalu menjadi obat penenang hatiku di setiap waktu lelah.', tx: 60, ty: 32 },
    { id: 4, name: 'Komitmen Bersama', text: 'Saat kita berjanji untuk saling merangkul, percaya, dan menjaga rasa ini selamanya.', tx: 78, ty: 68 },
    { id: 5, name: 'Selamat Ulang Tahun', text: 'Terima kasih sudah terlahir di semesta ini dan menerangi seluruh duniaku, sayang. ❤️', tx: 50, ty: 82 }
  ];

  let starsClicked = 0;
  let starElements = [];

  function initConstellationStars() {
    // Clear old elements if any
    svg.innerHTML = '';
    const oldStars = document.querySelectorAll('.constellation-star');
    oldStars.forEach(s => s.remove());

    starElements = [];
    starsClicked = 0;
    document.getElementById('btn-proceed-to-wish').style.display = 'none';
    document.getElementById('constellation-status-hint').innerText = 
      'Ketuk 5 bintang bersinar di langit malam untuk menyalakan rasi memori kita.';

    starData.forEach(star => {
      const starEl = document.createElement('div');
      starEl.className = 'constellation-star';
      starEl.style.left = `${star.tx}%`;
      starEl.style.top = `${star.ty}%`;
      starEl.id = `star-node-${star.id}`;
      
      starEl.addEventListener('click', () => triggerStarClick(star, starEl));
      sky.appendChild(starEl);
      starElements.push({ id: star.id, element: starEl, data: star });
    });
  }

  function triggerStarClick(star, el) {
    if (el.classList.contains('active')) {
      // Just reopen details
      memoTitle.innerText = star.name;
      memoText.innerText = star.text;
      popupCard.classList.add('active');
      return;
    }

    el.classList.add('active');
    starsClicked++;
    
    // Play beautiful high pitch chime note
    playBeepSound(650 + (starsClicked * 90), 'sine', 0.08);

    // Draw connection line in SVG to previous star node
    if (starsClicked > 1) {
      const prevStar = starElements[starsClicked - 2];
      drawConstellationLine(prevStar.element, el);
    }

    // Open popup
    memoTitle.innerText = star.name;
    memoText.innerText = star.text;
    popupCard.classList.add('active');

    // Check complete
    if (starsClicked === starData.length) {
      // Golden ending: Rearrange constellations to SZT!
      setTimeout(morphStarsToSZT, 3000);
    } else {
      document.getElementById('constellation-status-hint').innerText = 
        `Memori dinyalakan: ${starsClicked} dari 5 bintang rasi.`;
    }
  }

  function drawConstellationLine(star1, star2) {
    const rect1 = star1.getBoundingClientRect();
    const rect2 = star2.getBoundingClientRect();
    const skyRect = sky.getBoundingClientRect();

    const x1 = rect1.left - skyRect.left + 6;
    const y1 = rect1.top - skyRect.top + 6;
    const x2 = rect2.left - skyRect.left + 6;
    const y2 = rect2.top - skyRect.top + 6;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'rgba(231, 203, 169, 0.6)');
    line.setAttribute('stroke-width', '1.5');
    line.style.transition = 'all 1s ease';
    svg.appendChild(line);
  }

  // Morph existing nodes and spawn new nodes to compose the letters S - Z - T!
  function morphStarsToSZT() {
    popupCard.classList.remove('active');
    document.getElementById('constellation-status-hint').innerHTML = 
      '<span style="color:var(--secondary); font-weight:700; animation:pulsePulse 1s infinite;">Rasi Bintang Cinta SZT telah bersinar di langitmu! ✨</span>';
    
    // Clear lines
    svg.innerHTML = '';
    playSuccessArpeggio();

    // Coordinates points list for SZT letters (total 13 nodes)
    const sztCoordinates = [
      // Letter S (5 nodes)
      { x: 22, y: 35 }, { x: 18, y: 42 }, { x: 22, y: 50 }, { x: 26, y: 58 }, { x: 20, y: 65 },
      // Letter Z (4 nodes)
      { x: 42, y: 35 }, { x: 52, y: 35 }, { x: 44, y: 65 }, { x: 54, y: 65 },
      // Letter T (4 nodes)
      { x: 70, y: 35 }, { x: 80, y: 35 }, { x: 75, y: 40 }, { x: 75, y: 65 }
    ];

    // Reposition the first 5 existing stars
    for (let i = 0; i < 5; i++) {
      const starNode = starElements[i].element;
      starNode.style.transition = 'left 2s cubic-bezier(0.19, 1, 0.22, 1), top 2s cubic-bezier(0.19, 1, 0.22, 1)';
      starNode.style.left = `${sztCoordinates[i].x}%`;
      starNode.style.top = `${sztCoordinates[i].y}%`;
    }

    // Spawn 8 additional stars to complete the SZT shape
    for (let i = 5; i < sztCoordinates.length; i++) {
      setTimeout(() => {
        const starEl = document.createElement('div');
        starEl.className = 'constellation-star active';
        starEl.style.left = '50%';
        starEl.style.top = '50%';
        starEl.style.transition = 'left 2s cubic-bezier(0.19, 1, 0.22, 1), top 2s cubic-bezier(0.19, 1, 0.22, 1)';
        
        sky.appendChild(starEl);
        
        // Move to target coord
        setTimeout(() => {
          starEl.style.left = `${sztCoordinates[i].x}%`;
          starEl.style.top = `${sztCoordinates[i].y}%`;
          playBeepSound(800 + i*15, 'sine', 0.03);
        }, 50);
      }, (i - 5) * 250);
    }

    // Redraw the elegant letters connections after coordinates finish moving
    setTimeout(() => {
      drawSZTConnections(sztCoordinates);
      
      // Unlock Scene 10 (Wishing Well)
      unlockScene(10, 'wishing-well');
      document.getElementById('btn-proceed-to-wish').style.display = 'inline-block';
    }, 4500);
  }

  function drawSZTConnections(coords) {
    const skyRect = sky.getBoundingClientRect();
    const allStars = document.querySelectorAll('.constellation-star');
    
    function drawPair(idx1, idx2) {
      const rect1 = allStars[idx1].getBoundingClientRect();
      const rect2 = allStars[idx2].getBoundingClientRect();
      const x1 = rect1.left - skyRect.left + 6;
      const y1 = rect1.top - skyRect.top + 6;
      const x2 = rect2.left - skyRect.left + 6;
      const y2 = rect2.top - skyRect.top + 6;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', 'rgba(231, 203, 169, 0.65)');
      line.setAttribute('stroke-width', '2');
      line.style.filter = 'drop-shadow(0 0 5px var(--secondary))';
      svg.appendChild(line);
    }

    // Connect S (0 -> 1 -> 2 -> 3 -> 4)
    drawPair(0, 1); drawPair(1, 2); drawPair(2, 3); drawPair(3, 4);
    // Connect Z (5 -> 6 -> 7 -> 8)
    drawPair(5, 6); drawPair(6, 7); drawPair(7, 8);
    // Connect T (9 -> 10, then 11 -> 12)
    drawPair(9, 10); drawPair(11, 12);
  }

  // Handle proceeding from Constellation to Scene 10 (Wish)
  document.getElementById('btn-proceed-to-wish').addEventListener('click', () => {
    scrollToSection('wishing-well');
  });

  // ==========================================================================
  // SCENE 10: STARRY WISHING WELL
  // ==========================================================================
  const wishTxt = document.getElementById('txt-wish');
  const sendWishBtn = document.getElementById('btn-send-wish');

  sendWishBtn.addEventListener('click', () => {
    const wishText = wishTxt.value.trim();
    if (!wishText) {
      playBeepSound(180, 'sawtooth', 0.1);
      wishTxt.style.borderColor = '#c62828';
      setTimeout(() => wishTxt.style.borderColor = 'var(--glass-border)', 800);
      return;
    }

    // Play magical launch swoop sound
    playBeepSound(260, 'sine', 0.05);
    playSuccessArpeggio();

    // Create floating wish element
    const wishBadge = document.createElement('div');
    wishBadge.className = 'floating-wish';
    wishBadge.innerText = `💫 ${wishText}`;
    wishBadge.style.left = `${Math.random() * 40 + 30}vw`;
    wishBadge.style.setProperty('--drift-x', `${Math.random() * 150 - 75}px`);
    document.body.appendChild(wishBadge);

    // Confettis at the textarea
    const rect = sendWishBtn.getBoundingClientRect();
    burstConfetti(rect.left + rect.width/2 + window.scrollX, rect.top + window.scrollY);

    // Reset textarea
    wishTxt.value = '';
    
    // Unlock Ending Credits!
    unlockScene(11, 'ending-credits');
    document.getElementById('app-footer').style.display = 'block';
    
    setTimeout(() => {
      scrollToSection('ending-credits');
      document.getElementById('ending-credits').classList.add('credits-active');
    }, 2000);
  });

  // ==========================================================================
  // SYNTHESIZED ROMANTIC SOUND EFFECTS (WEB AUDIO API)
  // ==========================================================================
  function playBeepSound(freq, type, duration) {
    try {
      const actx = getAudioContext();
      const osc = actx.createOscillator();
      const gainNode = actx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      
      gainNode.gain.setValueAtTime(0.01, actx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, actx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(actx.destination);
      
      osc.start();
      osc.stop(actx.currentTime + duration);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  function playUnlockChime() {
    try {
      const actx = getAudioContext();
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // Arpeggio C Major
      notes.forEach((freq, i) => {
        setTimeout(() => {
          playBeepSound(freq, 'triangle', 0.5);
        }, i * 110);
      });
    } catch (e) {}
  }

  function playSuccessArpeggio() {
    try {
      const actx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // Bright celebratory high chords
      notes.forEach((freq, i) => {
        setTimeout(() => {
          playBeepSound(freq, 'sine', 0.8);
        }, i * 90);
      });
    } catch (e) {}
  }

  // ==========================================================================
  // SYNTH BACKUP BGM CHUNKS PLAYER
  // ==========================================================================
  function playMusic() {
    if (isSynthPlaying) return;
    isSynthPlaying = true;
    const widget = document.getElementById('music-player-widget');
    if (widget) widget.classList.add('playing');

    const actx = getAudioContext();
    const chords = [
      [261.63, 329.63, 392.00], // C Major
      [293.66, 349.23, 440.00], // D Minor
      [329.63, 392.00, 493.88], // E Minor
      [349.23, 440.00, 523.25]  // F Major
    ];

    let chordIdx = 0;
    
    // Play warm background synth arpeggios
    synthInterval = setInterval(() => {
      const activeChord = chords[chordIdx % chords.length];
      activeChord.forEach((freq, i) => {
        setTimeout(() => {
          if (!isSynthPlaying) return;
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq / 2, actx.currentTime); // Bass octave
          
          gain.gain.setValueAtTime(0.01, actx.currentTime);
          gain.gain.linearRampToValueAtTime(0.12, actx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 2.5);
          
          osc.connect(gain);
          gain.connect(actx.destination);
          
          osc.start();
          osc.stop(actx.currentTime + 2.5);
        }, i * 200);
      });
      chordIdx++;
    }, 3500);
  }

  function stopMusic() {
    isSynthPlaying = false;
    clearInterval(synthInterval);
    const widget = document.getElementById('music-player-widget');
    if (widget) widget.classList.remove('playing');
  }

  // Handle Play/Pause toggle widget
  const playPauseBtn = document.getElementById('btn-play-pause');
  const playPauseIcon = document.getElementById('play-pause-icon');

  playPauseBtn.addEventListener('click', () => {
    if (isSynthPlaying) {
      stopMusic();
      playPauseIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play SVG path
    } else {
      playMusic();
      playPauseIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause SVG path
    }
  });

});
