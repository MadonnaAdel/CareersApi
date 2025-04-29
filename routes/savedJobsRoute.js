const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobsController');

/**
 * @swagger
 * /savedJobs/{userId}:
 *   get:
 *     summary: Get all saved jobs by a user
 *     tags: [Saved Jobs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of saved jobs
 *       404:
 *         description: No saved jobs found
 */
router.get('/:userId', savedJobController.getSavedJobs);

/**
 * @swagger
 * /savedJobs/{savedJobId}:
 *   delete:
 *     summary: Delete a saved job by ID
 *     tags: [Saved Jobs]
 *     parameters:
 *       - in: path
 *         name: savedJobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Saved Job ID
 *     responses:
 *       200:
 *         description: Saved job deleted
 *       404:
 *         description: Saved job not found
 */
router.delete('/:savedJobId', savedJobController.deleteSavedJob);

/**
 * @swagger
 * /savedJobs/:
 *   post:
 *     summary: Save a job
 *     tags: [Saved Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               jobId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job saved successfully
 *       400:
 *         description: Bad request
 */
router.post('/', savedJobController.saveJob);

/**
 * @swagger
 * /savedJobs/count/{userId}:
 *   get:
 *     summary: Get the number of saved jobs by a user
 *     tags: [Saved Jobs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Number of saved jobs
 *       404:
 *         description: No saved jobs found
 */
router.get('/count/:userId', savedJobController.countSavedJobsByUser);

module.exports = router;
