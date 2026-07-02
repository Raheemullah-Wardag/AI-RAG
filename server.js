import express from 'express';
import usersRouter from './routes/users.js';
import conversationRouter from './routes/conversations.js';
import messagesRouter from './routes/messages.js';
import registerRouter from './routes/auth/register.js';
import loginRouter from './routes/auth/login.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 attempts per 15 minutes per IP
    message: { error: 'Too many attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
const app = express();
app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/users', conversationRouter);
app.use('/conversations', messagesRouter);
app.use('/auth', authLimiter);
app.use('/auth', registerRouter);
app.use('/auth', loginRouter,);
app.listen(8000, () => console.log('Server running on port 8000'));