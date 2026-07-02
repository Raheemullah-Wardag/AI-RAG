import bcrypt from 'bcrypt';
import pool from '../db.js';
import { loginSchema, registerSchema } from '../schemas/userSchema.js';
import { nameformatter } from '../utilities/nameformatter.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../utilities/AppError.js';
export const login = async (req, res, next) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return next(new AppError('Invalid login data', 400));
    }

    try {
        const dbResult = await pool.query(
            'Select id,password_hash from users where email =($1)',
            [result.data.email]
        );

        if (dbResult.rows.length === 0) {
            return next(new AppError('Invalid Email or Password Try Again', 401));
        }

        const compare = await bcrypt.compare(result.data.password, dbResult.rows[0].password_hash);
        if (!compare) {
            return next(new AppError('Invalid Email or Password Try Again', 401));
        }

        const loginToken = jwt.sign({ id: dbResult.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'User Loged In', authToken: loginToken });
    } catch (err) {
        console.error(err);
        next(new AppError('Database error', 500));
    }
};
export const register = async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return next(new AppError('Invalid registration data', 400));
  }

  const formattedName = nameformatter(result.data.name);
  const password_hash = await bcrypt.hash(result.data.password, 12);

  try {
    const dbResult = await pool.query(
      'insert into users(name,email,password_hash) values ($1,$2,$3) returning *',
      [formattedName, result.data.email, password_hash]
    );

    const { password_hash: _, ...safeUser } = dbResult.rows[0];
    return res.status(201).json({ message: 'User registered', user: safeUser });
  } catch (err) {
    console.log(err);
    return next(new AppError('Database error', 500));
  }
};