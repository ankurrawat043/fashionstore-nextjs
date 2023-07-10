import connectDB from "@/middleware/mongoose";
import User from "@/models/User";
var jwt = require("jsonwebtoken");
const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const dbuser = await User.findOne({ email: user.email });
    const { name, email, pincode, address, phone } = dbuser;

    res.status(200).json({ name, email, pincode, address, phone });
  } else {
    res.status(400).json({ error: "error" });
  }
};
export default connectDB(handler);
