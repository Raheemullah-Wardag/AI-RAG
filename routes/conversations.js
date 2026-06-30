import express from 'express';
import { getConversation, newConversation } from '../controllers/conversations.js';
const router = express.Router();
router.post('/:id/conversations', newConversation);
router.get('/:id/conversations', getConversation);
export default  router;