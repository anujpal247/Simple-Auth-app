import emailValidator from "email-validator";
import bcrypt from "bcrypt";
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

export { signupContoller, signinController };
