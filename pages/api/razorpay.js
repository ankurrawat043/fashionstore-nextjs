const Razorpay = require("razorpay");
const shortid = require("shortid");
import connectDB from "@/middleware/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import pincodes from "@/pincodes.json";

const handler = async (req, res) => {
  if (req.method === "POST") {
    //Check if cart is tempered
    let cart = req.body.cart;
    if (!Object.keys(pincodes).includes(req.body.pincode)) {
      res.status(200).json({
        success: false,
        error: "The Pincode you have entered is not serviceable",
      });
      return;
    }

    let product,
      sumTotal = 0;
    if (req.body.subTotal <= 0) {
      res.status(200).json({
        success: false,
        error: " Your cart is empty. Please add some products and try again.",
      });
      return;
    }
    for (let item in cart) {
      sumTotal += cart[item].price * cart[item].qty;
      product = await Product.findOne({ slug: item });
      if (product.availableQty < cart[item].qty) {
        res.status(200).json({
          success: false,
          error:
            "Some Products in your cart is out of stock. Please add some new products ",
        });
        return;
      }
      if (product.price != cart[item].price) {
        res.status(200).json({
          success: false,
          error:
            "Price of some products in your cart have changed. Please Try Again!!",
        });
        return;
      }
    }
    if (sumTotal !== req.body.subTotal) {
      res.status(200).json({
        success: false,
        error:
          "Price of some products in your cart have changed. Please Try Again!!",
      });
      return;
    }
    //Check if cart items are out of stock

    //Check if details are valid
    if (
      req.body.phone.length !== 10 ||
      !Number.isInteger(Number(req.body.phone))
    ) {
      res.status(200).json({
        success: false,
        error: "Please enter a valid 10 digit Phone number",
      });
      return;
    }
    if (
      req.body.pincode.length !== 6 ||
      !Number.isInteger(Number(req.body.pincode))
    ) {
      res.status(200).json({
        success: false,
        error: "Please enter a valid 6 digit Pincode number",
      });
      return;
    }

    //Initiate order corresponding to an orderId
    let order = new Order({
      email: req.body.email,
      name: req.body.name,
      orderId: req.body.oid,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      amount: req.body.subTotal,
      products: req.body.cart,
    });
    await order.save();
    // Initialize razorpay object
    const amount = req.body.subTotal;
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_APT_SECRET,
    });

    // Create an order -> generate the OrderID -> Send it to the Front-end
    // Also, check the amount and currency on the backend (Security measure)
    const payment_capture = 1;

    const currency = "INR";
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);

      let order1 = await Order.findOneAndUpdate(
        { orderId: req.body.oid },
        { paymentId: response.id }
      );

      res.status(200).json({ success: true, response });
    } catch (err) {
      res.status(400).json(err);
    }
  } else {
    // Handle any other HTTP method
  }
};
export default connectDB(handler);
