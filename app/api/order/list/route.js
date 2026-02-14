import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Product from '@/models/Product';

export async function GET(request) {
    try {
        const { userId: clerkUserId } = getAuth(request);

        if (!clerkUserId) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        await connectDB();

        console.log("Fetching orders for userId:", clerkUserId);

        // Orders are saved with userId as the Clerk ID (from user._id which is Clerk ID)
        const orders = await Order.find({ userId: clerkUserId }).sort({ date: -1 });

        console.log("Orders found:", orders.length);

        // Collect all product ids from all orders to fetch product details in one query
        const productIds = [];
        orders.forEach(order => {
            (order.items || []).forEach(item => {
                if (item && item.product) productIds.push(item.product.toString());
            });
        });

        let productsMap = {};
        if (productIds.length > 0) {
            const uniqueIds = [...new Set(productIds)];
            const products = await Product.find({ _id: { $in: uniqueIds } }).select('name offerPrice image');
            productsMap = products.reduce((acc, p) => {
                acc[p._id.toString()] = p;
                return acc;
            }, {});
        }

        // Attach product details to each order item (if available)
        const enrichedOrders = orders.map(order => {
            const items = (order.items || []).map(item => {
                const prod = productsMap[item.product?.toString()];
                return {
                    ...item._doc ? item._doc : item,
                    product: prod ? {
                        _id: prod._id,
                        name: prod.name,
                        offerPrice: prod.offerPrice,
                        image: prod.image
                    } : item.product
                };
            });
            return {
                ...order._doc ? order._doc : order,
                items
            };
        });

        return NextResponse.json({ success: true, orders: enrichedOrders });
    } catch (error) {
        console.error("Order list error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}