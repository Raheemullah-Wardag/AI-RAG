import pool from "../db.js";
export const newConversation = async (req,res)=>{
   const id=  Number(req.params.id);
   try{
    const dbResult=await pool.query(
        'Insert into conversations(user_id) values ($1) returning *',
        [id]
    )
   return res.status(201).json ({message :"New Conversation Started",conversation: dbResult.rows[0]});
    }
catch (err){
    console.log(err);
    return res.status(500).json({message :"DataBase error"});
}
}

export const getConversation =async(req,res)=>{
    const id =Number(req.params.id);
     try{
    const dbResult=await pool.query(
        'Select  *  from conversations where user_id = ($1)',
        [id]
    )
    if (dbResult.rows.length === 0) {
        return res.status(404).json({ error: 'No Conversation for this User found' });
      }
   return res.status(200).json ({message :"Conversation Found",conversation: dbResult.rows});
    }
catch (err){
    console.log(err);
    return res.status(404).json({message :"DataBase error"});
}
}