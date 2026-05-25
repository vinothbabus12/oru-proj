document.addEventListener('DOMContentLoaded', ()=>{
  const openBtn = document.getElementById('openQr');
  const modal = document.getElementById('qrModal');
  const close = document.getElementById('qrClose');
  const scan = document.getElementById('qrScan');
  const startBtn = document.getElementById('qrStart');
  const stopBtn = document.getElementById('qrStop');
  const scannerEl = document.getElementById('qrScanner');
  let html5QrcodeScanner = null;

  if(!modal) return;

  openBtn && openBtn.addEventListener('click', ()=> modal.classList.add('open'));
  close && close.addEventListener('click', ()=> modal.classList.remove('open'));

  // Start camera-based QR scanning using Html5Qrcode if available
  async function startCamera(){
    if(!window.Html5Qrcode){
      scannerEl.textContent = 'Camera scanner not available';
      return;
    }
    const id = 'qrScanner';
    html5QrcodeScanner = new Html5Qrcode(id);
    try{
      const devices = await Html5Qrcode.getCameras();
      const cameraId = devices && devices.length ? devices[0].id : null;
      if(!cameraId){ scannerEl.textContent = 'No camera found'; return; }
      await html5QrcodeScanner.start(cameraId, { fps: 10, qrbox: 250 }, (decoded) => {
        // decoded text received
        // finalize booking once a QR code is scanned
        try{ if(window.finalizeBooking) window.finalizeBooking(); }catch(e){}
        stopCamera();
        modal.classList.remove('open');
      }, (err)=>{
        // ignore scan errors
      });
    }catch(err){ scannerEl.textContent = 'Camera access denied or error'; }
  }

  function stopCamera(){
    if(html5QrcodeScanner){
      html5QrcodeScanner.stop().then(()=>{
        html5QrcodeScanner.clear();
        html5QrcodeScanner = null;
      }).catch(()=>{ html5QrcodeScanner = null; });
    }
  }

  startBtn && startBtn.addEventListener('click', startCamera);
  stopBtn && stopBtn.addEventListener('click', ()=>{ stopCamera(); });

  scan && scan.addEventListener('click', ()=>{
    // simulate scan delay as a fallback
    scan.disabled = true;
    scan.textContent = 'Scanning...';
    setTimeout(()=>{
      scan.textContent = 'Scanned';
      try{ if(window.finalizeBooking) window.finalizeBooking(); }
      catch(e){
        const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo') || 'null');
        if(bookingInfo){
          try{ const userId = localStorage.getItem('userId') || 'guest'; const key = 'bookings_' + userId; const list = JSON.parse(localStorage.getItem(key) || '[]'); list.push(bookingInfo); localStorage.setItem(key, JSON.stringify(list)); }catch(e){}
          setTimeout(()=> location.href = 'confirm.html', 400);
        }
      }
    }, 900);
  });
});
