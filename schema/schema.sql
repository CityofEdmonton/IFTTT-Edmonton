-- MySQL dump 10.13  Distrib 5.7.16, for Linux (x86_64)
--
-- Host: localhost    Database: ifttt_api
-- ------------------------------------------------------
-- Server version	5.7.16-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS ifttt_api;
USE ifttt_api;

--
-- Table structure for table `light_the_bridge_event`
--

DROP TABLE IF EXISTS `light_the_bridge_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `light_the_bridge_event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `color_description` varchar(100) NOT NULL,
  `color1` varchar(10) NOT NULL,
  `color2` varchar(10),
  `color3` varchar(10),
  `color4` varchar(10),
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `title` (`title`)
) ENGINE=MyISAM AUTO_INCREMENT=172 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `light_the_bridge_event`
--

LOCK TABLES `light_the_bridge_event` WRITE;
/*!40000 ALTER TABLE `light_the_bridge_event` DISABLE KEYS */;

INSERT INTO `light_the_bridge_event` VALUES
('1', '2018-02-1 03:00:00', '2018-02-1 15:00:00', 'TestEvent1', 'TestEvent1', 'white', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '2018-02-15 04:25:09'),
('2', '2018-02-2 03:00:00', '2018-02-2 15:00:00', 'TestEvent2', 'TestEvent1', 'white', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '2018-02-15 04:25:09'),
('3', '2018-02-3 03:00:00', '2018-02-3 15:00:00', 'TestEvent3', 'TestEvent1', 'white', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '2018-02-15 04:25:09');
/*!40000 ALTER TABLE `light_the_bridge_event` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-22  5:35:40
--
-- Dumping data for table `light_the_bridge_event`
--

-- LOCK TABLES `light_the_bridge_event` WRITE;
-- /*!40000 ALTER TABLE `light_the_bridge_event` DISABLE KEYS */;
-- INSERT INTO `light_the_bridge_event` VALUES
-- (1,'2017-11-28 18:00:00','2017-11-29 01:00:00','Canada Music Week','Canada Music Week',
--   '#FF0000','#FFFFFF','#FF0000','#FFFFFF','2017-12-04 20:11:09'),
-- (2,'2017-11-29 18:00:00','2017-11-30 01:00:00','Finding Balance, Injury Prevention Centre','Finding Balance, Injury Prevention Centre',
--   '#0000FF','#FFA500','#0000FF','#FFA500','2017-12-04 20:11:09'),
-- (3,'2017-11-30 18:00:00','2017-11-01 01:00:00','Stomach Cancer Awareness Day','Stomach Cancer Awareness Day',
--   '#CCCCFF','#CCCCFF','#CCCCFF','#CCCCFF','2017-12-04 20:11:09'),
-- (4,'2017-12-01 18:00:00','2017-11-02 01:00:00','World AIDS Day','World AIDS Day',
--   '#FF0000','#FF0000','#FF0000','#FF0000','2017-12-04 20:11:09'),
-- (5,'2017-12-02 18:00:00','2017-11-03 01:00:00','Sir John Thompson Sign of Hope Campaign','Sir John Thompson Sign of Hope Campaign',
--   '#0000FF','#FFFFFF','#0000FF','#FFFFFF','2017-12-04 20:11:09'),
-- (6,'2017-12-06 18:00:00','2017-11-07 01:00:00','YWCA Rose Campaign','YWCA Rose Campaign',
--   '#FF0000','#FF0000','#FF0000','#FF0000','2017-12-04 20:11:09'),
-- (7,'2017-12-10 18:00:00','2017-11-11 01:00:00','16 Days of Activism Against Gender-based Violence','16 Days of Activism Against Gender-based Violence',
--   '#FFA500','#FFA500','#FFA500','#FFA500','2017-12-04 20:11:09'),
-- (8,'2017-12-12 18:00:00','2017-11-13 01:00:00','Hanukkah, Jewish Festival of Lights','Hanukkah, Jewish Festival of Lights',
--   '#0000FF','#FFFFFF','#0000FF','#FFFFFF','2017-12-04 20:11:09');
-- /*!40000 ALTER TABLE `light_the_bridge_event` ENABLE KEYS */;
-- UNLOCK TABLES;

--
-- Table structure for table `air_quality_health_risk_record`
--

DROP TABLE IF EXISTS `air_quality_health_risk_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `air_quality_health_risk_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` varchar(30) NOT NULL,
  `community_name` varchar(20) NOT NULL,
  `aqhi_current` varchar(10) NOT NULL,
  `aqhi_forecast_today` varchar(10) NOT NULL,
  `aqhi_forecast_tonight` varchar(10) NOT NULL,
  `aqhi_forecast_tomorrow` varchar(10) NOT NULL,
  `color` varchar(10) NOT NULL,
  `light_color` varchar(10) NOT NULL,
  `health_risk` varchar(20) NOT NULL,
  `general_population_message` varchar(200) NOT NULL,
  `at_risk_message` varchar(200) NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `aqhi_current` (`aqhi_current`)
) ENGINE=MyISAM AUTO_INCREMENT=172 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `air_quality_health_risk_record`
--

LOCK TABLES `air_quality_health_risk_record` WRITE;
/*!40000 ALTER TABLE `air_quality_health_risk_record` DISABLE KEYS */;
INSERT INTO `air_quality_health_risk_record` VALUES
("1","67","Edmonton",3,3,3,3,"#006699","#006699","Low","Ideal air quality for outdoor activities.","Enjoy your usual outdoor activities.","2017-12-07 20:14:17"),
("2","67","Edmonton",4,4,4,4,"#FFFF00","#FFFF00","Moderate","No need to modify your usual outdoor activities unless you experience symptoms such as coughing and throat irritation.","Consider reducing or rescheduling strenuous activites outdoors if you are experiencing symptoms.","2017-12-07 19:55:57"),
("3","67","Edmonton",8,8,8,8,"#FF0000","#FF0000","High","Consider reducing or rescheduling strenuous activities outdoors if you experience symptoms such as coughing and throat irritation.","Reduce or reschedule strenuous activities outdoors. Children and the elderly should also take it easy.","2017-12-07 19:55:57");
/*!40000 ALTER TABLE `air_quality_health_risk_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `air_quality_health_index_record`
--

DROP TABLE IF EXISTS `air_quality_health_index_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `air_quality_health_index_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` varchar(30) NOT NULL,
  `community_name` varchar(20) NOT NULL,
  `aqhi_current` varchar(10) NOT NULL,
  `aqhi_forecast_today` varchar(10) NOT NULL,
  `aqhi_forecast_tonight` varchar(10) NOT NULL,
  `aqhi_forecast_tomorrow` varchar(10) NOT NULL,
  `color` varchar(10) NOT NULL,
  `light_color` varchar(10) NOT NULL,
  `health_risk` varchar(20) NOT NULL,
  `general_population_message` varchar(200) NOT NULL,
  `at_risk_message` varchar(200) NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `aqhi_current` (`aqhi_current`)
) ENGINE=MyISAM AUTO_INCREMENT=172 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `air_quality_health_index_record`
--

LOCK TABLES `air_quality_health_index_record` WRITE;
/*!40000 ALTER TABLE `air_quality_health_index_record` DISABLE KEYS */;
INSERT INTO `air_quality_health_index_record` VALUES
("1","67","Edmonton",3,3,3,3,"#006699","#006699","Low","Ideal air quality for outdoor activities.","Enjoy your usual outdoor activities.","2017-12-07 20:14:17"),
("2","67","Edmonton",4,4,4,4,"#FFFF00","#FFFF00","Moderate","No need to modify your usual outdoor activities unless you experience symptoms such as coughing and throat irritation.","Consider reducing or rescheduling strenuous activites outdoors if you are experiencing symptoms.","2017-12-07 19:55:57"),
("3","67","Edmonton",8,8,8,8,"#FF0000","#FF0000","High","Consider reducing or rescheduling strenuous activities outdoors if you experience symptoms such as coughing and throat irritation.","Reduce or reschedule strenuous activities outdoors. Children and the elderly should also take it easy.","2017-12-07 19:55:57");
/*!40000 ALTER TABLE `air_quality_health_index_record` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-22  5:35:40
