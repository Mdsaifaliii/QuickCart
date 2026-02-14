import connectDB from "@/config/db";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body || {};

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, message: "Missing required fields." },
                { status: 400 }
            );
        }

        await connectDB();

        const newContact = await Contact.create({
            name,
            email,
            subject: subject || "",
            message,
        });

        console.log("Contact message saved:", newContact);

        return NextResponse.json({
            success: true,
            message: "Thanks — your message was received. We'll get back to you soon.",
            contactId: newContact._id,
        });
    } catch (err) {
        console.error("Contact API error:", err);
        return NextResponse.json(
            { success: false, message: err.message || "Server error" },
            { status: 500 }
        );
    }
}
