-- ========================================================
-- Base de Datos para Sistema de Cine
-- ========================================================

CREATE DATABASE IF NOT EXISTS `cinema_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `cinema_db`;

-- Tabla Directores
CREATE TABLE IF NOT EXISTS `Directores` (
  `IDDirector` INT AUTO_INCREMENT PRIMARY KEY,
  `Director` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Categorías
CREATE TABLE IF NOT EXISTS `Categorias` (
  `Identificador` INT AUTO_INCREMENT PRIMARY KEY,
  `Categoria` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla Películas
CREATE TABLE IF NOT EXISTS `Peliculas` (
  `Identificador` INT AUTO_INCREMENT PRIMARY KEY,
  `Titulo` VARCHAR(255) NOT NULL,
  `IDDirector` INT NOT NULL,
  `Duracion` INT NOT NULL COMMENT 'Duración en minutos',
  `IDCategoria` INT NOT NULL,
  `Sinopsis` TEXT NOT NULL,
  `ImagenUrl` VARCHAR(500) NULL,
  CONSTRAINT `fk_pelicula_director` FOREIGN KEY (`IDDirector`) REFERENCES `Directores` (`IDDirector`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pelicula_categoria` FOREIGN KEY (`IDCategoria`) REFERENCES `Categorias` (`Identificador`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- Datos de prueba iniciales (Seeds)
-- ========================================================

INSERT INTO `Directores` (`IDDirector`, `Director`) VALUES
(1, 'Christopher Nolan'),
(2, 'Denis Villeneuve'),
(3, 'Steven Spielberg'),
(4, 'Quentin Tarantino'),
(5, 'Hayao Miyazaki')
ON DUPLICATE KEY UPDATE `Director`=VALUES(`Director`);

INSERT INTO `Categorias` (`Identificador`, `Categoria`) VALUES
(1, 'Ciencia Ficción'),
(2, 'Acción'),
(3, 'Drama'),
(4, 'Animación'),
(5, 'Suspenso')
ON DUPLICATE KEY UPDATE `Categoria`=VALUES(`Categoria`);

INSERT INTO `Peliculas` (`Identificador`, `Titulo`, `IDDirector`, `Duracion`, `IDCategoria`, `Sinopsis`, `ImagenUrl`) VALUES
(1, 'Interstellar', 1, 169, 1, 'Un grupo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por asegurar la supervivencia de la humanidad.', 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'),
(2, 'Oppenheimer', 1, 180, 3, 'La historia del científico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.', 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg'),
(3, 'Dune: Parte Dos', 2, 166, 1, 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.', 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg'),
(4, 'El Viaje de Chihiro', 5, 125, 4, 'Durante el traslado de su familia a los suburbios, una niña de 10 años deambula por un mundo gobernado por dioses, brujas y espíritus.', 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png'),
(5, 'Pulp Fiction', 4, 154, 5, 'Las vidas de dos sicarios de la mafia, un boxeador, la esposa de un gángster y dos bandidos se entrelazan en cuatro historias de violencia y redención.', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg')
ON DUPLICATE KEY UPDATE `Titulo`=VALUES(`Titulo`);

