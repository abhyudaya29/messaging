import dbConnect from "@/lib/connection";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { acceptMessages, userId } = await request.json();

  try {
    // Connect to the database
    await dbConnect();

    // Fetch and update user data based on the userId
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: "Failed to update user status to accept message",
        status: 401,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message acceptance status updated successfully",
      status: 200,
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    await dbConnect();

    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      isAcceptingMessages: foundUser.isAcceptingMessage,
      status: 200,
    });

  } catch (error) {
    console.log("Error while fetching user data:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      status: 500,
    });
  }
}
