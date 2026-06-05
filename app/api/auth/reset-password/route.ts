import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json(
      { message: "Token болон нууц үг шаардлагатай" },
      { status: 400 },
    );
  }

  // TODO: token шалгаж, DB-д шинэ нууц үг хадгал
  // Жишээ нь:
  // const user = await findUserByResetToken(token);
  // if (!user) return NextResponse.json({ message: "Token хүчингүй" }, { status: 400 });
  // await updatePassword(user.id, password);
  // await invalidateToken(token);

  return NextResponse.json({ message: "Нууц үг амжилттай шинэчлэгдлээ" });
}
