import express from 'express';
import { getMessages, newMessage } from '../controllers/messages.js';

const router = express.Router();
/**
 * @swagger
 * /conversations/{conversation_id}/messages:
 *   post:
 *     summary: Send a new message in a conversation
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: user
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created
 *       500:
 *         description: Database error
 */
router.post('/:conversation_id/messages', newMessage);

/**
 * @swagger
 * /conversations/{conversation_id}/messages:
 *   get:
 *     summary: Get all messages in a conversation
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Messages found
 *       404:
 *         description: No messages found for this conversation
 */
router.get('/:conversation_id/messages', getMessages);
export default router ;
