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
      claimable.userId === userId
        ? claimable
        : await claimCart(claimable.id, userId),
    );
  }

  return NextResponse.json(userCart ?? (await createCart(userId)));
};
export const PATCH = async (req: NextRequest) => {
  let userId: string | null;
  try {
    userId = getUserIdFromAuth(req.headers.get("authorization"));
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    throw e;
  }

  const { foodId, deleteAll } = await req.json();
  const cartToken = req.headers.get("x-cart-token");

  // cart олох
  let cart;
  if (userId) {
    cart = await findCartByUserId(userId);
  } else {
    cart = cartToken ? await findCartByToken(cartToken) : null;
  }

  if (!cart) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  if (deleteAll) {
    await prisma.cartFood.delete({
      where: { foodId_cartId: { foodId, cartId: cart.id } },
    });
  } else {
    const item = await prisma.cartFood.findUnique({
      where: { foodId_cartId: { foodId, cartId: cart.id } },
    });
    if (item && item.quantity > 1) {
      await prisma.cartFood.update({
        where: { foodId_cartId: { foodId, cartId: cart.id } },
        data: { quantity: { decrement: 1 } },
      });
    } else {
      await prisma.cartFood.delete({
        where: { foodId_cartId: { foodId, cartId: cart.id } },
      });
    }
  }

  return NextResponse.json(
    await prisma.cart.findUnique({
      where: { id: cart.id },
      include: cartInclude,
    }),
  );
};
export const POST = async (req: NextRequest) => {
  let userId: string | null;
  try {
    userId = getUserIdFromAuth(req.headers.get("authorization"));
  } catch (e) {
    if (e instanceof AuthError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    throw e;
  }

  const { foodId, quantity = 1 } = await req.json();
  const cartToken = req.headers.get("x-cart-token");

  let cart;
  if (userId) {
    cart = (await findCartByUserId(userId)) ?? (await createCart(userId));
  } else {
    cart =
      (cartToken ? await findCartByToken(cartToken) : null) ??
      (await createCart());
  }

  await prisma.cartFood.upsert({
    where: { foodId_cartId: { foodId, cartId: cart.id } },
    create: { foodId, cartId: cart.id, quantity },
    update: { quantity: { increment: quantity } },
  });

  return NextResponse.json(
    await prisma.cart.findUnique({
      where: { id: cart.id },
      include: cartInclude,
    }),
  );
};
