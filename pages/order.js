import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Order from "@/models/Order";
import mongoose from "mongoose";
import Image from "next/image";

function MyOrder({ order, clearCart }) {
  const router = useRouter();
  const [date, setDate] = useState();
  useEffect(() => {
    const d = new Date(order.createdAt);
    setDate(d);
    if (router.query.clearcart == 1) {
      clearCart();
    }
  }, []);

  let products = order.products;
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 ml-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              FASHION STORE
            </h2>
            <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-4">
              Order Id : {order.orderId}
            </h1>

            <p className="leading-relaxed mb-4">
              Your Order has been successfully placed.
            </p>
            <p className="leading-relaxed mb-4">
              Order placed on:{date && date.toLocaleDateString("en-IN")}
            </p>
            <p>
              Your Payment Status is:{" "}
              <b className="text-green-400">{order.status}</b>
            </p>
            <div className="flex mb-4">
              <a className="flex-grow text-center border-b-2 border-gray-300 py-2 text-lg px-1">
                Item Description
              </a>
              <a className="flex-grow text-center border-b-2 border-gray-300 py-2 text-lg px-1">
                Quantity
              </a>
              <a className="flex-grow text-center border-b-2 border-gray-300 py-2 text-lg px-1">
                Item Price
              </a>
            </div>
            {Object.keys(products).map((key) => {
              return (
                <div key={key} className="flex  border-gray-200 py-2">
                  <span className="text-gray-500">
                    {products[key].name}({products[key].size}/
                    {products[key].variant})
                  </span>
                  <span className="m-auto text-gray-900">
                    {products[key].qty}
                  </span>
                  <span className="m-auto text-gray-900">
                    {products[key].price * products[key].qty}
                  </span>
                </div>
              );
            })}

            <div className="flex flex-col">
              <span className="title-font font-medium text-2xl text-gray-900 mt-8">
                SubTotal: ₹{order.amount}
              </span>
              <div className="my-6">
                <button className="flex mx-0 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                  Track Order
                </button>
              </div>
            </div>
          </div>
          <img
            alt="ecommerce"
            className="lg:w-1/3 w-50 lg:h-full h-64 object-cover object-center rounded"
            src="https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/b/r/g/s-cmb-po2-dab-wynk-smartees-original-imagm5vhumtz8epz.jpeg?q=70"
          />
        </div>
      </div>
    </section>
  );
}

export const getServerSideProps = async (context) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URL);
  }
  let order = await Order.findById(context.query.id);

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
};

export default MyOrder;
