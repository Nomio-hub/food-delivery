import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Invalid token" });
  }
  const [_, token] = authorization.split(" ");
  try {
    const payload = jwt.verify(token, "My-JWT-Secret");
    return NextResponse.json({ message: "Success!", user: payload });
  } catch {
    return NextResponse.json({ message: "Token expired" }, { status: 401 });
  }
};
