
import pool from "../db.js";
export const newMessage = async (req,res)=>{
   const id=  Number(req.params.conversation_id);
   try{
    const dbResult=await pool.query(
        'Insert into messages(conversation_id,role,content) values ($1,$2,$3) returning *',
        [id,req.body.role,req.body.content]
    )
   return res.status(201).json ({message :"New Chat Started",messages: dbResult.rows[0]});
    }
catch (err){
    console.log(err);
    return res.status(500).json({message :"DataBase error"});
}
}

export const getMessages =async(req,res)=>{
    const conversation_id =Number(req.params.conversation_id)
         try{
    const dbResult=await pool.query(
        'SELECT id, role, content, created_at FROM messages WHERE conversation_id = $1',
        [   conversation_id]
    )
    if (dbResult.rows.length === 0) {
        return res.status(404).json({ error: 'No Messages found' });
      }
   return res.status(200).json ({message :"Message Found",messages: dbResult.rows});
    }
catch (err){
    console.log(err);
    return res.status(500).json({message :"DataBase error"});
}
}