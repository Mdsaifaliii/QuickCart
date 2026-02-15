"use client";
import React, { useState, useEffect } from "react";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { Menu, X, Search } from "lucide-react";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn, signOut } = useClerk();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // 🔒 BODY SCROLL LOCK (mobile fix)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [menuOpen]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <nav className="w-full border-b border-gray-300 bg-white relative z-40">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-3">
        {/* LOGO */}
        <Image
          src={assets.logo}
          alt="logo"
          className="w-24 sm:w-28 md:w-32 cursor-pointer"
          onClick={() => router.push("/")}
        />

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/all-products">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="text-xs border px-4 py-1.5 rounded-full"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <button onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={18} />
          </button>

          {/* PROFILE */}
          {user ? (
            !isMobile ? (
              <div className="relative z-[100]">
                <UserButton afterSignOutUrl="/">
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Manage Account"
                      onClick={() => router.push("/user-profile")}
                    />

                    <UserButton.Action
                      label="Cart"
                      labelIcon={<CartIcon />}
                      onClick={() => router.push("/cart")}
                    />

                    <UserButton.Action
                      label="My Orders"
                      labelIcon={<BagIcon />}
                      onClick={() => router.push("/my-orders")}
                    />

                    <hr className="my-2 border-gray-200" />
                    <UserButton.Action label="Sign Out" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <div className="relative z-[100]">
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="flex items-center gap-2"
                >
                  <Image src={assets.user_icon} alt="user" />
                </button>

                {profileOpen && (
                  <div className="fixed inset-0 z-[200] bg-white p-6">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-lg font-medium">Account</p>
                      <button onClick={() => setProfileOpen(false)}>
                        <X size={24} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        onClick={() => {
                          router.push("/user-profile");
                          setProfileOpen(false);
                        }}
                        className="text-left px-4 py-3 border rounded"
                      >
                        Manage Account
                      </button>

                      <button
                        onClick={() => {
                          router.push("/cart");
                          setProfileOpen(false);
                        }}
                        className="text-left px-4 py-3 border rounded flex items-center gap-3"
                      >
                        <CartIcon /> Cart
                      </button>

                      <button
                        onClick={() => {
                          router.push("/my-orders");
                          setProfileOpen(false);
                        }}
                        className="text-left px-4 py-3 border rounded flex items-center gap-3"
                      >
                        <BagIcon /> My Orders
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            await signOut?.();
                          } catch (err) {}
                          router.push("/");
                          setProfileOpen(false);
                        }}
                        className="text-left px-4 py-3 border rounded"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <button onClick={openSignIn} className="flex items-center gap-2">
              <Image src={assets.user_icon} alt="user" />
              <span className="hidden sm:block">Account</span>
            </button>
          )}

          {/* HAMBURGER */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* SEARCH INPUT */}
      {searchOpen && (
        <div className="px-4 sm:px-8 md:px-16 pb-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      )}

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 py-5 space-y-4 text-sm border-t bg-white">
          <Link onClick={() => setMenuOpen(false)} href="/">
            Home
          </Link>
          <Link onClick={() => setMenuOpen(false)} href="/all-products">
            Shop
          </Link>
          <Link onClick={() => setMenuOpen(false)} href="/about">
            About Us
          </Link>
          <Link onClick={() => setMenuOpen(false)} href="/contact">
            Contact
          </Link>

          {isSeller && (
            <button
              onClick={() => {
                router.push("/seller");
                setMenuOpen(false);
              }}
              className="text-left text-xs border px-4 py-2 rounded-full"
            >
              Seller Dashboard
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
