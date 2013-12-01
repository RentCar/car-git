SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Users` (
  `id` INT NOT NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `karma` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Trips`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Trips` (
  `id` INT NOT NULL,
  `driver_id` INT NULL,
  `passenger_id` INT NULL,
  `status` INT NULL,
  `time` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Trips_1_idx` (`driver_id` ASC),
  INDEX `fk_Trips_2_idx` (`passenger_id` ASC),
  CONSTRAINT `fk_Trips_1`
    FOREIGN KEY (`driver_id`)
    REFERENCES `mydb`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Trips_2`
    FOREIGN KEY (`passenger_id`)
    REFERENCES `mydb`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Points`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Points` (
  `id` INT NOT NULL,
  `x` DOUBLE NULL,
  `y` DOUBLE NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Schedules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Schedules` (
  `id` INT NOT NULL,
  `trip_id` INT NULL,
  `from_date` DATE NULL,
  `to_date` DATE NULL,
  `weekly cycle` INT NULL,
  `active` TINYINT(1) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Schedules_1_idx` (`trip_id` ASC),
  CONSTRAINT `fk_Schedules_1`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`Trips` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Users_Points`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Users_Points` (
  `id` INT NOT NULL,
  `user_id` INT NULL,
  `point_id` INT NULL,
  `point_name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Addresses_1_idx` (`user_id` ASC),
  INDEX `fk_Users_Points_1_idx` (`point_id` ASC),
  CONSTRAINT `fk_Addresses_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Users_Points_1`
    FOREIGN KEY (`point_id`)
    REFERENCES `mydb`.`Points` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Points_labels_keys`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Points_labels_keys` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Points_labels`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Points_labels` (
  `id` INT NOT NULL,
  `point_id` INT NULL,
  `label_key` INT NULL,
  `label_value` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Points_labels_1_idx` (`point_id` ASC),
  INDEX `fk_Points_labels_2_idx` (`label_key` ASC),
  CONSTRAINT `fk_Points_labels_1`
    FOREIGN KEY (`point_id`)
    REFERENCES `mydb`.`Points` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Points_labels_2`
    FOREIGN KEY (`label_key`)
    REFERENCES `mydb`.`Points_labels_keys` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Trips_Points`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Trips_Points` (
  `trip_id` INT NULL,
  `point_id` INT NULL,
  `order` INT NULL,
  INDEX `fk_Trips_Points_1_idx` (`trip_id` ASC),
  INDEX `fk_Trips_Points_2_idx` (`point_id` ASC),
  CONSTRAINT `fk_Trips_Points_1`
    FOREIGN KEY (`trip_id`)
    REFERENCES `mydb`.`Trips` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Trips_Points_2`
    FOREIGN KEY (`point_id`)
    REFERENCES `mydb`.`Points` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Social_networks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Social_networks` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`User_Social`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`User_Social` (
  `user_id` INT NULL,
  `social_type_id` INT NULL,
  `social_id` VARCHAR(45) NULL,
  UNIQUE INDEX `fk_User_Social_1_idx` (`user_id` ASC),
  UNIQUE INDEX `social_type_id_UNIQUE` (`social_type_id` ASC),
  CONSTRAINT `fk_User_Social_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_Social_2`
    FOREIGN KEY ()
    REFERENCES `mydb`.`Social_networks` ()
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
