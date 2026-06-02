import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const categories = await prisma.foodCategory.findMany({
    include: {
      foods: true,
    },
  });
  return NextResponse.json(categories);
};
