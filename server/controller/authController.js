import emailValidator from "email-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/userModel.js";

const signupContoller = async (req, res, next) => {
  // console.log(req.body);

  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  // every feild is required
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      data: "All feilds are required!",
    });
  }

  // email validation
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid email",
    });
  }

  // check password and confirmPassword
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and confirmPassword not matched (:",
    });
  }

  const user = new User({
    name: name,
    email: email,
    password: password,
  });

  try {
    const result = await user.save();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const signinController = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  // both email and password required
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password both are required!",
    });
  }

  try {
    // user exist or not
    const user = await User.findOne({ email }).select("+password");
    // console.log("user->", user);

    // password should be string
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPasswordController = async (req, res, next) => {
  const email = req.body.email;
  // if email is undefine or null
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required!",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    console.log(email);
    // if user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    // if user found then generate forgot password token

    const forgotPasswordToken = user.getForgotPasswordToken();

    await user.save();

    return res.status(200).json({
      success: true,
      token: forgotPasswordToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPasswordController = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(token, password, confirmPassword);

  if (!password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "both password and confirm password are required!",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "password and confirm password does not match!",
    });
  }
  // if password and confirm password matched then
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      forgotPasswordToken: hashToken,
      forgotPasswordExpiryDate: {
        $gt: new Date(), // forgotPasswordExpiryToken() less then current date
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or token expired",
      });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "successfully reset the password",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutController = async (req, res, next) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };

    res.cookie("token", null, cookieOption);
    return res.status(200).json({
      success: true,
      message: "Logout user",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserController = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  signupContoller,
  signinController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
  getUserController,
};
