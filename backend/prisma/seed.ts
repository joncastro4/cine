import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Se puede correr varias veces: borra y vuelve a meter los datos de prueba.
  await prisma.pelicula.deleteMany();
  await prisma.director.deleteMany();
  await prisma.categoria.deleteMany();

  const nolan = await prisma.director.create({ data: { director: 'Christopher Nolan' } });
  const miyazaki = await prisma.director.create({ data: { director: 'Hayao Miyazaki' } });
  const tarantino = await prisma.director.create({ data: { director: 'Quentin Tarantino' } });
  const delToro = await prisma.director.create({ data: { director: 'Guillermo del Toro' } });
  const spielberg = await prisma.director.create({ data: { director: 'Steven Spielberg' } });

  const cienciaFiccion = await prisma.categoria.create({ data: { categoria: 'Ciencia ficción' } });
  const drama = await prisma.categoria.create({ data: { categoria: 'Drama' } });
  const animacion = await prisma.categoria.create({ data: { categoria: 'Animación' } });
  const suspenso = await prisma.categoria.create({ data: { categoria: 'Suspenso' } });
  const fantasia = await prisma.categoria.create({ data: { categoria: 'Fantasía' } });

  const peliculas = [
    {
      titulo: 'Interstellar',
      idDirector: nolan.idDirector,
      duracion: 169,
      idCategoria: cienciaFiccion.identificador,
      sinopsis: 'Unos astronautas cruzan un agujero de gusano para buscar otro lugar donde pueda vivir la gente.',
    },
    {
      titulo: 'Oppenheimer',
      idDirector: nolan.idDirector,
      duracion: 180,
      idCategoria: drama.identificador,
      sinopsis: 'La historia de Oppenheimer y del proyecto con el que se construyó la bomba atómica.',
    },
    {
      titulo: 'El viaje de Chihiro',
      idDirector: miyazaki.idDirector,
      duracion: 125,
      idCategoria: animacion.identificador,
      sinopsis: 'Chihiro entra a un mundo de espíritus y trabaja en una casa de baños para poder volver con sus papás.',
    },
    {
      titulo: 'Pulp Fiction',
      idDirector: tarantino.idDirector,
      duracion: 154,
      idCategoria: suspenso.identificador,
      sinopsis: 'Varias historias de criminales en Los Ángeles se van cruzando. No está contada en orden.',
    },
    {
      titulo: 'El laberinto del fauno',
      idDirector: delToro.idDirector,
      duracion: 118,
      idCategoria: fantasia.identificador,
      sinopsis: 'En la posguerra, Ofelia encuentra un laberinto y un fauno que le pone tres pruebas.',
    },
    {
      titulo: 'Parque Jurásico',
      idDirector: spielberg.idDirector,
      duracion: 127,
      idCategoria: cienciaFiccion.identificador,
      sinopsis: 'Abren un parque con dinosaurios clonados y en la primera visita se sale de control.',
    },
    {
      titulo: 'Django sin cadenas',
      idDirector: tarantino.idDirector,
      duracion: 165,
      idCategoria: suspenso.identificador,
      sinopsis: 'Django recorre el sur con un cazador de recompensas para encontrar a su esposa.',
    },
    {
      titulo: 'Mi vecino Totoro',
      idDirector: miyazaki.idDirector,
      duracion: 86,
      idCategoria: animacion.identificador,
      sinopsis: 'Dos hermanas se mudan al campo y conocen a los espíritus del bosque, entre ellos a Totoro.',
    },
  ];

  await prisma.pelicula.createMany({ data: peliculas });
  console.log('Listo: 5 directores, 5 categorías y 8 películas.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
