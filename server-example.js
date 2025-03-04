const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'host',
  user: 'user',
  password: 'password',
  database: 'database',
  charset: 'utf8mb4'
});

app.post('/api/add-todo', (req, res) => {
  const { user_id, title, description } = req.body;
  if (!user_id || !title) {
    return res.status(400).json({ success: false, error: "user_id ve title alanları gereklidir." });
  }
  const query = "INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)";
  pool.query(query, [user_id, title, description], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, todo_id: results.insertId });
  });
});

app.post('/api/edit-todo', (req, res) => {
  const { id, user_id, title, description, is_completed } = req.body;
  if (!id || !user_id) {
    return res.status(400).json({ success: false, error: "Hesap Sorunu!" });
  }
  const query = "UPDATE todos SET title = ?, description = ?, is_completed = ? WHERE id = ? AND user_id = ?";
  pool.query(query, [title, description, is_completed, id, user_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Belirtilen Todo Bulunamadı." });
    }
    res.json({ success: true });
  });
});

app.post('/api/delete-todo', (req, res) => {
  const { id, user_id } = req.body;
  if (!id || !user_id) {
    return res.status(400).json({ success: false, error: "Hesap Sorunu!" });
  }
  const query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
  pool.query(query, [id, user_id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Belirtilen Todo Bulunamadı." });
    }
    res.json({ success: true });
  });
});

app.post('/api/newuser', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Lütfen formu eksiksiz doldurunuz."
    });
  }
  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  pool.query(query, [username, email, password], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          error: "Bu kullanıcı adı veya e-posta ile zaten kayıtlı bir kullanıcı mevcut."
        });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, user_id: results.insertId });
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
app.post('/api/userlogin', (req, res) => {
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
      return res.status(401).json({
        success: false,
        error: "Geçersiz e-posta veya şifre."
      });
    }
    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Geçersiz e-posta veya şifre."
      });
    }
    res.json({ success: true, user });
  });
});
app.post('/api/list-todo', (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ success: false, error: "user_id gereklidir." });
    }
    const query = "SELECT * FROM todos WHERE user_id = ? ORDER BY date ASC";
    pool.query(query, [user_id], (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      return res.json({ success: true, todos: results });
    });
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda dinleniyor.`);
});