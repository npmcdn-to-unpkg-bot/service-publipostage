SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `publipostage` ;
CREATE SCHEMA IF NOT EXISTS `publipostage` DEFAULT CHARACTER SET utf8 ;
USE `publipostage` ;

-- -----------------------------------------------------
-- Table `publipostage`.`publipostage`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `publipostage`.`publipostage` ;

CREATE  TABLE IF NOT EXISTS `publipostage`.`publipostage` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `date` DATETIME NULL ,
  `message` VARCHAR(255) NULL ,
  `descriptif` VARCHAR(45) NULL ,
  `destinataires` VARCHAR(255) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
