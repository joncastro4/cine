CREATE DATABASE IF NOT EXISTS cinema_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cinema_db;

CREATE TABLE IF NOT EXISTS Directores (
  IDDirector INT AUTO_INCREMENT PRIMARY KEY,
  Director VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Categorias (
  Identificador INT AUTO_INCREMENT PRIMARY KEY,
  Categoria VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Peliculas (
  Identificador INT AUTO_INCREMENT PRIMARY KEY,
  Titulo VARCHAR(255) NOT NULL,
  IDDirector INT NOT NULL,
  Duracion INT NOT NULL,
  IDCategoria INT NOT NULL,
  Sinopsis TEXT NOT NULL,
  CONSTRAINT fk_pelicula_director
    FOREIGN KEY (IDDirector) REFERENCES Directores (IDDirector),
  CONSTRAINT fk_pelicula_categoria
    FOREIGN KEY (IDCategoria) REFERENCES Categorias (Identificador)
);

INSERT INTO Directores (Director) VALUES
  ('Christopher Nolan'),
  ('Hayao Miyazaki'),
  ('Quentin Tarantino'),
  ('Guillermo del Toro'),
  ('Steven Spielberg');

INSERT INTO Categorias (Categoria) VALUES
  ('Ciencia ficción'),
  ('Drama'),
  ('Animación'),
  ('Suspenso'),
  ('Fantasía');

INSERT INTO Peliculas (Titulo, IDDirector, Duracion, IDCategoria, Sinopsis) VALUES
  ('Interstellar', 1, 169, 1, 'Unos astronautas cruzan un agujero de gusano para buscar otro lugar donde pueda vivir la gente.'),
  ('Oppenheimer', 1, 180, 2, 'La historia de Oppenheimer y del proyecto con el que se construyó la bomba atómica.'),
  ('El viaje de Chihiro', 2, 125, 3, 'Chihiro entra a un mundo de espíritus y trabaja en una casa de baños para poder volver con sus papás.'),
  ('Pulp Fiction', 3, 154, 4, 'Varias historias de criminales en Los Ángeles se van cruzando. No está contada en orden.'),
  ('El laberinto del fauno', 4, 118, 5, 'En la posguerra, Ofelia encuentra un laberinto y un fauno que le pone tres pruebas.'),
  ('Parque Jurásico', 5, 127, 1, 'Abren un parque con dinosaurios clonados y en la primera visita se sale de control.'),
  ('Django sin cadenas', 3, 165, 4, 'Django recorre el sur con un cazador de recompensas para encontrar a su esposa.'),
  ('Mi vecino Totoro', 2, 86, 3, 'Dos hermanas se mudan al campo y conocen a los espíritus del bosque, entre ellos a Totoro.');
