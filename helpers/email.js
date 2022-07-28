import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Informacion del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de tareas" <cuentas@uptask.com>',
    to: email,
    subject: "Uptask - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: ` <p> Hola ${nombre} comprueba tu cuenta en UpTask</p>
    <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace </p>
    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje </p>
    `,
  });
};

const emailOlvidePassword = async (datos) => {
  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //Informacion del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de tareas" <cuentas@uptask.com>',
    to: email,
    subject: "Uptask - Reestablece tu password",
    text: "Reestablece tu password",
    html: ` <p> Hola ${nombre} has solicitado reestablecer tu password</p>
    <p> Sigue el siguiente enlace para generar un nuevo password:</p>
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer password</a>
    <p>Si tu no solicitaste este mail, puedes ignorar este mensaje </p>
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
