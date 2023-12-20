// controllers/UserController.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Notification = require("../models/notification");
const Visitor = require("../models/visitor");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const translate = require("translate-google");

// GENERATE TOKEN
const generateToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  const expires = Date.now() + 3600000;
  return { token, expires };
};

// RESET PASSWORD
const sendResetEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ttriki50@gmail.com",
      pass: "hlctjnhciorbhmkc",
    },
  });
  const resetToken = generateToken();
  user.resetToken = resetToken.token;
  user.resetTokenExpires = resetToken.expires;
  await user.save();

  const mailOptions = {
    from: "ttriki50@gmail.com",
    to: user.email,
    subject: "Password Reset",
    text: `
    You are receiving this email because you have requested a password reset.
    Please click on the following link to reset your password: 
    https://hamedportfolio.vercel.app/reset/${resetToken.token}
    `,
  };

  await transporter.sendMail(mailOptions);
};

const validateEmailAndSendResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found");
    }

    await sendResetEmail(user);

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired token.");
    }

    if (password.length < 8 || !/\d/.test(password)) {
      throw new Error(
        "New password should be at least 8 characters long and contain at least one number"
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.verified) {
      throw new Error("User not verified yet!");
    }

    if (!user.status) {
      throw new Error("User is banned! Please contact the admin");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Password is incorrect");
    }

    const expiresIn = rememberMe ? "7d" : "1h";

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        userType: user.userType,
        verified: user.verified,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// USER INFORMATIONS
const getUserInfo = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, "secret");
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    res.json({
      name: user.name,
      email: user.email,
      userType: user.userType,
      verified: user.verified,
      status: user.status,
      premium: user.premium,
      premiumExpires: user.premiumExpires,
      createdAt: user.createdAt,
      _id: user._id,
      image: user.image,
      country: user.country,
      aboutMe: user.aboutMe,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving users." });
  }
};

// DELETE SELECTED USERS
const deleteSelectedUsers = async (req, res) => {
  try {
    const { users } = req.body;

    const hasUserTypeTrue = await User.exists({
      _id: { $in: users },
      userType: true,
    });

    if (hasUserTypeTrue) {
      return res.status(400).json({
        error: "Cannot delete admins.",
      });
    }

    await User.deleteMany({ _id: { $in: users } });

    res.status(200).json({
      message: `${users.length} Selected users deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting selected users:", error);
    res.status(500).json({ error: "An error occurred while deleting users." });
  }
};

// DELETE USER BY ID
const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};

// UPDATE THE USER PROFILE
const updateUserProfile = async (req, res) => {
  const {
    userId,
    name,
    oldPassword,
    newPassword,
    image,
    phone,
    about,
    country,
  } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (name) {
      user.name = name;
    } else {
      throw new Error("Name not valid");
    }
    if (image) {
      user.image = image;
    } else {
      throw new Error("Image not valid");
    }
    if (phone) {
      user.phoneNumber = phone;
    } else {
      throw new Error("Phone number not valid");
    }

    if (about) {
      user.aboutMe = about;
    } else {
      throw new Error("About me field not valid");
    }
    if (country) {
      user.country = country;
    } else {
      throw new Error("Country not valid");
    }

    if (oldPassword && newPassword) {
      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match) {
        throw new Error("Old password is incorrect");
      }
      if (newPassword.length < 8 || !/\d/.test(newPassword)) {
        throw new Error(
          "New password should be at least 8 characters long and contain at least one number"
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// SEND MAILS
const sendEmail = async (req, res) => {
  const { userId, subject, text } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ttriki50@gmail.com",
        pass: "hlctjnhciorbhmkc",
      },
    });

    const mailOptions = {
      from: "ttriki50@gmail.com",
      to: user.email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: `Email has been sent successfully to ${user.name}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE THE USER STATUS
const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    user.status = !status;
    await user.save();

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE EXPIRED TOKENS
const resetExpiredTokens = async () => {
  try {
    const expiredUsers = await User.find({
      resetTokenExpires: { $lt: Date.now() },
    });

    for (let i = 0; i < expiredUsers.length; i++) {
      const user = expiredUsers[i];
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
    }

    const resetCount = expiredUsers.length;

    const admins = await User.find({
      userType: true,
    });

    for (let i = 0; i < admins.length; i++) {
      const notification = new Notification({
        user: admins[i],
        message: `${resetCount} users with expired tokens reset.`,
      });

      await notification.save();
    }

    console.log(`${resetCount} users with expired tokens reset.`);
    return { message: `${resetCount} users with expired tokens reset.` };
  } catch (error) {
    console.error("Error resetting expired tokens:", error);
    return { error: "An error occurred while resetting expired tokens." };
  }
};

// DELETE USERS WITH EXPIRED TOKENS
const deleteUsersWithExpiredTokens = async () => {
  try {
    const expiredUsers = await User.find({
      verified: false,
      verificationTokenExpires: { $lt: Date.now() },
    });

    await User.deleteMany({
      verified: false,
      verificationTokenExpires: { $lt: Date.now() },
    });

    const admins = await User.find({
      userType: true,
    });
    const deletedCount = expiredUsers.length;

    for (let i = 0; i < admins.length; i++) {
      const notification = new Notification({
        user: admins[i],
        message: `${deletedCount} users with expired tokens deleted.`,
      });

      await notification.save();
    }

    console.log(`${deletedCount} users with expired tokens deleted.`);
    return { message: `${deletedCount} users with expired tokens deleted.` };
  } catch (error) {
    console.error("Error deleting users with expired tokens:", error);
    return { error: "An error occurred while deleting users." };
  }
};

// EXECUTE THIS METHODS EVERY HOUR
setInterval(async () => {
  const resetExpiredTokensResult = await resetExpiredTokens();
  console.log(resetExpiredTokensResult);

  const deleteUsersWithExpiredTokensResult =
    await deleteUsersWithExpiredTokens();
  console.log(deleteUsersWithExpiredTokensResult);
}, 60 * 60 * 1000);

// GET USER BY ID
const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

// INCRIMENT THE NUMBER OF VISITORS
const incrimentNumberOfVisitors = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);

    let visitorCountDoc = await Visitor.findOne({ date: today });

    if (!visitorCountDoc) {
      visitorCountDoc = await Visitor.create({ count: 0, date: today });
    }

    visitorCountDoc.count++;
    await visitorCountDoc.save();

    res
      .status(200)
      .json({ message: `Number of visitors: ${visitorCountDoc.count}` });
  } catch (error) {
    console.error("Error updating visitor count:", error);
    res.status(500).send("Internal Server Error");
  }
};

// GET THE NUMBER OF VISITORS
const getNumberOfVisitors = async (req, res) => {
  try {
    const visitorCountDocs = await Visitor.find();
    const Users = await User.find();

    let totalCount = 0;
    let totalPremium = 0;
    for (let i = 0; i < Users.length; i++) {
      const u = Users[i];
      if (u.premium) {
        totalPremium += 1;
      }
    }
    for (let i = 0; i < visitorCountDocs.length; i++) {
      const doc = visitorCountDocs[i];
      totalCount += doc.count;
    }

    const averageVisitors = totalCount / visitorCountDocs.length;

    res.status(200).json({
      total: totalCount,
      average: averageVisitors,
      totalPremium: totalPremium,
    });
  } catch (error) {
    console.error("Error retrieving visitor count:", error);
    res.status(500).send("Internal Server Error");
  }
};

// GET NUMBER OF USERS PER MONTH
const getNumberOfUsersPerMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const result = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const userCountPerMonth = result.map((item) => ({
      year: currentYear,
      month: item._id.month,
      count: item.count,
    }));

    res.status(200).json(userCountPerMonth);
  } catch (error) {
    console.error("Error getting user count per month:", error);
    res.status(500).send("Internal Server Error");
  }
};

// GET NUMBER OF USERS PER YEAR
const getNumberOfUsersPerYear = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: { $year: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const userCountPerYear = result.map((item) => ({
      year: item._id,
      count: item.count,
    }));

    res.status(200).json(userCountPerYear);
  } catch (error) {
    console.error("Error getting user count per year:", error);
    res.status(500).send("Internal Server Error");
  }
};

// GET USERS HAS AMOUNT
const getAllUsersWithAmount = async (req, res) => {
  try {
    const users = await User.find({ amount: { $gt: 0 } });
    res.json({ count: users.length, users: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving users." });
  }
};

// GET NUMBER OF USERS FOR EACH COUNTRY
const getNumberOfUsersForEachCountry = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TEXT TRANSLATION
const translateText = async (text, fromLang, toLang) => {
  try {
    const translation = await translate(text, { from: fromLang, to: toLang });
    return translation;
  } catch (error) {
    throw new Error("Translation failed.");
  }
};

const translateTo = async (req, res) => {
  const { text, fromLang, toLang } = req.body;

  try {
    const Translation = await translateText(text, fromLang, toLang);
    res.json({
      Translation: Translation,
    });
  } catch (error) {
    res.status(500).json({ error: "Translation failed." });
  }
};

module.exports = {
  resetPassword,
  login,
  validateEmailAndSendResetEmail,
  getUserInfo,
  deleteUsersWithExpiredTokens,
  resetExpiredTokens,
  getAllUsers,
  deleteSelectedUsers,
  deleteUserById,
  updateUserProfile,
  sendEmail,
  updateUserStatus,
  getUserById,
  incrimentNumberOfVisitors,
  getNumberOfVisitors,
  getNumberOfUsersPerMonth,
  getNumberOfUsersPerYear,
  getAllUsersWithAmount,
  getNumberOfUsersForEachCountry,
  translateTo,
};
