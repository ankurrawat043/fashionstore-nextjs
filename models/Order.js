const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    orderId: { type: String, required: true },
    phone: { type: String, required: true },
    paymentId: { type: String, default: "" },
    paymentInfo: { type: String, default: "" },
    products: { type: Object, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Created", required: true },
    deliveryStatus: { type: String, default: "unshipped", required: true },
  },
  { timestamps: true }
);
// mongoose.models = {};
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
