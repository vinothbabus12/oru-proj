const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ ok: false, message: 'Missing fields' });

  // Demo authentication: accept password === 'password'
  if (password === 'password') {
    return res.json({ ok: true, token: 'demo-token', message: 'Login successful' });
  }

  return res.status(401).json({ ok: false, message: 'Invalid credentials' });
});

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
