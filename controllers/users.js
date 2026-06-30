import { email } from 'zod';
import pool from '../db.js';
import { updateUserSchema, userSchema } from '../schemas/userSchema.js';
import { nameformatter } from '../utilities/nameformatter.js';
export const  editUserWhole = async (req,res)=>{
    const result = userSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json ({error : result.error.issues})

    }
    const id=Number(req.params.id);
 const name = nameformatter(result.data.name)
try {
    const dbResult= await pool.query(
   ' UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *'    ,
   [name ,result.data.email,id]

    )
   res.status(200).json({ message: 'User Overwritten' });
  }catch (err){
   console.error(err);
    res.status(500).json({ error: 'Database error' });
    }
}
export const editUser=async(req,res)=>{
  const result =updateUserSchema.safeParse(req.body);
 const id = Number(req.params.id);
  
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
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
      return res.status(400).json({ error: 'No fields provided to update' });
    }
  
    values.push(id);
  
    try {
      const dbResult = await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );
  
      if (dbResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated', user: dbResult.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  }
  export const deleteuser= async(req,res)=>{
  
    const id = Number(req.params.id);
    
    try {
      const dbResult = await pool.query(
        `delete from users where id =($1) returning *` ,
        [ id]
      );
      
      if (dbResult.rows.length===0){
      return res.status(404).json({ message: 'User does not exists', user: dbResult.rows[0]})
    }
      res.status(200).json({ message: 'User Deleted', user: dbResult.rows[0]});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
  
  }
}
export const findUser = async(req,res)=>{
  const id = Number (req.params.id);
  try {
    const dbResult = await pool.query(
      'Select * from users where id =($1)',
     [id]
    );
  if (dbResult.rows.length===0){
      return res.status(404).json({ message: 'User does not exists', user: dbResult.rows[0]})
    }
    res.status(200).json({ message: 'User found', user: dbResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
 
}


export const createUser = async (req, res) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
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
    res.status(500).json({ error: 'Database error' });
  }
};