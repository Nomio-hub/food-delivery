import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { User } from "@/app/generated/prisma/client";

const JWT_SECRET = "My-JWT-Secret";

const getUserId = (req: NextRequest): string | null => {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  const payload = jwt.verify(token, JWT_SECRET) as User;
  return payload.id;
};

// Захиалга үүсгэх
export const POST = async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { address, items } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const totalPrice = items.reduce(
    (sum: number, item: { quantity: number; price: number }) =>
      sum + item.quantity * item.price,
    0,
  );

  const order = await prisma.foodOrder.create({
    data: {
      userId,
      totalPrice,
      address,
      foodOrderItems: {
        create: items.map((item: { foodId: string; quantity: number }) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      foodOrderItems: { include: { food: true } },
    },
  });

  return NextResponse.json(order);
};

// Захиалгын түүх авах
export const GET = async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.foodOrder.findMany({
    where: { userId },
    include: { foodOrderItems: { include: { food: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
};
