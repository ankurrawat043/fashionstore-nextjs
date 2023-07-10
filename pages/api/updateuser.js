import connectDB from "@/middleware/mongoose";
import User from "@/models/User";
var jwt = require("jsonwebtoken");
const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const dbuser = await User.findOneAndUpdate(
      { email: user.email },
      {
        address: req.body.address,
        phone: req.body.phone,
        pincode: req.body.pincode,
        name: req.body.name,
      }
    );

    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: "error" });
  }
};
export default connectDB(handler);
