-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-03-2025 a las 05:01:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `peliculas`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_categories_to_movie` (IN `intmovieId` INT, IN `jsoncategoryIds` JSON)   BEGIN
	DECLARE i INT DEFAULT 0;
    DECLARE n INT;
    DECLARE categoryId INT;

    SET n = JSON_LENGTH(jsoncategoryIds);

    WHILE i < n DO
        SET categoryId = JSON_UNQUOTE(JSON_EXTRACT(jsoncategoryIds, CONCAT('$[', i, ']')));
        INSERT INTO movie_categories (movieId, categoryId) VALUES (intmovieId, categoryId);
        SET i = i + 1;
    END WHILE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_category` (IN `varname` VARCHAR(50))   BEGIN
	insert into categories (name)
    values(name);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_movie` (IN `vartitle` VARCHAR(50), IN `vardirector` VARCHAR(50), IN `dateRelease` DATE, IN `varyear` VARCHAR(50), IN `timeduration` TIME, IN `decratingValue` DECIMAL(3,1), IN `tinyratingSuffix` TINYINT, IN `jsoncategoryIds` JSON)   BEGIN
	DECLARE last_insert_id INT;
    DECLARE i INT DEFAULT 0;
    DECLARE n INT;
    DECLARE categoryId INT;

    -- Insertar la película en la tabla movies
    INSERT INTO movies (title, director, releaseDate, year, duration, ratingValue, ratingSuffix)
    VALUES (vartitle, vardirector, dateRelease, varyear, timeduration, decratingValue, tinyratingSuffix);

    -- Obtener el ID de la última película insertada
    SET last_insert_id = LAST_INSERT_ID();

    -- Obtener la longitud del JSON de categorías
    SET n = JSON_LENGTH(jsoncategoryIds);

    -- Insertar las categorías asociadas en la tabla movie_categories
    WHILE i < n DO
        SET categoryId = JSON_UNQUOTE(JSON_EXTRACT(jsoncategoryIds, CONCAT('$[', i, ']')));
        INSERT INTO movie_categories (movieId, categoryId) VALUES (last_insert_id, categoryId);
        SET i = i + 1;
    END WHILE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_movies_views` (`intmovieId` INT, `intuserId` INT)   BEGIN
    -- Verificar si la película existe
    IF NOT EXISTS (SELECT 1 FROM Movies WHERE id = intmovieId) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Movie ID does not exist.';
     -- Verificar si el usuario existe   
    ELSEIF NOT EXISTS (SELECT 1 FROM Users WHERE id = intuserId) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'User ID does not exist.';
    ELSE
        -- Insertar la vista de la película por el usuario
        INSERT INTO movies_views (movieId, userId, viewIn)
        VALUES (intmovieId, intuserId, NOW());
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `create_user` (IN `varname` VARCHAR(50), IN `varemail` VARCHAR(255), IN `varpassword` VARCHAR(255))   BEGIN
	insert into users (name, email, password)
    values (varname, varemail, varpassword);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_movies_temp` (IN `vartitle` VARCHAR(50), IN `varccategorieid` INT(11), IN `varPage` INT, IN `varPageSize` INT)   BEGIN
    -- Declarar variables para el cursor
    DECLARE done INT DEFAULT FALSE;
    DECLARE `v_id` int(11);
    DECLARE `v_title` varchar(50);
    DECLARE `v_director` varchar(50);
    DECLARE `v_categories_name` varchar(255);
    DECLARE `v_releaseDate` datetime;
    DECLARE `v_year` varchar(50);
    DECLARE `v_duration` time;
    DECLARE `v_rating` tinyint(4);
    DECLARE `v_createdAt` timestamp(6);
    DECLARE `v_updatedAt` timestamp(6);
    
    -- Calcular el OFFSET
    DECLARE varOffset INT DEFAULT (varPage - 1) * varPageSize;

    -- Declarar cursor para seleccionar registros con paginación
    DECLARE cur CURSOR FOR
    SELECT 
        m.id, m.title, m.director, m.releaseDate, m.year, 
        m.duration, CONCAT(m.ratingValue, "/", m.ratingSuffix) AS rating, 
        m.createdAt, m.updatedAt, 
        IFNULL(GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', '), '') AS categories_name
    FROM peliculas.movies m
    LEFT JOIN peliculas.movie_categories mc ON m.id = mc.movieId
    LEFT JOIN peliculas.categories c ON mc.categoryId = c.id
    WHERE (vartitle = '' OR m.title LIKE CONCAT('%', vartitle, '%'))
      AND (varccategorieid IS NULL OR varccategorieid = mc.categoryId)
    GROUP BY m.id, m.title
    order by m.releaseDate
    LIMIT varPageSize OFFSET varOffset;  -- 🔹 Agregar paginación

    -- Manejo de errores para el cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Eliminar la tabla temporal si ya existe
    DROP TEMPORARY TABLE IF EXISTS temp_movies;

    -- Crear la tabla temporal
    CREATE TEMPORARY TABLE temp_movies (
        `id` int(11) NOT NULL,
        `title` varchar(50) NOT NULL,
        `director` varchar(50) NOT NULL,
        `categories_name` varchar(255) NULL,
        `releaseDate` datetime NOT NULL,
        `year` varchar(50) NOT NULL,
        `duration` time NOT NULL,
        `rating` varchar(10) NOT NULL,
        `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
        `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
    );

    -- Abrir cursor
    OPEN cur;

    read_loop: LOOP
        -- Obtener datos del cursor
        FETCH cur INTO v_id, v_title, v_director, v_releaseDate, v_year, v_duration, 
                      v_rating, v_createdAt, v_updatedAt, v_categories_name;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Insertar en la tabla temporal
        INSERT INTO temp_movies
        VALUES (v_id, v_title, v_director, v_categories_name, v_releaseDate, v_year, 
                v_duration, v_rating, v_createdAt, v_updatedAt);
    END LOOP;

    -- Cerrar cursor
    CLOSE cur;

    -- Retornar los datos de la tabla temporal
    SELECT * FROM temp_movies;

    -- Opción: eliminar la tabla temporal al final
    DROP TEMPORARY TABLE IF EXISTS temp_movies;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_new_releases` ()   BEGIN
	SELECT 
        id, 
        title,
        director, 
        releaseDate,
        year,
        duration,
        CONCAT(ratingValue, "/", ratingSuffix) AS rating
    FROM movies
    WHERE releaseDate >= DATE_SUB(CURDATE(), INTERVAL 3 WEEK)
    ORDER BY releaseDate DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_category` (IN `varname` VARCHAR(50), IN `varuser_id` INT)   BEGIN
	update categories
    set name = varname
    where id = varuser_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_password` (IN `varpassword` VARCHAR(255), IN `varuser_id` INT)   BEGIN
	UPDATE users 
    SET password = varpassword
    WHERE id = varuser_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1742184050455, 'InitialMigrtion1742184050455');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `director` varchar(50) NOT NULL,
  `releaseDate` datetime NOT NULL,
  `year` varchar(50) NOT NULL,
  `duration` time NOT NULL,
  `ratingValue` decimal(3,1) NOT NULL,
  `ratingSuffix` tinyint(4) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movies_views`
--

CREATE TABLE `movies_views` (
  `id` int(11) NOT NULL,
  `viewIn` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `movieId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movie_categories`
--

CREATE TABLE `movie_categories` (
  `id` int(11) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `movieId` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movies_views`
--
ALTER TABLE `movies_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_61c25bcc9ecf9119eeedc7799d0` (`movieId`),
  ADD KEY `FK_8ce76782710a111a3488523f89c` (`userId`);

--
-- Indices de la tabla `movie_categories`
--
ALTER TABLE `movie_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_7e9bec9df82e8036cd25a3ab052` (`movieId`),
  ADD KEY `FK_5729be243dbde4c15437997055e` (`categoryId`);

--
-- Indices de la tabla `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_94f168faad896c0786646fa3d4a` (`userId`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movies_views`
--
ALTER TABLE `movies_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movie_categories`
--
ALTER TABLE `movie_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `movies_views`
--
ALTER TABLE `movies_views`
  ADD CONSTRAINT `FK_61c25bcc9ecf9119eeedc7799d0` FOREIGN KEY (`movieId`) REFERENCES `movies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8ce76782710a111a3488523f89c` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `movie_categories`
--
ALTER TABLE `movie_categories`
  ADD CONSTRAINT `FK_5729be243dbde4c15437997055e` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_7e9bec9df82e8036cd25a3ab052` FOREIGN KEY (`movieId`) REFERENCES `movies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
