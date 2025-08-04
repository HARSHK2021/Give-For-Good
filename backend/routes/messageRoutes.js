import express from 'express';
import { getMessages } from '../controllers/messageController.js';

import { Router } from 'express';
const router = Router();
router.get('/:conversationId', getMessages);

export default router;
