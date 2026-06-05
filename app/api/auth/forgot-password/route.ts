import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// TODO: DB-тай холбогдсон үед token-г хадгалах
// await saveResetToken(user.id, token, expiry);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: "Email шаардлагатай" },
      { status: 400 },
    );
  }

  // TODO: DB-с хэрэглэгч хайх
  // const user = await findUserByEmail(email);
  // if (!user) return NextResponse.json({ message: "Хэрэглэгч олдсонгүй" }, { status: 404 });

  const token = crypto.randomBytes(32).toString("hex");
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Food App" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Нууц үг шинэчлэх",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Нууц үг шинэчлэх</h2>
        <p>Доорх товчийг дарж нууц үгээ шинэчлэнэ үү. Линк 1 цагийн дараа хүчингүй болно.</p>
        <a href="${resetLink}"
          style="display:inline-block; padding: 12px 24px; background:#000;
                 color:#fff; border-radius:8px; text-decoration:none; margin-top:16px;">
          Нууц үг шинэчлэх
        </a>
        <p style="margin-top:16px; color:#888; font-size:12px;">
          Хэрэв та энэ хүсэлт гаргаагүй бол энэ имэйлийг үл тоомсорлоно уу.
        </p>
      </div>
    `,
  });

  return NextResponse.json({ message: "Имэйл илгээгдлээ" });
}
