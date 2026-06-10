// photobooth.js - Logika Retro Korean 4-Cut Photobooth Premium untuk Sabrina
document.addEventListener('DOMContentLoaded', () => {

  const video = document.getElementById('camera-video');
  const timerOverlay = document.getElementById('booth-countdown-timer');
  const flashScreen = document.getElementById('flash-overlay-screen');
  const shutterOverlay = document.getElementById('aperture-overlay');
  
  const startBtn = document.getElementById('btn-take-photo');
  const downloadBtn = document.getElementById('btn-download-strip');
  
  const cameraStatus = document.getElementById('camera-status-text');
  const cameraDot = document.getElementById('camera-status-dot');
  
  const previewStrip = document.getElementById('paper-strip-preview');
  const stickersRoot = document.getElementById('draggable-stickers-container');
  
  let stream = null;
  let capturedImages = [null, null, null, null];
  let photoCount = 0;
  let isTakingSession = false;
  
  let selectedColor = 'pink';
  let selectedFilter = 'normal'; // default filter

  const frameColorsHex = {
    pink: '#ffd2dc',
    mint: '#e6f3eb',
    blue: '#e4f0f9',
    black: '#0c0914',
    white: '#fcfbfa'
  };

  // Map CSS filter classes to Canvas context filters for high-res drawing!
  const canvasFilterStrings = {
    normal: 'contrast(1.02)',
    vintage: 'sepia(0.3) contrast(1.05) saturate(1.15)',
    bw: 'grayscale(1) contrast(1.2) brightness(1.05)',
    dreamy: 'brightness(1.05) saturate(1.25) contrast(0.96) blur(0.2px)',
    retro: 'contrast(1.2) saturate(1.4) hue-rotate(15deg)'
  };

  // 1. INITIALIZE CAMERA
  function startCamera() {
    if (!video) return;
    cameraStatus.innerText = 'Menghubungkan kamera...';
    cameraDot.style.backgroundColor = '#ffcc00';

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    })
    .then(mediaStream => {
      stream = mediaStream;
      video.srcObject = mediaStream;
      cameraStatus.innerText = 'Kamera Aktif';
      cameraDot.className = 'status-indicator ready';
      cameraDot.style.backgroundColor = '#4caf50';
    })
    .catch(err => {
      console.error('Gagal mengakses kamera:', err);
      cameraStatus.innerText = 'Kamera Diblokir / Tidak Ditemukan';
      cameraDot.className = 'status-indicator';
      cameraDot.style.backgroundColor = '#f44336';
      startBtn.style.opacity = '0.5';
      startBtn.style.pointerEvents = 'none';
    });
  }

  // Delay starting camera slightly so it starts as soon as user scrolls or unlocks
  setTimeout(startCamera, 1500);

  // 2. TOGGLE BINGKAI / FRAME COLORS
  window.changeFrameColor = function(colorName) {
    selectedColor = colorName;
    
    // Reset frame classes
    previewStrip.className = 'photo-strip-preview';
    previewStrip.classList.add(`strip-frame-${colorName}`);
    
    playInterfaceBeep(450);
    
    // Manage active states of buttons
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
      btn.classList.remove('active');
      const inlineStyle = btn.getAttribute('style') || '';
      if (
        (colorName === 'pink' && inlineStyle.includes('ffd2dc')) ||
        (colorName === 'mint' && inlineStyle.includes('e6f3eb')) ||
        (colorName === 'blue' && inlineStyle.includes('e4f0f9')) ||
        (colorName === 'black' && inlineStyle.includes('0c0914')) ||
        (colorName === 'white' && inlineStyle.includes('fcfbfa'))
      ) {
        btn.classList.add('active');
      }
    });
  };

  // 3. TOGGLE VIDEO FILTERS IN REAL-TIME
  window.applyCameraFilter = function(filterName) {
    selectedFilter = filterName;
    video.className = '';
    video.classList.add(`filter-${filterName}`);
    
    playInterfaceBeep(500);

    // Manage active button states
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.innerText.toLowerCase().includes(filterName === 'bw' ? 'b' : filterName.substring(0, 3))) {
        btn.classList.add('active');
      }
    });
  };

  // 4. DIGITAL STICKERS DRAG & DROP SYSTEM
  window.spawnStiker = function(emoji) {
    if (capturedImages.includes(null)) {
      alert('Ambil 4 foto terlebih dahulu sebelum menempel stiker!');
      return;
    }

    const sticker = document.createElement('div');
    sticker.className = 'draggable-sticker';
    sticker.innerText = emoji;
    
    // Spawn near center of the preview strip
    sticker.style.left = '40%';
    sticker.style.top = '45%';
    
    stickersRoot.appendChild(sticker);
    makeElementDraggable(sticker);
    playInterfaceBeep(600);
  };

  function makeElementDraggable(elm) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    elm.addEventListener('mousedown', dragMouseDown);
    elm.addEventListener('touchstart', dragTouchStart, { passive: false });

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      document.addEventListener('mouseup', closeDragElement);
      document.addEventListener('mousemove', elementDrag);
    }

    function dragTouchStart(e) {
      e = e || window.event;
      const touch = e.touches[0];
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      
      document.addEventListener('touchend', closeDragElement);
      document.addEventListener('touchmove', elementTouchDrag, { passive: false });
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      updatePosition(pos1, pos2);
    }

    function elementTouchDrag(e) {
      e = e || window.event;
      e.preventDefault();
      
      const touch = e.touches[0];
      pos1 = pos3 - touch.clientX;
      pos2 = pos4 - touch.clientY;
      pos3 = touch.clientX;
      pos4 = touch.clientY;
      
      updatePosition(pos1, pos2);
    }

    function updatePosition(dx, dy) {
      const containerRect = previewStrip.getBoundingClientRect();
      const elemRect = elm.getBoundingClientRect();
      
      let newLeft = elm.offsetLeft - dx;
      let newTop = elm.offsetTop - dy;
      
      // Constrain stickers inside boundaries
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft > containerRect.width - elemRect.width) newLeft = containerRect.width - elemRect.width;
      if (newTop > containerRect.height - elemRect.height) newTop = containerRect.height - elemRect.height;
      
      // Store in percentage for high-res compositing
      const pctLeft = (newLeft / containerRect.width) * 100;
      const pctTop = (newTop / containerRect.height) * 100;
      
      elm.style.left = `${pctLeft}%`;
      elm.style.top = `${pctTop}%`;
    }

    function closeDragElement() {
      document.removeEventListener('mouseup', closeDragElement);
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('touchend', closeDragElement);
      document.removeEventListener('touchmove', elementTouchDrag);
    }
  }

  // Cute audio sound synthesize helper
  function playInterfaceBeep(freq = 400) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(0.06, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime);
      osc.stop(actx.currentTime + 0.12);
    } catch(e){}
  }

  function playShutterClickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, actx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.2, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime);
      osc.stop(actx.currentTime + 0.25);
    } catch(e){}
  }

  // 5. TAKE PHOTOS SEQUENCE (4 SHOTS AUTOMATIC LOOP)
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (isTakingSession) return;
      
      if (startBtn.innerText.includes('Ulangi')) {
        // Reset everything
        photoCount = 0;
        capturedImages = [null, null, null, null];
        stickersRoot.innerHTML = '';
        downloadBtn.disabled = true;
        
        for (let i = 1; i <= 4; i++) {
          document.getElementById(`preview-slot-${i}`).innerHTML = `Frame ${i}`;
        }
      }

      if (!stream) {
        alert('Kamera belum siap atau tidak diizinkan.');
        return;
      }
      
      isTakingSession = true;
      startBtn.disabled = true;
      startBtn.innerText = 'Mengambil foto... 📸';
      photoCount = 0;
      
      takeNextPhoto();
    });
  }

  function takeNextPhoto() {
    if (photoCount >= 4) {
      cameraStatus.innerText = 'Sesi Selesai! Klik stiker & unduh hasil foto strip!';
      cameraDot.style.backgroundColor = '#4caf50';
      
      isTakingSession = false;
      startBtn.disabled = false;
      startBtn.innerText = 'Ulangi Sesi Foto 📸';
      downloadBtn.disabled = false;
      
      previewStrip.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    cameraStatus.innerText = `Mengambil Foto ${photoCount + 1}/4...`;
    cameraDot.style.backgroundColor = '#ff9800';

    let countdown = 3;
    timerOverlay.innerText = countdown;
    timerOverlay.classList.add('active');
    playInterfaceBeep(700);

    const timerInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timerInterval);
        timerOverlay.classList.remove('active');
        
        // Capture snapshot with sound + flash
        captureSnapshot();
        photoCount++;
        
        setTimeout(takeNextPhoto, 1800);
      } else {
        timerOverlay.innerText = countdown;
        playInterfaceBeep(700);
      }
    }, 1000);
  }

  function captureSnapshot() {
    // 1. Shutter camera lens overlay click + Flash
    shutterOverlay.classList.add('active');
    playShutterClickSound();
    
    setTimeout(() => {
      shutterOverlay.classList.remove('active');
      flashScreen.classList.add('active');
      setTimeout(() => {
        flashScreen.classList.remove('active');
      }, 300);
    }, 120);

    // 2. Grab frame
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = video.videoWidth || 640;
    tempCanvas.height = video.videoHeight || 480;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw mirrored video snapshot
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    
    const dataUrl = tempCanvas.toDataURL('image/png');
    capturedImages[photoCount] = dataUrl;

    // 3. Update preview strip box
    const previewBox = document.getElementById(`preview-slot-${photoCount + 1}`);
    previewBox.innerHTML = `<img src="${dataUrl}" class="filter-${selectedFilter}" alt="Foto ${photoCount + 1}">`;
  }

  // 6. HIGH-RESOLUTION CANVAS MERGE & DOWNLOAD
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (capturedImages.includes(null)) {
        alert('Ambil 4 foto terlebih dahulu!');
        return;
      }

      cameraStatus.innerText = 'Mengemas berkas strip foto premium...';
      
      const offscreenCanvas = document.createElement('canvas');
      const ctx = offscreenCanvas.getContext('2d');
      
      const width = 600;
      const height = 1380;
      
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;

      // A. Draw background hex color
      ctx.fillStyle = frameColorsHex[selectedColor];
      ctx.fillRect(0, 0, width, height);

      // Grid sizes
      const photoWidth = 520;
      const framePhotoHeight = 265;
      const paddingX = 40;
      const paddingTop = 40;
      const spacingY = 30;
      
      let loadedCount = 0;
      const imagesToDraw = [];

      // Preload image snapshots
      capturedImages.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          imagesToDraw[index] = img;
          loadedCount++;
          
          if (loadedCount === 4) {
            drawAllElements();
          }
        };
      });

      function drawAllElements() {
        // Loop over and draw webcam snapshots with filters & mirroring
        for (let i = 0; i < 4; i++) {
          const img = imagesToDraw[i];
          const posY = paddingTop + i * (framePhotoHeight + spacingY);

          ctx.save();
          
          // Setup clip box for the photo
          ctx.beginPath();
          ctx.rect(paddingX, posY, photoWidth, framePhotoHeight);
          ctx.clip();

          // Apply native canvas filters
          ctx.filter = canvasFilterStrings[selectedFilter];

          // Draw mirrored image
          ctx.translate(paddingX + photoWidth, posY);
          ctx.scale(-1, 1);
          
          const sWidth = img.width;
          const sHeight = img.height;
          const sAspectRatio = sWidth / sHeight;
          const dAspectRatio = photoWidth / framePhotoHeight;
          
          let sx = 0, sy = 0, sw = sWidth, sh = sHeight;
          
          if (sAspectRatio > dAspectRatio) {
            sw = sHeight * dAspectRatio;
            sx = (sWidth - sw) / 2;
          } else {
            sh = sWidth / dAspectRatio;
            sy = (sHeight - sh) / 2;
          }
          
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, photoWidth, framePhotoHeight);
          
          ctx.restore();
        }

        // B. DRAW DRAGGED DIGITAL STICKERS (PRESERVING EXACT LOCATIONS!)
        const containerRect = previewStrip.getBoundingClientRect();
        const activeStickers = stickersRoot.querySelectorAll('.draggable-sticker');
        
        activeStickers.forEach(sticker => {
          // Compute sticker positions relative to preview strip in percentage
          const stickerLeftPct = parseFloat(sticker.style.left) / 100;
          const stickerTopPct = parseFloat(sticker.style.top) / 100;
          
          // Translate percentage directly to absolute high-res canvas positions!
          const canvasX = stickerLeftPct * width + 20; // text center correction
          const canvasY = stickerTopPct * height + 20;
          
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Draw emoji sticker
          ctx.font = '50px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(0,0,0,0.35)';
          ctx.fillText(sticker.innerText, canvasX, canvasY);
          
          ctx.restore();
        });

        // C. Draw Signature and bottom text
        const bottomAreaY = paddingTop + 4 * (framePhotoHeight + spacingY) + 10;
        const textColor = selectedColor === 'black' ? '#f8f5f2' : '#0c0914';
        
        ctx.textAlign = 'center';
        
        // Title
        ctx.fillStyle = textColor;
        ctx.font = 'bold 32px "Cormorant Garamond", serif';
        ctx.fillText("Sabrina's Birthday Strip", width / 2, bottomAreaY + 45);

        // Date Subheading
        ctx.fillStyle = selectedColor === 'black' ? '#8b85a3' : '#7a728c';
        ctx.font = 'bold 15px "Montserrat", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText("16 JUNE 2026 • MY MIDNIGHT MOVIE ❤️", width / 2, bottomAreaY + 80);

        // D. Generate and trigger download link
        try {
          const finalDataUrl = offscreenCanvas.toDataURL('image/png');
          const tempLink = document.createElement('a');
          tempLink.href = finalDataUrl;
          tempLink.download = `sabrina_birthday_strip.png`;
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          
          cameraStatus.innerText = 'Unduhan berhasil! Membuka kuis berikutnya...';
          cameraDot.style.backgroundColor = '#4caf50';

          // Automatic progressive narrative unlock of Scene 8 (Sweet Quiz)
          setTimeout(() => {
            // Check if app.js functions are globally accessible or just trigger direct DOM manipulation
            const quizSection = document.getElementById('sweet-popup-quiz');
            if (quizSection) {
              quizSection.classList.remove('scene-locked');
              quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 2000);

        } catch (err) {
          console.error('Download error:', err);
          alert('Gagal mendownload foto strip.');
          cameraStatus.innerText = 'Gagal Mengunduh';
        }
      }
    });
  }

});
