import dbConnect from "@/lib/connection";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Get user messages from the database
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Extract userId from the request URL query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log(userId, "userId");

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Convert userId to ObjectId
    const UserId = new mongoose.Types.ObjectId(userId);
    console.log(UserId, "UserId");

    // Aggregate messages for the given user
    const user = await UserModel.aggregate([
      { $match: { _id: UserId } },
      { $unwind: "$message" },
      { $sort: { 'message.createdAt': -1 } },
      { $group: { _id: "$_id", messages: { $push: "$message" } } }
    ]);

    console.log(user, "user");

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found or no messages available' }, { status: 404 });
    }

    // Return the messages of the user
    return NextResponse.json({
      success: true,
      messages: user[0].messages,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
