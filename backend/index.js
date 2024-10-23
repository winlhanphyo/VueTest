const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // <-- Import cors
const app = express();
const port = 3000;

app.use(cors()); // <-- Enable cors globally
app.use(express.json());

// Initialize SQLite database
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');

  db.run(`CREATE TABLE game_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id TEXT,
            total_bet INTEGER,
            winnings INTEGER,
            date TEXT
          )`);

  db.run(`CREATE TABLE leaderboard (
            player_id TEXT PRIMARY KEY,
            total_winnings INTEGER
          )`);

  db.run(`CREATE TABLE user (
            player_id TEXT PRIMARY KEY,
            balance REAL
          )`);
});

// Endpoint to store game history
app.post('/api/spin', (req, res) => {
  const { playerId, totalBet, winnings, userBalance } = req.body;
  const balance = userBalance;

  const date = new Date().toISOString();
  db.run(`INSERT INTO game_history (player_id, total_bet, winnings, date) VALUES (?, ?, ?, ?)`,
    [playerId, totalBet, winnings, date], function(err) {
      if (err) {
        return console.error(err.message);
      }
      res.json({ message: 'Spin recorded successfully!', id: this.lastID });
    });

  // Update leaderboard
  db.run(`INSERT INTO leaderboard (player_id, total_winnings)
          VALUES (?, ?) ON CONFLICT(player_id) DO UPDATE SET total_winnings = total_winnings + ?`,
    [playerId, winnings, winnings], (err) => {
      if (err) {
        return console.error(err.message);
      }
    });

    db.run(
      `INSERT INTO user (player_id, balance)
       VALUES (?, ?) 
       ON CONFLICT(player_id) DO UPDATE 
       SET balance = balance + ?`,
      [playerId, balance, balance], // Add balance again for the conflict update
      (err) => {
        if (err) {
          return console.error(err.message);
        }
      }
    );

});

// Endpoint to get leaderboard
app.get('/api/leaderboard', (req, res) => {
  db.all(`SELECT * FROM leaderboard ORDER BY total_winnings DESC LIMIT 10`, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});

// Endpoint to get user
app.get('/api/user/:id', (req, res) => {
  const player_id = req.params.id;
  console.log("playerid", player_id);

  db.all(`SELECT * FROM user WHERE player_id = ?`, [player_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    if (rows.length > 0) {
      res.json(rows[0]);
    }
    res.json([]);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
