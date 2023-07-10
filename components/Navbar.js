import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaShoppingCart } from "react-icons/fa";
import { BsFillBagFill } from "react-icons/bs";
import { MdAccountBox } from "react-icons/md";
import {
  AiFillCloseSquare,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";

function Navbar({
  logout,
  user,
  addToCart,
  removeFromCart,
  cart,
  clearCart,
  subTotal,
}) {
  const ref = useRef();
  const [dropdown, setDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true);
    let exempted = ["/checkout", "/order", "/orders"];
    if (exempted.includes(router.pathname)) {
      setSidebar(false);
    }
  }, []);

  const toggleCart = () => {
    setSidebar(!sidebar);
    // if (ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-full");
    //   ref.current.classList.add("translate-x-0");
    // } else if (!ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-0");
    //   ref.current.classList.add("translate-x-full");
    // }
  };

  return (
    <>
      {dropdown && (
        <div
          onMouseOver={() => {
            setDropdown(true);
          }}
          onMouseLeave={() => {
            setDropdown(false);
          }}
          className="absolute z-20 top-12 text-center right-8 rounded-md px-5 bg-violet-400 w-36"
        >
          <ul>
            <Link href={"/myaccount"}>
              <li className="py-1 text-sm font-bold hover:text-red-200">
                Profile
              </li>
            </Link>
            <Link href={"/orders"}>
              <li className="py-1 text-sm font-bold hover:text-red-200">
                Orders
              </li>
            </Link>
            <li
              onClick={logout}
              className="py-1 text-sm font-bold hover:text-red-200"
            >
              <button>Logout</button>
            </li>
          </ul>
        </div>
      )}
      <div
        className={`flex flex-col justify-center md:flex-row md:justify-start items-center py-2 sticky z-10 shadow-md top-0 bg-white ${
          !sidebar && "overflow-hidden"
        }
      `}
      >
        <div className="logo mr-auto md:mx-5 my-2 cursor-pointer">
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt="logo"
              height={"5"}
              width={"150"}
              priority
              className="rounded-md "
            />
          </Link>
        </div>
        <div className="nav">
          <ul className="flex items-center space-x-8 font-bold md:text-xl">
            <Link href={"/tshirts"}>
              <li className="hover:text-pink-800">T-shirts</li>
            </Link>
            <Link href={"/hoodies"}>
              <li className="hover:text-pink-800">Hoodies</li>
            </Link>
            <Link href={"/mugs"}>
              <li className="hover:text-pink-800">Mugs</li>
            </Link>
            <Link href={"/stickers"}>
              <li className="hover:text-pink-800">Stickers</li>
            </Link>
          </ul>
        </div>
        <div className="cart absolute items-center right-0 top-6 mx-5 cursor-pointer flex">
          <div
            onMouseOver={() => {
              setDropdown(true);
            }}
            onMouseLeave={() => {
              setDropdown(false);
            }}
          >
            {user.value && (
              <MdAccountBox className="text-xl md:text-2xl mx-2" />
            )}
          </div>
          {!user.value && (
            <Link href={"/login"}>
              <button className="flex mr-2  text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded text-sm">
                Login
              </button>
            </Link>
          )}
          <FaShoppingCart
            className="text-xl md:text-2xl"
            onClick={toggleCart}
          />
        </div>
        <div
          ref={ref}
          className={`sideCart overflow-y-scroll absolute w-72 h-[100vh] top-0 px-8 py-10 bg-red-100  transition-all ${
            sidebar ? "right-0" : "-right-96"
          }`}
        >
          <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
          <span
            onClick={toggleCart}
            className="absolute top-2 right-2 cursor-pointer text-2xl"
          >
            <AiFillCloseSquare />
          </span>
          <ol className="list-decimal font-semibold">
            {Object.keys(cart).length == 0 && (
              <div className="my-4 font-semibold">Your cart is Empty!!</div>
            )}
            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex my-5">
                    <div className="font-semibold w-2/3">
                      {cart[k].name}({cart[k].size}/{cart[k].variant})
                    </div>
                    <div className="w-1/3 font-semibold flex items-center justify-center ">
                      <AiOutlineMinusCircle
                        onClick={() => {
                          removeFromCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          );
                        }}
                        className="cursor-pointer text-4xl"
                      />
                      <span className="mx-2">{cart[k].qty}</span>
                      <AiOutlinePlusCircle
                        onClick={() => {
                          addToCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].name,
                            cart[k].size,
                            cart[k].variant
                          );
                        }}
                        className="cursor-pointer text-4xl"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="total font-bold my-2">SubTotal :₹{subTotal}</div>
          <div className="flex">
            <Link href={"/checkout"}>
              <button
                disabled={Object.keys(cart).length == 0}
                className="disabled:bg-indigo-300 flex mr-2  text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded text-sm"
              >
                <BsFillBagFill className="m-1" /> Checkout
              </button>
            </Link>
            <button
              disabled={Object.keys(cart).length == 0}
              onClick={clearCart}
              className="disabled:bg-indigo-300  flex mr-2  text-white bg-indigo-500 border-0 py-2 px-2 focus:outline-none hover:bg-indigo-600 rounded text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
