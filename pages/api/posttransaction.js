import connectDB from "@/middleware/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
const Razorpay = require("razorpay");
import crypto from "crypto";

const handler = async (req, res) => {
  //Validate payment
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    let paymentId = req.body.razorpay_payment_id;

    let rzp = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY, // your `KEY_ID`
      key_secret: process.env.RAZORPAY_APT_SECRET, // your `KEY_SECRET`
    });
    let paymentStatus = await rzp.payments.fetch(paymentId);

    // success

    let order;
    //Update payment status in Order after checking payment
    if (paymentStatus.status == "captured") {
      order = await Order.findOneAndUpdate(
        { paymentId: req.body.razorpay_order_id },
        { status: "Paid", paymentInfo: JSON.stringify(req.body) }
      );
      let products = order.products;
      for (let slug in products) {
        await Product.findOneAndUpdate(
          { slug: slug },
          { $inc: { availableQty: -products[slug].qty } }
        );
      }
      res.redirect("/order?clearcart=1&id=" + order._id, 200);
    } else if (paymentStatus.status == "attempted") {
      order = await Order.findOneAndUpdate(
        { paymentId: req.body.razorpay_order_id },
        { status: "Pending", paymentInfo: JSON.stringify(req.body) }
      );
      res.redirect("/order?id=" + order._id, 200);
    }
  } else {
    res.status(400).json({
      success: false,
    });
  }
  // res.status(200).json({ success: "success" });
};
export default connectDB(handler);
