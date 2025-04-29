const express = require('express');
const router = express.Router();
const appliedJobController = require('../controllers/appliedJobsController');

/**
 * @swagger
 * /applied-jobs/:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applied Jobs]
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
 *               additionalAnswers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Application successful
 *       400:
 *         description: Bad request
 */
router.post('/', appliedJobController.applyForJob);

/**
 * @swagger
 * /applied-jobs/{jobId}:
 *   get:
 *     summary: Get all applicants for a specific job
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: List of applicants
 *       404:
 *         description: No applicants found
 */
router.get('/:jobId', appliedJobController.getAllAppliedJobs);

/**
 * @swagger
 * /applied-jobs/get/{userId}:
 *   get:
 *     summary: Get all applied jobs by a job seeker
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of applied jobs
 *       404:
 *         description: No applications found
 */
router.get('/get/:userId', appliedJobController.getAllAppliedJobsByJobSeeker);

/**
 * @swagger
 * /applied-jobs/{applicationId}:
 *   delete:
 *     summary: Delete an application by ID
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted
 *       404:
 *         description: Application not found
 */
router.delete('/:applicationId', appliedJobController.deleteAppliedJob);

/**
 * @swagger
 * /applied-jobs/count/{jobId}:
 *   get:
 *     summary: Get the number of applicants for a job
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Number of applicants
 *       404:
 *         description: No applicants found
 */
router.get('/count/:jobId', appliedJobController.getCountByUser);

/**
 * @swagger
 * /applied-jobs/counts/{userId}:
 *   get:
 *     summary: Get the number of applications by a user
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Number of applications
 *       404:
 *         description: No applications found
 */
router.get('/counts/:userId', appliedJobController.countAppliedJobsByUser);

/**
 * @swagger
 * /applied-jobs/get/{jobId}/{userId}:
 *   get:
 *     summary: Get application ID by job and user
 *     tags: [Applied Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application found
 *       404:
 *         description: Application not found
 */
router.get("/get/:jobId/:userId", appliedJobController.getApplicantId);

/**
 * @swagger
 * /applied-jobs/update-status:
 *   put:
 *     summary: Update application status and notify the user
 *     tags: [Applied Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated
 *       400:
 *         description: Bad request
 */
router.put("/update-status", appliedJobController.updateApplicationStatusAndNotify);

module.exports = router;
