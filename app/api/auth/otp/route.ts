import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(body.email)) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }

  if (!body.otp) {
    return NextResponse.json({ message: "OTP is required" }, { status: 400 });
  }

  const otpRegex = /\d{4}/;

  if (!otpRegex.test(body.otp)) {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: body.email } });

  if (!user) {
    return NextResponse.json({ message: "Email not found" }, { status: 404 });
  }
  if (user.otpTries === 3) {
    return NextResponse.json({ message: "OTP Expired" }, { status: 403 });
  }
  try {
    const payload = jwt.verify(user.otp!, "SIGNING-OTP") as { otp: string };
    if (payload.otp !== body.otp) {
      await prisma.user.update({ where: { email: body.email }, data: { otpTries: user.otpTries + 1 } });
      return NextResponse.json({ message: "Invalid OTP" }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ message: "OTP Expired" }, { status: 404 });
  }
  const accessToken = jwt.sign(user, "My-JWT-Secret", { expiresIn: "1h" });

  return NextResponse.json({ message: "Success!", accessToken });
};
