import { Server as SocketIoServer } from 'socket.io';
import Message from './models/messageModel.js';

const setupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User disconnected: ${userId}`);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
       
        try {
            console.log('Message received on server:', message); // Add this line
            const senderSocketId = userSocketMap.get(message.sender);
            const recipientSocketId = userSocketMap.get(message.recipient);
            console.log("socket.js:30",senderSocketId,recipientSocketId)

            // Create message in the database
            const createdMessage = await Message.create(message);
            console.log(createdMessage)
            const messageData = await Message.findById(createdMessage.id)
                .populate("sender", "id email firstName lastName")
                .populate("recipient", "id email firstName lastName");

            // Emit message to the recipient

            // io.to(recipientSocketId).emit("receiveMessage",messageData)
            if (recipientSocketId) {
                console.log(`Sending message to recipient: ${recipientSocketId}`);
                io.to(recipientSocketId).emit("receiveMessage", messageData);
            } else {
                console.log('Recipient is not connected');
            }
            // io.to(senderSocketId).emit("receiveMessage", messageData);

            // Optionally emit to the sender as well
            if (senderSocketId) {
                console.log(`Sending message to sender: ${senderSocketId}`);
                io.to(senderSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        console.log("socket.js line:57",userId)

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId}`);
        } else {
            console.log('User ID not provided during connection');
        }

        socket.on("sendMessage", (message) => {
            console.log("Message received on server:", message); // Add this line
            sendMessage(message); // Ensure this line is correct
          });
        
        socket.on('disconnect', () => disconnect(socket));
    });
};

export default setupSocket;
