import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET

app.use(cors());
app.use(express.json());

// In-memory storage for users (not suitable for production)
const users = [];
const roles = ['user', 'manager', 'admin'];

const createAdminUser = async () => {
  const existingAdmin = users.find(u => u.email === 'admin@gmail.com');
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Aa12345678@', 10);
    const adminUser = { id: 1, name: 'Admin', email: 'admin@gmail.com', password: hashedPassword, role: 'admin' };
    users.push(adminUser);
  }
};

createAdminUser();

app.post('/api/auth', async (req, res) => {
  const { isLogin, email, password, name } = req.body;

  if (isLogin) {
    const user = users.find(u => u.email === email);
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } else {
    if (users.some(u => u.email === email)) {
      res.status(400).json({ success: false, message: 'Email already in use' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id: users.length + 1, name, email, password: hashedPassword, role: 'user' };
      users.push(newUser);
      const token = jwt.sign({ userId: newUser.id, role: "user" }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
    }
  }
});

app.get('/api/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    res.json({ success: true, user });
  });
});

app.get('/api/get_users', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required' });
  }
  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    const userId = decodedUser.userId;
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (decodedUser.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const filteredUsers = users.filter(u => u.id !== 1).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role
    }));

    res.json({ success: true, users: filteredUsers });
  });
});

app.get('/api/get_role', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    const userRole = users.find(u => u.id === user.userId).role;
    res.json({ success: true, role: userRole });
  });
});

app.post('/api/update_role', (req, res) => {
  const { role, userId } = req.body;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }

    if (!roles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const userIndex = users.findIndex(u => u.id === user.userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    users[userId-1].role = role;
    res.json({ success: true, message: 'Role updated successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});