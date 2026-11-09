import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import peliculasRoutes from './routes/peliculas.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    mensaje: 'API de Cinetopia',
    peliculas: '/api/peliculas',
  });
});

app.use('/api/peliculas', peliculasRoutes);

app.use((_req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.listen(port, () => {
  console.log(`API en http://localhost:${port}`);
});
