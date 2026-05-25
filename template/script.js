document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('loginForm');
  const idEl = document.getElementById('identifier');
  const pwEl = document.getElementById('password');
  const toggle = document.getElementById('togglePw');
  const msg = document.getElementById('msg');

  toggle.addEventListener('click', ()=>{
    const isPw = pwEl.type === 'password';
    pwEl.type = isPw ? 'text' : 'password';
    toggle.textContent = isPw ? 'Hide' : 'Show';
  });

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'msg';

    const identifier = idEl.value.trim();
    const password = pwEl.value;

    if(!identifier){
      showError('Enter email or phone');
      return;
    }
    if(password.length < 6){
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json().catch(()=>({ ok:false, message: 'Invalid server response' }));
      if(res.ok && data.ok){
        // persist a simple user id (identifier) for demo history
        try{ localStorage.setItem('userId', identifier); }catch(e){}
        showSuccess(data.message || 'Login successful — redirecting...');
        setTimeout(()=> location.href = 'search.html', 800);
      } else {
        showError(data.message || 'Invalid credentials');
      }
    } catch(err){
      // fallback to demo behaviour when server isn't available
      if(password === 'password'){
        try{ localStorage.setItem('userId', identifier); }catch(e){}
        showSuccess('Login successful (demo) — redirecting...');
        setTimeout(()=> location.href = 'search.html', 800);
      } else {
        showError('Network error or invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading){
    const btn = document.getElementById('submitBtn');
    btn.disabled = loading;
    btn.textContent = loading ? 'Signing in...' : 'Sign in';
  }
  function showError(s){ msg.textContent = s; msg.classList.add('error'); }
  function showSuccess(s){ msg.textContent = s; msg.classList.add('success'); }
});
