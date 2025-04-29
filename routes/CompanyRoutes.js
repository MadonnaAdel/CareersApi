const express = require('express');
const router = express.Router();
const {
  signup,
  getCompanyById,
  getAllCompanies,
  companyLogin,
  updateCompanyData,
  deleteCompanyData,
  getCompaniesByCity,
  countCompaniesInCity,
  countAllCompanies,
  resetPassword,
  logout,
  RequestCompanyOTP,
  verifyOTP,
  resetCompanyPassword
} = require('../controllers/CompanyController');
const { auth } = require('../middlewares/auth');

/**
 * @swagger
 * /companies/signup:
 *   post:
 *     summary: Register a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - companyEmail
 *               - companyPassword
 *               - companyIndustry
 *               - foundedYear
 *             properties:
 *               companyName:
 *                 type: string
 *               companyIndustry:
 *                 type: string
 *               companyEmail:
 *                 type: string
 *               companyPassword:
 *                 type: string
 *               foundedYear:
 *                 type: integer
 *               phone:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               companyLogo:
 *                 type: string
 *                 description: URL to the logo image
 *               companyImage:
 *                 type: string
 *                 description: URL to a company background image
 *               companySize:
 *                 type: string
 *                 description: Size of the company (e.g., Small, Medium, Large)
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Bad request
 */

router.post('/signup', signup);

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company data
 *       404:
 *         description: Company not found
 */
router.get('/:id', getCompanyById);

/**
 * @swagger
 * /companies/:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of all companies
 */
router.get('/', getAllCompanies);

/**
 * @swagger
 * /companies/login:
 *   post:
 *     summary: Company login
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', companyLogin);

/**
 * @swagger
 * /companies/sendMail:
 *   post:
 *     summary: Request OTP to reset password
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Error sending OTP
 */
router.post('/sendMail', RequestCompanyOTP);

/**
 * @swagger
 * /companies/verifyOTP:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyEmail:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid OTP
 */
router.post('/verifyOTP',auth, verifyOTP);

/**
 * @swagger
 * /companies/restNewPass:
 *   post:
 *     summary: Reset company password
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyEmail:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Error resetting password
 */
router.post('/restNewPass', resetCompanyPassword);

/**
 * @swagger
 * /companies/{id}:
 *   patch:
 *     summary: Update company data
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               companyIndustry:
 *                 type: string
 *               companyEmail:
 *                 type: string
 *               phone:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               companyLogo:
 *                 type: string
 *               companyImage:
 *                 type: string
 *               companySize:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       400:
 *         description: Bad request
 */

 
router.patch('/:id', updateCompanyData);

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 */
router.delete('/:id', deleteCompanyData);

/**
 * @swagger
 * /companies/city/{city}:
 *   get:
 *     summary: Get companies by city
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *     responses:
 *       200:
 *         description: List of companies in the city
 *       404:
 *         description: No companies found in this city
 */
router.get('/city/:city', getCompaniesByCity);

/**
 * @swagger
 * /companies/count/{city}:
 *   get:
 *     summary: Count companies in a city
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *     responses:
 *       200:
 *         description: Number of companies in the city
 *       404:
 *         description: No companies found
 */
router.get('/count/:city', countCompaniesInCity);

/**
 * @swagger
 * /companies/count-all:
 *   get:
 *     summary: Count all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Total number of companies
 */
router.get('/count-all', countAllCompanies);

/**
 * @swagger
 * /companies/resetPassword:
 *   post:
 *     summary: Reset password via email
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Error resetting password
 */
router.post('/resetPassword', resetPassword);

/**
 * @swagger
 * /companies/logout:
 *   post:
 *     summary: Company logout
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

module.exports = router;
