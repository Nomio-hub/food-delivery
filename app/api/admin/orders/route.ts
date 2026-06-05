import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — бүх захиалга (admin)
export const GET = async () => {
  const orders = await prisma.foodOrder.findMany({
    include: {
      user: { select: { email: true } },
      foodOrderItems: { include: { food: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
};

// PATCH — олон захиалгын status өөрчлөх
export const PATCH = async (req: NextRequest) => {
  const { ids, status } = await req.json();
  await prisma.foodOrder.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });
  return NextResponse.json({ ok: true });
};
