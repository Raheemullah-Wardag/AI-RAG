import pool from "../db.js";
import { AppError } from "../utilities/AppError.js";

export const newConversation = async (req, res, next) => {
  const id = Number(req.params.id);

  if (req.user.id !== id) {
    return next(new AppError('You are not allowed to create conversation here', 403));
  }

  try {
    const dbResult = await pool.query(
      'Insert into conversations(user_id) values ($1) returning *',
      [id]
    );

    return res.status(201).json({ message: 'New Conversation Started', conversation: dbResult.rows[0] });
  } catch (err) {
    console.log(err);
    return next(new AppError('Database error', 500));
  }
};

export const getConversation = async (req, res, next) => {
  const id = Number(req.params.id);

  if (req.user.id !== id) {
    return next(new AppError('You are not allowed to access this resource', 403));
  }

  try {
    const dbResult = await pool.query(
      'Select * from conversations where user_id = ($1)',
      [id]
    );

    if (dbResult.rows.length === 0) {
      return next(new AppError('No Conversation for this User found', 404));
    }

    return res.status(200).json({ message: 'Conversation Found', conversation: dbResult.rows });
  } catch (err) {
    console.log(err);
    return next(new AppError('Database error', 500));
  }
};