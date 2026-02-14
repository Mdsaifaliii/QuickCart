"use client";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const statsData = [
  { id: 1, label: "Products", value: 1280 },
  { id: 2, label: "Happy Customers", value: 5400 },
  { id: 3, label: "Sellers", value: 320 },
];

const team = [
  { id: 1, name: "Aisha Khan", role: "Founder & CEO" },
  { id: 2, name: "Priya", role: "Head of Product" },
  { id: 3, name: "Sameer Patel", role: "Design Lead" },
];

const faq = [
  {
    q: "How can I sell on QuickCart?",
    a: "Head to the Seller section, create an account and add products. We handle the rest.",
  },
  {
    q: "What shipping options do you offer?",
    a: "We support standard and express shipping — costs vary by seller and location.",
  },
  {
    q: "Can I return an item?",
    a: "Returns depend on the seller's policy; open a return request from your order page.",
  },
];

export default function About() {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    let raf = null;
    let start = performance.now();
    const duration = 1200;

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCounts(statsData.map((s, i) => Math.floor(s.value * eased)));
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggleFaq(i) {
    setOpenFaq(openFaq === i ? null : i);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            {" "}
            <Link href="/">
              {" "}
              <Image
                className="cursor-pointer w-28 md:w-32"
                onClick={() => router.push("/")}
                src={assets.logo}
                alt="logo"
              />
            </Link>
          </h1>
          <p className="mt-4 text-gray-600">
            QuickCart brings local sellers and happy shoppers together. We make
            it simple to discover great products, support small businesses, and
            check out fast.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="/all-products"
              className="inline-flex items-center px-5 py-3 bg-orange-600 rounded-lg text-white hover:bg-orange-500"
            >
              Browse Products
            </a>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg">
          <div className="grid grid-cols-3 gap-4">
            {statsData.map((s, i) => (
              <div key={s.id} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
                  {counts[i]}
                </div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p className="mt-3 text-gray-600">
            To empower local sellers with an easy-to-use platform and deliver
            delightful shopping experiences to customers everywhere. We build
            thoughtfully — preserving seller control and focusing on speed and
            trust.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">Fast Checkout</h3>
              <p className="mt-2 text-sm text-gray-500">
                One-page, secure checkout with multiple payment options.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">Seller Tools</h3>
              <p className="mt-2 text-sm text-gray-500">
                Inventory, order management, and analytics for sellers.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">Local Focus</h3>
              <p className="mt-2 text-sm text-gray-500">
                Support nearby businesses and discover unique finds.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold">Customer Support</h3>
              <p className="mt-2 text-sm text-gray-500">
                Responsive help when you need it.
              </p>
            </div>
          </div>
        </div>

        <aside className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex flex-col items-center justify-center text-center">
          <Link
            href="/all-products"
            className="text-6xl hover:scale-110 transition-transform"
          >
            🛒
          </Link>
          <p className="mt-3 text-sm text-gray-700">
            <Link
              href="/all-products"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Explore Products
            </Link>
          </p>
        </aside>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Meet the Team</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {m.name.split(" ")[0][0]}
              </div>
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-gray-500">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-4 divide-y rounded-lg overflow-hidden border">
          {faq.map((f, i) => (
            <div key={i} className="bg-white">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full text-left px-4 py-4 flex justify-between items-center"
              >
                <span className="font-medium">{f.q}</span>
                <span className="ml-4 text-indigo-600">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-gray-600">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
