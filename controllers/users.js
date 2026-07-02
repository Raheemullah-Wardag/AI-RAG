import { email } from 'zod';
import pool from '../db.js';
import { updateUserSchema, userSchema } from '../schemas/userSchema.js';
import { nameformatter } from '../utilities/nameformatter.js';
import { AppError } from '../utilities/AppError.js';


export const  editUserWhole = async (req,res,next)=>{
    const result = userSchema.safeParse(req.body);
    if(!result.success){
        return next(new AppError(result.error.issues, 400));

    }
    const id=Number(req.params.id);
    const name = nameformatter(result.data.name);
    try {
        const dbResult= await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, result.data.email, id]
        );

        if (dbResult.rows.length === 0) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({ message: 'User Overwritten', user: dbResult.rows[0] });
    } catch (err){
        console.error(err);
        next(new AppError('Database error', 500));
    }
}
export const editUser=async(req,res,next)=>{
  const result =updateUserSchema.safeParse(req.body);
  const id = Number(req.params.id);
  
  if (!result.success) {
    return next(new AppError(result.error.issues, 400));
  }
  
  const fields = [];
  const values = [];
  let paramIndex = 1;
  
  if (result.data.name !== undefined) {
    fields.push(`name = $${paramIndex}`);
    values.push(result.data.name);
    paramIndex++;
  }
  
  if (result.data.email !== undefined) {
    fields.push(`email = $${paramIndex}`);
    values.push(result.data.email);
    paramIndex++;
  }
  
  if (fields.length === 0) {
    return next(new AppError('No fields provided to update', 400));
  }
  
  values.push(id);
  
  try {
    const dbResult = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (dbResult.rows.length === 0) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({ message: 'User updated', user: dbResult.rows[0] });
  } catch (err) {
    console.error(err);
    next(new AppError('Database error', 500));
  }
}
  export const deleteuser= async(req,res,next )=>{
  
    const id = Number(req.params.id);
    
    try {
      const dbResult = await pool.query(
        `delete from users where id =($1) returning *` ,
        [ id]
      );
      
      if (dbResult.rows.length===0){
        return next(new AppError('User does not exists', 404));
      }

      res.status(200).json({ message: 'User Deleted', user: dbResult.rows[0]});
    } catch (err) {
      console.error(err);
      next(new AppError('Database error', 500));
    }
}
export const findUser = async(req,res,next)=>{
  const id = Number (req.params.id);
  try {
    const dbResult = await pool.query(
      'Select * from users where id =($1)',
     [id]
    );
    if (dbResult.rows.length===0){
      return next(new AppError('User not found', 404));
    }
    res.status(200).json({ message: 'User found', user: dbResult.rows[0] });
  } catch (err) {
    console.error(err);
    next(new AppError('Database error', 500));
  }
 
}


export const createUser = async (req, res, next) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return next(new AppError('Invalid user data', 400));
  }

  const name = nameformatter(result.data.name)
  try {
    const dbResult = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name , result.data.email]
    );

    res.status(201).json({ message: 'User created', user: dbResult.rows[0] });
  } catch (err) {
    console.error(err);
    next(new AppError('Database error', 500));
  }
};