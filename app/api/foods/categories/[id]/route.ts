import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const { name } = await req.json();
    const category = await prisma.foodCategory.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json(
      { message: "Засварлахад алдаа гарлаа" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    await prisma.foodCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Устгахад алдаа гарлаа" },
      { status: 500 },
    );
  }
};
