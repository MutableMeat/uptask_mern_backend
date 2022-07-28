import Usuario from "../models/Usuario.js";

//Helpers
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

//------Registrar usuaio------
const registrarUsuario = async (req, res) => {
  const { email } = req.body;

  const usuarioExiste = await Usuario.findOne({ email });

  //Se verifica si ya existe el mismo usuario
  if (usuarioExiste) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

    //Envio de email de confirmacion
    const { email, nombre, token } = usuario;

    emailRegistro({
      nombre,
      email,
      token,
    });

    res.json({
      msg: "Usuario creado correctamente, revisa tu Email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

//------Autenticar usuaio------
const autenticarUsuario = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //Comprobar su password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

//------Confirmar usuaio------
const confirmarUsuario = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true;
    // usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado exitosamente" });
  } catch (error) {
    console.log(error);
  }
};

//------Recuperar password------
const olvidePassword = async (req, res) => {
  const { email } = req.body;

  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuario.token = generarId();
    await usuario.save();

    //Enviar el email
    const { nombre, email, token } = usuario;

    emailOlvidePassword({
      nombre,
      email,
      token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

//------Validar token para cambiar contraseña------
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "El token es valido y el usuario existe" });
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

//------Almacenar nuevo password------
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Contraseña modificada exitosamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

//------Perfil Usuario------
const perfilUsuario = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

export {
  registrarUsuario,
  autenticarUsuario,
  confirmarUsuario,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfilUsuario,
};
