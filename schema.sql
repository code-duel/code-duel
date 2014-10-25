USE scoreboard;


-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'Scores'
-- 
-- ---

DROP TABLE IF EXISTS `Scores`;
		
CREATE TABLE `Scores` (
  `session` INTEGER(6) NULL DEFAULT NULL,
  `winner` INTEGER(6) NULL DEFAULT NULL,
  `opponent` INTEGER(6) NULL DEFAULT NULL,
  `score` INTEGER(10) NULL DEFAULT NULL,
  `room` VARCHAR(20) NULL DEFAULT NULL,
  `promptname` VARCHAR(30) NULL DEFAULT NULL,
  `submittedcode` VARCHAR(256) NULL DEFAULT NULL,
  PRIMARY KEY (`session`)
);

DROP TABLE IF EXISTS `users`;
    
CREATE TABLE `users` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `username` VARCHAR(30) NULL DEFAULT NULL,
  `socketid` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(128) NULL DEFAULT NULL,
  `scoretotal` INTEGER(10) NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);







-- DROP TABLE IF EXISTS `Prompts`;
		
-- CREATE TABLE `Prompts` (
--   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
--   `prompt` VARCHAR(30) NULL DEFAULT NULL,
--   'promptpath' VARCHAR(128) NULL DEFAULT NULL,
--   `testpath`  VARCHAR(128) NULL DEFAULT NULL,
--   PRIMARY KEY (`id`)
-- );



-- ---
-- Foreign Keys 
-- ---


-- ---
-- Table Properties
-- ---

-- ALTER TABLE `Scores` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `Scores` (`id`,`username`,`opponent`,`userscore`,`prompt`,`submittedcode`,`new field`) VALUES
-- ('','','','','','','');