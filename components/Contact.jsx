"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim())
      return false;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return false;
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      setStatus({
        type: "error",
        msg: "Please provide a valid name, email and message.",
      });
      return;
    }
    setLoading(true);
    setStatus({ type: "sending", msg: "Sending message..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Server error");
      setStatus({ type: "success", msg: data.message || "Message received." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.message || "Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-4">
            <span>Contact</span>
            <Link href="/">
              <Image
                className="cursor-pointer w-28 md:w-32"
                src={assets.logo}
                alt="logo"
                width={112}
                height={112}
              />
            </Link>
          </h1>
          <p className="mt-3 text-gray-600">
            Have a question, partnership idea, or need help? Send us a message
            and we'll reply quickly.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-orange-600 text-xl">📧</div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-600">
                  contact@QuickCart.gmail.com
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-orange-600 text-xl">📞</div>
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-sm text-gray-600">+1-234-567-890</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-orange-600 text-xl">📍</div>
              <div>
                <div className="font-medium">Headquarters</div>
                <div className="text-sm text-gray-600">
                  123 Market St, Suite 400, Cityville
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject (optional)
              </label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Quick question about orders"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 disabled:opacity-60"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : null}
                Send Message
              </button>
              {status && (
                <div
                  className={`text-sm ${
                    status.type === "error" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {status.msg}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
