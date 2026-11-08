import { prisma } from '../config/prisma';

async function main() {
  console.log('🌱 Iniciando carga de datos de prueba (Seed)...');

  // 1. Directores
  const directoresData = [
    { director: 'Christopher Nolan' },
    { director: 'Denis Villeneuve' },
    { director: 'Steven Spielberg' },
    { director: 'Quentin Tarantino' },
    { director: 'Hayao Miyazaki' },
    { director: 'Guillermo del Toro' },
    
  ];

  console.log('Creando Directores...');
  for (const dir of directoresData) {
    const existing = await prisma.director.findFirst({
      where: { director: dir.director },
    });
    if (!existing) {
      await prisma.director.create({ data: dir });
    }
  }

  // 2. Categorías
  const categoriasData = [
    { categoria: 'Ciencia Ficción' },
    { categoria: 'Acción' },
    { categoria: 'Drama' },
    { categoria: 'Animación' },
    { categoria: 'Suspenso' },
    { categoria: 'Fantasía' },
  ];

  console.log('Creando Categorías...');
  for (const cat of categoriasData) {
    const existing = await prisma.categoria.findFirst({
      where: { categoria: cat.categoria },
    });
    if (!existing) {
      await prisma.categoria.create({ data: cat });
    }
  }

  // Obtener directores y categorías creados
  const directores = await prisma.director.findMany();
  const categorias = await prisma.categoria.findMany();

  const nolan = directores.find((d) => d.director.includes('Nolan'))?.idDirector || directores[0].idDirector;
  const denis = directores.find((d) => d.director.includes('Villeneuve'))?.idDirector || directores[0].idDirector;
  const spielberg = directores.find((d) => d.director.includes('Spielberg'))?.idDirector || directores[0].idDirector;
  const tarantino = directores.find((d) => d.director.includes('Tarantino'))?.idDirector || directores[0].idDirector;
  const miyazaki = directores.find((d) => d.director.includes('Miyazaki'))?.idDirector || directores[0].idDirector;
  const delToro = directores.find((d) => d.director.includes('Toro'))?.idDirector || directores[0].idDirector;

  const suspenso = categorias.find((c) => c.categoria.includes('Suspenso'))?.identificador || categorias[0].identificador;
  const sciFi = categorias.find((c) => c.categoria.includes('Ciencia'))?.identificador || categorias[0].identificador;
  const drama = categorias.find((c) => c.categoria.includes('Drama'))?.identificador || categorias[0].identificador;
  const animacion = categorias.find((c) => c.categoria.includes('Animación'))?.identificador || categorias[0].identificador;
  const accion = categorias.find((c) => c.categoria.includes('Acción'))?.identificador || categorias[0].identificador;
  const fantasia = categorias.find((c) => c.categoria.includes('Fantasía'))?.identificador || categorias[0].identificador;

  // 3. Películas
  const peliculasData = [
    {
      titulo: 'Interstellar',
      idDirector: nolan,
      duracion: 169,
      idCategoria: sciFi,
      sinopsis:
        'Un grupo de exploradores emprende la misión más importante de la historia humana: viajar más allá de nuestra galaxia a través de un agujero de gusano para descubrir si la humanidad tiene un futuro entre las estrellas.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg',
    },
    {
      titulo: 'Oppenheimer',
      idDirector: nolan,
      duracion: 180,
      idCategoria: drama,
      sinopsis:
        'Biografía del físico estadounidense J. Robert Oppenheimer, al frente del Proyecto Manhattan, que condujo al desarrollo de la primera bomba nuclear durante la Segunda Guerra Mundial.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
    },
    {
      titulo: 'Dune: Parte Dos',
      idDirector: denis,
      duracion: 166,
      idCategoria: sciFi,
      sinopsis:
        'Paul Atreides se une a Chani y al pueblo Fremen mientras emprende un viaje espiritual y marcial de venganza contra los conspiradores que destruyeron a su familia.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
    },
    {
      titulo: 'El Viaje de Chihiro',
      idDirector: miyazaki,
      duracion: 125,
      idCategoria: animacion,
      sinopsis:
        'Chihiro, una niña caprichosa de diez años, debe trabajar en un balneario para dioses y espíritus regentado por una bruja para liberar a sus padres transformados en cerdos.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
    },
    {
      titulo: 'Pulp Fiction',
      idDirector: tarantino,
      duracion: 154,
      idCategoria: accion,
      sinopsis:
        'Las vidas de dos mafiosos, la esposa de su jefe, un boxeador en decadencia y una pareja de asaltantes se cruzan de manera delirante en Los Ángeles.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg',
    },
    {
      titulo: 'El Laberinto del Fauno',
      idDirector: delToro,
      duracion: 118,
      idCategoria: fantasia,
      sinopsis:
        'En la España de 1944 de la posguerra, una niña fascinada por los cuentos de hadas es enviada con su madre al campamento militar de su padrastro, descubriendo un misterioso laberinto subterráneo.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/6/67/Pan%27s_Labyrinth.jpg',
    },
    {
      titulo: 'Inception',
      idDirector: nolan,
      duracion: 148,
      idCategoria: sciFi,
      sinopsis:
        'Un ladrón especializado en robar secretos del subconsciente durante el sueño recibe la misión inversa: implantar una idea en la mente de un poderoso heredero.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg',
    },
    {
      titulo: 'El Caballero de la Noche',
      idDirector: nolan,
      duracion: 152,
      idCategoria: accion,
      sinopsis:
        'Batman, Gordon y Harvey Dent se enfrentan al Joker, un criminal anárquico que sumerge Gotham en el caos y pone a prueba los límites morales del héroe.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg',
    },
    {
      titulo: 'Blade Runner 2049',
      idDirector: denis,
      duracion: 164,
      idCategoria: sciFi,
      sinopsis:
        'El oficial K descubre un secreto enterrado durante décadas que podría hundir lo que queda de la sociedad y lo lleva a buscar a Rick Deckard, desaparecido hace treinta años.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png',
    },
    {
      titulo: 'Parque Jurásico',
      idDirector: spielberg,
      duracion: 127,
      idCategoria: sciFi,
      sinopsis:
        'Un millonario crea un parque temático con dinosaurios clonados a partir de ADN antiguo; cuando los sistemas de seguridad fallan, los visitantes pasan a ser presas.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg',
    },
    {
      titulo: 'La Lista de Schindler',
      idDirector: spielberg,
      duracion: 195,
      idCategoria: drama,
      sinopsis:
        'Oskar Schindler, empresario alemán, salva la vida de más de mil judíos polacos empleándolos en sus fábricas durante el Holocausto.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/3/38/Schindler%27s_List_movie.jpg',
    },
    {
      titulo: 'Django sin Cadenas',
      idDirector: tarantino,
      duracion: 165,
      idCategoria: accion,
      sinopsis:
        'Un cazarrecompensas alemán libera al esclavo Django y juntos se embarcan en una misión para rescatar a su esposa de un cruel plantador de Misisipi.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/8/8b/Django_Unchained_Poster.jpg',
    },
    {
      titulo: 'La Princesa Mononoke',
      idDirector: miyazaki,
      duracion: 134,
      idCategoria: animacion,
      sinopsis:
        'El joven Ashitaka se ve envuelto en el conflicto entre los dioses del bosque y los humanos que explotan sus recursos, y conoce a San, la princesa lobo.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/8/8c/Princess_Mononoke_Japanese_poster.png',
    },
    {
      titulo: 'La Forma del Agua',
      idDirector: delToro,
      duracion: 123,
      idCategoria: fantasia,
      sinopsis:
        'En plena Guerra Fría, una conserje muda de un laboratorio secreto establece un vínculo inesperado con una misteriosa criatura anfibia mantenida cautiva.',
      imagenUrl:
        'https://upload.wikimedia.org/wikipedia/en/3/37/The_Shape_of_Water_%28film%29.png',
    },
  ];

  console.log('Creando Películas...');
  for (const pelicula of peliculasData) {
    const existing = await prisma.pelicula.findFirst({
      where: { titulo: pelicula.titulo },
    });
    if (!existing) {
      await prisma.pelicula.create({
        data: pelicula,
      });
    } else {
      // Actualiza el póster en bases ya sembradas
      await prisma.pelicula.update({
        where: { identificador: existing.identificador },
        data: { imagenUrl: pelicula.imagenUrl },
      });
    }
  }

  console.log('✅ Base de datos inicializada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error al sembrar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

