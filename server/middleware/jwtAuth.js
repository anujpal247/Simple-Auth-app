import JWT from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  // get cookie token from req
  const token = (req.cookies && req.cookies.token) || null;
  console.log("token: ", token);

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "NOT Authorized",
    });
  }

  // verify token
  try {
    const payload = JWT.verify(token, process.env.SECRET);
    console.log("payload: ", payload);
    req.user = { id: payload.id, email: payload.email };
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

export default jwtAuth;
