console.log('from index');
import app from "./app.js";
import { config } from "dotenv";
config();
const port = 5000;

app.listen(port, () => {
  console.log("server is running!!");
});
