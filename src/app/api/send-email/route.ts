import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ ENV ERROR: EMAIL_USER atau EMAIL_PASS belum diset di .env.local");
      return NextResponse.json({ error: 'Konfigurasi server bermasalah (Missing Env)' }, { status: 500 });
    }

    const body = await req.json();
    const { email, image } = body;

    if (!email || !image) {
      return NextResponse.json({ error: 'Email dan gambar wajib ada' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.verify();
      console.log("✅ Server siap mengirim email");
    } catch (verifyError) {
      console.error("❌ Gagal connect ke Gmail:", verifyError);
      return NextResponse.json({ error: 'Gagal koneksi ke Gmail. Cek password/email.' }, { status: 500 });
    }

    const info = await transporter.sendMail({
      from: '"Fotline Studio" <no-reply@fotlinestudio.com>',
      to: email,
      subject: '📸 Foto Photobooth Kamu Sudah Jadi!',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
            <h1 style="color: #000000;">Here is your photo! ✨</h1>
            <p>Terima kasih sudah mencoba Fotline Photobooth.</p>
            <p style="margin-bottom: 20px;">Silakan unduh foto kamu di lampiran.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #888;">Powered by FOTLINE</p>
        </div>
      `,
      attachments: [
        {
          filename: `fotline-${Date.now()}.png`,
          content: image,
          encoding: 'base64',
        },
      ],
    });

    console.log("✅ Email terkirim ke:", email, "MessageID:", info.messageId);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ CRITICAL ERROR:", error);
    return NextResponse.json({
      error: 'Gagal mengirim email.',
    }, { status: 500 });
  }
}