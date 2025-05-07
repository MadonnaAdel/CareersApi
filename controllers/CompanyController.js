require("dotenv").config();
const { companyModel } = require("../models/CompanyModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otps = new Map();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const signup = async (req, res, next) => {
  const files = req.files;

  try {
    const {
      companyName,
      companyIndustry,
      companyEmail,
      companyPassword,
      companySize,
      foundedYear,
      phone,
      city,
      state,
      companyLogo,
      companyImage,
    } = req.body;

    if (
      !companyName ||
      !companyIndustry ||
      !companyEmail ||
      !companyPassword ||
      !companySize ||
      !foundedYear ||
      !phone ||
      !state ||
      !city
    ) {
      return res.status(400).json({
        message:
          "Email, password, name, industry, state, and city are required",
      });
    }

    const existingCompany = await companyModel.findOne({ companyEmail });
    if (existingCompany) {
      return res
        .status(409)
        .json({ message: "Company with this email already exists" });
    }

    const defaultLogoPath = "https://pic.onlinewebfonts.com/svg/img_148020.svg";
    const defaultImagePath =
      "https://d31kswug2i6wp2.cloudfront.net/fallback/company/medium_logo_default.png";

    const logoPath =
      files && files.companyLogo && files.companyLogo[0]
        ? `${req.protocol}://${req.get("host")}/uploads/${
            files.companyLogo[0].filename
          }`
        : defaultLogoPath;
    const imagePath =
      files && files.companyImage && files.companyImage[0]
        ? ` ${req.protocol}://${req.get("host")}/uploads/${
            files.companyImage[0].filename
          } `
        : defaultImagePath;
    const newCompany = new companyModel({
      companyName,
      companyIndustry,
      companyEmail,
      companySize,
      foundedYear,
      phone,
      city,
      state,
      companyPassword,
      companyLogo: logoPath,
      companyImage: imagePath,
    });

    await newCompany.save();

    return res
      .status(201)
      .json({ message: "Company created successfully", company: newCompany });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating company", error: error.message });
  }
};

const companyLogin = async (req, res) => {
  let { companyEmail, companyPassword } = req.body;
  if (!companyEmail || !companyPassword) {
    return res
      .status(400)
      .json({ message: "You must provide email and password" });
  }
  try {
    let company = await companyModel.findOne({ companyEmail });

    if (!company) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    let isValid = await bcrypt.compare(
      companyPassword,
      company.companyPassword
    );

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let token = jwt.sign(
      { user: { companyEmail: company.companyEmail, id: company._id } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Success",
      token: token,
      company: {
        companyEmail: company.companyEmail,
        id: company._id,
        companyName: company.companyName,
        companyIndustry: company.companyIndustry,
        companySize: company.companySize,
        foundedYear: company.foundedYear,
        phone: company.phone,
        city: company.city,
        state: company.state,
        companyPassword: company.companyPassword,
      },
    });
  } catch (error) {
    console.error("Server error during login:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

const RequestCompanyOTP = async (req, res) => {
  const { companyEmail } = req.body;
  if (!companyEmail) {
    return res.status(400).send("companyEmail is required");
  }

  try {
    const company = await companyModel.findOne({ companyEmail });

    if (!company) {
      return res.status(404).send("Company not found");
    }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    otps.set(company.id, { OTP, expiresAt });

    const mailOptions = {
      from: process.env.EMAIL,
      to: companyEmail,
      subject: "Your Company OTP Code",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f7fc;
                margin: 0;
                padding: 20px;
              }
              .container {
                background-color: #ffffff;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
              }
              h1 {
                color: #4caf50;
                font-size: 24px;
                text-align: center;
              }
              p {
                color: #333333;
                font-size: 16px;
                line-height: 1.6;
              }
              .otp {
                font-size: 22px;
                font-weight: bold;
                color: #ffffff;
                background-color: #4caf50;
                padding: 10px 20px;
                border-radius: 5px;
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to ${company.companyName}</h1>
              <p>Hello,</p>
              <p>We have received a request to send you an OTP (One-Time Password) for verification.</p>
              <div class="otp">
                Your OTP code is: <strong>${OTP}</strong>
              </div>
              <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
              <p>Best regards,</p>
              <p>The Careers Team</p>
              <div class="footer">
                <p>&copy; 2025 Careers. All Rights Reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send mail:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: `Server error: ${err.message}`});
  }
};

const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  try {
    let company = await companyModel.findOne({ companyEmail: email });

    if (!company) {
      return res.status(404).send("company not found");
    }

    const storedOtp = otps.get(company.id);
    if (!storedOtp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).send("OTP expired or invalid");
    }

    if (typeof otp !== "string" || storedOtp.OTP !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    storedOtp.verified = true;
    otps.set(company.id, storedOtp);

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}`});
  }
};

const resetCompanyPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "email and newPassword are required" });
    }

    const company = await companyModel.findOne({ companyEmail: email });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const storedOtp = otps.get(company.id);

    if (!storedOtp || !storedOtp.verified) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    company.companyPassword = newPassword; 
    await company.save();
    otps.delete(company.id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}`});
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    const { newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields must be provided" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRE);
    const companyEmail = decodedToken.data.companyEmail;

    const company = await companyModel.findOne({ companyEmail });
    if (!company) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    company.companyPassword = encryptedPassword;
    await company.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link is expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCompanyById = async (req, res) => {
  let { id } = req.params;
  try {
    let company = await companyModel.findById(id).exec();
    if (company) {
      res.status(200).json({ message: "success", data: company });
    } else {
      res.status(400).json({ message: `Company doesn't exist` });
    }
  } catch (err) {
    res.status(500).json({ message: `try again please` });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    let allCompany = await companyModel.find();
    res.status(200).json({ message: "succes", data: allCompany });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const updateCompanyData = async (req, res) => {
  let { id } = req.params;
  let { name } = req.body;

  try {
    let updatedData = await companyModel.findByIdAndUpdate(
      id,
      { companyName: name },
      { new: true }
    );
    res
      .status(200)
      .json({ message: `company data updated Sucessfully`, data: updatedData });
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

const deleteCompanyData = async (req, res) => {
  let { id } = req.params;
  try {
    const deleteCompanyAccount = await companyModel.findByIdAndDelete(id);
    if (deleteCompanyAccount) {
      res.status(200).json({ message: `account deleted Successfully` });
    } else {
      res.status(404).json({ message: `account not found ` });
    }
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

const getCompaniesByCity = async (req, res) => {
  let { city } = req.params;
  try {
    let companies = await companyModel.find({ "companyLocation.city": city });
    if (companies.length > 0) {
      res.status(200).json({ message: "success", data: companies });
    } else {
      res.status(404).json({ message: `No companies found in ${city}` });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

const countCompaniesInCity = async (req, res) => {
  let { city } = req.params;

  try {
    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    let count = await companyModel.countDocuments({
      "companyLocation.city": city,
    });
    res.status(200).json({ message: "success", count: count });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

const countAllCompanies = async (req, res) => {
  try {
    let count = await companyModel.countDocuments();
    res.status(200).json({ message: "success", count: count });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  signup,
  getCompanyById,
  getAllCompanies,
  companyLogin,
  updateCompanyData,
  deleteCompanyData,
  getCompaniesByCity,
  countCompaniesInCity,
  countAllCompanies,
  RequestCompanyOTP,
  resetPassword,
  logout,
  verifyOTP,
  resetCompanyPassword,
};
