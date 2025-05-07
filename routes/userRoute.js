
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require('multer');
const { auth } = require("../middlewares/auth");
const multerStorageCloudinary = require('multer-storage-cloudinary');
const cloudinary = require("../cloudinary"); 

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'images',  
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif'], 
});

const upload = multer({ storage: storage });


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               category:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               desiredJobType:
 *                 type: string
 *               qualifications:
 *                 type: string
 *               profilePhoto:
 *                 type: string
 *                 format: uri
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               overview:
 *                 type: string
 *               socialMedia:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     school:
 *                       type: string
 *                     degree:
 *                       type: string
 *                     year:
 *                       type: string
 *               workAndExperience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     company:
 *                       type: string
 *                     title:
 *                       type: string
 *                     years:
 *                       type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

router.post("/register", userController.register);

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /users/deleteUser/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     security:              
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */

router.delete("/deleteUser/:id", auth,userController.deleteUser);

/**
 * @swagger
 * /users/updateUserAccount/{id}:
 *   put:
 *     summary: Update user account (with optional profile photo upload)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               category:
 *                 type: string
 *               experienceLevel:
 *                 type: string
 *               desiredJobType:
 *                 type: string
 *               qualifications:
 *                 type: string
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *               skills:
 *                 type: string
 *                 description: Comma-separated skills (e.g. HTML,CSS,JS)
 *               overview:
 *                 type: string
 *               socialMedia:
 *                 type: string
 *                 description: JSON stringified object of social links
 *               isActive:
 *                 type: boolean
 *               education:
 *                 type: string
 *                 description: JSON stringified array of education objects
 *               workAndExperience:
 *                 type: string
 *                 description: JSON stringified array of work experience objects
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put("/updateUserAccount/:id", upload.single("profilePhoto"), userController.updateUser);

/**
 * @swagger
 * /users/changeactivity/{id}:
 *   patch:
 *     summary: Change user's activity status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activity status changed
 *       404:
 *         description: User not found
 */
router.patch("/changeactivity/:id", userController.changeUserActivity);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /users/requestotp:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 *       404:
 *         description: Email not found
 */
router.post("/requestotp", userController.RequestOTP);

/**
 * @swagger
 * /users/verifyotp:
 *   post:
 *     summary: Verify OTP code
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid OTP
 */
router.post("/verifyotp", userController.verifyOTP);

/**
 * @swagger
 * /users/resetpassword:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
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
 *         description: Password reset successful
 *       400:
 *         description: Bad request
 */
router.post("/resetpassword", userController.resetPassword);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change user password (after login)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 */
router.post('/change-password', userController.changePassword);

router.post("/login/google", userController.loginWithGoogle);

  
module.exports = router;
