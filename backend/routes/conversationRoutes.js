import express from 'express';
import { getUserConversations, createConversation, deleteConversation } from '../controllers/conversationController.js';
import protectUser from '../middleware/protectUser.js';
import { Router } from 'express';
const router = Router();

router.get('/get/:userId',  getUserConversations);
router.post('/getConversation',  createConversation);
router.delete('/delete/:conversationId', deleteConversation);
export default router;