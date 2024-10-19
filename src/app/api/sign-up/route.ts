import UserModel from "@/model/User";
import dbConnect from "@/lib/connection";
import bcryptjs from "bcryptjs";
import { sendVerificationEmailNodeMailer } from "@/helpers/sendVerificationEmailNodeMailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        // Log incoming request data for debugging
        console.log("Registering user:", { username, email });

        const existingUserVerifiedByUserName = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUserName) {
            return NextResponse.json({
                status: 400,
                success: false,
                message: "Username is already taken",
            });
        }

        const checkUserExistByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        if (checkUserExistByEmail) {
            if (checkUserExistByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "An account already exists with this email",
                    status: 400,
                });
            } else {
                const hashedPassword = await bcryptjs.hash(password, 10);
                checkUserExistByEmail.password = hashedPassword;
                checkUserExistByEmail.verifyCode = verifyCode;
                checkUserExistByEmail.verifyCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
                await checkUserExistByEmail.save();
            }
        } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                isVerified: false,
                isAcceptingMessage: true,
                message: [],
            });
            await newUser.save();
        }

        // Send email for verification
        const emailResponse = await sendVerificationEmailNodeMailer(
            email,
            username,
            verifyCode
        );

        console.log("Email response:", emailResponse);

        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message,
                status: 500,
            });
        }

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            status: 200,
        });

    } catch (error) {
        console.error("Error while saving user:", error);
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Error while saving user",
        });
    }
}
