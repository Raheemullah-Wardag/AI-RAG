import bcrypt from 'bcrypt';
import pool from '../db.js';
import { loginSchema, registerSchema } from '../schemas/userSchema.js';
import { nameformatter } from '../utilities/nameformatter.js';
import jwt from 'jsonwebtoken';
export const login =async (req,res)=>{
    const result =loginSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({errors:result.error.issues});
    }
    try{
        const dbResult=await pool.query(
            'Select id,password_hash from users where email =($1)',
            [result.data.email]

        )
        if(dbResult.rows.length===0){
            return res.status(401).json({message: "Invalid Email or Password Try Again"})
        }
        const compare =await bcrypt.compare(result.data.password,dbResult.rows[0].password_hash);
        if(!compare){
             return res.status(401).json({message: "Invalid Email or Password Try Again"})
        }
       
        const loginToken= jwt.sign({id:dbResult.rows[0].id},process.env.JWT_SECRET,{expiresIn:'1h'})
        res.status(200).json({message:"User Loged In",authToken :loginToken});
    }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
}
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


};