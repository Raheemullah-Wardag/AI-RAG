import express from 'express';
import { getMessages, newMessage } from '../controllers/messages.js';

const router = express.Router();
router.post('/:conversation_id/messages', newMessage);
router.get('/:conversation_id/messages', getMessages);
export default router ;
