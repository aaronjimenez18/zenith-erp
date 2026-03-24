import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name?: string | null
) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
  const firstName = name?.split(" ")[0] || "Usuario";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f6f9fc;">
      <div style="background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #333; text-align: center; margin-bottom: 24px;">¡Hola, ${firstName}!</h1>
        <p style="color: #555; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
          Gracias por registrarte en ERP SaaS. Para completar tu registro y activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 500;">
            Verificar correo electrónico
          </a>
        </div>
        <p style="color: #555; font-size: 14px; margin-bottom: 16px;">
          Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:
        </p>
        <p style="color: #0070f3; font-size: 14px; word-break: break-all;">
          ${verifyUrl}
        </p>
        <hr style="border: none; border-top: 1px solid #e6ebf1; margin: 32px 0;">
        <p style="color: #8898aa; font-size: 14px;">
          Este enlace de verificación expirará en 24 horas. Si no solicitaste este registro, puedes ignorar este correo.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"ERP SaaS" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verifica tu correo electrónico",
      html,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: String(error) };
  }
}
