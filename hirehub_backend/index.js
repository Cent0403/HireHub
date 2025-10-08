require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors()); 
app.use(express.json());

const usuariosRouter = require('./src/routes/usuarios');
const authRouter = require('./src/routes/auth'); 
const detallesCandidatoRouter = require('./src/routes/detalles_candidato');
const candidatoArchivoRouter = require('./src/routes/candidato_archivo');
const candidatoRedRouter = require('./src/routes/candidato_red_social');
const detallesEmpresaRouter = require('./src/routes/detalles_empresa');
const empresaRedRouter = require('./src/routes/empresa_red_social');
const trabajoRouter = require('./src/routes/trabajo');
const aplicacionRouter = require('./src/routes/aplicacion_trabajo');
const trabajosFavRouter = require('./src/routes/trabajos_favoritos');
const candidatosFavRouter = require('./src/routes/candidatos_favoritos');

app.use('/api/usuarios', usuariosRouter);
app.use('/api/auth', authRouter); 
app.use('/api/detalles_candidato', detallesCandidatoRouter);
app.use('/api/candidato_archivo', candidatoArchivoRouter);
app.use('/api/candidato_red_social', candidatoRedRouter);
app.use('/api/detalles_empresa', detallesEmpresaRouter);
app.use('/api/empresa_red_social', empresaRedRouter);
app.use('/api/trabajo', trabajoRouter);
app.use('/api/aplicacion_trabajo', aplicacionRouter);
app.use('/api/trabajos_favoritos', trabajosFavRouter);
app.use('/api/candidatos_favoritos', candidatosFavRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

app.get('/', (req, res) => {
  res.send('HireHub backend is running');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
