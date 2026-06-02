import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { User } from "@/app/generated/prisma/client";

const JWT_SECRET = "My-JWT-Secret";

const cartInclude = {
  cartFoods: { include: { food: true } },
} as const;

class AuthError extends Error {}

const findCartByToken = (token: string) =>
  prisma.cart.findUnique({ where: { token }, include: cartInclude });

const findCartByUserId = (userId: string) =>
  prisma.cart.findFirst({ where: { userId }, include: cartInclude });

const createCart = (userId?: string) =>
  prisma.cart.create({
    data: {
      token: nanoid(),
      ...(userId && { user: { connect: { id: userId } } }),
    },
    include: cartInclude,
  });

const claimCart = (cartId: string, userId: string) =>
  prisma.cart.update({
    where: { id: cartId },
    data: { user: { connect: { id: userId } } },
    include: cartInclude,
  });

const mergeCarts = (fromId: string, toId: string) =>
  prisma.$transaction(async (tx) => {
    const fromItems = await tx.cartFood.findMany({ where: { cartId: fromId } });
    for (const item of fromItems) {
      await tx.cartFood.upsert({
        where: { foodId_cartId: { foodId: item.foodId, cartId: toId } },
        create: { foodId: item.foodId, cartId: toId, quantity: item.quantity },
        update: { quantity: { increment: item.quantity } },
      });
    }
    await tx.cartFood.deleteMany({ where: { cartId: fromId } });
    await tx.cart.delete({ where: { id: fromId } });
  });

const getUserIdFromAuth = (authorization: string | null): string | null => {
  if (!authorization) return null;
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !token) throw new AuthError();
  try {
    const payload = jwt.verify(token, JWT_SECRET) as User;
    return payload.id;
  } catch {
    throw new AuthError();
  }
};

export const GET = async (req: NextRequest) => {
  let userId: string | null;
  try {
    userId = getUserIdFromAuth(req.headers.get("authorization"));
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    throw e;
  }

  const cartToken = req.headers.get("x-cart-token");
  const guestCart = cartToken ? await findCartByToken(cartToken) : null;

  if (!userId) {
    return NextResponse.json(guestCart ?? (await createCart()));
  }

  const userCart = await findCartByUserId(userId);

  // Only adopt the guest cart if it's unowned or already belongs to this user.
  const claimable =
    guestCart && (!guestCart.userId || guestCart.userId === userId)
      ? guestCart
      : null;

  if (claimable && userCart && claimable.id !== userCart.id) {
    await mergeCarts(claimable.id, userCart.id);
    return NextResponse.json(await findCartByUserId(userId));
  }

  if (claimable && !userCart) {
    return NextResponse.json(
      claimable.userId === userId ? claimable : await claimCart(claimable.id, userId),
    );
  }

  return NextResponse.json(userCart ?? (await createCart(userId)));
};
