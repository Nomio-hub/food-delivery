import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  headers();
  const result = await prisma.food.findMany({ include: { category: true } });
  return NextResponse.json(result);
};

export const POST = async (req: NextRequest) => {
  const { foodCategoryId, ...restBody }: Prisma.FoodUncheckedCreateInput = await req.json();

  const result = await prisma.food.create({
    data: {
      ...restBody,
      category: {
        connect: {
          id: foodCategoryId,
        },
      },
    },
    include: {
      category: true,
    },
  });
  return NextResponse.json(result);
};
