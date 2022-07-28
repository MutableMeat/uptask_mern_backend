import express from "express";
import {
  registrarUsuario,
  autenticarUsuario,
  confirmarUsuario,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfilUsuario,
} from "../controllers/usuarioController.js";

import checkAuth from "../middlewares/checkAuth.js";

const router = express.Router();

//Autenticacion, registro y confirmacion de usuarios
router.post("/", registrarUsuario);
router.post("/login", autenticarUsuario);
router.get("/confirmar/:token", confirmarUsuario);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.get("/perfil", checkAuth, perfilUsuario);

export default router;
