require("dotenv").config();
const bcrypt = require("bcryptjs");
const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Ensure preflight requests are handled properly
app.options("*", cors(corsOptions));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: true,
    message: "Too many requests, please try again after 1 minute.",
  },
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const sendEmailOTP = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        //console.log("Error sending email:", error);
        throw new Error("Email sending failed");
      } else {
        //console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    //console.error("Error sending OTP email:", error);
    throw error;
  }
};

const sendVerificationEmail = async (user, req) => {
  try {
    const token = jwt.sign(
      { email: user.email },
      process.env.EMAIL_SECRET,
      { expiresIn: "5m" } // 1 hour expiration
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Dianotes Email Verification",
      text: `Please verify your email by clicking the following link: ${process.env.FRONTEND_URL}/verify-email?token=${token} \n\nThis link will expire after 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        //console.log("Error sending email:", error);
        throw new Error("Email sending failed");
      } else {
        //console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    //console.error("Error in sendVerificationEmail:", error);
    throw error; // rethrow the error to be caught in the create-account handler
  }
};

app.use(limiter);

app.get("/", (req, res) => {
  res.send("hello world");
});

//Backend Ready!!!

// Send OTP for password reset or change
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ email, otp }, process.env.OTP_SECRET, {
      expiresIn: "2m",
    });

    await sendEmailOTP({
      to: user.email,
      subject: "Dianotes OTP for Password Reset",
      text: `Your OTP is ${otp}. It will expire in 2 minutes.`,
    });

    // Set the HTTP-only cookie with the OTP token
    res.cookie("otpToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 2 * 60 * 1000, // 2 minutes
      sameSite: "Strict",
    });

    res.status(200).json({ error: false, message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error." });
  }
});


// Validate OTP
app.post("/validate-otp", (req, res) => {
  const { email, otp } = req.body;

  // Read token from cookie
  const token = req.cookies.otpToken;

  if (!token) {
    return res
      .status(400)
      .json({ error: true, message: "The OTP got Expired. Click the Resend OTP." });
  }

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);

    if (decoded.email !== email || decoded.otp !== otp) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid or expired OTP." });
    }

 

    res
      .status(200)
      .json({ error: false, message: "OTP validated successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: true, message: "OTP has expired." });
    }
    res.status(500).json({ error: true, message: "Internal server error." });
  }
});

// Reset or Change Password when the user forgot their password
app.put("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  // Read the token from the HTTP-only cookie
  const token = req.cookies.otpToken;

  if (!token) {
    return res
      .status(400)
      .json({
        error: true,
        message: "The OTP got Expired. Click the Resend OTP.",
      });
  }

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);

    if (decoded.email !== email) {
      return res.status(400).json({ error: true, message: "Invalid token." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }

    user.password = password;
    await user.save();

    // Clear the OTP token cookie after password reset
    res.clearCookie("otpToken");

    res
      .status(200)
      .json({ error: false, message: "Password reset/change successful." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ error: true, message: "Token has expired." });
    }
    res.status(500).json({ error: true, message: "Internal server error." });
  }
});

// Change password when the user is logged in
app.put("/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { user } = req.user;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: true, message: "Old and new passwords are required." });
  }

  try {
    const userRecord = await User.findById(user._id);

    if (!userRecord) {
      return res.json({ error: true, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, userRecord.password);

    if (!isMatch) {
      return res.json({ error: true, message: "Old password is incorrect." });
    }

    userRecord.password = newPassword;
    await userRecord.save();

    res.status(200).json({ error: false, message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error." });
  }
});


//Create account
app.post("/create-account", async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName) {
    return res
      .status(400)
      .json({ error: true, message: "Username is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User with this email already exists",
    });
  }

  const user = new User({
    userName,
    email,
    password,
  });

  try {
    await user.save();
    await sendVerificationEmail(user, req);
    res.json({
      error: false,
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    //console.error("Error during account creation or email sending:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

//verify email
app.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    jwt.verify(token, process.env.EMAIL_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(400)
          .json({ error: true, message: "Invalid or expired token." });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res
          .status(400)
          .json({ error: true, message: "User not found." });
      }

      user.verified = true;
      await user.save();

      res.json({ error: false, message: "Email verified successfully!" });
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error." });
  }
});

app.post("/send-verification-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ error: true, message: "User not found" });
    }

    if (!user.verified) {
      await sendVerificationEmail(user, req);
      return res.json({
        error: false,
        message: "The verification link has been sent to your email address.",
      });
    } 

    if(user.verified) {
      return res.json({ error: true, message: "Email is already verified" });
    }

  } catch (error) {
  
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Incorrect password" });
    }

    if (!user.verified) {
      return res.status(400).json({
        error: true,
        message: "Please verify your email first",
      });
    }

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.json({ error: false, message: "Login successful!" });
  } catch (error) {
    //console.error("Error during login:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

//get user
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.status(401);
  }

  return res.json({
    user: {
      userName: isUser.userName,
      email: isUser.email,
      /* _id: isUser._id, */
      /* createdOn: isUser.createdOn, */
    },
    message: "",
  });
});

//Add note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//get all notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

    return res.json({
      error: false,
      notes,
      message: "All Notes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.find({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//update isPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//search notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: true,
      notes: matchingNotes,
      message: "Notes matching the search query found successfully",
    });
  } catch {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//logout user
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

// Auth status endpoint
app.get("/auth-status", authenticateToken, (req, res) => {
  // If the token is valid, respond with user info or a simple status
  res.json({ authenticated: true, user: req.user });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

module.exports = app;
 