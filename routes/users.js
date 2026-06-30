import express from 'express';
import { createUser, findUser, editUserWhole, editUser, deleteuser } from '../controllers/users.js';

const router = express.Router();
router.patch('/:id',editUser);
router.put('/:id',editUserWhole);
router.get('/:id',findUser);
router.delete('/:id',deleteuser);

router.post('/', createUser);

export default router;
