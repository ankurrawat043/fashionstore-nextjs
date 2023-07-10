import connectDB from "@/middleware/mongoose";
import Product from "@/models/Product";

const handler = async (req, res) => {
  if (req.method == "POST") {
    for (let i = 0; i < req.body.length; i++) {
      let p = new Product({
        title: req.body[i].title,
        desc: req.body[i].desc,
        slug: req.body[i].slug,
        img: req.body[i].img,
        category: req.body[i].category,
        size: req.body[i].size,
        color: req.body[i].color,
        availableQty: req.body[i].availableQty,
        price: req.body[i].price,
      });
      await p.save();
    }
    res.status(200).json({ success: "success" });
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};
export default connectDB(handler);
