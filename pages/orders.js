import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      let a = await fetch("/api/myorders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: JSON.parse(localStorage.getItem("myuser")).token,
        }),
      });
      let res = await a.json();
      setOrders(res.orders);
    };
    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, []);
  return (
    <div className="container min-h-screen  mx-auto">
      <h1 className=" font-semibold text-2xl text-center p-8">My Orders</h1>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      OrderId
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Order Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item) => {
                    return (
                      <tr
                        key={item._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-slate-100"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                          {item.orderId}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {item.amount}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 ">
                          <Link
                            className="border-b dark:border-blue-500"
                            href={"/order?id=" + item._id}
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
