import express from 'express';
import { getLeads, addLead, updateLead, deleteLead } from '../controllers/leadController.js';
import { authenticateToken } from '../middlewares/auth.js';
const router = express.Router();

// Define the routes for lead management
router.get('/lead', authenticateToken, getLeads); // Get all leads
router.post('/lead', addLead); // Create a new lead
router.put('/lead/:id',authenticateToken, updateLead); // Update a lead by ID
router.delete('/lead/:id',authenticateToken, deleteLead); // Delete a lead by ID
export default router;