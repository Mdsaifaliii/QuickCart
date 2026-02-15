"use client";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

const AllProducts = () => {
  const { products } = useAppContext();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(window.location.search);
      setSearch((params.get("search") || "").toLowerCase());
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const filteredProducts = search
    ? products.filter(
        (product) =>
          product.name?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search),
      )
    : products;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">
            {search ? `Results for "${search}"` : "All products"}
          </p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <div className="col-span-full text-gray-500 text-center w-full">
              No products found.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
