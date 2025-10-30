import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { userId: clerkUserId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    // Find MongoDB user by Clerk ID
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // calculate total
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) amount += product.offerPrice * item.quantity;
    }

    await inngest.send({
      name: "order/created",
      data: {
        userId: user._id, // now using MongoDB ID
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
    console.log(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
