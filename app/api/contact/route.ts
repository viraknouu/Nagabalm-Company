import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message, phone, subject } = await req.json();

    // 1) Configure SMTP transporter (Gmail)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL
      secure: true, // true for 465, false for 587 (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`, // must be your Gmail
      to: process.env.TO_EMAIL, // recipient
      subject: `New message from ${name} - ${subject}`, // add subject in mail subject line too
      text: `Name: ${name}
    Email: ${email}
    Message: ${message}
    `,
      html: `<p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>
    <p><b>Subject:</b> ${subject}</p>
    <p><b>Message:</b><br/>${message.replace(/\n/g, "<br/>")}</p>
    `,
      replyTo: email,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
