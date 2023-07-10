import connectDB from "@/middleware/mongoose";
import User from "@/models/User";
var jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method == "POST") {
    let token = req.body.token;
    const verifyuser = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: verifyuser.email });
    var bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (req.body.oldPassword == originalText) {
      const dbuser = await User.findOneAndUpdate(
        { email: user.email },
        {
          password: CryptoJS.AES.encrypt(
            req.body.newPassword,
            process.env.AES_SECRET
          ).toString(),
        }
      );
    } else {
      res
        .status(200)
        .json({ success: false, error: "Password Does not match" });
      return;
    }

    res
      .status(200)
      .json({ success: true, error: "Password Updated Successfully" });
  } else {
    res.status(400).json({ error: "error" });
  }
};
export default connectDB(handler);
