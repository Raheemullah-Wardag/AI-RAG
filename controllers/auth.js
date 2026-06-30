import bcrypt from 'bcrypt';
import pool from '../db.js';
import { registerSchema } from '../schemas/userSchema.js';
import { nameformatter } from '../utilities/nameformatter.js';

export const register = async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }
  const formattedName = nameformatter(result.data.name)
  const  password_hash = await bcrypt.hash(result.data.password,12);
  try {
    const dbResult =await pool.query(
        'insert into users(name,email,password_hash) values ($1,$2,$3) returning *',
        [formattedName,result.data.email,password_hash]
    )
    const { password_hash: _, ...safeUser } = dbResult.rows[0];
return res.status(201).json({ message: "User registered", user: safeUser });
   
  }catch (err){
    console.log(err);
    return res.status(500).json({error:"DataBase Error"})

  }

  // 1. hash the password using bcrypt.hash(plainPassword, saltRounds)
  // 2. insert into users: name, email, password_hash
  // 3. respond with 201 and the created user — but DO NOT include password_hash in the response
  // 4. wrap in try/catch, same pattern as always
};