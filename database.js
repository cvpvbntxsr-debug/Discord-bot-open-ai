import Database from 'better-sqlite3';

// Initialize SQLite database
const db = new Database('conversations.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_user_id ON conversations(user_id);
  CREATE INDEX IF NOT EXISTS idx_timestamp ON conversations(timestamp);
`);

// Save a message to the database
export function saveMessage(userId, role, content) {
  const stmt = db.prepare('INSERT INTO conversations (user_id, role, content) VALUES (?, ?, ?)');
  stmt.run(userId, role, content);
}

// Get conversation history for a user (last N messages)
export function getConversationHistory(userId, limit = 10) {
  const stmt = db.prepare(`
    SELECT role, content
    FROM conversations
    WHERE user_id = ?
    ORDER BY timestamp DESC
    LIMIT ?
  `);

  const messages = stmt.all(userId, limit);
  // Reverse to get chronological order (oldest first)
  return messages.reverse();
}

// Get all messages for a user (for export/analysis)
export function getAllUserMessages(userId) {
  const stmt = db.prepare(`
    SELECT role, content, timestamp
    FROM conversations
    WHERE user_id = ?
    ORDER BY timestamp ASC
  `);

  return stmt.all(userId);
}

// Clear conversation history for a user
export function clearUserHistory(userId) {
  const stmt = db.prepare('DELETE FROM conversations WHERE user_id = ?');
  stmt.run(userId);
}

// Get total message count
export function getTotalMessages() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM conversations');
  return stmt.get().count;
}

// Get unique user count
export function getUniqueUserCount() {
  const stmt = db.prepare('SELECT COUNT(DISTINCT user_id) as count FROM conversations');
  return stmt.get().count;
}

// Close database connection (call on bot shutdown)
export function closeDatabase() {
  db.close();
}

console.log('✅ Database initialized: conversations.db');
