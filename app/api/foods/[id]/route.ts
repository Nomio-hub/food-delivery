import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  const body = await req.json();
  const food = await prisma.food.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(food);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  await prisma.food.delete({ where: { id } });
  return NextResponse.json({ ok: true });
};
