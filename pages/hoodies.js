import React from "react";
import Link from "next/link";
import Product from "@/models/Product";
import mongoose from "mongoose";

function Hoodies({ products }) {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap m-4 justify-center">
            {Object.keys(products).length === 0 && (
              <p>
                Sorry All the Hoodies are out of stock. Please comeback later
              </p>
            )}
            {Object.keys(products).map((item) => {
              return (
                <Link
                  key={products[item]._id}
                  passHref={true}
                  href={`/product/${products[item].slug}`}
                  className=" lg:w-1/5 md:w-1/2 p-4 w-full  m-5 cursor-pointer shadow-lg"
                >
                  <div className="block relative rounded overflow-hidden">
                    <img
                      alt="ecommerce"
                      className="  block m-auto"
                      src={products[item].img}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                      Hoodies
                    </h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      {products[item].title}
                    </h2>
                    <p className="mt-1"> ₹{products[item].price}</p>
                    <div className="mt-1">
                      {products[item].size.includes("S") && (
                        <span className="mx-1 px-1 border border-gray-600">
                          S
                        </span>
                      )}
                      {products[item].size.includes("M") && (
                        <span className="mx-1 px-1 border border-gray-600">
                          M
                        </span>
                      )}
                      {products[item].size.includes("L") && (
                        <span className="mx-1 px-1 border border-gray-600">
                          L
                        </span>
                      )}
                      {products[item].size.includes("XL") && (
                        <span className="mx-1 px-1 border border-gray-600">
                          XL
                        </span>
                      )}
                      {products[item].size.includes("XXL") && (
                        <span className="mx-1 px-1 border border-gray-600">
                          XXL
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      {products[item].color.includes("red") && (
                        <button className="border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("green") && (
                        <button className="border-2 border-gray-300 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("black") && (
                        <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("blue") && (
                        <button className="border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URL);
  }
  let products = await Product.find({ category: "hoodies" });
  let hoodies = {};
  for (let item of products) {
    if (item.title in hoodies) {
      if (
        !hoodies[item.title].color.includes(item.color) &&
        item.availableQty > 0
      ) {
        hoodies[item.title].color.push(item.color);
      }
      if (
        !hoodies[item.title].size.includes(item.size) &&
        item.availableQty > 0
      ) {
        hoodies[item.title].size.push(item.size);
      }
    } else {
      hoodies[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQty > 0) {
        hoodies[item.title].color = [item.color];
        hoodies[item.title].size = [item.size];
      }
    }
  }

  return { props: { products: JSON.parse(JSON.stringify(hoodies)) } };
};

export default Hoodies;
