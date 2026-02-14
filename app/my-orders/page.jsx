"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Please log in to view orders");
        setLoading(false);
        return;
      }

      console.log("Token:", token.substring(0, 20) + "...");
      console.log("User:", user);

      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response Status:", data.success);
      console.log("Orders response:", data);

      if (data.success) {
        console.log("Orders count:", data.orders?.length || 0);
        setOrders(data.orders ? data.orders.reverse() : []);
        if (!data.orders || data.orders.length === 0) {
          console.log("No orders found for this user");
          toast.success("No orders yet");
        }
      } else {
        console.log("API Error:", data.message);
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error.response?.data || error.message,
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error fetching orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium mt-6">My Orders</h2>
            <button
              onClick={() => {
                setLoading(true);
                fetchOrders();
              }}
              className="mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 text-sm"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">
                No orders yet. Start shopping now!
              </p>
            </div>
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => {
                const firstItem =
                  order.items && order.items.length > 0 ? order.items[0] : null;
                const firstProduct =
                  firstItem && typeof firstItem.product === "object"
                    ? firstItem.product
                    : firstItem
                    ? firstItem.product
                    : null;
                const firstProductId = firstProduct
                  ? firstProduct._id || firstProduct.id || firstProduct
                  : null;

                return (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                  >
                    <div className="flex-1 flex gap-5 max-w-80">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                        {firstProductId ? (
                          <Link href={`/product/${firstProductId}`}>
                            <Image
                              className="object-cover w-full h-full"
                              src={
                                firstProduct &&
                                firstProduct.image &&
                                firstProduct.image[0]
                                  ? firstProduct.image[0]
                                  : assets.box_icon
                              }
                              alt={
                                firstProduct && firstProduct.name
                                  ? firstProduct.name
                                  : "product"
                              }
                              width={64}
                              height={64}
                            />
                          </Link>
                        ) : (
                          <Image
                            className="object-cover w-full h-full"
                            src={
                              order.items &&
                              order.items.length > 0 &&
                              order.items[0].product &&
                              order.items[0].product.image &&
                              order.items[0].product.image[0]
                                ? order.items[0].product.image[0]
                                : assets.box_icon
                            }
                            alt={
                              order.items &&
                              order.items.length > 0 &&
                              order.items[0].product &&
                              order.items[0].product.name
                                ? order.items[0].product.name
                                : "product"
                            }
                            width={64}
                            height={64}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-base">
                          {order.items && order.items.length > 0
                            ? order.items.map((item, idx) => {
                                const prod =
                                  typeof item.product === "object"
                                    ? item.product
                                    : null;
                                const name = prod ? prod.name : "Product";
                                const price = prod
                                  ? prod.offerPrice
                                  : item.price || "-";
                                const pid = prod
                                  ? prod._id || prod.id
                                  : typeof item.product === "string"
                                  ? item.product
                                  : null;
                                return (
                                  <span key={idx} className="block">
                                    {pid ? (
                                      <Link
                                        href={`/product/${pid}`}
                                        className="underline text-orange-600 mr-2"
                                      >
                                        {name}
                                      </Link>
                                    ) : (
                                      <span className="mr-2">{name}</span>
                                    )}
                                    x {item.quantity} • {currency}
                                    {price}
                                  </span>
                                );
                              })
                            : "No items"}
                        </p>
                        <span className="text-sm text-gray-600">
                          Items : {order.items?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">
                          {typeof order.address === "object"
                            ? order.address?.fullName
                            : "Saved Address"}
                        </span>
                        <br />
                        <span>
                          {typeof order.address === "object"
                            ? order.address?.area
                            : "-"}
                        </span>
                        <br />
                        <span>
                          {typeof order.address === "object"
                            ? `${order.address?.city}, ${order.address?.state}`
                            : "-"}
                        </span>
                        <br />
                        <span>
                          {typeof order.address === "object"
                            ? order.address?.phoneNumber
                            : "-"}
                        </span>
                      </p>
                    </div>
                    <p className="font-medium my-auto">
                      {currency}
                      {order.amount}
                    </p>
                    <div>
                      <p className="flex flex-col">
                        <span>Method : COD</span>
                        <span>
                          Date : {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span>Payment : Pending</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
