const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const pool = mysql.createPool({
  host: '162.19.143.0',
  user: 'yefeblg2_efe',
  password: 'qazxsw123efe',
  database: 'yefeblg2_todoapp',
  charset: 'utf8mb4'
});

// Yeni kullanıcı kaydı
app.post('/api/newuser', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'username, email ve password gereklidir.' });
  }
  const query = `
    INSERT INTO users (username, email, password, created_at, updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
  `;
  pool.query(query, [username, email, password], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'Bu email zaten kullanılıyor.' });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.json({ success: true, user_id: results.insertId });
  });
});

// Kullanıcı girişi
app.post('/api/userlogin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'email ve password gereklidir.' });
  }
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  pool.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Geçersiz email veya şifre.' });
    }
    return res.json({ success: true, user: results[0] });
  });
});

// Todo ekleme
app.post('/api/add-todo', (req, res) => {
  const { user_id, title, description, date } = req.body;
  if (!user_id || !title || !date) {
    return res.status(400).json({
      success: false,
      error: 'user_id, title ve date (due_date) alanları gereklidir.'
    });
  }
  const query = `
    INSERT INTO todos (user_id, title, description, due_date, is_completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, 0, NOW(), NOW())
  `;
  pool.query(query, [user_id, title, description, date], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.json({ success: true, todo_id: results.insertId });
  });
});

// Todo listeleme
app.post('/api/list-todo', (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ success: false, error: 'user_id gereklidir.' });
  }
  const query = 'SELECT * FROM todos WHERE user_id = ? ORDER BY due_date ASC';
  pool.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.json({ success: true, todos: results });
  });
});

// Todo düzenleme
app.post('/api/edit-todo', (req, res) => {
  const { id, user_id, title, description, is_completed, date } = req.body;
  if (!id || !user_id) {
    return res.status(400).json({ success: false, error: 'id ve user_id gereklidir.' });
  }
  const query = `
    UPDATE todos
    SET title = ?, description = ?, is_completed = ?, due_date = ?, updated_at = NOW()
    WHERE id = ? AND user_id = ?
  `;
  pool.query(query, [title, description, is_completed, date, id, user_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Belirtilen todo bulunamadı.' });
    }
    return res.json({ success: true });
  });
});

// Todo silme
app.post('/api/delete-todo', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, error: 'id gereklidir.' });
  }
  const query = 'DELETE FROM todos WHERE id = ?';
  pool.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Belirtilen todo bulunamadı.' });
    }
    return res.json({ success: true });
  });
});
app.post('/api/delete-account', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "E-posta ve şifre gereklidir."
    });
  }
  
  const query = "SELECT * FROM users WHERE email = ?";
  pool.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: "Kullanıcı bulunamadı." });
    }
    
    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: "Geçersiz şifre." });
    }
    
    const deleteQuery = "DELETE FROM users WHERE email = ?";
    pool.query(deleteQuery, [email], (err, deleteResults) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      return res.json({ success: true });
    });
  });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda dinliyor...`);
});
