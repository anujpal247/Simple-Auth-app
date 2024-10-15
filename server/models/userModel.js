import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [5, "Name should be greater than 5 char"],
      maxLength: [50, "Name should be less than 50 char"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: [true, "Email should be unique"],
    },
    password: {
      type: String,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // If password is not modified then do not hash it
  //   console.log("this->", this);

  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods = {
  // generate jwt token
  jwtToken() {
    return JWT.sign({ id: this._id, email: this.email }, process.env.SECRET, {
      expiresIn: "24h",
    });
  },
  // generate and return forgot password token
  getForgotPasswordToken() {
    // create token
    const forgotToken = crypto.randomBytes(20).toString("hex");
    console.log(forgotToken);
    // save it to DB
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");
    // setExpiry
    this.forgotPasswordExpiryDate = Date.now() + 1000 * 60 * 20; // 20 min
    // return token
    return forgotToken;
  },
};

const User = model("User", userSchema);

export default User;
