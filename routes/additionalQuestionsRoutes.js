const express = require("express");
const router = express.Router();
const {
  addJobForm,
  updateJobForm,
  deleteJobForm,
  getJobForm,
  getFormByJobId,
} = require("../controllers/additionalQuestionsController");
const { auth } = require("../middlewares/auth");

/**
 * @swagger
 * /jobforms:
 *   get:
 *     summary: Get all job forms
 *     tags: [JobForms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of job forms
 *       500:
 *         description: Server error
 */

router.get("/", auth, getJobForm);

router.get("/:id", auth, getFormByJobId);

/**
 * @swagger
 * /jobforms/{id}:
 *   put:
 *     summary: Update an existing job form
 *     tags: [JobForms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job form ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *               description:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job form updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Job form not found
 */

router.put("/:id", auth, updateJobForm);

/**
 * @swagger
 * /additional-questions/{id}:
 *   get:
 *     summary: Get a job form by job ID
 *     tags: [Additional Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job form found
 *       404:
 *         description: Job form not found
 */
router.get("/:id", auth, getFormByJobId);

/**
 * @swagger
 * /additional-questions/:
 *   post:
 *     summary: Add a new job form
 *     tags: [Additional Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Job form created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", auth, addJobForm);

/**
 * @swagger
 * /jobforms/{id}:
 *   delete:
 *     summary: Delete a job form by job ID
 *     tags: [JobForms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job form ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job form deleted successfully
 *       404:
 *         description: Job form not found
 */
router.delete("/:id", auth, deleteJobForm);

module.exports = router;
