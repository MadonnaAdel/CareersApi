const express = require('express');
const router = express.Router();
const { 
    filterSalaryBudget,
    postNewJob,
    getAllJobs,
    getJobById,
    getJobsBySalary,
    updateJobById,
    deleteJobById,
    deleteAllJobs,
    getJobsByCompanyName,
    filterJobsByLocationState,
    filterJobsByLocationGovernment,
    getAllCounts,
    getCountByState,
    getCountByCompanyName,
    getJobsByCompanyId,
    foundedJobByIdDona
} = require('../controllers/JobController');

/**
 * @swagger
 * /jobs/get:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/get', getAllJobs);

/**
 * @swagger
 * /jobs/get/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *    security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/get/:id', getJobById);

/**
 * @swagger
 * /jobs/foundedJob/{id}:
 *   get:
 *     summary: Get a founded job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Founded job details
 *       404:
 *         description: Job not found
 */
router.get('/foundedJob/:id', foundedJobByIdDona);


/**
 * @swagger
 * /jobs/getJobsByCompanyId/{companyId}:
 *   get:
 *     summary: Get jobs by company ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *    security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/getJobsByCompanyId/:companyId', getJobsByCompanyId);

/**
 * @swagger
 * /jobs/getJobsBySalay:
 *   get:
 *     summary: Get jobs sorted by salary
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs by salary
 */
router.get('/getJobsBySalay', getJobsBySalary);

/**
 * @swagger
 * /jobs/FilterJobsByLoactionState/{State}:
 *   get:
 *     summary: Filter jobs by location state
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: State
 *         required: true
 *         schema:
 *           type: string
 *         description: State
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/FilterJobsByLoactionState/:State', filterJobsByLocationState);

/**
 * @swagger
 * /jobs/countAll:
 *   get:
 *     summary: Get total count of jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Total number of jobs
 */
router.get('/countAll', getAllCounts);

/**
 * @swagger
 * /jobs/CountByState/{State}:
 *   get:
 *     summary: Get job count by state
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: State
 *         required: true
 *         schema:
 *           type: string
 *         description: State
 *     responses:
 *       200:
 *         description: Number of jobs
 */
router.get('/CountByState/:State', getCountByState);



/**
 * @swagger
 * /jobs/create:
 *   post:
 *     summary: Post a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - JobTitle
 *               - JobCategory
 *               - description
 *             properties:
 *               companyId:
 *                 type: string
 *               companyName:
 *                 type: string
 *               JobTitle:
 *                 type: string
 *               JobCategory:
 *                 type: string
 *               JobSubCategory:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *               JobType:
 *                 type: string
 *                 enum: [Full-Time, Part-Time, Internship, Contract]
 *               salary:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: number
 *                   to:
 *                     type: number
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               JobHours:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: number
 *                   to:
 *                     type: number
 *               jobLocation:
 *                 type: object
 *                 properties:
 *                   State:
 *                     type: string
 *                   government:
 *                     type: string
 *               JoblocationType:
 *                 type: string
 *                 enum: [Onsite, Remote, Hybrid]
 *               jobLevel:
 *                 type: string
 *                 enum: [EntryLevel, MidLevel, Senior, Expert]
 *               jobRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Open, Closed]
 *               additionalJobForm:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newJob:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/create', postNewJob);

/**
 * @swagger
 * /jobs/filter:
 *   post:
 *     summary: Filter jobs by salary budget
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minSalary:
 *                 type: number
 *               maxSalary:
 *                 type: number
 *     responses:
 *       200:
 *         description: List of filtered jobs
 */
router.post('/filter', filterSalaryBudget);

/**
 * @swagger
 * /jobs/FilterJobsByLoactionGovernment/{government}:
 *   get:
 *     summary: Filter jobs by location government
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: government
 *         required: true
 *         schema:
 *           type: string
 *         description: Government location
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get('/FilterJobsByLoactionGovernment/:government', filterJobsByLocationGovernment);

/**
 * @swagger
 * /jobs/update/{id}:
 *   patch:
 *     summary: Update a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Job updated
 *       404:
 *         description: Job not found
 */
router.patch('/update/:id', updateJobById);

/**
 * @swagger
 * /jobs/delete/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted
 *       404:
 *         description: Job not found
 */
router.delete('/delete/:id', deleteJobById);

/**
 * @swagger
 * /jobs/delete:
 *   delete:
 *     summary: Delete all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: All jobs deleted
 */
router.delete('/delete', deleteAllJobs);

module.exports = router;
