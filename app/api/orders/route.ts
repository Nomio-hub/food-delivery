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

  const { address } = await req.json();

  // Хэрэглэгчийн cart олох
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { cartFoods: { include: { food: true } } },
  });

  if (!cart || cart.cartFoods.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  const totalPrice = cart.cartFoods.reduce(
    (sum, cf) => sum + cf.quantity * cf.food.price,
    0,
  );

  // Захиалга үүсгэх
  const order = await prisma.foodOrder.create({
    data: {
      userId,
      totalPrice,
      address,
      foodOrderItems: {
        create: cart.cartFoods.map((cf) => ({
          foodId: cf.foodId,
          quantity: cf.quantity,
        })),
      },
    },
    include: {
      foodOrderItems: { include: { food: true } },
    },
  });

  // Cart-г хоослох
  await prisma.cartFood.deleteMany({ where: { cartId: cart.id } });

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
