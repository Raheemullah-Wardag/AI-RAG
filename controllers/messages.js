
import pool from "../db.js";
export const newMessage = async (req, res) => {
  const id = Number(req.params.conversation_id);

  try {
    // Step 1: look up who owns this conversation
    const convResult = await pool.query(
      'SELECT user_id FROM conversations WHERE id = ($1)',
      [id]
    );

    // Step 2: conversation doesn't exist at all
    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Step 3: ownership check — compare token's user id to conversation's owner
    if (req.user.id !== convResult.rows[0].user_id) {
      return res.status(403).json({ error: 'You are not allowed to chat here' });
    }

    // Step 4: ownership confirmed, now insert the message
    const dbResult = await pool.query(
      'INSERT INTO messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [id, req.body.role, req.body.content]
    );

    return res.status(201).json({ message: 'Message created', messages: dbResult.rows[0] });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Database error' });
  }
};

export const getMessages =async(req,res)=>{
    const conversation_id =Number(req.params.conversation_id)
    
 
    try{
    const user_id = await pool.query(
        'select user_id from conversations where  id=($1)',[conversation_id]

    ) 
    
     if (user_id.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
   
  if (req.user.id !== user_id.rows[0].user_id) {
    return res.status(403).json({ error: 'You are not allowed to read these messages' });
  }
    const dbResult=await pool.query(
        'SELECT id, role, content, created_at FROM messages WHERE conversation_id = $1',
        [   conversation_id]
    )
    if (dbResult.rows.length === 0) {
        return res.status(404).json({ error: 'No Messages found' });
      }
   return res.status(200).json ({message :"Messages Found",messages: dbResult.rows});
    }
catch (err){
    console.log(err);
    return res.status(500).json({message :"DataBase error"});
}
}
