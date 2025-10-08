const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const { check } = require('express-validator');
const runValidation = require('../middlewares/validate');

const JWT_SECRET = process.env.JWT_SECRET; 

router.post(
    '/login',
    [
        check('usuario').trim().notEmpty().withMessage('Usuario es obligatorio'),
        check('contrasena_hash').trim().notEmpty().withMessage('Contraseña es obligatoria'),
    ],
    runValidation,
    async (req, res) => {
        const { usuario, contrasena_hash } = req.body;

        try {
            const result = await db.query(
                'SELECT id_usuario, usuario, correo, contrasena_hash, tipo FROM usuario WHERE usuario = $1',
                [usuario]
            );

            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            const passwordMatch = await bcrypt.compare(contrasena_hash, user.contrasena_hash);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            const token = jwt.sign(
                { id: user.id_usuario, tipo: user.tipo, usuario: user.usuario },
                JWT_SECRET,
                { expiresIn: '1d' } 
            );

            delete user.contrasena_hash; 
            
            return res.json({ 
                message: 'Login exitoso', 
                token: token,
                user: user,
            });

        } catch (err) {
            console.error('Error durante el login:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
    }
);

module.exports = router;