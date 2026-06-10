// NodemailerEmailNotifier.js — Adaptador de infraestructura: implementación de IEmailNotifier con Nodemailer
// Encapsula el transporte SMTP de Gmail y el formato de los correos enviados por la plataforma.

const nodemailer = require('nodemailer');

const BRAND_COLOR = '#1F4E79';

class NodemailerEmailNotifier {
  constructor(emailUser, emailPass) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    this.from = `UCEConnect <${emailUser}>`;
  }

  async sendVerificationCode(email, code) {
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Código de verificación — UCEConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background-color: ${BRAND_COLOR}; color: #ffffff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 20px;">UCEConnect</h1>
            <p style="margin: 8px 0 0;">Verificación de cuenta</p>
          </div>
          <div style="border: 1px solid #e0e0e0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="color: #333333; font-size: 15px;">Usa el siguiente código para verificar tu cuenta:</p>
            <div style="display: inline-block; background-color: #f0f4f8; color: ${BRAND_COLOR}; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 24px; border-radius: 8px; margin: 16px 0;">
              ${code}
            </div>
            <p style="color: #666666; font-size: 13px;">Este código expira en 5 minutos. Si no solicitaste esta verificación, puedes ignorar este correo.</p>
          </div>
        </div>
      `,
    });
  }

  async sendWelcome(email, name) {
    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: '¡Bienvenido a UCEConnect!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: ${BRAND_COLOR};">Hola, ${name} 👋</h2>
          <p style="color: #333333; font-size: 15px;">
            Tu cuenta en <strong>UCEConnect</strong> ha sido verificada exitosamente.
            Ya puedes iniciar sesión y comenzar a reportar y dar seguimiento a tus incidencias.
          </p>
          <p style="color: #666666; font-size: 13px;">Universidad Central del Ecuador</p>
        </div>
      `,
    });
  }
}

module.exports = NodemailerEmailNotifier;
