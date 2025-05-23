const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const otps = new Map();
const cloudinary = require("../cloudinary");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedData.profilePhoto = result.secure_url;
    }

    const updatedUser = await usersModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

const changeUserActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersModel.findById(id).select("isActive");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const changePassword = async (req, res) => {
  const userIdFromHeader = req.headers["user-id"];
  const { currentPassword, newPassword } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.user.id;

    if (userIdFromHeader !== userIdFromToken.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const user = await usersModel.findById(userIdFromToken);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await usersModel.findByIdAndUpdate(userIdFromToken, {
      password: hashedPassword,
    });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(`Change Password Error: ${err.message}`);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    city,
    country,
    category,
    experienceLevel,
    desiredJobType,
    qualifications,
    profilePhoto,
    skills,
    overview,
    socialMedia,
    isActive,
    education,
    workAndExperience,
  } = req.body;
  try {
    let user = await usersModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const defaultProfilePhoto = `${baseUrl}/images/User-Profile-PNG-Image.svg`;
    const userProfilePhoto =
      profilePhoto && profilePhoto.trim() !== ""
        ? profilePhoto
        : defaultProfilePhoto;
    user = new usersModel({
      firstName,
      lastName,
      email,
      phone,
      password,
      city,
      country,
      category,
      experienceLevel,
      desiredJobType,
      qualifications,
      profilePhoto: userProfilePhoto,
      skills,
      overview,
      socialMedia,
      isActive,
      education,
      workAndExperience,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error(`JWT Error: ${err.message}`);
          throw err;
        }
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(`Register Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await usersModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials, User is not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials, password doesn't match" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          console.error(`JWT Error: ${err.message}`);
          throw err;
        }
        return res.json({ token, user: { ...user.toObject(), id: user.id } });
      }
    );
  } catch (err) {
    console.error(`Login Error: ${err.message}`);
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const RequestOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await usersModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    otps.set(user.id, { OTP, expiresAt });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your One-Time Password (OTP)",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 500px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">🔐 Your OTP Code</h2>
            <p style="font-size: 16px; color: #555;">
              Hello,
            </p>
            <p style="font-size: 16px; color: #555;">
              Here is your one-time password (OTP). Please use it to complete your action:
            </p>
            <p style="font-size: 24px; font-weight: bold; color: #2c3e50; text-align: center; margin: 20px 0;">
              ${OTP}
            </p>
            <p style="font-size: 14px; color: #999;">
              This code is valid for a limited time only. If you didn’t request it, please ignore this email.
            </p>
            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Regards,<br>
              Careers Team
            </p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const user = await usersModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const storedOtp = otps.get(user.id);
    if (!storedOtp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).send("OTP expired or invalid");
    }

    if (typeof otp !== "string" || storedOtp.OTP !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    storedOtp.verified = true;
    otps.set(user.id, storedOtp);

    res.send("OTP verified successfully");
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await usersModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const storedOtp = otps.get(user.id);
    if (!storedOtp || !storedOtp.verified) {
      return res.status(400).send("OTP not verified or expired");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    otps.delete(user.id);
    res.send("Password reset successful");
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const loginWithGoogle = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await usersModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }

        return res.json({ token, user: { ...user.toObject(), id: user.id } });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

const registerWithGoogle = async (req, res) => {
  const { firstName, lastName, email, googleId } = req.body;

  try {
    let user = await usersModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new usersModel({
      firstName,
      lastName,
      email,
      googleId,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token, user });
      }
    );
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

module.exports = {
  register,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  changeUserActivity,
  login,
  RequestOTP,
  verifyOTP,
  resetPassword,
  changePassword,
  loginWithGoogle,
  registerWithGoogle,
};
