import express from 'express';
import usersRouter from './routes/users.js';
import conversationRouter from './routes/conversations.js';
import messagesRouter from './routes/messages.js';
import authRouter from './routes/auth/register.js';

const app = express();
app.use(express.json());
app.use('/users', usersRouter);
app.use('/users', conversationRouter);
app.use('/conversations', messagesRouter);
app.use('/auth', authRouter);
app.listen(8000, () => console.log('Server running on port 8000'));