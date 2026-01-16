import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Make io available in routes
app.set('io', io);

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

// Adding '0.0.0.0' is the key fix
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
