-- Adminer 5.4.1 MySQL 8.0.44 dump

SET NAMES utf8;
SET GLOBAL event_scheduler = ON;
SET time_zone = '+00:00';

SET foreign_key_checks = 0;

SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DELIMITER ;;

DROP PROCEDURE IF EXISTS `PopulateSeats`;;

CREATE PROCEDURE `PopulateSeats` (IN `p_theaterId` int)
BEGIN
    DECLARE rowCount INT;
    DECLARE currentRow INT DEFAULT 1;
    DECLARE seats INT;

    -- Hämta antal rader från JSON-arrayen
    SELECT JSON_LENGTH(seatsPerRow)
    INTO rowCount
    FROM Theater
    WHERE id = p_theaterId;

    -- Loopar igenom varje rad
    WHILE currentRow <= rowCount DO

        -- Hämta antal stolar i denna rad
        SELECT JSON_EXTRACT(seatsPerRow, CONCAT('$[', currentRow - 1, ']'))
        INTO seats
        FROM Theater
        WHERE id = p_theaterId;

        -- Skapa stolarna i denna rad
        SET @i = 1;
        WHILE @i <= seats DO
            INSERT INTO Seat (`row`, `number`, theaterId, seatType)
            VALUES (currentRow, @i, p_theaterId, 'normal');
            SET @i = @i + 1;
        END WHILE;

        SET currentRow = currentRow + 1;
    END WHILE;

END;;

DROP EVENT IF EXISTS `auto_generate_screenings`;;

CREATE EVENT `auto_generate_screenings` ON SCHEDULE EVERY 1 DAY STARTS '2026-02-20 03:00:00' ON COMPLETION NOT PRESERVE ENABLE COMMENT 'Kopierar gårdagens visningar till nästa vecka om de inte redan finns' DO BEGIN
  INSERT INTO Screening (date, startTime, theaterId, movieId)
  SELECT 
    DATE_ADD(s1.date, INTERVAL 7 DAY) AS newDate, 
    DATE_ADD(s1.startTime, INTERVAL 7 DAY) AS newStart, 
    s1.theaterId, 
    s1.movieId
  FROM Screening s1
  JOIN Movie m1 ON s1.movieId = m1.id  -- Vi behöver veta längden på filmen vi kopierar
  WHERE s1.date = CURRENT_DATE - INTERVAL 1 DAY
  AND NOT EXISTS (
      /* Här är den smarta kollen: Finns det NÅGON film som krockar i den salongen? */
      SELECT 1 FROM Screening s2
      JOIN Movie m2 ON s2.movieId = m2.id
      WHERE s2.theaterId = s1.theaterId
      AND (
          /* Den nya filmens starttid ligger inuti en annan films speltid (+30 min städ) */
          (DATE_ADD(s1.startTime, INTERVAL 7 DAY) BETWEEN s2.startTime AND DATE_ADD(s2.startTime, INTERVAL (m2.duration + 30) MINUTE))
          OR
          /* Den nya filmens sluttid (+30 min städ) krockar med en annan films starttid */
          (DATE_ADD(DATE_ADD(s1.startTime, INTERVAL 7 DAY), INTERVAL (m1.duration + 30) MINUTE) BETWEEN s2.startTime AND DATE_ADD(s2.startTime, INTERVAL (m2.duration + 30) MINUTE))
      )
  );
END;;

DELIMITER;

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Actor`;

CREATE TABLE `Actor` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `country` varchar(255) NOT NULL,
    `bio` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 199 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Actor` (
        `id`,
        `name`,
        `country`,
        `bio`
    )
VALUES (
        10,
        'Florence Pugh',
        'UK',
        'Snabbt stigande stjärna inom drama och psykologisk film.'
    ),
    (
        13,
        'Meryl Streep',
        'USA',
        'En av världens mest prisbelönta skådespelare med roller i drama och komedi.'
    ),
    (
        14,
        'Sydney Sweeney',
        'USA',
        'Amerikansk skådespelare känd för intensiva roller i drama och thriller.'
    ),
    (
        15,
        'Emily Blunt',
        'UK',
        'Brittisk skådespelare känd för action, drama och stora blockbusterfilmer.'
    ),
    (
        36,
        'Jason Momoa',
        'Unknown',
        'Duncan Idaho'
    ),
    (
        37,
        'Timothée Chalamet',
        'Unknown',
        'Paul Atreides'
    ),
    (
        38,
        'Rebecca Ferguson',
        'Unknown',
        'Lady Jessica'
    ),
    (
        39,
        'Anya Taylor-Joy',
        'Unknown',
        'Alia Atreides'
    ),
    (
        40,
        'Robert Pattinson',
        'Unknown',
        'Scytale'
    ),
    (
        41,
        'Zendaya',
        'Unknown',
        'Chani'
    ),
    (
        42,
        'Javier Bardem',
        'Unknown',
        'Stilgar'
    ),
    (
        43,
        'Nakoa-Wolf Momoa',
        'Unknown',
        'Leto II'
    ),
    (
        44,
        'Ida Brooke',
        'Unknown',
        'Ghanima'
    ),
    (
        45,
        'Kristen Bell',
        'Unknown',
        'Anna (voice)'
    ),
    (
        46,
        'Jonathan Groff',
        'Unknown',
        'Kristoff (voice)'
    ),
    (
        47,
        'Josh Gad',
        'Unknown',
        'Olaf (voice)'
    ),
    (
        48,
        'Idina Menzel',
        'Unknown',
        'Elsa (voice)'
    ),
    (
        49,
        'Scarlett Johansson',
        'Unknown',
        'Scarlett Johansson'
    ),
    (
        50,
        'Robert Pattinson',
        'Unknown',
        'Bruce Wayne'
    ),
    (
        51,
        'Colin Farrell',
        'Unknown',
        'Oz Cobb'
    ),
    (
        52,
        'Barry Keoghan',
        'Unknown',
        'The Joker (rumored)'
    ),
    (
        53,
        'Andy Serkis',
        'Unknown',
        'Alfred Pennyworth'
    ),
    (
        54,
        'Jeffrey Wright',
        'Unknown',
        'James Gordon'
    ),
    (
        55,
        'Tom Hanks',
        'Unknown',
        'Woody (voice)'
    ),
    (
        56,
        'Greta Lee',
        'Unknown',
        'LilyPad (voice)'
    ),
    (
        57,
        'Tim Allen',
        'Unknown',
        'Buzz Lightyear (voice)'
    ),
    (
        58,
        'Joan Cusack',
        'Unknown',
        'Jessie (voice)'
    ),
    (
        59,
        'Ernie Hudson',
        'Unknown',
        'Combat Carl (voice)'
    ),
    (
        60,
        'Tony Hale',
        'Unknown',
        'Forky (voice)'
    ),
    (
        61,
        'Conan O\'Brien',
        'Unknown',
        'Smarty Pants (voice)'
    ),
    (
        62,
        'Blake Clark',
        'Unknown',
        'Slinky Dog (voice)'
    ),
    (
        63,
        'Jon Bernthal',
        'Unknown',
        'Frank Castle'
    ),
    (
        64,
        'Jacob Batalon',
        'Unknown',
        'Ned'
    ),
    (
        65,
        'Sadie Sink',
        'Unknown',
        'Zendaya'
    ),
    (
        66,
        'Zendaya',
        'Unknown',
        'MJ'
    ),
    (
        67,
        'Tom Holland',
        'Unknown',
        'Peter Parker'
    ),
    (
        68,
        'Mark Ruffalo',
        'Unknown',
        'Bruce Banner'
    ),
    (
        69,
        'Tramell Tillman',
        'Unknown',
        'Michael Mando'
    ),
    (
        70,
        'Michael Mando',
        'Unknown',
        'Mac Gargan'
    ),
    (
        71,
        'Liza Colón-Zayas',
        'Unknown',
        'Marvin Jones III'
    ),
    (
        72,
        'Marvin Jones III',
        'Unknown',
        'Tombstone'
    ),
    (
        73,
        'Mahershala Ali',
        'Unknown',
        'Duncan Kincaid'
    ),
    (
        74,
        'Jonathan Bailey',
        'Unknown',
        'Dr. Henry Loomis'
    ),
    (
        75,
        'Rupert Friend',
        'Unknown',
        'Martin Krebs'
    ),
    (
        76,
        'Manuel Garcia-Rulfo',
        'Unknown',
        'Reuben Delgado'
    ),
    (
        77,
        'Luna Blaise',
        'Unknown',
        'Teresa Delgado'
    ),
    (
        78,
        'David Iacono',
        'Unknown',
        'Xavier Dobbs'
    ),
    (
        79,
        'Audrina Miranda',
        'Unknown',
        'Isabella Delgado'
    ),
    (
        80,
        'Philippine Velge',
        'Unknown',
        'Nina'
    ),
    (
        81,
        'Bechir Sylvain',
        'Unknown',
        'LeClerc'
    ),
    (
        82,
        'Ed Skrein',
        'Unknown',
        'Bobby Atwater'
    ),
    (
        83,
        'Adam Loxley',
        'Unknown',
        'Williams'
    ),
    (
        84,
        'Niamh Finlay',
        'Unknown',
        'Desanto'
    ),
    (
        85,
        'Julian Edgar',
        'Unknown',
        'Van Dijk\'s Barman'
    ),
    (
        86,
        'Lucy Thackeray',
        'Unknown',
        'Helicopter Pilot'
    ),
    (
        87,
        'Billy Smith',
        'Unknown',
        'Cop'
    ),
    (
        88,
        'Jonny Lavelle',
        'Unknown',
        'Helicopter Co-Pilot'
    ),
    (
        89,
        'Dylan Bickel',
        'Unknown',
        'Brooklyn Pedestrian (uncredited)'
    ),
    (
        90,
        'Mike Myers',
        'Canada',
        'Voice of Shrek'
    ),
    (
        91,
        'Cameron Diaz',
        'USA',
        'Voice of Princess Fiona'
    ),
    (
        92,
        'Eddie Murphy',
        'USA',
        'Voice of Donkey'
    ),
    (
        93,
        'Skyler Gisondo',
        'USA',
        'Voice of Farkle'
    ),
    (
        94,
        'Marcello Hernández',
        'USA',
        'Voice of Fergus'
    ),
    (
        97,
        'Bradley Pierce',
        'USA',
        'Voice of Clark Kent'
    ),
    (
        98,
        'Brandon Tate',
        'USA',
        'Voice of Steel'
    ),
    (
        99,
        'Micheal Manning',
        'USA',
        'Voice of Lex Luthor'
    ),
    (
        100,
        'Laura Alvarez',
        'USA',
        'Voice of Lois Lane'
    ),
    (
        101,
        'Randy Miller',
        'USA',
        'Voice of Jonathan Kent'
    ),
    (
        104,
        'Sophia Brown',
        'Unknown',
        'Character: Éile (4 episodes • 2022)'
    ),
    (
        105,
        'Laurence O\'Fuarain',
        'Ireland',
        'Character: Fjall (4 episodes • 2022)'
    ),
    (
        106,
        'Mirren Mack',
        'UK',
        'Character: Merwyn (4 episodes • 2022)'
    ),
    (
        107,
        'Lenny Henry',
        'UK',
        'Character: Balor (4 episodes • 2022)'
    ),
    (
        108,
        'Jacob Collins-Levy',
        'Australia',
        'Character: Eredin (4 episodes • 2022)'
    ),
    (
        109,
        'Zach Wyatt',
        'UK',
        'Character: Syndril (4 episodes • 2022)'
    ),
    (
        110,
        'Lizzie Annis',
        'UK',
        'Character: Zacaré (4 episodes • 2022)'
    ),
    (
        111,
        'Huw Novelli',
        'UK',
        'Character: Brother Death (4 episodes • 2022)'
    ),
    (
        112,
        'Francesca Mills',
        'UK',
        'Character: Meldof (4 episodes • 2022)'
    ),
    (
        113,
        'Amy Murray',
        'UK',
        'Character: Fenrick (4 episodes • 2022)'
    ),
    (
        114,
        'Minnie Driver',
        'UK',
        'Character: Seanchaí (4 episodes • 2022)'
    ),
    (
        115,
        'Michelle Yeoh',
        'Malaysia',
        'Character: Scían (4 episodes • 2022)'
    ),
    (
        116,
        'Samuel Blenkin',
        'UK',
        'Character: Avallac\'h (3 episodes • 2022)'
    ),
    (
        117,
        'Hiftu Quasem',
        'UK',
        'Character: Light (3 episodes • 2022)'
    ),
    (
        118,
        'Joey Batey',
        'UK',
        'Character: Jaskier (2 episodes • 2022)'
    ),
    (
        119,
        'Dylan Moran',
        'Ireland',
        'Character: Uthrok One-Nut (2 episodes • 2022)'
    ),
    (
        120,
        'Nathaniel Curtis',
        'UK',
        'Character: Brían (2 episodes • 2022)'
    ),
    (
        121,
        'Ella Schrey-Yeats',
        'UK',
        'Character: Ithlinne (2 episodes • 2022)'
    ),
    (
        122,
        'Cynthia Erivo',
        'UK',
        'Role: Elphaba'
    ),
    (
        123,
        'Ariana Grande',
        'USA',
        'Role: Glinda'
    ),
    (
        124,
        'Jeff Goldblum',
        'USA',
        'Role: The Wonderful Wizard of Oz'
    ),
    (
        125,
        'Ethan Slater',
        'USA',
        'Role: Boq'
    ),
    (
        126,
        'Marissa Bode',
        'USA',
        'Role: Nessarose'
    ),
    (
        127,
        'Colman Domingo',
        'USA',
        'Role: The Cowardly Lion'
    ),
    (
        128,
        'Bowen Yang',
        'USA',
        'Role: Pfannee'
    ),
    (
        129,
        'Bronwyn James',
        'UK',
        'Role: Shenshen'
    ),
    (
        130,
        'Aaron Teoh Guan Ti',
        'Malaysia',
        'Role: Avaric'
    ),
    (
        131,
        'Keala Settle',
        'USA',
        'Role: Miss. Coddle'
    ),
    (
        132,
        'Sharon D. Clarke',
        'UK',
        'Role: Dulcibear'
    ),
    (
        133,
        'Bethany Weaver',
        'USA',
        'Role: Dorothy'
    ),
    (
        134,
        'Adam James',
        'UK',
        'Role: Galinda\'s Popsicle'
    ),
    (
        135,
        'Alice Fearn',
        'UK',
        'Role: Galinda\'s Momsie'
    ),
    (
        136,
        'Scarlett Spears',
        'USA',
        'Role: Young Galinda'
    ),
    (
        137,
        'Esme Sheridan',
        'USA',
        'Role: Party Child'
    ),
    (
        153,
        'Idris Elba',
        'UK',
        'Voice of Knuckles'
    ),
    (
        154,
        'James Marsden',
        'USA',
        'Role: Tom'
    ),
    (
        155,
        'Ben Schwartz',
        'USA',
        'Voice of Sonic'
    ),
    (
        156,
        'Tom Cruise',
        'USA',
        'Role: Ethan Hunt'
    ),
    (
        157,
        'Hayley Atwell',
        'UK',
        'Role: Grace'
    ),
    (
        158,
        'Ving Rhames',
        'USA',
        'Role: Luther Stickell'
    ),
    (
        159,
        'Simon Pegg',
        'UK',
        'Role: Benji Dunn'
    ),
    (
        160,
        'Esai Morales',
        'USA',
        'Role: Gabriel'
    ),
    (
        161,
        'Pom Klementieff',
        'France',
        'Role: Paris'
    ),
    (
        162,
        'Henry Czerny',
        'Canada',
        'Role: Kittridge'
    ),
    (
        163,
        'Holt McCallany',
        'USA',
        'Role: Serling'
    ),
    (
        164,
        'Janet McTeer',
        'UK',
        'Role: Walters'
    ),
    (
        165,
        'Nick Offerman',
        'USA',
        'Role: General Sidney'
    ),
    (
        166,
        'Hannah Waddingham',
        'UK',
        'Role: Admiral Neely'
    ),
    (
        167,
        'Angela Bassett',
        'USA',
        'Role: Erika Sloane'
    ),
    (
        168,
        'Shea Whigham',
        'USA',
        'Role: Briggs'
    ),
    (
        169,
        'Greg Tarzan Davis',
        'USA',
        'Role: Degas'
    ),
    (
        170,
        'Charles Parnell',
        'USA',
        'Role: Richards'
    ),
    (
        171,
        'Mark Gatiss',
        'UK',
        'Role: Angstrom'
    ),
    (
        172,
        'Rolf Saxon',
        'USA',
        'Role: William Donloe'
    ),
    (
        187,
        'Tom Hardy',
        'UK',
        'Role: Max Rockatansky'
    ),
    (
        188,
        'Jeremy Allen White',
        'USA',
        'Voice of Rotta the Hutt'
    ),
    (
        189,
        'Pedro Pascal',
        'Chile/USA',
        'Role: The Mandalorian (Din Djarin)'
    ),
    (
        190,
        'Sigourney Weaver',
        'USA',
        'Role: Colonel Ward'
    ),
    (
        191,
        'Steve Blum',
        'USA',
        'Voice of Zeb Orrelios'
    ),
    (
        192,
        'Jonny Coyne',
        'UK',
        'Role: Imperial Warlord'
    ),
    (
        193,
        'Hemky Madera',
        'USA',
        'Role: Imperial Warlord'
    ),
    (
        194,
        'London Stubblefield',
        'USA',
        'Role: Village Merchant'
    ),
    (
        195,
        'Bo Bragason',
        'UK',
        'Role: Princess Zelda'
    ),
    (
        196,
        'Benjamin Evan Ainsworth',
        'UK',
        'Role: Link'
    ),
    (
        198,
        'Daisy Ridley',
        'UK',
        'Character: Rey'
    );

DROP TABLE IF EXISTS `Avatar`;

CREATE TABLE `Avatar` (
    `id` int NOT NULL AUTO_INCREMENT,
    `url` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 29 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Avatar` (`id`, `url`)
VALUES (
        1,
        'https://robohash.org/ametveldolorem.png?size=50x50&set=set1'
    ),
    (
        2,
        'https://robohash.org/quidemvelitut.png?size=50x50&set=set1'
    ),
    (
        3,
        'https://robohash.org/asperioresipsamitaque.png?size=50x50&set=set1'
    ),
    (
        4,
        'https://robohash.org/harumdelectusratione.png?size=50x50&set=set1'
    ),
    (
        5,
        'https://robohash.org/commodisimiliquesunt.png?size=50x50&set=set1'
    ),
    (
        6,
        'https://robohash.org/vitaeporroid.png?size=50x50&set=set1'
    ),
    (
        7,
        'https://robohash.org/laboriosamofficiisnihil.png?size=50x50&set=set1'
    ),
    (
        8,
        'https://robohash.org/delenitiducimusea.png?size=50x50&set=set1'
    ),
    (
        9,
        'https://robohash.org/unique1.png?size=50x50&set=set2'
    ),
    (
        10,
        'https://robohash.org/unique2.png?size=50x50&set=set2'
    ),
    (
        11,
        'https://robohash.org/unique3.png?size=50x50&set=set2'
    ),
    (
        12,
        'https://robohash.org/unique4.png?size=50x50&set=set2'
    ),
    (
        13,
        'https://robohash.org/unique5.png?size=50x50&set=set2'
    ),
    (
        14,
        'https://robohash.org/unique6.png?size=50x50&set=set3'
    ),
    (
        15,
        'https://robohash.org/unique7.png?size=50x50&set=set3'
    ),
    (
        16,
        'https://robohash.org/unique8.png?size=50x50&set=set3'
    ),
    (
        17,
        'https://robohash.org/unique9.png?size=50x50&set=set3'
    ),
    (
        18,
        'https://robohash.org/unique10.png?size=50x50&set=set3'
    ),
    (
        19,
        'https://robohash.org/unique11.png?size=50x50&set=set4'
    ),
    (
        20,
        'https://robohash.org/unique12.png?size=50x50&set=set4'
    ),
    (
        21,
        'https://robohash.org/unique13.png?size=50x50&set=set4'
    ),
    (
        22,
        'https://robohash.org/unique14.png?size=50x50&set=set4'
    ),
    (
        23,
        'https://robohash.org/unique15.png?size=50x50&set=set4'
    ),
    (
        24,
        'https://robohash.org/unique16.png?size=50x50&set=set5'
    ),
    (
        25,
        'https://robohash.org/unique17.png?size=50x50&set=set5'
    ),
    (
        26,
        'https://robohash.org/unique18.png?size=50x50&set=set5'
    ),
    (
        27,
        'https://robohash.org/unique19.png?size=50x50&set=set5'
    ),
    (
        28,
        'https://robohash.org/unique20.png?size=50x50&set=set5'
    );

DROP TABLE IF EXISTS `Booking`;

CREATE TABLE `Booking` (
    `id` int NOT NULL AUTO_INCREMENT,
    `ScreeningId` int NOT NULL,
    `createdAtUTC` datetime NOT NULL DEFAULT(utc_timestamp()),
    `status` tinyint(1) NOT NULL,
    `totalAmount` int NOT NULL,
    `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `bookingRef` varchar(12) DEFAULT NULL,
    `snack` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`),
    UNIQUE KEY `ux_booking_bookingRef` (`bookingRef`),
    KEY `userId` (`email`),
    KEY `fk_booking_screening` (`ScreeningId`),
    CONSTRAINT `fk_booking_screening` FOREIGN KEY (`ScreeningId`) REFERENCES `Screening` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 261 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Booking` (
        `id`,
        `ScreeningId`,
        `createdAtUTC`,
        `status`,
        `totalAmount`,
        `email`,
        `bookingRef`,
        `snack`
    )
VALUES (
        1,
        1,
        '2026-02-17 08:48:30',
        1,
        280,
        'hamster',
        NULL,
        NULL
    ),
    (
        2,
        1,
        '2026-02-17 08:48:30',
        1,
        140,
        'hamster',
        NULL,
        NULL
    ),
    (
        9,
        30,
        '2026-02-17 08:48:30',
        1,
        10000,
        'hamster',
        NULL,
        'large'
    ),
    (
        10,
        65,
        '2026-02-17 08:48:30',
        1,
        10000,
        'hamster',
        NULL,
        'large'
    ),
    (
        13,
        61,
        '2026-02-17 08:48:30',
        1,
        10000,
        'show-time@example.com',
        NULL,
        'large'
    ),
    (
        14,
        61,
        '2026-02-17 08:48:30',
        1,
        10000,
        'show-time@example.com',
        NULL,
        'medium'
    ),
    (
        15,
        30,
        '2026-02-17 08:48:30',
        1,
        10000,
        'show-time@example.com',
        NULL,
        'medium'
    ),
    (
        19,
        34,
        '2026-02-17 08:48:30',
        1,
        280,
        'a@a.com',
        NULL,
        'large'
    ),
    (
        20,
        1,
        '2026-02-24 08:25:17',
        1,
        100,
        'test@example.com',
        NULL,
        NULL
    ),
    (
        21,
        34,
        '2026-02-24 08:35:41',
        1,
        280,
        'test@test2.se',
        NULL,
        'large'
    ),
    (
        22,
        51,
        '2026-02-24 09:25:09',
        1,
        280,
        'vi behöver fixa så man inte kan skriva vad som här ?',
        NULL,
        'large'
    ),
    (
        23,
        34,
        '2026-02-24 10:06:38',
        1,
        469,
        'ceciliacavallin@hotmail.se',
        NULL,
        'large'
    ),
    (
        24,
        34,
        '2026-02-24 10:55:22',
        1,
        609,
        'test3@testare.se',
        NULL,
        'large'
    ),
    (
        25,
        61,
        '2026-02-24 10:58:06',
        1,
        479,
        'alfaville :)',
        'CKJ981',
        'small'
    ),
    (
        26,
        73,
        '2026-02-24 12:25:13',
        1,
        559,
        'anders_strömberg@google.se',
        'PJE-961',
        'large'
    ),
    (
        28,
        61,
        '2026-02-24 13:34:13',
        1,
        269,
        'lars@test.se',
        NULL,
        'small'
    ),
    (
        29,
        1,
        '2026-02-24 13:35:58',
        1,
        100,
        'detta är inte en email',
        NULL,
        NULL
    ),
    (
        30,
        1,
        '2026-02-24 14:51:24',
        1,
        100,
        'testdevtools@test.se',
        NULL,
        NULL
    ),
    (
        31,
        1,
        '2026-02-24 14:51:46',
        1,
        100,
        'testdevtools@test.se',
        NULL,
        NULL
    ),
    (
        32,
        38,
        '2026-02-25 12:56:11',
        1,
        449,
        'ceciliacavallin@hotmail.se',
        NULL,
        'large'
    ),
    (
        33,
        38,
        '2026-02-25 13:02:10',
        1,
        409,
        'ceciliacavallin@hotmail.se',
        NULL,
        'medium'
    ),
    (
        34,
        52,
        '2026-02-25 13:47:30',
        1,
        539,
        'Jag vill inte bli en email , nejjjjjj',
        'IMR-717',
        'large'
    ),
    (
        35,
        38,
        '2026-02-25 13:55:00',
        1,
        289,
        'ceciliacavallin@hotmail.se',
        NULL,
        'medium'
    ),
    (
        36,
        38,
        '2026-02-25 14:12:53',
        1,
        269,
        'alfa@ville.com',
        NULL,
        'small'
    ),
    (
        37,
        38,
        '2026-02-25 14:13:24',
        1,
        289,
        'alfa@ville.com',
        NULL,
        'medium'
    ),
    (
        38,
        38,
        '2026-02-25 14:42:02',
        1,
        499,
        'ceciliacavallin@hotmail.se',
        NULL,
        'medium'
    ),
    (
        39,
        38,
        '2026-02-25 14:44:19',
        1,
        269,
        'ceciliacavallin@hotmail.se',
        'YZW-766',
        'medium'
    ),
    (
        40,
        38,
        '2026-02-25 16:46:10',
        1,
        449,
        'show-time@example.com',
        'UEO-724',
        'large'
    ),
    (
        41,
        70,
        '2026-02-26 08:28:41',
        1,
        499,
        'hamster@hamster.se',
        'SYZ-897',
        'medium'
    ),
    (
        42,
        61,
        '2026-02-26 08:54:09',
        1,
        449,
        'edvin@hotmail.se',
        'QGA-305',
        'large'
    ),
    (
        43,
        41,
        '2026-02-26 08:59:27',
        1,
        140,
        'edvin.lindborg@hotmail.se',
        'WRC-944',
        NULL
    ),
    (
        44,
        53,
        '2026-02-26 12:29:21',
        1,
        329,
        'zhaneta.lecini88@gmail.com',
        'FTR-550',
        'large'
    ),
    (
        45,
        61,
        '2026-02-27 09:29:36',
        1,
        289,
        'zhaneta.lecini88@gmail.com',
        'JXU-453',
        'medium'
    ),
    (
        46,
        46,
        '2026-02-27 09:43:06',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'OAQ-809',
        NULL
    ),
    (
        47,
        46,
        '2026-02-27 09:43:32',
        1,
        329,
        'zhaneta.lecini88@gmail.com',
        'XVU-094',
        'large'
    ),
    (
        48,
        46,
        '2026-02-27 09:43:59',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'ZFV-983',
        NULL
    ),
    (
        49,
        46,
        '2026-02-27 09:47:20',
        1,
        329,
        'zhaneta.lecini88@gmail.com',
        'MGM-415',
        'large'
    ),
    (
        50,
        44,
        '2026-02-27 09:49:10',
        1,
        329,
        'zhaneta.lecini88@gmail.com',
        'UYB-375',
        'large'
    ),
    (
        51,
        46,
        '2026-02-27 09:54:34',
        1,
        289,
        'zhaneta.lecini88@gmail.com',
        'ZLG-619',
        'medium'
    ),
    (
        52,
        47,
        '2026-02-27 09:58:49',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'CZC-460',
        NULL
    ),
    (
        53,
        46,
        '2026-02-27 10:04:19',
        1,
        539,
        'zhaneta.lecini88@gmail.com',
        'RND-289',
        'large'
    ),
    (
        54,
        46,
        '2026-02-27 10:05:34',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'ZJA-890',
        NULL
    ),
    (
        55,
        46,
        '2026-02-27 10:13:42',
        1,
        279,
        'ceciliacavallin@hotmail.se',
        'URV-218',
        'large'
    ),
    (
        56,
        46,
        '2026-02-27 10:15:03',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'EKX-135',
        NULL
    ),
    (
        57,
        69,
        '2026-02-27 10:15:44',
        1,
        120,
        'zhaneta.lecini88@gmail.com',
        'OOB-686',
        NULL
    ),
    (
        58,
        61,
        '2026-02-27 10:44:51',
        1,
        409,
        'ceciliacavallin@hotmail.se',
        'CUU-056',
        'medium'
    ),
    (
        59,
        46,
        '2026-02-27 11:01:29',
        1,
        289,
        'hamster@hamster.se',
        'FEQ-905',
        'medium'
    ),
    (
        60,
        46,
        '2026-02-27 11:04:04',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'RJK-408',
        NULL
    ),
    (
        61,
        46,
        '2026-02-27 11:07:28',
        1,
        269,
        'hund@hund.se',
        'ZZJ-932',
        'small'
    ),
    (
        62,
        46,
        '2026-02-27 11:24:03',
        1,
        370,
        'edvin.lindborg@hotmail.se',
        'FXW-532',
        NULL
    ),
    (
        63,
        46,
        '2026-02-27 11:24:40',
        1,
        203,
        'edvin.lindborg@hotmail.se',
        'ERX-623',
        'large'
    ),
    (
        64,
        61,
        '2026-02-27 11:39:53',
        1,
        190,
        'hund@hund.se',
        'KDA-577',
        'medium'
    ),
    (
        65,
        46,
        '2026-02-27 11:46:47',
        1,
        183,
        'ceciliacavallin@hotmail.se',
        'PLC-740',
        'large'
    ),
    (
        69,
        21,
        '2026-03-03 08:55:43',
        1,
        183,
        'zhaneta.lecini88@gmail.com',
        'SZG-875',
        'small'
    ),
    (
        70,
        132,
        '2026-03-03 19:38:08',
        1,
        140,
        'kifle.uni@gmail.com',
        'VZO-745',
        NULL
    ),
    (
        71,
        132,
        '2026-03-03 19:38:10',
        1,
        140,
        'kifle.uni@gmail.com',
        'QTJ-786',
        NULL
    ),
    (
        72,
        96,
        '2026-03-03 22:21:17',
        1,
        140,
        'test12@hotmail.se',
        'FLK-627',
        NULL
    ),
    (
        73,
        80,
        '2026-03-04 13:28:30',
        1,
        366,
        'hamster@hamster..se',
        'JYR-593',
        'small'
    ),
    (
        76,
        80,
        '2026-03-04 13:56:36',
        1,
        203,
        'hamster@hamster.se',
        'RBA-366',
        'large'
    ),
    (
        78,
        87,
        '2026-03-05 07:56:04',
        1,
        406,
        'kund@test.se',
        'FVU-430',
        'large'
    ),
    (
        79,
        87,
        '2026-03-05 17:29:38',
        1,
        120,
        'k@hotmail.com',
        'IQS-907',
        NULL
    ),
    (
        80,
        138,
        '2026-03-05 17:30:24',
        1,
        190,
        'kifle@hotmail.com',
        'XCL-141',
        'medium'
    ),
    (
        81,
        105,
        '2026-03-05 17:31:48',
        1,
        153,
        'k@hotmail.com',
        'VSQ-158',
        'large'
    ),
    (
        82,
        87,
        '2026-03-05 22:33:42',
        1,
        163,
        'kund@test.se',
        'SLJ-939',
        'small'
    ),
    (
        83,
        120,
        '2026-03-05 22:35:06',
        1,
        366,
        'kund@test.se',
        'GOV-201',
        'large'
    ),
    (
        84,
        94,
        '2026-03-06 08:19:01',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'RJG-731',
        NULL
    ),
    (
        85,
        98,
        '2026-03-06 12:51:21',
        1,
        406,
        'hamster@hamster.se',
        'NUU-851',
        'large'
    ),
    (
        88,
        132,
        '2026-03-09 09:38:59',
        1,
        203,
        'edvin.lindborg@hotmail.se',
        'ITQ-170',
        'large'
    ),
    (
        89,
        132,
        '2026-03-09 09:42:04',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'KAC-398',
        NULL
    ),
    (
        90,
        131,
        '2026-03-09 14:18:39',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'HBE-786',
        NULL
    ),
    (
        91,
        131,
        '2026-03-09 14:24:14',
        1,
        203,
        'lasse@lasse.se',
        'XYI-593',
        'large'
    ),
    (
        93,
        138,
        '2026-03-10 13:01:42',
        1,
        140,
        'test@test.se',
        'RWV-152',
        NULL
    ),
    (
        104,
        138,
        '2026-03-10 14:25:35',
        1,
        406,
        'hamster@hamster.se',
        'NBT-694',
        'large'
    ),
    (
        105,
        138,
        '2026-03-10 14:28:17',
        1,
        812,
        'hamster@hamster.se',
        'SYV-803',
        'large'
    ),
    (
        109,
        138,
        '2026-03-10 19:32:38',
        1,
        140,
        'kifle_@hotmail.com',
        'QCL-283',
        NULL
    ),
    (
        111,
        201,
        '2026-03-10 20:29:57',
        1,
        386,
        'ceciliacavallin@hotmail.se',
        'BBL-969',
        'large'
    ),
    (
        124,
        208,
        '2026-03-11 12:58:04',
        1,
        366,
        'hamster@hamster.se',
        'DJM-004',
        'small'
    ),
    (
        126,
        203,
        '2026-03-11 13:06:36',
        1,
        203,
        'ceciliacavallin@hotmail.se',
        'BMC-008',
        'large'
    ),
    (
        127,
        203,
        '2026-03-11 13:11:30',
        1,
        163,
        'ceciliacavallin@hotmail.se',
        'GVW-465',
        'small'
    ),
    (
        128,
        203,
        '2026-03-11 13:15:24',
        1,
        140,
        'ceciliacavallin@hotmail.se',
        'IKC-806',
        NULL
    ),
    (
        130,
        203,
        '2026-03-11 13:18:40',
        1,
        183,
        'ceciliacavallin@hotmail.se',
        'UYH-684',
        'large'
    ),
    (
        131,
        204,
        '2026-03-11 13:21:18',
        1,
        183,
        'edvin.lindborg@hotmail.se',
        'BUY-144',
        'small'
    ),
    (
        132,
        201,
        '2026-03-11 13:22:09',
        1,
        379,
        'hamster@hamster.se',
        'NNH-641',
        'medium'
    ),
    (
        133,
        207,
        '2026-03-11 13:26:25',
        1,
        140,
        'edvin.lindborg@hotmail.se',
        'YYM-834',
        'medium'
    ),
    (
        134,
        202,
        '2026-03-11 13:26:36',
        1,
        406,
        'kifle_@hotmail.com',
        'VOP-998',
        'large'
    ),
    (
        135,
        201,
        '2026-03-11 13:27:39',
        1,
        140,
        'kifle_@hotmail.com',
        'AGP-082',
        NULL
    ),
    (
        136,
        203,
        '2026-03-11 13:33:41',
        1,
        140,
        'kifle_@hotmail.com',
        'ISR-804',
        NULL
    ),
    (
        141,
        202,
        '2026-03-11 14:11:03',
        1,
        140,
        'kifle_@hotmail.com',
        'AZH-952',
        NULL
    ),
    (
        152,
        217,
        '2026-03-12 10:57:22',
        1,
        183,
        'edvin.lindborg@hotmail.se',
        'KOI-070',
        'small'
    ),
    (
        154,
        217,
        '2026-03-12 11:02:36',
        1,
        163,
        'edvin.lindborg@hotmail.se',
        'NPN-684',
        'small'
    ),
    (
        155,
        241,
        '2026-03-12 11:03:08',
        1,
        203,
        'edvin.lindborg@hotmail.se',
        'DTW-089',
        'large'
    ),
    (
        156,
        241,
        '2026-03-12 11:03:09',
        1,
        203,
        'edvin.lindborg@hotmail.se',
        'FVG-679',
        'large'
    ),
    (
        157,
        217,
        '2026-03-12 11:04:04',
        1,
        163,
        'edvin.lindborg@hotmail.se',
        'YVH-350',
        'small'
    ),
    (
        158,
        217,
        '2026-03-12 11:05:14',
        1,
        163,
        'edvin.lindborg@hotmail.se',
        'LVR-039',
        'small'
    ),
    (
        159,
        207,
        '2026-03-12 11:08:00',
        1,
        133,
        'edvin.lindborg@hotmail.se',
        'VTY-931',
        'small'
    ),
    (
        161,
        207,
        '2026-03-12 11:19:19',
        1,
        163,
        'edvin.lindborg@hotmail.se',
        'ELI-030',
        'small'
    ),
    (
        163,
        207,
        '2026-03-12 11:24:21',
        1,
        133,
        'edvin.lindborg@hotmail.se',
        'CGZ-775',
        'small'
    ),
    (
        164,
        217,
        '2026-03-12 11:26:07',
        1,
        133,
        'edvin.lindborg@hotmail.se',
        'XBS-855',
        'small'
    ),
    (
        165,
        218,
        '2026-03-12 11:26:17',
        1,
        379,
        'jarllindquist@gmail.com',
        'RJQ-710',
        'medium'
    ),
    (
        166,
        207,
        '2026-03-12 11:26:46',
        1,
        133,
        'edvin.lindborg@hotmail.se',
        'GQF-511',
        'small'
    ),
    (
        167,
        207,
        '2026-03-12 11:28:57',
        1,
        133,
        'edvin.lindborg@hotmail.se',
        'MQT-628',
        'small'
    ),
    (
        168,
        207,
        '2026-03-12 11:31:38',
        1,
        133,
        'edvin.lindborg@hotmail.se',
        'ART-910',
        'small'
    ),
    (
        171,
        207,
        '2026-03-12 11:54:32',
        1,
        90,
        'edvin.lindborg@hotmail.se',
        'FCR-767',
        NULL
    ),
    (
        172,
        207,
        '2026-03-12 12:14:27',
        1,
        140,
        'edvin.lindborg@hotmail.se',
        'BXZ-780',
        'medium'
    ),
    (
        178,
        217,
        '2026-03-12 13:20:27',
        1,
        90,
        'edvin.lindborg@hotmail.se',
        'FYM-973',
        NULL
    ),
    (
        181,
        207,
        '2026-03-12 13:33:49',
        1,
        203,
        'edvin.lindborg@hotmail.se',
        'ZCQ-014',
        'large'
    ),
    (
        182,
        207,
        '2026-03-12 13:34:14',
        1,
        539,
        'edvin.lindborg@hotmail.se',
        'RJB-966',
        'large'
    ),
    (
        186,
        217,
        '2026-03-12 13:53:40',
        1,
        120,
        'edvin.lindborg@hotmail.se',
        'GPK-270',
        NULL
    ),
    (
        193,
        217,
        '2026-03-12 14:23:24',
        1,
        120,
        'hamster@hamster.se',
        'MJV-756',
        NULL
    ),
    (
        195,
        207,
        '2026-03-12 15:12:31',
        1,
        350,
        'edvin.lindborg@hotmail.se',
        'DKQ-753',
        NULL
    ),
    (
        196,
        218,
        '2026-03-12 15:14:03',
        1,
        1150,
        'edvin.lindborg@hotmail.se',
        'ZUU-442',
        NULL
    ),
    (
        197,
        216,
        '2026-03-12 19:08:36',
        1,
        379,
        'jarllindquist@gmail.com',
        'CXT-345',
        'medium'
    ),
    (
        198,
        216,
        '2026-03-12 19:17:55',
        1,
        366,
        'jarllindquist@gmail.com',
        'YJY-604',
        'small'
    ),
    (
        199,
        219,
        '2026-03-13 08:12:53',
        1,
        810,
        'edvin.lindborg@hotmail.se',
        'KRR-670',
        NULL
    ),
    (
        205,
        219,
        '2026-03-13 09:20:14',
        1,
        203,
        'edvin.lindborg@hotmail.se',
        'QUH-018',
        'large'
    ),
    (
        211,
        219,
        '2026-03-13 12:14:44',
        1,
        203,
        'ceciliacavallin@hotmail.se',
        'APT-765',
        'large'
    ),
    (
        213,
        219,
        '2026-03-13 13:09:21',
        1,
        203,
        'ceciliacavallin@hotmail.se',
        'XBV-757',
        'large'
    ),
    (
        216,
        219,
        '2026-03-13 16:11:27',
        1,
        386,
        'ceciliacavallin@hotmail.se',
        'NSC-709',
        'large'
    ),
    (
        217,
        209,
        '2026-03-14 00:28:56',
        1,
        203,
        'zhaneta.lecini88@gmail.com',
        'ICU-084',
        'large'
    ),
    (
        224,
        227,
        '2026-03-15 10:22:55',
        1,
        203,
        'edvin.lindborg@hotmail.se',
        'LEL-409',
        'large'
    ),
    (
        225,
        223,
        '2026-03-15 10:25:33',
        1,
        183,
        'edvin.lindborg@hotmail.se',
        'TNP-348',
        'small'
    ),
    (
        226,
        223,
        '2026-03-15 10:29:49',
        1,
        356,
        'pelle@pelle.se',
        'VAT-992',
        'large'
    ),
    (
        227,
        259,
        '2026-03-16 09:34:41',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'PAW-552',
        NULL
    ),
    (
        228,
        213,
        '2026-03-16 09:39:03',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'WQU-939',
        NULL
    ),
    (
        229,
        213,
        '2026-03-16 10:30:01',
        1,
        366,
        'jarllindquist@gmaill.com',
        'SRJ-962',
        'small'
    ),
    (
        231,
        235,
        '2026-03-16 10:56:25',
        1,
        240,
        'hamster@hamster.se',
        'PTT-169',
        NULL
    ),
    (
        232,
        235,
        '2026-03-17 09:27:19',
        1,
        183,
        'ceciliacavallin@hotmail.se',
        'FAU-190',
        'small'
    ),
    (
        233,
        264,
        '2026-03-17 09:29:49',
        1,
        356,
        'ceciliacavallin@hotmail.se',
        'DPX-121',
        'large'
    ),
    (
        234,
        269,
        '2026-03-17 10:00:51',
        1,
        379,
        'ceciliacavallin@hotmail.se',
        'HCG-898',
        'medium'
    ),
    (
        235,
        236,
        '2026-03-17 10:02:19',
        1,
        449,
        'ceciliacavallin@hotmail.se',
        'AXW-428',
        'small'
    ),
    (
        238,
        234,
        '2026-03-17 11:32:22',
        1,
        420,
        'jarllindquist@gmail.com',
        'LML-310',
        NULL
    ),
    (
        239,
        274,
        '2026-03-17 11:39:15',
        1,
        420,
        'jarllindquist@gmail.com',
        'WEW-360',
        NULL
    ),
    (
        240,
        235,
        '2026-03-17 11:43:55',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'SSA-449',
        NULL
    ),
    (
        241,
        235,
        '2026-03-17 11:44:05',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'PYW-947',
        NULL
    ),
    (
        247,
        246,
        '2026-03-17 12:02:16',
        1,
        1218,
        'jarllindquist@gmail.com',
        'IJV-233',
        'large'
    ),
    (
        248,
        236,
        '2026-03-17 12:06:51',
        1,
        609,
        'jarllindquist@gmail.com',
        'QLA-969',
        'large'
    ),
    (
        249,
        243,
        '2026-03-17 12:09:09',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'CPG-240',
        NULL
    ),
    (
        250,
        235,
        '2026-03-17 12:15:29',
        1,
        140,
        'zhaneta.lecini88@gmail.com',
        'AME-416',
        NULL
    ),
    (
        252,
        243,
        '2026-03-18 08:43:26',
        1,
        316,
        'ceciliacavallin@hotmail.se',
        'RKF-105',
        'small'
    ),
    (
        253,
        243,
        '2026-03-18 09:31:51',
        1,
        509,
        'ceciliacavallin@hotmail.se',
        'OON-540',
        'small'
    ),
    (
        255,
        259,
        '2026-03-18 16:21:54',
        1,
        140,
        'kifle.uni@gmail.com',
        'ENT-579',
        NULL
    ),
    (
        256,
        259,
        '2026-03-18 16:22:02',
        1,
        140,
        'kifle.uni@gmail.com',
        'PQK-204',
        NULL
    ),
    (
        257,
        259,
        '2026-03-18 16:22:10',
        1,
        140,
        'kifle.uni@gmail.com',
        'IBJ-911',
        NULL
    ),
    (
        258,
        243,
        '2026-03-18 16:35:04',
        1,
        140,
        'k@hotmail.com',
        'GYF-494',
        NULL
    ),
    (
        260,
        248,
        '2026-03-19 19:00:54',
        1,
        406,
        'ceciliacavallin@hotmail.se',
        'WFE-900',
        'large'
    );

DROP TABLE IF EXISTS `Category`;

CREATE TABLE `Category` (
    `id` int NOT NULL AUTO_INCREMENT,
    `type` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Category` (`id`, `type`)
VALUES (1, 'Action'),
    (2, 'Adventure'),
    (3, 'Sci-Fi'),
    (4, 'Fantasy'),
    (5, 'Superhero'),
    (6, 'Animation'),
    (7, 'Family'),
    (8, 'Comedy'),
    (9, 'Drama'),
    (10, 'Thriller'),
    (11, 'Musical'),
    (12, 'Space'),
    (13, 'Dinosaur'),
    (14, 'Video Game Adaptation'),
    (15, 'Franchise Sequel'),
    (16, 'Romance'),
    (17, 'Mystery'),
    (18, 'Crime'),
    (19, 'Epic'),
    (20, 'Blockbuster');

DROP TABLE IF EXISTS `JobPosting`;

CREATE TABLE `JobPosting` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Slug` varchar(100) NOT NULL,
    `Title` varchar(200) NOT NULL,
    `Location` varchar(200) NOT NULL,
    `Description` text NOT NULL,
    `CreatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `Slug` (`Slug`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `JobPosting` (
        `Id`,
        `Slug`,
        `Title`,
        `Location`,
        `Description`,
        `CreatedAt`
    )
VALUES (
        2,
        'Biografvard',
        'Biografvärd',
        'Malmö',
        'Som biografvärd är du ansiktet utåt, du ska vara en snäll prick',
        '2026-03-16 13:59:21'
    ),
    (
        3,
        'kioskpersonal',
        'Kioskpersonal',
        'Malmö ',
        'Arbeta i vårt team och servera snacks...',
        '2026-03-16 13:59:48'
    ),
    (
        4,
        'maskinist',
        'Maskinist / Tekniker',
        'Malmö',
        'Ansvarar för tekniken i salongerna...',
        '2026-03-16 14:00:16'
    ),
    (
        5,
        'Entrévärd',
        'Entrévärd',
        'Malmö',
        'Hjälp person att hitta till rätt salong',
        '2026-03-17 08:37:17'
    );

DROP TABLE IF EXISTS `Movie`;

CREATE TABLE `Movie` (
    `id` int NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` mediumtext NOT NULL,
    `duration` int DEFAULT NULL,
    `ageLimit` enum('11', '15', '18') NOT NULL,
    `language` varchar(255) NOT NULL,
    `dateRelease` date NOT NULL,
    `trailerUrl` varchar(255) NOT NULL,
    `productionYear` date NOT NULL,
    `distributor` varchar(255) NOT NULL,
    `subtitles` tinyint(1) NOT NULL,
    `popular` tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`),
    UNIQUE KEY `title` (`title`)
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Movie` (
        `id`,
        `title`,
        `description`,
        `duration`,
        `ageLimit`,
        `language`,
        `dateRelease`,
        `trailerUrl`,
        `productionYear`,
        `distributor`,
        `subtitles`,
        `popular`
    )
VALUES (
        1,
        'Djävulen bär Prada 2',
        'Miranda Priestly tvingas försvara sin position när hennes tidigare assistent Emily Charlton återvänder som en mäktig rival i kampen om inflytande och annonsintäkter.',
        165,
        '11',
        'English',
        '2026-05-01',
        'https://youtu.be/9c-DrMe8o5Q?si=NF-HKo-t6Qd1exKB',
        '2026-01-01',
        '20th Century Studios',
        1,
        1
    ),
    (
        2,
        'Frozen 3',
        'Frozen 3 fortsätter berättelsen om Elsa och Anna efter att livet i Arendelle har förändrats. När ett nytt mysterium från det förflutna vaknar tvingas systrarna ge sig ut på en farlig resa. De möter nya platser, nya karaktärer och svåra val. Filmen handlar om familj, ansvar och att våga gå vidare.',
        110,
        '11',
        'English',
        '2027-11-24',
        'https://youtu.be/uJdD8eGQ1mg?si=82pdnt80ZV_aAyqB',
        '2026-01-01',
        'Disney',
        1,
        1
    ),
    (
        3,
        'The Batman Part II',
        'The Batman Part II fortsätter Bruce Waynes kamp i ett mörkt och kaotiskt Gotham. Staden är fortfarande skadad efter tidigare händelser och nya brott hotar att ta över. Batman ställs inför farliga fiender och svåra val som testar både hans styrka och moral. Filmen fokuserar på skuld, rättvisa och vad det verkligen kostar att vara Gotham’s beskyddare.',
        175,
        '15',
        'English',
        '2027-10-01',
        'https://youtu.be/T7_zMl_ZhdQ?si=992Y6VdilqzMIaL8',
        '2026-01-01',
        'Warner Bros',
        1,
        1
    ),
    (
        4,
        'Toy Story 5',
        'Toy Story 5 tar oss tillbaka till leksakernas värld. Woody, Buzz och de andra ställs inför en ny situation där deras plats i barnens liv förändras igen. Ett nytt äventyr börjar som handlar om vänskap, förändring och vad det betyder att bli vald.',
        105,
        '11',
        'English',
        '2026-06-19',
        'https://youtu.be/ad6ZFDslXPA?si=2Xi34_VybO2Xlgrq',
        '2026-06-19',
        'Pixar',
        1,
        0
    ),
    (
        5,
        'Spider-Man 4',
        'Spider-Man 4 följer Peter Parker efter att hans liv har förändrats helt. Ingen minns vem han är, och han måste klara sig ensam som både hjälte och människa. Nya hot dyker upp i New York och Peter tvingas ta svåra beslut om ansvar, identitet och uppoffring.',
        140,
        '15',
        'English',
        '2026-07-24',
        'https://youtu.be/krRbqUQ2U2U?si=ohVpQIYSF6Atei6O',
        '2026-01-01',
        'Sony/Marvel',
        1,
        1
    ),
    (
        6,
        'Jurassic World 4',
        'Jurassic World 4 utspelar sig i en värld där dinosaurier nu lever sida vid sida med människor. Balansen är skör och nya hot uppstår när kontrollen över dinosaurierna ifrågasätts. Filmen handlar om överlevnad, ansvar och vad som händer när naturen inte längre går att stoppa.',
        130,
        '15',
        'English',
        '2026-07-03',
        'https://youtu.be/jan5CFWs9ic?si=xluwP_ofbNwzpVGl',
        '2026-01-01',
        'Universal',
        1,
        0
    ),
    (
        7,
        'Shrek 5',
        'Shrek 5 tar oss tillbaka till träsket och det kaotiska, roliga livet med Shrek, Fiona och deras vänner. När en oväntad ny utmaning hotar deras hem, tvingas Shrek lämna sin bekvämlighetszon och ge sig ut på ett galet äventyr. Full av skratt, hjärta och nya magiska varelser, handlar filmen om vänskap, familj och att acceptera sig själv – även när världen runt omkring förändras.',
        100,
        '11',
        'English',
        '2026-05-15',
        'https://youtu.be/0rhcEXJ14Rg?si=I3iBVXhcbx1_-ZrK',
        '2026-01-01',
        'DreamWorks',
        1,
        0
    ),
    (
        8,
        'Supergirl 2026',
        'Kara Zor-El är inte den hoppfulla hjälte vi är vana vid att se. Tyngd av minnen från ett förlorat Krypton och trött på att leva i sin kusins skugga, bestämmer hon sig för att fira sin 23-årsdag på ett annorlunda sätt. Tillsammans med sin trogna följeslagare, hunden Krypto, lämnar hon jorden för en resa till galaxens mest avlägsna hörn.\r\n\r\nMen firandet avbryts tvärt när hon landar på en karg och laglös planet. Där möter hon den unga och beslutsamma Ruthye Marye Knoll, en flicka som bär på ett brinnande hat efter att hennes far mördats av den hänsynslösa legosoldaten Krem. Ruthye söker inte efter tröst – hon söker efter en mördare.\r\n\r\nNär en tragedi drabbar även Karas närmaste krets, flätas deras öden samman. Tillsammans ger de sig ut på en mörk och brutal jakt tvärs över stjärnsystemen. Berövad sina superkrafter under en röd sol tvingas Kara konfrontera sin egen vrede och smärta i en episk hämndresa. Det är inte längre bara en jakt på en mördare; det är en kamp för att återfinna gnistan av hopp i ett universum som verkar ha glömt vad rättvisa innebär.',
        150,
        '11',
        'English',
        '2026-07-11',
        'https://youtu.be/0BThHv7vt8E?si=qnd-Uf5WC6GLjnWY',
        '2026-01-01',
        'Warner Bros',
        1,
        0
    ),
    (
        9,
        'Wicked: Part Two',
        'Elsa och Anna får vänta, nu är det häxornas tur. Wicked: Part Two följer Elphaba och Glindas resa när hemligheter avslöjas och maktbalansen i Oz hotas. Filmen utforskar vänskap, svek och hur val formar både hjältar och skurkar.',
        125,
        '11',
        'English',
        '2026-11-26',
        'https://youtu.be/R2Xubj7lazE?si=P8gSL-3MzIrl9e0b',
        '2026-01-01',
        'Universal',
        1,
        0
    ),
    (
        10,
        'Sonic the Hedgehog 4',
        'När en ny fara hotar världen måste Sonic och hans vänner sätta fart som aldrig förr. Med list, mod och vänskap kämpar de mot Dr. Robotniks farliga planer och möter oväntade hinder längs vägen. Äventyret är fullt av action, humor och hjärta, där varje sekund räknas.',
        115,
        '11',
        'English',
        '2026-12-20',
        'https://youtu.be/xBIxYeUNxV8?si=GP4QyUPUs1rpFUqq',
        '2026-01-01',
        'Paramount',
        1,
        0
    ),
    (
        11,
        'Mission: Impossible 9',
        'Ethan Hunt ställs inför sitt farligaste uppdrag hittills när en global konspiration hotar hela världen. \r\n\r\nMed sitt team måste han navigera förräderi, högteknologiska fällor och dödliga fiender. Spänningen är konstant, och varje sekund kan vara skillnaden mellan framgång och katastrof.',
        160,
        '15',
        'English',
        '2026-06-26',
        'https://youtu.be/fsQgc9pCyDU?si=WE8bLnkXbcOI0fNr',
        '2026-01-01',
        'Paramount',
        1,
        0
    ),
    (
        12,
        'Dune: Messiah',
        'Trettio år efter händelserna i Dune kämpar Paul Atreides med makt, profetior och de konsekvenser hans beslut fått för galaxen. \r\n\r\nSom kejsare balanserar han mellan lojalitet, kärlek och det ökande hotet från sina fiender, medan intriger och ödesdigra val formar både hans framtid och universums öde.',
        170,
        '15',
        'English',
        '2026-10-16',
        'https://youtu.be/-glW8zLI9W0?si=ZruQObDnkbTC6jS8',
        '2026-01-01',
        'Warner Bros',
        1,
        0
    ),
    (
        13,
        'Deadpool 4',
        'Deadpool 4 följer den okontrollerbara antihjälten när han kastas in i ännu ett kaotiskt äventyr fullt av våld, humor och oväntade vändningar. \r\n\r\nMed sin vassa tunga och galna upptåg utmanar han både fiender och regler, samtidigt som han försöker hitta sin plats i en värld som alltid verkar ligga steget efter honom.',
        120,
        '18',
        'English',
        '2026-08-14',
        'https://youtu.be/3aIU_qL1TBI?si=hFJYJLvEoZU2GWya',
        '2026-01-01',
        'Marvel Studios',
        1,
        1
    ),
    (
        14,
        'Mad Max: The Wasteland',
        'I en ödelagd värld där laglöshet råder och resurserna är knappa, tvingas Mad Max återigen kämpa för överlevnad. Jakten på rättvisa och frihet leder honom genom farliga territorier fyllda med fiender och förrädiska allianser. Filmen handlar om uthållighet, överlevnad och att hitta hopp i en värld som nästan har glömts.',
        155,
        '18',
        'English',
        '2026-09-18',
        'https://youtu.be/kkTPK2fJBAw?si=cX-tTt0Kw0YBGIIG',
        '2026-01-01',
        'Warner Bros',
        1,
        0
    ),
    (
        15,
        'Kung Fu Panda 5',
        'Po och de andra drakarna kämpar för att skydda kungariket mot en ny, mystisk fiende som hotar freden. Under resan upptäcker Po mer om sitt förflutna och vad det verkligen innebär att vara en mästare. Filmen blandar action, humor och hjärta, och handlar om mod, vänskap och självinsikt.',
        110,
        '11',
        'English',
        '2026-03-27',
        'https://youtu.be/N3nx_FzmW8s?si=sZ7GJXO5oY0kTdNb',
        '2026-01-01',
        'DreamWorks',
        1,
        0
    ),
    (
        16,
        'The Mandalorian & Grogu',
        'En ny resa börjar i Star Wars-världen. Mandalorian och Grogu möter nya hot och starka band när de kämpar för att överleva tillsammans.',
        135,
        '11',
        'English',
        '2026-05-22',
        'https://youtu.be/_pa1KLXuW0Y?si=OwOaurKrZQ9CvCh0',
        '2026-01-01',
        'Lucasfilm',
        1,
        0
    ),
    (
        17,
        'The Legend of Zelda',
        'I en värld fylld av magi och faror måste en ung hjälte resa genom vidsträckta landskap för att rädda kungariket från ondskans makter. Med svärd, visdom och mod står han inför prövningar som testar både hjärta och styrka, och upptäcker kraften i hopp och vänskap längs vägen.',
        145,
        '11',
        'English',
        '2026-12-11',
        'https://youtu.be/zGOM2mcfUt8?si=TeAR3-mwnU4TS456',
        '2026-01-01',
        'Nintendo/Sony',
        1,
        0
    ),
    (
        18,
        'Terminator: Reborn',
        'Mänsklighetens framtid står på spel när nya och gamla maskiner återvänder för att ta kontroll. En oväntad hjälte tvingas stå emot övermäktiga fiender och göra svåra val för att skydda de som ännu lever. Filmen handlar om kamp, överlevnad och vad det verkligen kostar att förändra framtiden.',
        140,
        '15',
        'English',
        '2026-04-10',
        'https://youtu.be/27Kk9gMfbCw?si=kuEyrD8IRoLEPVzK',
        '2026-01-01',
        'Paramount',
        1,
        0
    ),
    (
        19,
        'Star Wars: New Jedi Order',
        'Star Wars: New Jedi Order följer galaxen efter Skywalker-eran. Jedi-orden är nästan borta och måste byggas upp igen. Filmen handlar om nya Jedi, nya hot och hur Kraften formas i en helt ny tid.',
        160,
        '11',
        'English',
        '2026-12-18',
        'https://youtu.be/PSW_AuAMlx0?si=MPiuzldgQ0pFA-Gl',
        '2026-01-01',
        'Lucasfilm',
        1,
        1
    ),
    (
        20,
        'The Witcher: Origins',
        'Geralt möter sitt ursprung i en mörk fantasyvärld.',
        150,
        '18',
        'English',
        '2022-12-25',
        'https://youtu.be/6nhwT1vQS68?si=pFssyewTJ5qOgwF5',
        '2022-01-01',
        'Netflix',
        1,
        0
    );

DROP TABLE IF EXISTS `MovieToActor`;

CREATE TABLE `MovieToActor` (
    `id` int NOT NULL AUTO_INCREMENT,
    `movieId` int NOT NULL,
    `actorId` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `movieId` (`movieId`),
    KEY `actorId` (`actorId`),
    CONSTRAINT `MovieToActor_ibfk_1` FOREIGN KEY (`movieId`) REFERENCES `Movie` (`id`),
    CONSTRAINT `MovieToActor_ibfk_2` FOREIGN KEY (`actorId`) REFERENCES `Actor` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 264 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `MovieToActor` (`id`, `movieId`, `actorId`)
VALUES (79, 1, 14),
    (80, 1, 15),
    (81, 1, 13),
    (82, 12, 36),
    (83, 12, 37),
    (84, 12, 38),
    (85, 12, 39),
    (86, 12, 41),
    (87, 12, 10),
    (88, 12, 42),
    (89, 12, 43),
    (90, 12, 44),
    (92, 2, 45),
    (93, 2, 46),
    (94, 2, 47),
    (95, 2, 48),
    (96, 3, 49),
    (97, 3, 40),
    (98, 3, 50),
    (100, 3, 51),
    (101, 3, 52),
    (102, 3, 53),
    (103, 3, 54),
    (104, 4, 55),
    (105, 4, 56),
    (106, 4, 57),
    (107, 4, 58),
    (108, 4, 59),
    (109, 4, 60),
    (110, 4, 61),
    (111, 4, 62),
    (112, 5, 63),
    (113, 5, 64),
    (114, 5, 65),
    (115, 5, 41),
    (116, 5, 66),
    (118, 5, 67),
    (119, 5, 68),
    (120, 5, 69),
    (121, 5, 70),
    (122, 5, 71),
    (123, 5, 72),
    (124, 6, 49),
    (125, 6, 73),
    (126, 6, 74),
    (127, 6, 75),
    (128, 6, 76),
    (129, 6, 77),
    (130, 6, 78),
    (131, 6, 79),
    (132, 6, 80),
    (133, 6, 81),
    (134, 6, 82),
    (135, 6, 83),
    (136, 6, 84),
    (137, 6, 85),
    (138, 6, 86),
    (139, 6, 87),
    (140, 6, 88),
    (141, 6, 89),
    (142, 7, 41),
    (143, 7, 66),
    (144, 7, 90),
    (145, 7, 91),
    (146, 7, 92),
    (147, 7, 93),
    (148, 7, 94),
    (149, 8, 97),
    (150, 8, 98),
    (151, 8, 99),
    (152, 8, 100),
    (153, 8, 101),
    (156, 20, 104),
    (157, 20, 105),
    (158, 20, 106),
    (159, 20, 107),
    (160, 20, 108),
    (161, 20, 109),
    (162, 20, 110),
    (163, 20, 111),
    (164, 20, 112),
    (165, 20, 113),
    (166, 20, 114),
    (167, 20, 115),
    (168, 20, 116),
    (169, 20, 117),
    (170, 20, 118),
    (171, 20, 119),
    (172, 20, 120),
    (173, 20, 121),
    (187, 9, 74),
    (188, 9, 115),
    (189, 9, 122),
    (190, 9, 123),
    (191, 9, 124),
    (192, 9, 125),
    (193, 9, 126),
    (194, 9, 127),
    (195, 9, 128),
    (196, 9, 129),
    (197, 9, 130),
    (198, 9, 131),
    (199, 9, 132),
    (200, 9, 133),
    (201, 9, 134),
    (202, 9, 135),
    (203, 9, 136),
    (204, 9, 137),
    (218, 10, 153),
    (219, 10, 154),
    (220, 10, 155),
    (221, 11, 69),
    (222, 11, 156),
    (223, 11, 157),
    (224, 11, 158),
    (225, 11, 159),
    (226, 11, 160),
    (227, 11, 161),
    (228, 11, 162),
    (229, 11, 163),
    (230, 11, 164),
    (231, 11, 165),
    (232, 11, 166),
    (233, 11, 167),
    (234, 11, 168),
    (235, 11, 169),
    (236, 11, 170),
    (237, 11, 171),
    (238, 11, 172),
    (252, 14, 187),
    (253, 16, 188),
    (254, 16, 189),
    (255, 16, 190),
    (256, 16, 191),
    (257, 16, 192),
    (258, 16, 193),
    (259, 16, 194),
    (260, 17, 195),
    (261, 17, 196),
    (263, 19, 198);

DROP TABLE IF EXISTS `MovieToCategory`;

CREATE TABLE `MovieToCategory` (
    `id` int NOT NULL AUTO_INCREMENT,
    `movieId` int NOT NULL,
    `categoryId` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `movieId` (`movieId`),
    KEY `categoryId` (`categoryId`),
    CONSTRAINT `MovieToCategory_ibfk_1` FOREIGN KEY (`movieId`) REFERENCES `Movie` (`id`),
    CONSTRAINT `MovieToCategory_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 68 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `MovieToCategory` (`id`, `movieId`, `categoryId`)
VALUES (2, 1, 9),
    (3, 1, 8),
    (4, 1, 20),
    (5, 2, 6),
    (6, 2, 7),
    (7, 2, 4),
    (8, 3, 1),
    (9, 3, 18),
    (10, 3, 10),
    (11, 3, 5),
    (12, 4, 6),
    (13, 4, 7),
    (14, 4, 8),
    (15, 5, 1),
    (16, 5, 5),
    (17, 5, 20),
    (18, 5, 1),
    (19, 5, 2),
    (20, 5, 5),
    (21, 5, 20),
    (22, 6, 1),
    (23, 6, 2),
    (24, 6, 13),
    (25, 6, 3),
    (26, 7, 6),
    (27, 7, 8),
    (28, 7, 7),
    (29, 8, 5),
    (30, 8, 1),
    (31, 8, 3),
    (32, 9, 11),
    (33, 9, 4),
    (34, 9, 9),
    (35, 10, 1),
    (36, 10, 2),
    (37, 10, 14),
    (38, 11, 1),
    (39, 11, 10),
    (40, 11, 2),
    (41, 12, 3),
    (42, 12, 19),
    (43, 12, 2),
    (44, 13, 1),
    (45, 13, 8),
    (46, 13, 5),
    (47, 14, 1),
    (48, 14, 2),
    (49, 14, 3),
    (50, 15, 6),
    (51, 15, 7),
    (52, 15, 8),
    (53, 16, 2),
    (54, 16, 3),
    (55, 16, 12),
    (56, 17, 2),
    (57, 17, 4),
    (58, 17, 14),
    (59, 18, 1),
    (60, 18, 3),
    (62, 19, 3),
    (63, 19, 4),
    (64, 19, 12),
    (65, 20, 2),
    (66, 20, 4),
    (67, 20, 9);

DROP TABLE IF EXISTS `PasswordReset`;

CREATE TABLE `PasswordReset` (
    `id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(255) NOT NULL,
    `code` varchar(10) NOT NULL,
    `expiresAt` datetime NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 27 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `PasswordReset` (
        `id`,
        `email`,
        `code`,
        `expiresAt`
    )
VALUES (
        16,
        'hamster@hamster.se',
        '261736',
        '2026-03-18 09:48:51'
    ),
    (
        20,
        'ceciliacavallin@hotmail.se',
        '736980',
        '2026-03-18 09:41:56'
    ),
    (
        21,
        'kifff@kiff.se',
        '196288',
        '2026-03-18 11:46:15'
    ),
    (
        24,
        'kifle.uni@gmail.com',
        '211259',
        '2026-03-18 11:49:13'
    ),
    (
        25,
        'k@hotmail.com',
        '714975',
        '2026-03-18 11:53:47'
    );

DROP TABLE IF EXISTS `Review`;

CREATE TABLE `Review` (
    `id` int NOT NULL AUTO_INCREMENT,
    `gradingOfStars` decimal(10, 0) NOT NULL,
    `description` varchar(250) NOT NULL,
    `author` varchar(200) NOT NULL,
    `movieId` int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`),
    KEY `movieId` (`movieId`),
    CONSTRAINT `Review_ibfk_1` FOREIGN KEY (`movieId`) REFERENCES `Movie` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 27 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Review` (
        `id`,
        `gradingOfStars`,
        `description`,
        `author`,
        `movieId`
    )
VALUES (
        1,
        5,
        'En fantastisk uppföljare! Meryl Streep är lika ikonisk som alltid.',
        'Filmfantasten88',
        1
    ),
    (
        2,
        3,
        'Bra, men saknar lite av charmen från första filmen.',
        'MovieCritiq',
        1
    ),
    (
        3,
        5,
        'Barnen älskade den! Musiken är återigen i världsklass.',
        'Förälder2024',
        2
    ),
    (
        4,
        4,
        'En värdig fortsättning på sagan om Elsa och Anna.',
        'DisneyLover',
        2
    ),
    (
        5,
        5,
        'Mörk, rå och helt fantastisk. Pattinson är den bästa Batman.',
        'GothamKnight',
        3
    ),
    (
        6,
        5,
        'En visuell upplevelse utöver det vanliga.',
        'CinemaBuff',
        3
    ),
    (
        7,
        4,
        'Lite onödig uppföljare, men fortfarande väldigt rörande.',
        'NostalgiNisse',
        4
    ),
    (
        8,
        5,
        'Äntligen tillbaka till rötterna. En nystart vi alla väntat på.',
        'SpideyFan',
        5
    ),
    (
        9,
        4,
        'Spännande och känslosam utveckling för Peter Parker.',
        'MarvelGeek',
        5
    ),
    (
        10,
        3,
        'Känns som vi har sett det här förut. Snygga effekter dock.',
        'DinoDestroyer',
        6
    ),
    (
        11,
        5,
        'Träsket har aldrig sett bättre ut! Skratten avlöser varandra.',
        'FarFarAway',
        7
    ),
    (
        12,
        4,
        'En modern tolkning som verkligen fungerar för vår tid.',
        'DailyPlanet',
        8
    ),
    (
        13,
        5,
        'Ett filosofiskt mästerverk. Villeneuve gör det igen.',
        'ArrakisTraveler',
        12
    ),
    (
        14,
        5,
        'Lika galen och rolig som de tidigare. Bryter fjärde väggen perfekt!',
        'WadeWilsonFan',
        13
    ),
    (
        15,
        3,
        'Intressant bakgrundshistoria, men lite seg i mitten.',
        'GeraltWatcher',
        20
    ),
    (
        16,
        3,
        'Betyg lämnat via Min Sida',
        'hamster',
        7
    ),
    (
        17,
        4,
        'jag kan rekomndera denna filmen efter dagens strukturmässiga hamsterdance techno remix i den',
        'hamster',
        7
    ),
    (
        18,
        4,
        'arbeta med den stora konstruktions debaklet',
        'hamster',
        3
    ),
    (
        19,
        5,
        'Helt fantastisk som vi skrattade!!',
        'Coolio Mar',
        15
    ),
    (
        20,
        5,
        'Otrolig!',
        'cool88',
        2
    ),
    (21, 5, 'zx', 'cool88', 2),
    (
        22,
        5,
        'Ingen kommentar',
        'cool88',
        2
    ),
    (23, 5, 'ff', 'cool88', 2),
    (
        24,
        3,
        'Jag tyckte den var bra ',
        'hamster',
        10
    ),
    (
        25,
        5,
        'Den var det bästa filmen jag sett ',
        'andersövaren',
        11
    ),
    (26, 5, 'bra', 'Coolio Mar', 2);

DROP TABLE IF EXISTS `Screening`;

CREATE TABLE `Screening` (
    `id` int NOT NULL AUTO_INCREMENT,
    `date` date NOT NULL,
    `startTime` timestamp NOT NULL,
    `theaterId` int NOT NULL,
    `movieId` int NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`),
    KEY `theaterId` (`theaterId`),
    KEY `movieId` (`movieId`),
    CONSTRAINT `Screening_ibfk_1` FOREIGN KEY (`theaterId`) REFERENCES `Theater` (`id`),
    CONSTRAINT `Screening_ibfk_2` FOREIGN KEY (`movieId`) REFERENCES `Movie` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 301 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Screening` (
        `id`,
        `date`,
        `startTime`,
        `theaterId`,
        `movieId`
    )
VALUES (
        1,
        '2026-02-17',
        '2026-02-17 18:00:00',
        1,
        4
    ),
    (
        2,
        '2026-02-17',
        '2026-02-17 20:15:00',
        1,
        13
    ),
    (
        3,
        '2026-02-17',
        '2026-02-17 18:00:00',
        2,
        2
    ),
    (
        4,
        '2026-02-17',
        '2026-02-17 20:30:00',
        2,
        15
    ),
    (
        5,
        '2026-02-18',
        '2026-02-18 18:00:00',
        1,
        12
    ),
    (
        6,
        '2026-02-18',
        '2026-02-18 21:15:00',
        1,
        10
    ),
    (
        7,
        '2026-02-18',
        '2026-02-18 18:00:00',
        2,
        7
    ),
    (
        8,
        '2026-02-18',
        '2026-02-18 20:15:00',
        2,
        5
    ),
    (
        9,
        '2026-02-19',
        '2026-02-19 18:00:00',
        1,
        3
    ),
    (
        10,
        '2026-02-19',
        '2026-02-19 18:00:00',
        2,
        1
    ),
    (
        11,
        '2026-02-19',
        '2026-02-19 20:30:00',
        2,
        8
    ),
    (
        12,
        '2026-02-20',
        '2026-02-20 18:00:00',
        1,
        11
    ),
    (
        13,
        '2026-02-20',
        '2026-02-20 21:15:00',
        1,
        18
    ),
    (
        14,
        '2026-02-20',
        '2026-02-20 18:00:00',
        2,
        9
    ),
    (
        16,
        '2026-02-21',
        '2026-02-21 14:00:00',
        1,
        7
    ),
    (
        17,
        '2026-02-21',
        '2026-02-21 16:15:00',
        1,
        4
    ),
    (
        18,
        '2026-02-21',
        '2026-02-21 19:00:00',
        1,
        19
    ),
    (
        19,
        '2026-02-21',
        '2026-02-21 14:00:00',
        2,
        2
    ),
    (
        20,
        '2026-02-21',
        '2026-02-21 16:30:00',
        2,
        17
    ),
    (
        21,
        '2026-02-21',
        '2026-02-21 19:45:00',
        2,
        13
    ),
    (
        22,
        '2026-02-22',
        '2026-02-22 14:00:00',
        1,
        15
    ),
    (
        23,
        '2026-02-22',
        '2026-02-22 16:30:00',
        1,
        6
    ),
    (
        24,
        '2026-02-22',
        '2026-02-22 19:30:00',
        1,
        3
    ),
    (
        25,
        '2026-02-22',
        '2026-02-22 14:00:00',
        2,
        10
    ),
    (
        26,
        '2026-02-22',
        '2026-02-22 16:30:00',
        2,
        16
    ),
    (
        27,
        '2026-02-22',
        '2026-02-22 19:30:00',
        2,
        20
    ),
    (
        28,
        '2026-02-23',
        '2026-02-23 18:00:00',
        1,
        5
    ),
    (
        29,
        '2026-02-23',
        '2026-02-23 21:00:00',
        1,
        8
    ),
    (
        30,
        '2026-02-23',
        '2026-02-23 18:00:00',
        2,
        1
    ),
    (
        31,
        '2026-02-23',
        '2026-02-23 20:30:00',
        2,
        7
    ),
    (
        32,
        '2026-02-24',
        '2026-02-24 18:00:00',
        1,
        14
    ),
    (
        33,
        '2026-02-24',
        '2026-02-24 21:15:00',
        1,
        12
    ),
    (
        34,
        '2026-02-24',
        '2026-02-24 18:00:00',
        2,
        2
    ),
    (
        35,
        '2026-02-24',
        '2026-02-24 20:30:00',
        2,
        10
    ),
    (
        36,
        '2026-02-25',
        '2026-02-25 18:00:00',
        1,
        11
    ),
    (
        37,
        '2026-02-25',
        '2026-02-25 21:15:00',
        1,
        18
    ),
    (
        38,
        '2026-02-25',
        '2026-02-25 18:00:00',
        2,
        15
    ),
    (
        39,
        '2026-02-25',
        '2026-02-25 20:30:00',
        2,
        13
    ),
    (
        40,
        '2026-02-26',
        '2026-02-26 18:00:00',
        1,
        17
    ),
    (
        41,
        '2026-02-26',
        '2026-02-26 21:00:00',
        1,
        5
    ),
    (
        42,
        '2026-02-26',
        '2026-02-26 18:00:00',
        2,
        9
    ),
    (
        43,
        '2026-02-26',
        '2026-02-26 20:45:00',
        2,
        8
    ),
    (
        44,
        '2026-02-27',
        '2026-02-27 18:00:00',
        1,
        19
    ),
    (
        45,
        '2026-02-27',
        '2026-02-27 21:15:00',
        1,
        14
    ),
    (
        46,
        '2026-02-27',
        '2026-02-27 18:00:00',
        2,
        4
    ),
    (
        47,
        '2026-02-27',
        '2026-02-27 20:30:00',
        2,
        20
    ),
    (
        48,
        '2026-02-28',
        '2026-02-28 14:00:00',
        1,
        6
    ),
    (
        49,
        '2026-02-28',
        '2026-02-28 16:45:00',
        1,
        5
    ),
    (
        50,
        '2026-02-28',
        '2026-02-28 19:45:00',
        1,
        12
    ),
    (
        51,
        '2026-02-28',
        '2026-02-28 14:00:00',
        2,
        10
    ),
    (
        52,
        '2026-02-28',
        '2026-02-28 16:30:00',
        2,
        2
    ),
    (
        53,
        '2026-02-28',
        '2026-02-28 19:00:00',
        2,
        3
    ),
    (
        54,
        '2026-03-01',
        '2026-03-01 14:00:00',
        1,
        17
    ),
    (
        55,
        '2026-03-01',
        '2026-03-01 17:00:00',
        1,
        11
    ),
    (
        56,
        '2026-03-01',
        '2026-03-01 20:15:00',
        1,
        13
    ),
    (
        57,
        '2026-03-01',
        '2026-03-01 14:00:00',
        2,
        7
    ),
    (
        58,
        '2026-03-01',
        '2026-03-01 16:15:00',
        2,
        9
    ),
    (
        59,
        '2026-03-01',
        '2026-03-01 19:00:00',
        2,
        16
    ),
    (
        60,
        '2026-03-02',
        '2026-03-02 18:00:00',
        1,
        8
    ),
    (
        61,
        '2026-03-02',
        '2026-03-02 21:00:00',
        1,
        1
    ),
    (
        62,
        '2026-03-02',
        '2026-03-02 18:00:00',
        2,
        15
    ),
    (
        63,
        '2026-03-02',
        '2026-03-02 20:30:00',
        2,
        18
    ),
    (
        64,
        '2026-03-03',
        '2026-03-03 18:00:00',
        1,
        4
    ),
    (
        65,
        '2026-03-03',
        '2026-03-03 20:30:00',
        1,
        3
    ),
    (
        66,
        '2026-03-03',
        '2026-03-03 18:00:00',
        2,
        10
    ),
    (
        67,
        '2026-03-03',
        '2026-03-03 20:30:00',
        2,
        5
    ),
    (
        68,
        '2026-02-27',
        '2026-02-27 20:45:00',
        2,
        14
    ),
    (
        69,
        '2026-02-28',
        '2026-02-28 16:15:00',
        1,
        4
    ),
    (
        70,
        '2026-02-28',
        '2026-02-28 19:00:00',
        1,
        19
    ),
    (
        71,
        '2026-02-28',
        '2026-02-28 19:45:00',
        2,
        13
    ),
    (
        72,
        '2026-03-01',
        '2026-03-01 16:30:00',
        1,
        6
    ),
    (
        73,
        '2026-03-01',
        '2026-03-01 19:30:00',
        1,
        3
    ),
    (
        74,
        '2026-03-01',
        '2026-03-01 16:30:00',
        2,
        16
    ),
    (
        75,
        '2026-03-01',
        '2026-03-01 19:30:00',
        2,
        20
    ),
    (
        79,
        '2026-03-03',
        '2026-03-03 21:15:00',
        1,
        12
    ),
    (
        80,
        '2026-03-04',
        '2026-03-04 18:00:00',
        1,
        11
    ),
    (
        81,
        '2026-03-04',
        '2026-03-04 21:15:00',
        1,
        18
    ),
    (
        82,
        '2026-03-04',
        '2026-03-04 18:00:00',
        2,
        15
    ),
    (
        83,
        '2026-03-04',
        '2026-03-04 20:30:00',
        2,
        13
    ),
    (
        87,
        '2026-03-05',
        '2026-03-05 18:00:00',
        1,
        17
    ),
    (
        88,
        '2026-03-05',
        '2026-03-05 21:00:00',
        1,
        5
    ),
    (
        89,
        '2026-03-05',
        '2026-03-05 18:00:00',
        2,
        9
    ),
    (
        90,
        '2026-03-05',
        '2026-03-05 20:45:00',
        2,
        8
    ),
    (
        94,
        '2026-03-06',
        '2026-03-06 18:00:00',
        1,
        19
    ),
    (
        95,
        '2026-03-06',
        '2026-03-06 21:15:00',
        1,
        14
    ),
    (
        96,
        '2026-03-06',
        '2026-03-06 18:00:00',
        2,
        4
    ),
    (
        97,
        '2026-03-06',
        '2026-03-06 20:30:00',
        2,
        20
    ),
    (
        98,
        '2026-03-06',
        '2026-03-06 20:45:00',
        2,
        14
    ),
    (
        101,
        '2026-03-07',
        '2026-03-07 14:00:00',
        1,
        6
    ),
    (
        102,
        '2026-03-07',
        '2026-03-07 16:45:00',
        1,
        5
    ),
    (
        103,
        '2026-03-07',
        '2026-03-07 19:45:00',
        1,
        12
    ),
    (
        104,
        '2026-03-07',
        '2026-03-07 14:00:00',
        2,
        10
    ),
    (
        105,
        '2026-03-07',
        '2026-03-07 16:30:00',
        2,
        2
    ),
    (
        106,
        '2026-03-07',
        '2026-03-07 19:00:00',
        2,
        3
    ),
    (
        107,
        '2026-03-07',
        '2026-03-07 16:15:00',
        1,
        4
    ),
    (
        108,
        '2026-03-07',
        '2026-03-07 19:00:00',
        1,
        19
    ),
    (
        109,
        '2026-03-07',
        '2026-03-07 19:45:00',
        2,
        13
    ),
    (
        116,
        '2026-03-08',
        '2026-03-08 14:00:00',
        1,
        17
    ),
    (
        117,
        '2026-03-08',
        '2026-03-08 17:00:00',
        1,
        11
    ),
    (
        118,
        '2026-03-08',
        '2026-03-08 20:15:00',
        1,
        13
    ),
    (
        119,
        '2026-03-08',
        '2026-03-08 14:00:00',
        2,
        7
    ),
    (
        120,
        '2026-03-08',
        '2026-03-08 16:15:00',
        2,
        9
    ),
    (
        121,
        '2026-03-08',
        '2026-03-08 19:00:00',
        2,
        16
    ),
    (
        122,
        '2026-03-08',
        '2026-03-08 16:30:00',
        1,
        6
    ),
    (
        123,
        '2026-03-08',
        '2026-03-08 19:30:00',
        1,
        3
    ),
    (
        124,
        '2026-03-08',
        '2026-03-08 16:30:00',
        2,
        16
    ),
    (
        125,
        '2026-03-08',
        '2026-03-08 19:30:00',
        2,
        20
    ),
    (
        131,
        '2026-03-09',
        '2026-03-09 18:00:00',
        1,
        8
    ),
    (
        132,
        '2026-03-09',
        '2026-03-09 21:00:00',
        1,
        1
    ),
    (
        133,
        '2026-03-09',
        '2026-03-09 18:00:00',
        2,
        15
    ),
    (
        134,
        '2026-03-09',
        '2026-03-09 20:30:00',
        2,
        18
    ),
    (
        138,
        '2026-03-10',
        '2026-03-10 18:00:00',
        1,
        4
    ),
    (
        139,
        '2026-03-10',
        '2026-03-10 20:30:00',
        1,
        3
    ),
    (
        140,
        '2026-03-10',
        '2026-03-10 18:00:00',
        2,
        10
    ),
    (
        141,
        '2026-03-10',
        '2026-03-10 20:30:00',
        2,
        5
    ),
    (
        201,
        '2026-03-11',
        '2026-03-11 18:00:00',
        1,
        3
    ),
    (
        202,
        '2026-03-11',
        '2026-03-11 21:30:00',
        1,
        5
    ),
    (
        203,
        '2026-03-11',
        '2026-03-11 18:00:00',
        2,
        2
    ),
    (
        204,
        '2026-03-11',
        '2026-03-11 20:30:00',
        2,
        7
    ),
    (
        205,
        '2026-03-14',
        '2026-03-14 13:30:00',
        1,
        4
    ),
    (
        206,
        '2026-03-14',
        '2026-03-14 16:00:00',
        1,
        6
    ),
    (
        207,
        '2026-03-14',
        '2026-03-14 19:00:00',
        1,
        1
    ),
    (
        208,
        '2026-03-14',
        '2026-03-14 13:30:00',
        2,
        7
    ),
    (
        209,
        '2026-03-14',
        '2026-03-14 16:00:00',
        2,
        2
    ),
    (
        210,
        '2026-03-14',
        '2026-03-14 18:30:00',
        2,
        5
    ),
    (
        211,
        '2026-03-16',
        '2026-03-16 18:00:00',
        1,
        12
    ),
    (
        212,
        '2026-03-16',
        '2026-03-16 21:30:00',
        1,
        11
    ),
    (
        213,
        '2026-03-16',
        '2026-03-16 18:00:00',
        2,
        10
    ),
    (
        214,
        '2026-03-16',
        '2026-03-16 20:30:00',
        2,
        15
    ),
    (
        215,
        '2026-03-12',
        '2026-03-12 18:00:00',
        1,
        12
    ),
    (
        216,
        '2026-03-12',
        '2026-03-12 21:15:00',
        1,
        11
    ),
    (
        217,
        '2026-03-12',
        '2026-03-12 18:00:00',
        2,
        8
    ),
    (
        218,
        '2026-03-12',
        '2026-03-12 21:00:00',
        2,
        9
    ),
    (
        219,
        '2026-03-13',
        '2026-03-13 18:00:00',
        1,
        14
    ),
    (
        220,
        '2026-03-13',
        '2026-03-13 21:15:00',
        1,
        17
    ),
    (
        221,
        '2026-03-13',
        '2026-03-13 18:00:00',
        2,
        19
    ),
    (
        222,
        '2026-03-13',
        '2026-03-13 21:15:00',
        2,
        13
    ),
    (
        223,
        '2026-03-15',
        '2026-03-15 13:30:00',
        1,
        15
    ),
    (
        224,
        '2026-03-15',
        '2026-03-15 16:00:00',
        1,
        18
    ),
    (
        225,
        '2026-03-15',
        '2026-03-15 19:00:00',
        1,
        20
    ),
    (
        226,
        '2026-03-15',
        '2026-03-15 13:30:00',
        2,
        16
    ),
    (
        227,
        '2026-03-15',
        '2026-03-15 16:30:00',
        2,
        19
    ),
    (
        228,
        '2026-03-15',
        '2026-03-15 20:00:00',
        2,
        9
    ),
    (
        233,
        '2026-03-17',
        '2026-03-17 18:00:00',
        1,
        12
    ),
    (
        234,
        '2026-03-17',
        '2026-03-17 21:30:00',
        1,
        11
    ),
    (
        235,
        '2026-03-17',
        '2026-03-17 18:00:00',
        2,
        10
    ),
    (
        236,
        '2026-03-17',
        '2026-03-17 20:30:00',
        2,
        15
    ),
    (
        241,
        '2026-03-18',
        '2026-03-18 18:00:00',
        1,
        3
    ),
    (
        242,
        '2026-03-18',
        '2026-03-18 21:30:00',
        1,
        5
    ),
    (
        243,
        '2026-03-18',
        '2026-03-18 18:00:00',
        2,
        2
    ),
    (
        244,
        '2026-03-18',
        '2026-03-18 20:30:00',
        2,
        7
    ),
    (
        245,
        '2026-03-19',
        '2026-03-19 18:00:00',
        1,
        12
    ),
    (
        246,
        '2026-03-19',
        '2026-03-19 21:15:00',
        1,
        11
    ),
    (
        247,
        '2026-03-19',
        '2026-03-19 18:00:00',
        2,
        8
    ),
    (
        248,
        '2026-03-19',
        '2026-03-19 21:00:00',
        2,
        9
    ),
    (
        252,
        '2026-03-20',
        '2026-03-20 18:00:00',
        1,
        14
    ),
    (
        253,
        '2026-03-20',
        '2026-03-20 21:15:00',
        1,
        17
    ),
    (
        254,
        '2026-03-20',
        '2026-03-20 18:00:00',
        2,
        19
    ),
    (
        255,
        '2026-03-20',
        '2026-03-20 21:15:00',
        2,
        13
    ),
    (
        259,
        '2026-03-21',
        '2026-03-21 19:00:00',
        1,
        1
    ),
    (
        260,
        '2026-03-21',
        '2026-03-21 16:00:00',
        2,
        2
    ),
    (
        261,
        '2026-03-21',
        '2026-03-21 13:30:00',
        1,
        4
    ),
    (
        262,
        '2026-03-21',
        '2026-03-21 18:30:00',
        2,
        5
    ),
    (
        263,
        '2026-03-21',
        '2026-03-21 16:00:00',
        1,
        6
    ),
    (
        264,
        '2026-03-21',
        '2026-03-21 13:30:00',
        2,
        7
    ),
    (
        266,
        '2026-03-22',
        '2026-03-22 13:30:00',
        1,
        15
    ),
    (
        267,
        '2026-03-22',
        '2026-03-22 16:00:00',
        1,
        18
    ),
    (
        268,
        '2026-03-22',
        '2026-03-22 19:00:00',
        1,
        20
    ),
    (
        269,
        '2026-03-22',
        '2026-03-22 13:30:00',
        2,
        16
    ),
    (
        270,
        '2026-03-22',
        '2026-03-22 16:30:00',
        2,
        19
    ),
    (
        271,
        '2026-03-22',
        '2026-03-22 20:00:00',
        2,
        9
    ),
    (
        273,
        '2026-03-23',
        '2026-03-23 18:00:00',
        1,
        12
    ),
    (
        274,
        '2026-03-23',
        '2026-03-23 21:30:00',
        1,
        11
    ),
    (
        275,
        '2026-03-23',
        '2026-03-23 18:00:00',
        2,
        10
    ),
    (
        276,
        '2026-03-23',
        '2026-03-23 20:30:00',
        2,
        15
    ),
    (
        280,
        '2026-03-24',
        '2026-03-24 18:00:00',
        1,
        12
    ),
    (
        281,
        '2026-03-24',
        '2026-03-24 21:30:00',
        1,
        11
    ),
    (
        282,
        '2026-03-24',
        '2026-03-24 18:00:00',
        2,
        10
    ),
    (
        283,
        '2026-03-24',
        '2026-03-24 20:30:00',
        2,
        15
    ),
    (
        287,
        '2026-03-25',
        '2026-03-25 18:00:00',
        1,
        3
    ),
    (
        288,
        '2026-03-25',
        '2026-03-25 21:30:00',
        1,
        5
    ),
    (
        289,
        '2026-03-25',
        '2026-03-25 18:00:00',
        2,
        2
    ),
    (
        290,
        '2026-03-25',
        '2026-03-25 20:30:00',
        2,
        7
    ),
    (
        294,
        '2026-03-26',
        '2026-03-26 18:00:00',
        1,
        12
    ),
    (
        295,
        '2026-03-26',
        '2026-03-26 21:15:00',
        1,
        11
    ),
    (
        296,
        '2026-03-26',
        '2026-03-26 18:00:00',
        2,
        8
    ),
    (
        297,
        '2026-03-26',
        '2026-03-26 21:00:00',
        2,
        9
    );

DROP TABLE IF EXISTS `Seat`;

CREATE TABLE `Seat` (
    `id` int NOT NULL AUTO_INCREMENT,
    `row` int NOT NULL,
    `number` int NOT NULL,
    `theaterId` int NOT NULL,
    `seatType` enum('normal', 'vip', 'wheelchair') DEFAULT 'normal',
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`),
    KEY `theaterId` (`theaterId`),
    CONSTRAINT `Seat_ibfk_1` FOREIGN KEY (`theaterId`) REFERENCES `Theater` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 137 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Seat` (
        `id`,
        `row`,
        `number`,
        `theaterId`,
        `seatType`
    )
VALUES (1, 1, 1, 1, 'normal'),
    (2, 1, 2, 1, 'normal'),
    (3, 1, 3, 1, 'normal'),
    (4, 1, 4, 1, 'normal'),
    (5, 1, 5, 1, 'normal'),
    (6, 1, 6, 1, 'normal'),
    (7, 1, 7, 1, 'normal'),
    (8, 1, 8, 1, 'normal'),
    (9, 2, 1, 1, 'normal'),
    (10, 2, 2, 1, 'normal'),
    (11, 2, 3, 1, 'normal'),
    (12, 2, 4, 1, 'normal'),
    (13, 2, 5, 1, 'normal'),
    (14, 2, 6, 1, 'normal'),
    (15, 2, 7, 1, 'normal'),
    (16, 2, 8, 1, 'normal'),
    (17, 2, 9, 1, 'normal'),
    (18, 3, 1, 1, 'normal'),
    (19, 3, 2, 1, 'normal'),
    (20, 3, 3, 1, 'normal'),
    (21, 3, 4, 1, 'normal'),
    (22, 3, 5, 1, 'normal'),
    (23, 3, 6, 1, 'normal'),
    (24, 3, 7, 1, 'normal'),
    (25, 3, 8, 1, 'normal'),
    (26, 3, 9, 1, 'normal'),
    (27, 3, 10, 1, 'normal'),
    (28, 4, 1, 1, 'normal'),
    (29, 4, 2, 1, 'normal'),
    (30, 4, 3, 1, 'normal'),
    (31, 4, 4, 1, 'normal'),
    (32, 4, 5, 1, 'normal'),
    (33, 4, 6, 1, 'normal'),
    (34, 4, 7, 1, 'normal'),
    (35, 4, 8, 1, 'normal'),
    (36, 4, 9, 1, 'normal'),
    (37, 4, 10, 1, 'normal'),
    (38, 5, 1, 1, 'normal'),
    (39, 5, 2, 1, 'normal'),
    (40, 5, 3, 1, 'normal'),
    (41, 5, 4, 1, 'normal'),
    (42, 5, 5, 1, 'normal'),
    (43, 5, 6, 1, 'normal'),
    (44, 5, 7, 1, 'normal'),
    (45, 5, 8, 1, 'normal'),
    (46, 5, 9, 1, 'normal'),
    (47, 5, 10, 1, 'normal'),
    (48, 6, 1, 1, 'normal'),
    (49, 6, 2, 1, 'normal'),
    (50, 6, 3, 1, 'normal'),
    (51, 6, 4, 1, 'normal'),
    (52, 6, 5, 1, 'normal'),
    (53, 6, 6, 1, 'normal'),
    (54, 6, 7, 1, 'normal'),
    (55, 6, 8, 1, 'normal'),
    (56, 6, 9, 1, 'normal'),
    (57, 6, 10, 1, 'normal'),
    (58, 7, 1, 1, 'normal'),
    (59, 7, 2, 1, 'normal'),
    (60, 7, 3, 1, 'normal'),
    (61, 7, 4, 1, 'normal'),
    (62, 7, 5, 1, 'normal'),
    (63, 7, 6, 1, 'normal'),
    (64, 7, 7, 1, 'normal'),
    (65, 7, 8, 1, 'normal'),
    (66, 7, 9, 1, 'normal'),
    (67, 7, 10, 1, 'normal'),
    (68, 7, 11, 1, 'normal'),
    (69, 7, 12, 1, 'normal'),
    (70, 8, 1, 1, 'normal'),
    (71, 8, 2, 1, 'normal'),
    (72, 8, 3, 1, 'normal'),
    (73, 8, 4, 1, 'normal'),
    (74, 8, 5, 1, 'normal'),
    (75, 8, 6, 1, 'normal'),
    (76, 8, 7, 1, 'normal'),
    (77, 8, 8, 1, 'normal'),
    (78, 8, 9, 1, 'normal'),
    (79, 8, 10, 1, 'normal'),
    (80, 8, 11, 1, 'normal'),
    (81, 8, 12, 1, 'normal'),
    (82, 1, 1, 2, 'normal'),
    (83, 1, 2, 2, 'normal'),
    (84, 1, 3, 2, 'normal'),
    (85, 1, 4, 2, 'normal'),
    (86, 1, 5, 2, 'normal'),
    (87, 1, 6, 2, 'normal'),
    (88, 2, 1, 2, 'normal'),
    (89, 2, 2, 2, 'normal'),
    (90, 2, 3, 2, 'normal'),
    (91, 2, 4, 2, 'normal'),
    (92, 2, 5, 2, 'normal'),
    (93, 2, 6, 2, 'normal'),
    (94, 2, 7, 2, 'normal'),
    (95, 2, 8, 2, 'normal'),
    (96, 3, 1, 2, 'normal'),
    (97, 3, 2, 2, 'normal'),
    (98, 3, 3, 2, 'normal'),
    (99, 3, 4, 2, 'normal'),
    (100, 3, 5, 2, 'normal'),
    (101, 3, 6, 2, 'normal'),
    (102, 3, 7, 2, 'normal'),
    (103, 3, 8, 2, 'normal'),
    (104, 3, 9, 2, 'normal'),
    (105, 4, 1, 2, 'normal'),
    (106, 4, 2, 2, 'normal'),
    (107, 4, 3, 2, 'normal'),
    (108, 4, 4, 2, 'normal'),
    (109, 4, 5, 2, 'normal'),
    (110, 4, 6, 2, 'normal'),
    (111, 4, 7, 2, 'normal'),
    (112, 4, 8, 2, 'normal'),
    (113, 4, 9, 2, 'normal'),
    (114, 4, 10, 2, 'normal'),
    (115, 5, 1, 2, 'normal'),
    (116, 5, 2, 2, 'normal'),
    (117, 5, 3, 2, 'normal'),
    (118, 5, 4, 2, 'normal'),
    (119, 5, 5, 2, 'normal'),
    (120, 5, 6, 2, 'normal'),
    (121, 5, 7, 2, 'normal'),
    (122, 5, 8, 2, 'normal'),
    (123, 5, 9, 2, 'normal'),
    (124, 5, 10, 2, 'normal'),
    (125, 6, 1, 2, 'normal'),
    (126, 6, 2, 2, 'normal'),
    (127, 6, 3, 2, 'normal'),
    (128, 6, 4, 2, 'normal'),
    (129, 6, 5, 2, 'normal'),
    (130, 6, 6, 2, 'normal'),
    (131, 6, 7, 2, 'normal'),
    (132, 6, 8, 2, 'normal'),
    (133, 6, 9, 2, 'normal'),
    (134, 6, 10, 2, 'normal'),
    (135, 6, 11, 2, 'normal'),
    (136, 6, 12, 2, 'normal');

DROP TABLE IF EXISTS `Theater`;

CREATE TABLE `Theater` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` enum('Stora', 'Lilla') NOT NULL,
    `amountOfSeats` int NOT NULL,
    `seatsPerRow` json NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Theater` (
        `id`,
        `name`,
        `amountOfSeats`,
        `seatsPerRow`
    )
VALUES (
        1,
        'Stora',
        81,
        '[8, 9, 10, 10, 10, 10, 12, 12]'
    ),
    (
        2,
        'Lilla',
        55,
        '[6, 8, 9, 10, 10, 12]'
    );

DROP TABLE IF EXISTS `Ticket`;

CREATE TABLE `Ticket` (
    `id` int NOT NULL AUTO_INCREMENT,
    `bookingId` int NOT NULL,
    `ScreeningId` int NOT NULL,
    `seatId` int NOT NULL,
    `ticketType` int NOT NULL,
    `price` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `id` (`id`),
    UNIQUE KEY `ux_ticket_screening_seat` (`ScreeningId`, `seatId`),
    KEY `bookingId` (`bookingId`),
    KEY `seatId` (`seatId`),
    KEY `ticketType` (`ticketType`),
    CONSTRAINT `fk_ticket_screening` FOREIGN KEY (`ScreeningId`) REFERENCES `Screening` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `Ticket_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `Booking` (`id`),
    CONSTRAINT `Ticket_ibfk_3` FOREIGN KEY (`seatId`) REFERENCES `Seat` (`id`),
    CONSTRAINT `Ticket_ibfk_4` FOREIGN KEY (`ticketType`) REFERENCES `TicketType` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 386 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `Ticket` (
        `id`,
        `bookingId`,
        `ScreeningId`,
        `seatId`,
        `ticketType`,
        `price`
    )
VALUES (1, 1, 1, 45, 1, 140),
    (2, 1, 1, 46, 1, 140),
    (3, 2, 1, 20, 1, 140),
    (4, 9, 30, 82, 1, 140),
    (7, 1, 65, 1, 1, 140),
    (8, 1, 61, 1, 1, 140),
    (12, 1, 30, 1, 1, 140),
    (17, 19, 34, 100, 1, 140),
    (18, 19, 34, 101, 1, 140),
    (19, 21, 34, 96, 1, 140),
    (20, 21, 34, 97, 1, 140),
    (21, 22, 51, 110, 1, 140),
    (22, 22, 51, 109, 2, 140),
    (25, 24, 34, 82, 1, 140),
    (26, 24, 34, 83, 1, 140),
    (27, 24, 34, 84, 1, 140),
    (28, 25, 61, 45, 1, 140),
    (29, 25, 61, 44, 2, 140),
    (30, 25, 61, 43, 3, 140),
    (31, 26, 73, 44, 1, 140),
    (32, 26, 73, 43, 1, 140),
    (33, 26, 73, 42, 3, 140),
    (35, 28, 61, 22, 1, 140),
    (38, 33, 38, 84, 1, 140),
    (39, 33, 38, 85, 2, 140),
    (40, 34, 52, 109, 1, 140),
    (41, 34, 52, 110, 2, 140),
    (42, 34, 52, 108, 3, 140),
    (43, 35, 38, 86, 1, 140),
    (46, 38, 38, 98, 1, 140),
    (47, 38, 38, 97, 2, 140),
    (48, 38, 38, 96, 3, 140),
    (49, 39, 38, 103, 2, 140),
    (50, 40, 38, 91, 1, 140),
    (51, 40, 38, 90, 2, 140),
    (55, 42, 61, 4, 1, 140),
    (56, 42, 61, 29, 2, 140),
    (57, 43, 41, 8, 1, 140),
    (58, 44, 53, 86, 1, 140),
    (59, 45, 61, 5, 1, 140),
    (60, 46, 46, 91, 1, 140),
    (61, 47, 46, 82, 1, 140),
    (62, 48, 46, 87, 1, 140),
    (63, 49, 46, 86, 1, 140),
    (64, 50, 44, 8, 1, 140),
    (65, 51, 46, 85, 1, 140),
    (66, 52, 47, 85, 1, 140),
    (67, 53, 46, 84, 1, 140),
    (68, 53, 46, 83, 2, 140),
    (69, 53, 46, 90, 3, 140),
    (70, 54, 46, 88, 1, 140),
    (71, 55, 46, 113, 3, 140),
    (72, 56, 46, 95, 1, 140),
    (73, 57, 69, 12, 2, 140),
    (74, 58, 61, 10, 1, 140),
    (75, 58, 61, 9, 2, 140),
    (76, 59, 46, 92, 1, 140),
    (77, 60, 46, 101, 1, 140),
    (78, 61, 46, 89, 1, 140),
    (79, 62, 46, 93, 1, 140),
    (80, 62, 46, 100, 1, 140),
    (81, 62, 46, 98, 3, 140),
    (82, 63, 46, 99, 1, 140),
    (84, 65, 46, 125, 2, 140),
    (89, 69, 21, 84, 1, 140),
    (90, 70, 132, 70, 1, 140),
    (92, 72, 96, 96, 1, 140),
    (93, 73, 80, 34, 1, 140),
    (94, 73, 80, 32, 1, 140),
    (99, 76, 80, 21, 1, 140),
    (101, 78, 87, 1, 1, 140),
    (102, 78, 87, 2, 1, 140),
    (103, 79, 87, 51, 1, 140),
    (104, 80, 138, 39, 1, 140),
    (105, 81, 105, 115, 1, 140),
    (106, 82, 87, 58, 1, 140),
    (107, 83, 120, 92, 1, 140),
    (108, 83, 120, 91, 1, 140),
    (109, 84, 94, 5, 1, 140),
    (110, 85, 98, 121, 1, 140),
    (111, 85, 98, 120, 1, 140),
    (114, 88, 132, 3, 1, 140),
    (115, 89, 132, 16, 1, 140),
    (116, 90, 131, 42, 1, 140),
    (117, 91, 131, 1, 1, 140),
    (119, 93, 138, 42, 1, 140),
    (138, 104, 138, 43, 1, 140),
    (139, 104, 138, 44, 1, 140),
    (140, 105, 138, 31, 1, 140),
    (141, 105, 138, 32, 1, 140),
    (142, 105, 138, 33, 1, 140),
    (143, 105, 138, 34, 1, 140),
    (147, 109, 138, 41, 1, 140),
    (149, 111, 201, 53, 1, 140),
    (150, 111, 201, 54, 1, 140),
    (169, 124, 208, 109, 1, 140),
    (170, 124, 208, 110, 1, 140),
    (173, 126, 203, 110, 1, 140),
    (174, 127, 203, 107, 1, 140),
    (175, 128, 203, 112, 1, 140),
    (177, 130, 203, 115, 1, 140),
    (178, 131, 204, 125, 1, 140),
    (179, 132, 201, 42, 1, 140),
    (180, 132, 201, 43, 1, 140),
    (181, 133, 207, 3, 1, 140),
    (182, 134, 202, 42, 1, 140),
    (183, 134, 202, 43, 1, 140),
    (184, 135, 201, 2, 1, 140),
    (185, 136, 203, 111, 1, 140),
    (206, 152, 217, 109, 1, 140),
    (209, 154, 217, 125, 1, 140),
    (210, 155, 241, 42, 1, 140),
    (212, 157, 217, 118, 1, 140),
    (213, 158, 217, 128, 1, 140),
    (214, 159, 207, 70, 1, 140),
    (217, 161, 207, 71, 1, 140),
    (220, 163, 207, 72, 1, 140),
    (221, 164, 217, 116, 1, 140),
    (222, 165, 218, 109, 1, 140),
    (223, 165, 218, 110, 1, 140),
    (224, 166, 207, 2, 1, 140),
    (225, 167, 207, 73, 1, 140),
    (226, 168, 207, 74, 1, 140),
    (229, 171, 207, 29, 1, 140),
    (230, 172, 207, 60, 1, 140),
    (236, 178, 217, 82, 1, 140),
    (239, 181, 207, 43, 1, 140),
    (240, 182, 207, 39, 1, 140),
    (241, 182, 207, 40, 1, 140),
    (242, 182, 207, 41, 1, 140),
    (246, 186, 217, 108, 1, 140),
    (254, 193, 217, 122, 1, 140),
    (256, 195, 207, 47, 1, 140),
    (257, 195, 207, 8, 1, 140),
    (258, 195, 207, 75, 1, 140),
    (259, 196, 218, 116, 1, 140),
    (260, 196, 218, 117, 1, 140),
    (261, 196, 218, 118, 1, 140),
    (262, 196, 218, 119, 1, 140),
    (263, 196, 218, 120, 1, 140),
    (264, 196, 218, 121, 1, 140),
    (265, 196, 218, 122, 1, 140),
    (266, 196, 218, 123, 1, 140),
    (267, 196, 218, 124, 1, 140),
    (268, 196, 218, 112, 1, 140),
    (269, 197, 216, 42, 1, 140),
    (270, 197, 216, 43, 1, 140),
    (271, 198, 216, 53, 1, 140),
    (272, 198, 216, 52, 1, 140),
    (273, 199, 219, 60, 1, 140),
    (274, 199, 219, 61, 1, 140),
    (275, 199, 219, 62, 1, 140),
    (276, 199, 219, 63, 1, 140),
    (277, 199, 219, 64, 1, 140),
    (278, 199, 219, 65, 1, 140),
    (279, 199, 219, 66, 1, 140),
    (280, 199, 219, 67, 1, 140),
    (281, 199, 219, 77, 1, 140),
    (287, 205, 219, 43, 1, 140),
    (293, 211, 219, 1, 1, 140),
    (295, 213, 219, 3, 1, 140),
    (298, 216, 219, 39, 1, 140),
    (299, 216, 219, 20, 1, 140),
    (300, 217, 209, 109, 1, 140),
    (314, 224, 227, 84, 1, 140),
    (315, 225, 223, 42, 1, 140),
    (316, 226, 223, 43, 1, 140),
    (317, 226, 223, 44, 1, 140),
    (318, 227, 259, 42, 1, 140),
    (319, 228, 213, 109, 1, 140),
    (320, 229, 213, 131, 1, 140),
    (321, 229, 213, 130, 1, 140),
    (324, 231, 235, 109, 1, 140),
    (325, 231, 235, 110, 1, 140),
    (326, 232, 235, 82, 1, 140),
    (327, 233, 264, 109, 1, 140),
    (328, 233, 264, 110, 1, 140),
    (329, 234, 269, 136, 1, 140),
    (330, 234, 269, 135, 1, 140),
    (331, 235, 236, 105, 1, 140),
    (332, 235, 236, 106, 1, 140),
    (333, 235, 236, 107, 1, 140),
    (338, 238, 234, 42, 1, 140),
    (339, 238, 234, 43, 1, 140),
    (340, 238, 234, 44, 1, 140),
    (341, 239, 274, 42, 1, 140),
    (342, 239, 274, 43, 1, 140),
    (343, 239, 274, 44, 1, 140),
    (344, 240, 235, 108, 1, 140),
    (356, 247, 246, 42, 1, 140),
    (357, 247, 246, 43, 1, 140),
    (358, 247, 246, 44, 1, 140),
    (359, 247, 246, 45, 1, 140),
    (360, 247, 246, 46, 1, 140),
    (361, 247, 246, 47, 1, 140),
    (362, 248, 236, 109, 1, 140),
    (363, 248, 236, 110, 1, 140),
    (364, 248, 236, 111, 1, 140),
    (365, 249, 243, 109, 1, 140),
    (366, 250, 235, 111, 1, 140),
    (368, 252, 243, 110, 1, 140),
    (369, 252, 243, 111, 1, 140),
    (370, 253, 243, 82, 1, 140),
    (371, 253, 243, 83, 1, 140),
    (372, 253, 243, 84, 1, 140),
    (375, 255, 259, 43, 1, 140),
    (378, 258, 243, 108, 1, 140),
    (384, 260, 248, 109, 1, 140),
    (385, 260, 248, 110, 1, 140);

DROP TABLE IF EXISTS `TicketType`;

CREATE TABLE `TicketType` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `basePrice` int NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `TicketType` (`id`, `name`, `basePrice`)
VALUES (1, 'normal', 140),
    (2, 'child', 80),
    (3, 'senior', 120);

DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userName` varchar(255) DEFAULT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `avatarUrl` int DEFAULT NULL,
    `role` enum('visitor', 'user', 'admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `created` date DEFAULT(curdate()),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    KEY `USER_index_0` (`id`),
    KEY `avatarUrl` (`avatarUrl`),
    CONSTRAINT `User_ibfk_1` FOREIGN KEY (`avatarUrl`) REFERENCES `Avatar` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 45 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `User` (
        `id`,
        `userName`,
        `email`,
        `password`,
        `avatarUrl`,
        `role`,
        `created`
    )
VALUES (
        1,
        'Guest',
        'guest@system.local',
        '$2b$10$wq9p6FZpQfVh8V7YJv1eUu3x0pYqz8p8p6uQ2jJxq8zFJt8xkZC2a',
        NULL,
        'visitor',
        '2026-02-04'
    ),
    (
        2,
        'jarl',
        'jarl@lindquist.com',
        '$2b$10$8Qq1p9ZkJt7eQb2xFJt8xOq9pYqz8p6uQ2jJxq8zFJt8xkZC2a',
        6,
        'user',
        '2026-02-04'
    ),
    (
        4,
        'Fantomen',
        'jail@example.com',
        '$2a$13$sPJqNqSks2ooxk2GvdO./ODwsPsWdgNfPVhs9.9JPjz3MZOo/YScu',
        3,
        'visitor',
        '2026-02-19'
    ),
    (
        6,
        'alfapeth',
        'j@l.com',
        '$2a$13$aU1JzMtg/EhzSC4YnQwRKuKxVhRqeLNit.VZiMHmtiFvkMfBskLOu',
        25,
        'user',
        '2026-02-20'
    ),
    (
        8,
        'user1',
        'sture@example.com',
        '$2a$13$I2uBgwDMryQA9HWpT5ugeOQDAuNShGdCBGWll74h3xQCLgwvIBzIW',
        3,
        'user',
        '2026-02-23'
    ),
    (
        9,
        'cool88',
        'k@a.com',
        '$2a$13$n2dqdeTwLm/fPNCDZVSUNejvrRaTxUzcvwE85Yc51W3fWFFrl5dES',
        3,
        'user',
        '2026-02-24'
    ),
    (
        11,
        'cool8',
        'k@hotmail.com',
        '$2a$13$PCD8OUuyMRc7V6SDgkAunekAujeR.LkDgf24xDOmyarMueciEUx1G',
        4,
        'user',
        '2026-02-24'
    ),
    (
        12,
        'edward',
        'edvin@hotmail.se',
        '$2a$13$QVARJbSHY4CTfB9rPXjX2eerT5GyJiKewHA2KSElDw9r8jKMy3iQO',
        3,
        'user',
        '2026-02-24'
    ),
    (
        13,
        'zhaneta',
        'zhaneta.lecini88@gmail.com',
        '$2a$13$Iwvs/Nd3B1AQAb.t2QEo/.g55CiaSITcvWYuJPoXZMhOqjd4.q9iG',
        21,
        'user',
        '2026-02-25'
    ),
    (
        14,
        'Coolio Mar',
        'ceciliacavallin@hotmail.se',
        '$2a$13$EtucX4p6D8u4fUxvxm.Ay.zp/yzkKypCe7kOHC4x981tRu0IftGv.',
        25,
        'user',
        '2026-02-25'
    ),
    (
        15,
        'hamster',
        'hamster@hamster.se',
        '$2a$13$bNQIpbncZ7DZSpbjHk3WgOGu03J.Xjpa3AGJ2cf84xNkxlmkBXlnS',
        9,
        'user',
        '2026-02-26'
    ),
    (
        16,
        'eddd',
        'ed@hotmail.se',
        '$2a$13$FT5zRhC1y9uBr1TnEXr2de8beonkXToYQ5IysphDnygg1k3QZl46G',
        3,
        'user',
        '2026-02-26'
    ),
    (
        17,
        'kalle',
        'kalle@hotmail.se',
        '$2a$13$N5Ha22UBXiWMHWb09HQIWOgiKxIe4zrS8qkB9lXrHLxCN5opB0PnS',
        5,
        'user',
        '2026-02-26'
    ),
    (
        19,
        'ben',
        'ben@ben.se',
        '$2a$13$MjF6CjWDTLt3yFj.8J337OLfvqB3IlrwKVswJoC67Ua2Kl/2nXRWi',
        3,
        'user',
        '2026-02-26'
    ),
    (
        20,
        'per',
        'per@per.se',
        '$2a$13$XL/ycOFOuI/njbmNLjsCoeUn785braYSLJ7Lh4UF4W5P92Pi0vohW',
        3,
        'user',
        '2026-02-27'
    ),
    (
        21,
        'anna',
        'anna@anna.se',
        '$2a$13$Dg4xweo1k1LJoLw.6Qhglej7NYROGKMV6iwNUQmIZxLZ0vsxeTXN6',
        1,
        'user',
        '2026-02-27'
    ),
    (
        22,
        'katt',
        'katt@katt.se',
        '$2a$13$s0v4hS1ScJdFKjjfuehLsevaGpU3ozRFGhdve6Ra85sg9xGoaA9xC',
        3,
        'user',
        '2026-02-27'
    ),
    (
        23,
        'hund',
        'hund@hund.se',
        '$2a$13$jiajio/Y10CgQJRCa0hh9OecIfDZ1W42rb5SessSTioeyNVPDR8BW',
        3,
        'user',
        '2026-02-27'
    ),
    (
        24,
        'ulf',
        'ulf@ulf.com',
        '$2a$13$K4Zdw8H1Uqem//5AVMVxBu4sUR7SnRRiZmNglpX28OeS.qjial/k.',
        1,
        'user',
        '2026-02-27'
    ),
    (
        25,
        'blomma',
        'blomma@blomma.se',
        '$2a$13$RJdYAd/ZIKIyh8X0ruBWueAcm3zAcfX3KbZFY39pdXZg3g72kRiuG',
        3,
        'user',
        '2026-02-27'
    ),
    (
        26,
        'lasse',
        'lasse@lasse.se',
        '$2a$13$1m92Kp3a.Lj73.g4hiSiIO9TD2FRXgrlpYj9b6E3OuE/ISoPldmNy',
        3,
        'user',
        '2026-02-27'
    ),
    (
        27,
        'test',
        'kund@test.se',
        '$2a$13$7I8NJNQySL7SjUeo2c/OC.TIEoyEUJ3nRB4a8W.hNraXCiqQb9sD6',
        1,
        'user',
        '2026-03-05'
    ),
    (
        28,
        'cool882',
        'kifle_@hotmail.com',
        '$2a$13$VTbb8xfYXEH7o/m2OdyC6..ds7VWCj4csPfONi.2LxHEYjTSX85YG',
        11,
        'user',
        '2026-03-10'
    ),
    (
        32,
        'edelvase',
        'a@a.se',
        '$2a$13$NegzZHYU9172YPKTXTEBRuoWAW.GILNIVbUw9sTzztgk85AMkmniK',
        11,
        'user',
        '2026-03-11'
    ),
    (
        33,
        'andersövaren',
        'jarllindquist@gmail.com',
        '$2a$13$CksmMNqa./V7IRwM7SL38e7SpCLZtiEdleO1HF177dIhIvTk7dJnS',
        8,
        'user',
        '2026-03-12'
    ),
    (
        34,
        'pelle',
        'pelle@pelle.se',
        '$2a$13$tZp9rmzV4gYrver.iDHNQOt/lYsfd7gdpNJgB5PgnFIgmryui.W8O',
        18,
        'user',
        '2026-03-15'
    ),
    (
        36,
        'ShowTime',
        'showtime@admin.com',
        '$2a$13$/.EGRD08JdJ7Y/y01VfhA..RS9zdTrhoqkmemAak0x3p2iHLrDzF6',
        11,
        'admin',
        '2026-03-16'
    ),
    (
        38,
        'Bengan',
        'test@bengt.se',
        '$2a$13$FLJFZCPIDS86ygizMrTtmO9OSYYfnDfD3RtTslNZRKDUSz3P6XI3C',
        11,
        'user',
        '2026-03-18'
    ),
    (
        39,
        'kiff',
        'kifff@kiff.se',
        '$2a$13$8pAozBvQY/XbejC2p7Ds9ONxJVo6OR7VpTkE30KhyDDzMvgJFBpE2',
        11,
        'user',
        '2026-03-18'
    ),
    (
        42,
        'kiff',
        'kifle.uni@gmail.com',
        '$2a$13$D4lS9dgyY/1zW.nGt4D1vOKtWbUnAErn/g/5Csym7MBps63E1jdTi',
        14,
        'user',
        '2026-03-18'
    ),
    (
        44,
        'hmster2',
        'hamster2@hamster.se',
        '$2a$13$SIWpvE..7zrA4OD0g3wiVuVyzODql5k/Z6CvyN4VceKcdqKPzVgcm',
        13,
        'user',
        '2026-03-19'
    );

DROP TABLE IF EXISTS `acl`;

CREATE TABLE `acl` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userRoles` varchar(255) NOT NULL,
    `method` varchar(50) NOT NULL DEFAULT 'GET',
    `allow` enum('allow', 'disallow') NOT NULL DEFAULT 'allow',
    `route` varchar(255) NOT NULL,
    `match` enum('true', 'false') NOT NULL DEFAULT 'true',
    `comment` varchar(500) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_acl` (
        `userRoles`,
        `method`,
        `route`
    )
) ENGINE = InnoDB AUTO_INCREMENT = 24 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `acl` (
        `id`,
        `userRoles`,
        `method`,
        `allow`,
        `route`,
        `match`,
        `comment`
    )
VALUES (
        1,
        'visitor, user',
        'GET',
        'disallow',
        '/secret.html',
        'true',
        'No access to /secret.html for visitors and normal users'
    ),
    (
        2,
        'visitor,user, admin',
        'GET',
        'allow',
        '/api',
        'false',
        'Allow access to all routes not starting with /api'
    ),
    (
        3,
        'visitor',
        'POST',
        'allow',
        '/api/users',
        'true',
        'Allow registration as new user for visitors'
    ),
    (
        4,
        'visitor, user,admin',
        '*',
        'allow',
        '/api/login',
        'true',
        'Allow access to all login routes'
    ),
    (
        5,
        'admin',
        '*',
        'allow',
        '/api/users',
        'true',
        'Allow admins to see and edit users'
    ),
    (
        6,
        'admin',
        '*',
        'allow',
        '/api/sessions',
        'true',
        'Allow admins to see and edit sessions'
    ),
    (
        7,
        'admin',
        '*',
        'allow',
        '/api/acl',
        'true',
        'Allow admins to see and edit acl rules'
    ),
    (
        8,
        'visitor,user,admin',
        'GET',
        'allow',
        '/api/products',
        'true',
        'Allow all user roles to read products'
    ),
    (
        9,
        'admin,visitor, user',
        'GET',
        'allow',
        '/api/v_screenings',
        'true',
        'Adding views for screenings path for '
    ),
    (
        10,
        'admin,visitor, user',
        'GET',
        'allow',
        '/api/Theater',
        'true',
        'Getting data for the seats at the moment'
    ),
    (
        11,
        'admin,visitor, user',
        'GET',
        'allow',
        '/api/v_occupied_seats',
        'true',
        ''
    ),
    (
        12,
        'admin,visitor, user',
        'GET',
        'allow',
        '/api/Screening',
        'true',
        'adding path to screening to get what theater the current screening is using'
    ),
    (
        13,
        'admin,visitor, user',
        'GET',
        'allow',
        '/api/v_getMovieDetailsView',
        'true',
        'get all details from the movie we are looking at'
    ),
    (
        14,
        'admin,visitor, user',
        'GET',
        'allow',
        '/api/v_getPopular',
        'true',
        'get all the popular movies'
    ),
    (
        15,
        'admin, visitor, user',
        '*',
        'allow',
        '/api/User',
        'true',
        'Allow admins to see and edit users (right table) '
    ),
    (
        16,
        'admin,user, visitor',
        'GET',
        'allow',
        '/api/Avatar',
        'true',
        'fetch the avatar to the user that is logged in. '
    ),
    (
        17,
        'visitor, admin, user',
        '*',
        'allow',
        '/api/Booking',
        'true',
        'adding for bookings'
    ),
    (
        18,
        'visitor, user, admin',
        'GET',
        'allow',
        '/api/hejhej',
        'true',
        'Vet inte vad vi ska ha här ?? '
    ),
    (
        19,
        'visitor, user, admin',
        '*',
        'allow',
        '/api/Ticket',
        'true',
        'get post to ticket'
    ),
    (
        20,
        'admin, user',
        'GET',
        'allow',
        '/api/v_user_bookings',
        'true',
        'hämta alla bokningar för .-.. '
    ),
    (
        21,
        'admin, visitor, user',
        '*',
        'allow',
        '/api/seathub',
        'true',
        'Allow SignalR WebSocket connections'
    ),
    (
        23,
        'Admin',
        '*',
        'allow',
        '/api/JobPosting',
        'true',
        'Admin CRUD Job'
    );



DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
    `id` varchar(255) NOT NULL,
    `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `data` json DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `sessions` (
        `id`,
        `created`,
        `modified`,
        `data`
    )
VALUES (
        '1452c30a-6216-4181-92a6-530af816c229',
        '2026-03-20 10:30:08',
        '2026-03-20 11:17:23',
        '{}'
    ),
    (
        'aa4a9864-5428-480e-90ff-ee05bf2a5037',
        '2026-03-20 09:26:54',
        '2026-03-20 11:38:40',
        '{}'
    );


DROP VIEW IF EXISTS `v_getCategoriesFromMovies`;

CREATE TABLE `v_getCategoriesFromMovies` (
    `movieId` int,
    `title` varchar(255),
    `categories` text
);

DROP VIEW IF EXISTS `v_getMovieDetailsView`;

CREATE TABLE `v_getMovieDetailsView` (
    `movieId` int,
    `title` varchar(255),
    `duration` int,
    `ageLimit` enum('11', '15', '18'),
    `trailer` varchar(255),
    `description` mediumtext,
    `dateRelease` date,
    `actors` text,
    `categories` text,
    `averageRating` decimal(14, 4),
    `reviewCount` bigint,
    `reviews` json,
    `screenings` json
);

DROP VIEW IF EXISTS `v_getPopular`;

CREATE TABLE `v_getPopular` ( `id` int, `title` varchar(255) );

DROP VIEW IF EXISTS `v_occupied_seats`;

CREATE TABLE `v_occupied_seats` (
    `seatId` int,
    `screeningId` int,
    `theaterId` int
);

DROP VIEW IF EXISTS `v_screenings`;

CREATE TABLE `v_screenings` (
    `id` int,
    `movieTitle` varchar(255),
    `movieId` int,
    `movieDescription` mediumtext,
    `duration` int,
    `ageLimit` enum('11', '15', '18'),
    `categories` text,
    `theaterName` enum('Stora', 'Lilla'),
    `totalAmountOfSeats` int,
    `screeningDate` date,
    `startTime` timestamp,
    `availableSeats` bigint
);

DROP VIEW IF EXISTS `v_user_bookings`;

CREATE TABLE `v_user_bookings` (
    `id` int,
    `email` varchar(255),
    `bookingRef` varchar(12),
    `totalAmount` int,
    `snack` varchar(12),
    `startTime` timestamp,
    `movieId` int,
    `movieTitle` varchar(255),
    `theaterName` enum('Stora', 'Lilla'),
    `ticketCount` bigint,
    `seats` text
);

DROP TABLE IF EXISTS `v_getCategoriesFromMovies`;

CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_getCategoriesFromMovies` AS
select
    `m`.`id` AS `movieId`,
    `m`.`title` AS `title`,
    group_concat(
        `c`.`type`
        order by `c`.`type` ASC separator ', '
    ) AS `categories`
from (
        (
            `Movie` `m`
            left join `MovieToCategory` `fc` on ((`fc`.`movieId` = `m`.`id`))
        )
        left join `Category` `c` on (
            (`c`.`id` = `fc`.`categoryId`)
        )
    )
group by
    `m`.`id`,
    `m`.`title`
order by `m`.`id`;

DROP TABLE IF EXISTS `v_getMovieDetailsView`;

CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_getMovieDetailsView` AS
select
    `m`.`id` AS `movieId`,
    `m`.`title` AS `title`,
    `m`.`duration` AS `duration`,
    `m`.`ageLimit` AS `ageLimit`,
    `m`.`trailerUrl` AS `trailer`,
    `m`.`description` AS `description`,
    `m`.`dateRelease` AS `dateRelease`,
    (
        select group_concat(`a`.`name` separator ', ')
        from (
                `MovieToActor` `ma`
                join `Actor` `a` on ((`a`.`id` = `ma`.`actorId`))
            )
        where (`ma`.`movieId` = `m`.`id`)
    ) AS `actors`,
    (
        select group_concat(`c`.`type` separator ', ')
        from (
                `MovieToCategory` `mc`
                join `Category` `c` on (
                    (`c`.`id` = `mc`.`categoryId`)
                )
            )
        where (`mc`.`movieId` = `m`.`id`)
    ) AS `categories`,
    (
        select avg(`r`.`gradingOfStars`)
        from `Review` `r`
        where (`r`.`movieId` = `m`.`id`)
    ) AS `averageRating`,
    (
        select count(0)
        from `Review` `r`
        where (`r`.`movieId` = `m`.`id`)
    ) AS `reviewCount`,
    (
        select json_arrayagg(
                json_object(
                    'reviewId', `r`.`id`, 'author', `r`.`author`, 'description', `r`.`description`, 'rating', `r`.`gradingOfStars`
                )
            )
        from `Review` `r`
        where (`r`.`movieId` = `m`.`id`)
    ) AS `reviews`,
    (
        select json_arrayagg(
                json_object(
                    'screeningId', `x`.`id`, 'date', cast(`x`.`startTime` as date), 'startTime', cast(`x`.`startTime` as time), 'endTime', cast(
                        (
                            `x`.`startTime` + interval `m`.`duration` minute
                        ) as time
                    )
                )
            )
        from (
                select `s`.`id` AS `id`, `s`.`startTime` AS `startTime`
                from `Screening` `s`
                where (
                        (`s`.`movieId` = `m`.`id`)
                        and (`s`.`startTime` >= now())
                    )
                order by `s`.`startTime`
            ) `x`
    ) AS `screenings`
from `Movie` `m`;

DROP TABLE IF EXISTS `v_getPopular`;

CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_getPopular` AS
select `Movie`.`id` AS `id`, `Movie`.`title` AS `title`
from `Movie`
where (`Movie`.`popular` = 1);

DROP TABLE IF EXISTS `v_occupied_seats`;

CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_occupied_seats` AS
select
    `t`.`seatId` AS `seatId`,
    `b`.`ScreeningId` AS `screeningId`,
    `s`.`theaterId` AS `theaterId`
from (
        (
            `Ticket` `t`
            join `Booking` `b` on ((`t`.`bookingId` = `b`.`id`))
        )
        join `Screening` `s` on (
            (`b`.`ScreeningId` = `s`.`id`)
        )
    );

DROP TABLE IF EXISTS `v_screenings`;

CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_screenings` AS
select
    `s`.`id` AS `id`,
    `m`.`title` AS `movieTitle`,
    `m`.`id` AS `movieId`,
    `m`.`description` AS `movieDescription`,
    `m`.`duration` AS `duration`,
    `m`.`ageLimit` AS `ageLimit`,
    (
        select group_concat(`c`.`type` separator ', ')
        from (
                `MovieToCategory` `mc`
                join `Category` `c` on (
                    (`c`.`id` = `mc`.`categoryId`)
                )
            )
        where (`mc`.`movieId` = `m`.`id`)
    ) AS `categories`,
    `t`.`name` AS `theaterName`,
    `t`.`amountOfSeats` AS `totalAmountOfSeats`,
    `s`.`date` AS `screeningDate`,
    `s`.`startTime` AS `startTime`,
    (
        `t`.`amountOfSeats` - (
            select count(0)
            from (
                    `Ticket` `ti`
                    join `Booking` `b` on ((`ti`.`bookingId` = `b`.`id`))
                )
            where (`b`.`ScreeningId` = `s`.`id`)
        )
    ) AS `availableSeats`
from (
        (
            `Screening` `s`
            join `Movie` `m` on ((`s`.`movieId` = `m`.`id`))
        )
        join `Theater` `t` on ((`s`.`theaterId` = `t`.`id`))
    );

DROP TABLE IF EXISTS `v_user_bookings`;

CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_user_bookings` AS
select
    `b`.`id` AS `id`,
    `b`.`email` AS `email`,
    `b`.`bookingRef` AS `bookingRef`,
    `b`.`totalAmount` AS `totalAmount`,
    `b`.`snack` AS `snack`,
    `s`.`startTime` AS `startTime`,
    `m`.`id` AS `movieId`,
    `m`.`title` AS `movieTitle`,
    `t`.`name` AS `theaterName`,
    (
        select count(0)
        from `Ticket`
        where (
                `Ticket`.`bookingId` = `b`.`id`
            )
    ) AS `ticketCount`,
    (
        select group_concat(
                `Ticket`.`seatId` separator ', '
            )
        from `Ticket`
        where (
                `Ticket`.`bookingId` = `b`.`id`
            )
    ) AS `seats`
from (
        (
            (
                `Booking` `b`
                join `Screening` `s` on (
                    (`b`.`ScreeningId` = `s`.`id`)
                )
            )
            join `Movie` `m` on ((`s`.`movieId` = `m`.`id`))
        )
        join `Theater` `t` on ((`s`.`theaterId` = `t`.`id`))
    );

-- 2026-03-20 12:05:32 UTC