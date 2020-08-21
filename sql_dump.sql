-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `forms`;
CREATE TABLE `forms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` int(11) NOT NULL DEFAULT 0,
  `VisitID` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `AssignedID` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Jmeno` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Prijmeni` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `RC` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Datum_narozeni` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Matersky_jazyk` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Vyska` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Vaha` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Pohlavi` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Stranova_dominance` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `Zrakova_korekce` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `inserted` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
