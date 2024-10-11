import mongoose from "mongoose";

const MONGODB_URL = "mongodb://localhost:27017/my_database";

const connectDB = () => {
  mongoose
    .connect(MONGODB_URL)
    .then((result) =>
      console.log(`DB is connected at ${result.connection.host}`)
    )
    .catch((err) => console.log(err.message));
};

export default connectDB;