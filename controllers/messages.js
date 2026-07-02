
import pool from "../db.js";
import { AppError } from "../utilities/AppError.js";

export const newMessage = async (req, res, next) => {
  const id = Number(req.params.conversation_id);

  try {
    const convResult = await pool.query(
      'SELECT user_id FROM conversations WHERE id = ($1)',
      [id]
    );

    if (convResult.rows.length === 0) {
      return next(new AppError('Conversation not found', 404));
    }

    if (req.user.id !== convResult.rows[0].user_id) {
      return next(new AppError('You are not allowed to chat here', 403));
    }

    const dbResult = await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [id, req.body.role, req.body.content]
    );

    return res.status(201).json({ message: 'Message created', messages: dbResult.rows[0] });
  } catch (err) {
    console.log(err);
    return next(new AppError('Database error', 500));
  }
};

export const getMessages = async (req, res, next) => {
  const conversation_id = Number(req.params.conversation_id);

  try {
    const user_id = await pool.query(
      'select user_id from conversations where id=($1)',
      [conversation_id]
    );

    if (user_id.rows.length === 0) {
      return next(new AppError('Conversation not found', 404));
    }

    if (req.user.id !== user_id.rows[0].user_id) {
      return next(new AppError('You are not allowed to read these messages', 403));
    }

    const dbResult = await pool.query(
      'SELECT id, role, content, created_at FROM messages WHERE conversation_id = $1',
      [conversation_id]
    );

    if (dbResult.rows.length === 0) {
      return next(new AppError('No Messages found', 404));
    }

    return res.status(200).json({ message: 'Messages Found', messages: dbResult.rows });
  } catch (err) {
    console.log(err);
    return next(new AppError('Database error', 500));
  }
};
