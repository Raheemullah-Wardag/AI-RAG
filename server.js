import express from 'express';
import usersRouter from './routes/users.js';
import conversationRouter from './routes/conversations.js';
import messagesRouter from './routes/messages.js';
import registerRouter from './routes/auth/register.js';
import loginRouter from './routes/auth/login.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/users', conversationRouter);
app.use('/conversations', messagesRouter);
app.use('/auth', registerRouter);
app.use('/auth', loginRouter);
app.listen(8000, () => console.log('Server running on port 8000'));