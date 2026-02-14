import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request) {
  try {
    const authObj = getAuth(request);
    const clerkUserId = authObj?.userId;

    console.log("Auth object:", authObj);
    console.log("ClerkUserId:", clerkUserId);

    const { address, items } = await request.json();

    if (!clerkUserId) {
      console.error("No userId found in auth");
      return NextResponse.json({
        success: false,
        message: "Not authenticated. Please log in."
      }, { status: 401 });
    }

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // Find or create user
    let user = await User.findById(clerkUserId);
    if (!user) {
      console.log("User not found, creating new user:", clerkUserId);
      user = await User.create({
        _id: clerkUserId,
        email: "user@quickcart.com",
        name: "QuickCart User",
        imageUrl: "",
        cartItems: {},
      });
    }

    // calculate total
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) amount += product.offerPrice * item.quantity;
    }

    console.log("Sending order to Inngest for userId:", user._id);

    await inngest.send({
      name: "order/created",
      data: {
        userId: user._id,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02),
        date: Date.now(),
      },
    });

    // Clear user cart
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
