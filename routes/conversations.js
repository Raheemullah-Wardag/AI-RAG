import express from 'express';
import { getConversation, newConversation } from '../controllers/conversations.js';
import { requireAuth } from '../middelware/auth.js';
const router = express.Router();
/**
 * @swagger
 * /users/{id}/conversations:
 *   post:
 *     summary: Start a new conversation for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Conversation created
 *       500:
 *         description: Database error
 */
router.post('/:id/conversations',requireAuth, newConversation);

/**
 * @swagger
 * /users/{id}/conversations:
 *   get:
 *     summary: Get all conversations (with messages) for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conversations found
 *       404:
 *         description: No conversations found for this user
 */
router.get('/:id/conversations',requireAuth, getConversation);
export default  router;