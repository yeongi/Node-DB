-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: webpage
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `addr_num` int NOT NULL AUTO_INCREMENT,
  `user_num` int NOT NULL,
  `zip_code` varchar(30) DEFAULT NULL,
  `default_addr` varchar(60) DEFAULT NULL,
  `detail_addr` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`addr_num`),
  KEY `FK_User_TO_Adress_1` (`user_num`),
  CONSTRAINT `FK_User_TO_Adress_1` FOREIGN KEY (`user_num`) REFERENCES `user` (`user_num`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,6,'46713','부산 광역시 강서구 입소정관길','203');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `basket`
--

DROP TABLE IF EXISTS `basket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basket` (
  `basket_num` int NOT NULL AUTO_INCREMENT,
  `user_num` int NOT NULL,
  `basket_date` datetime DEFAULT NULL,
  PRIMARY KEY (`basket_num`),
  KEY `FK_User_TO_Basket_1` (`user_num`),
  CONSTRAINT `FK_User_TO_Basket_1` FOREIGN KEY (`user_num`) REFERENCES `user` (`user_num`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basket`
--

LOCK TABLES `basket` WRITE;
/*!40000 ALTER TABLE `basket` DISABLE KEYS */;
/*!40000 ALTER TABLE `basket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `book_num` int NOT NULL AUTO_INCREMENT,
  `book_name` varchar(50) DEFAULT NULL,
  `book_stock` int DEFAULT NULL,
  `book_price` int DEFAULT NULL,
  PRIMARY KEY (`book_num`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (7,'장의영 연대기',94,12000),(8,'흥미로운 삶',98,12000),(9,'원숭이',18,12000),(10,'가슴이 시킨다',17,12000),(11,'서든 어택',16,12000),(12,'블루 버닝 스나',17,12000),(13,'레드 숏 위폭으로 잡기',17,12000),(14,'피타고라스는 말했다',93,7000),(15,'주식으로 돈 다잃기',93,8000),(16,'아프니까 청춘이다',97,14000),(17,'82년생 김지영',1,9999999);
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_basket`
--

DROP TABLE IF EXISTS `book_basket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_basket` (
  `book_basket_num` int NOT NULL AUTO_INCREMENT,
  `basket_num` int NOT NULL,
  `book_num` int NOT NULL,
  `book_name` varchar(30) DEFAULT NULL,
  `book_amount` int DEFAULT NULL,
  PRIMARY KEY (`book_basket_num`),
  KEY `FK_Basket_TO_book_basket_1` (`basket_num`),
  KEY `FK_Book_TO_book_basket_1` (`book_num`),
  CONSTRAINT `FK_Basket_TO_book_basket_1` FOREIGN KEY (`basket_num`) REFERENCES `basket` (`basket_num`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_Book_TO_book_basket_1` FOREIGN KEY (`book_num`) REFERENCES `book` (`book_num`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_basket`
--

LOCK TABLES `book_basket` WRITE;
/*!40000 ALTER TABLE `book_basket` DISABLE KEYS */;
/*!40000 ALTER TABLE `book_basket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_coupon`
--

DROP TABLE IF EXISTS `book_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_coupon` (
  `book_coupon_num` int NOT NULL,
  `coupon_num` int NOT NULL,
  `book_num` int NOT NULL,
  PRIMARY KEY (`book_coupon_num`),
  KEY `FK_Coupon_TO_book_coupon_1` (`coupon_num`),
  KEY `FK_Book_TO_book_coupon_1` (`book_num`),
  CONSTRAINT `FK_Book_TO_book_coupon_1` FOREIGN KEY (`book_num`) REFERENCES `book` (`book_num`),
  CONSTRAINT `FK_Coupon_TO_book_coupon_1` FOREIGN KEY (`coupon_num`) REFERENCES `coupon` (`coupon_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_coupon`
--

LOCK TABLES `book_coupon` WRITE;
/*!40000 ALTER TABLE `book_coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `book_coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_order`
--

DROP TABLE IF EXISTS `book_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_order` (
  `book_order_num` int NOT NULL AUTO_INCREMENT,
  `order_num` int NOT NULL,
  `book_num` int NOT NULL,
  `book_order_amount` int DEFAULT NULL,
  `book_order_price` int DEFAULT NULL,
  PRIMARY KEY (`book_order_num`),
  KEY `FK_Order_TO_book_order_1` (`order_num`),
  KEY `FK_Book_TO_book_order_1` (`book_num`),
  CONSTRAINT `FK_Book_TO_book_order_1` FOREIGN KEY (`book_num`) REFERENCES `book` (`book_num`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Order_TO_book_order_1` FOREIGN KEY (`order_num`) REFERENCES `myorder` (`order_num`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_order`
--

LOCK TABLES `book_order` WRITE;
/*!40000 ALTER TABLE `book_order` DISABLE KEYS */;
INSERT INTO `book_order` VALUES (14,23,7,3,36000),(15,23,15,4,32000),(16,23,10,3,36000),(17,23,15,3,24000);
/*!40000 ALTER TABLE `book_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `card_num` varchar(50) NOT NULL,
  `user_num` int NOT NULL,
  `card_valid_date` datetime DEFAULT NULL,
  `card_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`card_num`),
  KEY `FK_User_TO_Card_1` (`user_num`),
  CONSTRAINT `FK_User_TO_Card_1` FOREIGN KEY (`user_num`) REFERENCES `user` (`user_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
INSERT INTO `card` VALUES ('1233-1111-3333-2222',6,'2022-04-19 00:00:00','마스터카드');
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
  `coupon_num` int NOT NULL AUTO_INCREMENT,
  `coupon_discount_percent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`coupon_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade` (
  `grade_num` int NOT NULL,
  `grade_name` varchar(20) DEFAULT NULL,
  `grade_discount_percent` int DEFAULT NULL,
  PRIMARY KEY (`grade_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
INSERT INTO `grade` VALUES (300,'iron',0),(301,'bronze',3),(302,'silver',5),(303,'gold',7),(500,'admin',9999);
/*!40000 ALTER TABLE `grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `myorder`
--

DROP TABLE IF EXISTS `myorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `myorder` (
  `order_num` int NOT NULL AUTO_INCREMENT,
  `user_num` int NOT NULL,
  `order_date` date DEFAULT NULL,
  `order_zip_code` varchar(30) DEFAULT NULL,
  `order_default_addr` varchar(100) DEFAULT NULL,
  `order_detail_addr` varchar(60) DEFAULT NULL,
  `order_card_num` varchar(30) DEFAULT NULL,
  `order_card_valid_date` date DEFAULT NULL,
  `order_card_type` varchar(50) DEFAULT NULL,
  `order_total` int DEFAULT NULL,
  PRIMARY KEY (`order_num`),
  KEY `FK_User_TO_Order_1` (`user_num`),
  CONSTRAINT `FK_User_TO_Order_1` FOREIGN KEY (`user_num`) REFERENCES `user` (`user_num`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `myorder`
--

LOCK TABLES `myorder` WRITE;
/*!40000 ALTER TABLE `myorder` DISABLE KEYS */;
INSERT INTO `myorder` VALUES (23,6,'2021-11-08','46713','부산 광역시 강서구 입소정관길','203','1233-1111-3333-2222','2022-04-19','마스터카드',36000),(24,6,'2021-11-08','46713','부산 광역시 강서구 입소정관길','203','1233-1111-3333-2222','2022-04-19','마스터카드',92000);
/*!40000 ALTER TABLE `myorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_num` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `id` varchar(30) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  `grade_num` int NOT NULL DEFAULT '300',
  PRIMARY KEY (`user_num`),
  KEY `FK_grade_TO_User_1` (`grade_num`),
  CONSTRAINT `FK_grade_TO_User_1` FOREIGN KEY (`grade_num`) REFERENCES `grade` (`grade_num`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4,'백재호','hoho10','123',300),(5,'123','123','123',300),(6,'장의영','jang','123',500);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_coupon`
--

DROP TABLE IF EXISTS `user_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_coupon` (
  `user_coupon_num` int NOT NULL,
  `coupon_num` int NOT NULL,
  `user_num` int NOT NULL,
  PRIMARY KEY (`user_coupon_num`),
  KEY `FK_Coupon_TO_user_coupon_1` (`coupon_num`),
  KEY `FK_User_TO_user_coupon_1` (`user_num`),
  CONSTRAINT `FK_Coupon_TO_user_coupon_1` FOREIGN KEY (`coupon_num`) REFERENCES `coupon` (`coupon_num`),
  CONSTRAINT `FK_User_TO_user_coupon_1` FOREIGN KEY (`user_num`) REFERENCES `user` (`user_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_coupon`
--

LOCK TABLES `user_coupon` WRITE;
/*!40000 ALTER TABLE `user_coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_coupon` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-08 22:21:17
