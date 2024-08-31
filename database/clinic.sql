CREATE DATABASE  IF NOT EXISTS `clinic` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `clinic`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: clinic
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `api_customuser`
--

DROP TABLE IF EXISTS `api_customuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_customuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_login` datetime(6) DEFAULT NULL,
  `username` varchar(150) DEFAULT NULL,
  `email` varchar(254) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_customuser`
--

LOCK TABLES `api_customuser` WRITE;
/*!40000 ALTER TABLE `api_customuser` DISABLE KEYS */;
INSERT INTO `api_customuser` VALUES (1,'2024-08-19 09:49:56.000000','abhay','abhay@gmail.com','pbkdf2_sha256$720000$kozJN6PY6HEQUTPvAdxhQt$IBMF6lEwRDWc5GgbbPl1djQ9lt+LVM7E6uvxv3N0nu0=','super_admin',1,1,1,1,'active'),(2,NULL,'abhaysd','abhaysd@gmail.com','pbkdf2_sha256$720000$NGlDgT9QQLA4JHq0dbkYO4$VPeKrYogsjly9T0lydXkyQJML5P4I70QlxVzBizHAbA=','receptionist',1,0,0,0,'active'),(3,NULL,'drankit','drankit@gmail.com','pbkdf2_sha256$720000$OH6Z7B3CHaYVaNh52UpBhA$3E8VnxDRglVlh/VKWIcVuSvEaQHM3Qn8sLAJ1UlObAs=','doctor',1,0,0,0,'active'),(4,NULL,'drrupak','rupak@gmail.com','pbkdf2_sha256$720000$K5prBaxMWt4FBsnU0Jw1E9$wzgE/H/7Qs25J+kqiipy5MgRHEl8UtPAWRGpvU60WhM=','doctor',1,0,0,0,'active'),(5,NULL,'drnitin','drnitin@gmail.com','pbkdf2_sha256$720000$gZInz9WWXZnzcaGwRuJa1k$+PhBcse59z9h9emL5fVU1xS7sPHof+ffVWZxwM68RYE=','doctor',1,0,0,0,'active'),(6,NULL,'umasankar','umasankar@forants.com','pbkdf2_sha256$720000$1gezRZOOJMlP6Z7wfyE4uJ$Qtph/R0JCp+gKIIRBogkfGqfv3CMmjKPxMQ2p2mgy2k=','super_admin',1,1,1,1,'active');
/*!40000 ALTER TABLE `api_customuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_department`
--

DROP TABLE IF EXISTS `api_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_department` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) NOT NULL,
  `dept_code` varchar(255) NOT NULL,
  `dept_location` varchar(255) DEFAULT NULL,
  `dept_contact_no` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_department`
--

LOCK TABLES `api_department` WRITE;
/*!40000 ALTER TABLE `api_department` DISABLE KEYS */;
INSERT INTO `api_department` VALUES (1,'Admin','ADM',NULL,NULL),(2,'Cardiology','CRD',NULL,NULL),(3,'Cancer','CCR',NULL,NULL),(4,'Neurology','NRG',NULL,NULL),(5,'Nephrology','NPLG',NULL,NULL);
/*!40000 ALTER TABLE `api_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_doctor`
--

DROP TABLE IF EXISTS `api_doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_doctor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `doc_uid` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `specialization` varchar(50) NOT NULL,
  `fee` int NOT NULL,
  `degree` varchar(100) NOT NULL,
  `joined_on` date NOT NULL,
  `department_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `api_doctor_department_id_ed318b57_fk_api_department_id` (`department_id`),
  CONSTRAINT `api_doctor_department_id_ed318b57_fk_api_department_id` FOREIGN KEY (`department_id`) REFERENCES `api_department` (`id`),
  CONSTRAINT `api_doctor_user_id_e8d1c7b8_fk_api_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `api_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_doctor`
--

LOCK TABLES `api_doctor` WRITE;
/*!40000 ALTER TABLE `api_doctor` DISABLE KEYS */;
INSERT INTO `api_doctor` VALUES (1,'DCRD1','Dr Ankit  Das','','Medicine',1000,'MBBS','2024-08-19',2,3,'Active'),(2,'DNRG2','Dr Rupak Kumar Patra','4444555589','Medicine',1500,'MD','2024-08-19',4,4,'Active'),(3,'DCCR3','Dr Nitin Goswami','2356784321','Medicine',2000,'MD','2024-08-22',3,5,'Active');
/*!40000 ALTER TABLE `api_doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_patient`
--

DROP TABLE IF EXISTS `api_patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_patient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `dob` date NOT NULL,
  `address` longtext,
  `nationality` varchar(255) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `joined_on` date NOT NULL,
  `updated_on` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `contact_no` (`contact_no`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_patient`
--

LOCK TABLES `api_patient` WRITE;
/*!40000 ALTER TABLE `api_patient` DISABLE KEYS */;
INSERT INTO `api_patient` VALUES (1,'P200203031','Abhay Smaran Das',23,'dasabhaysmaran@gmail.com','male','2002-03-03','Bangriposi','Indian','7326892455','2024-08-19','2024-08-31 12:06:08.267376','Active'),(2,'P200203032','Ankit Kumar  Das',22,'ankit@gmail.com','male','2002-03-03','Bangriposi','Indian','7326892444','2024-08-19','2024-08-28 16:57:03.229129','Active'),(3,'P200201013','Rishi k. Das',22,'rishi@gmail.com','Male','2002-01-01','Baripada','Indian','9938604850','2024-08-19','2024-08-29 02:01:50.789453','Active'),(4,'P200002024','Rohit Das',24,'rohit@gmail.com','Male','2000-02-02','Odisha','indian','07326892477','2024-08-20','2024-08-28 16:48:27.083514','Inactive'),(5,'P200002025','Rohit Das',24,'rohit1@gmail.com','Male','2000-02-02','Odisha','indian','07326892422','2024-08-20','2024-08-28 16:56:38.739196','Inactive'),(6,'P200203226','Abhay    Mahapatra',22,'abhay1111@gmail.com','Male','2002-03-22','Odisha','indian','07326893434','2024-08-20','2024-08-24 11:29:46.734005','active'),(7,'P200201017','Ankita Mahapatra',22,'ankita111@gmial.com','Female','2002-01-01','Odisha','indian','07326894344','2024-08-27','2024-08-27 18:04:48.673325','active'),(8,'P200206118','Ritika Sen',22,'ritika@gmail.com','Female','2002-06-11','Baripada','indian','9978564388','2024-08-28','2024-08-28 06:29:12.823781','active'),(9,'P000000001','A.s. Das',24,'asd@gmail.com','Male','2000-01-01','Baripada','indian','07326897898','2024-08-28','2024-08-28 16:02:20.304324','active');
/*!40000 ALTER TABLE `api_patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_receptionist`
--

DROP TABLE IF EXISTS `api_receptionist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_receptionist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `user_id` bigint NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `api_receptionist_user_id_b1a90c8a_fk_api_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `api_customuser` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_receptionist`
--

LOCK TABLES `api_receptionist` WRITE;
/*!40000 ALTER TABLE `api_receptionist` DISABLE KEYS */;
INSERT INTO `api_receptionist` VALUES (1,'ADM001','Abhay Smaran','8989897676',2,'Active');
/*!40000 ALTER TABLE `api_receptionist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_support`
--

DROP TABLE IF EXISTS `api_support`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_support` (
  `Ticket_id` int NOT NULL AUTO_INCREMENT,
  `Customer_Name` varchar(100) NOT NULL,
  `Customer_ID` varchar(20) NOT NULL,
  `Issue_Caption` varchar(50) NOT NULL,
  `Issue_Description` longtext NOT NULL,
  `Priority` varchar(20) NOT NULL,
  `Status` varchar(20) NOT NULL,
  `Assigned_to` varchar(50) NOT NULL,
  `Comments` longtext NOT NULL,
  `Created_Date` date NOT NULL,
  `Last_Updated_Date` date NOT NULL,
  `Resolution_date` date DEFAULT NULL,
  `Issue_ScreenShot` varchar(100) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  PRIMARY KEY (`Ticket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_support`
--

LOCK TABLES `api_support` WRITE;
/*!40000 ALTER TABLE `api_support` DISABLE KEYS */;
INSERT INTO `api_support` VALUES (1,'Dr. Ranjan Mahanty','C1','Screen Issue','new issue','low','Open','','','2024-08-31','2024-08-31',NULL,'','Abhay Smaran');
/*!40000 ALTER TABLE `api_support` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add custom user',6,'add_customuser'),(22,'Can change custom user',6,'change_customuser'),(23,'Can delete custom user',6,'delete_customuser'),(24,'Can view custom user',6,'view_customuser'),(25,'Can add department',7,'add_department'),(26,'Can change department',7,'change_department'),(27,'Can delete department',7,'delete_department'),(28,'Can view department',7,'view_department'),(29,'Can add patient',8,'add_patient'),(30,'Can change patient',8,'change_patient'),(31,'Can delete patient',8,'delete_patient'),(32,'Can view patient',8,'view_patient'),(33,'Can add doctor',9,'add_doctor'),(34,'Can change doctor',9,'change_doctor'),(35,'Can delete doctor',9,'delete_doctor'),(36,'Can view doctor',9,'view_doctor'),(37,'Can add receptionist',10,'add_receptionist'),(38,'Can change receptionist',10,'change_receptionist'),(39,'Can delete receptionist',10,'delete_receptionist'),(40,'Can view receptionist',10,'view_receptionist'),(41,'Can add test',11,'add_test'),(42,'Can change test',11,'change_test'),(43,'Can delete test',11,'delete_test'),(44,'Can view test',11,'view_test'),(45,'Can add appointment',12,'add_appointment'),(46,'Can change appointment',12,'change_appointment'),(47,'Can delete appointment',12,'delete_appointment'),(48,'Can view appointment',12,'view_appointment'),(49,'Can add report',13,'add_report'),(50,'Can change report',13,'change_report'),(51,'Can delete report',13,'delete_report'),(52,'Can view report',13,'view_report'),(53,'Can add hospital visit log',14,'add_hospitalvisitlog'),(54,'Can change hospital visit log',14,'change_hospitalvisitlog'),(55,'Can delete hospital visit log',14,'delete_hospitalvisitlog'),(56,'Can view hospital visit log',14,'view_hospitalvisitlog'),(57,'Can add prescription',15,'add_prescription'),(58,'Can change prescription',15,'change_prescription'),(59,'Can delete prescription',15,'delete_prescription'),(60,'Can view prescription',15,'view_prescription'),(61,'Can add support',16,'add_support'),(62,'Can change support',16,'change_support'),(63,'Can delete support',16,'delete_support'),(64,'Can view support',16,'view_support'),(65,'Can add follow up appointments',17,'add_followupappointments'),(66,'Can change follow up appointments',17,'change_followupappointments'),(67,'Can delete follow up appointments',17,'delete_followupappointments'),(68,'Can view follow up appointments',17,'view_followupappointments');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_api_customuser_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_api_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `api_customuser` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2024-08-19 05:53:48.966761','1','',1,'[{\"added\": {}}]',13,1),(2,'2024-08-19 05:55:10.046791','1','Ankit Das with Dr Ankit  Das',1,'[{\"added\": {}}]',12,1),(3,'2024-08-19 10:15:23.127280','2','CRT_20240819_101523.pdf',1,'[{\"added\": {}}]',13,1),(4,'2024-08-29 08:51:41.725787','1','abhay',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',6,1),(5,'2024-08-29 16:32:18.415685','3','Cretinine Test',2,'[{\"changed\": {\"fields\": [\"Test name\", \"Test type\"]}}]',11,1),(6,'2024-08-29 16:32:35.685729','2','Urine Test',2,'[{\"changed\": {\"fields\": [\"Test name\", \"Test type\"]}}]',11,1),(7,'2024-08-29 16:32:47.946445','1','Blood Test',2,'[{\"changed\": {\"fields\": [\"Test name\", \"Test type\"]}}]',11,1),(8,'2024-08-29 17:28:15.430737','6','Ultrasound',3,'',11,1),(9,'2024-08-29 18:02:15.332414','5','Ultrasound',2,'[{\"changed\": {\"fields\": [\"Test code\"]}}]',11,1),(10,'2024-08-30 04:36:22.259886','7','Hemoglobin',3,'',11,1),(11,'2024-08-30 04:36:22.302246','5','Ultrasound',3,'',11,1),(12,'2024-08-30 04:36:22.387972','4','X-Ray',3,'',11,1),(13,'2024-08-30 04:36:22.412622','3','Cretinine Test',3,'',11,1),(14,'2024-08-30 04:36:22.476015','2','Urine Test',3,'',11,1),(15,'2024-08-30 04:36:22.501739','1','Blood Test',3,'',11,1),(16,'2024-08-30 05:31:52.202585','7','WBC',3,'',13,1),(17,'2024-08-30 05:31:52.368197','6','BLD',3,'',13,1),(18,'2024-08-30 05:31:52.401775','5','WBC',3,'',13,1),(19,'2024-08-31 03:43:44.421681','4','Support object (4)',3,'',16,1),(20,'2024-08-31 03:43:44.591055','3','Support object (3)',3,'',16,1),(21,'2024-08-31 03:43:44.634195','2','Support object (2)',3,'',16,1),(22,'2024-08-31 03:43:44.655525','1','Support object (1)',3,'',16,1),(23,'2024-08-31 11:55:23.408106','2','Support object (2)',3,'',16,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(6,'api','customuser'),(7,'api','department'),(9,'api','doctor'),(8,'api','patient'),(10,'api','receptionist'),(16,'api','support'),(3,'auth','group'),(2,'auth','permission'),(4,'contenttypes','contenttype'),(12,'services','appointment'),(17,'services','followupappointments'),(14,'services','hospitalvisitlog'),(15,'services','prescription'),(13,'services','report'),(11,'services','test'),(5,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-08-19 05:14:47.489776'),(2,'api','0001_initial','2024-08-19 05:14:50.911829'),(3,'admin','0001_initial','2024-08-19 05:14:51.990122'),(4,'admin','0002_logentry_remove_auto_add','2024-08-19 05:14:52.120710'),(5,'admin','0003_logentry_add_action_flag_choices','2024-08-19 05:14:52.193315'),(6,'contenttypes','0002_remove_content_type_name','2024-08-19 05:14:53.067687'),(7,'auth','0001_initial','2024-08-19 05:14:55.380408'),(8,'auth','0002_alter_permission_name_max_length','2024-08-19 05:14:55.911531'),(9,'auth','0003_alter_user_email_max_length','2024-08-19 05:14:55.958442'),(10,'auth','0004_alter_user_username_opts','2024-08-19 05:14:56.024066'),(11,'auth','0005_alter_user_last_login_null','2024-08-19 05:14:56.105218'),(12,'auth','0006_require_contenttypes_0002','2024-08-19 05:14:56.148565'),(13,'auth','0007_alter_validators_add_error_messages','2024-08-19 05:14:56.208563'),(14,'auth','0008_alter_user_username_max_length','2024-08-19 05:14:56.259548'),(15,'auth','0009_alter_user_last_name_max_length','2024-08-19 05:14:56.315048'),(16,'auth','0010_alter_group_name_max_length','2024-08-19 05:14:56.473941'),(17,'auth','0011_update_proxy_permissions','2024-08-19 05:14:56.544209'),(18,'auth','0012_alter_user_first_name_max_length','2024-08-19 05:14:56.607304'),(19,'services','0001_initial','2024-08-19 05:14:59.302619'),(20,'sessions','0001_initial','2024-08-19 05:14:59.661566'),(21,'services','0002_alter_report_report_file','2024-08-19 09:49:03.338715'),(22,'services','0003_alter_report_report_file','2024-08-19 12:16:11.583626'),(23,'services','0004_appointment_status_hospitalvisitlog','2024-08-20 12:22:13.185122'),(24,'services','0005_prescription','2024-08-20 14:33:09.508791'),(25,'services','0006_remove_prescription_date_alter_prescription_patient','2024-08-20 15:34:59.868217'),(26,'services','0007_report_year','2024-08-26 14:25:06.131689'),(27,'api','0002_patient_ststus','2024-08-27 12:51:01.415703'),(28,'api','0003_customuser_status','2024-08-27 13:02:15.166639'),(29,'api','0004_rename_ststus_patient_status','2024-08-28 13:17:57.873711'),(30,'api','0005_alter_customuser_role','2024-08-29 08:48:59.343768'),(31,'api','0006_alter_patient_address','2024-08-29 14:22:37.539840'),(32,'services','0008_test_test_type','2024-08-29 16:29:10.748454'),(33,'services','0009_alter_test_test_type','2024-08-29 16:29:41.610934'),(34,'services','0010_alter_test_test_code_alter_test_test_name','2024-08-29 17:59:59.623933'),(35,'api','0007_doctor_status_receptionist_status_and_more','2024-08-30 04:24:32.612522'),(36,'services','0011_rename_prescription_files_prescription_prescription_file','2024-08-30 04:29:21.581089'),(37,'api','0008_support','2024-08-30 11:43:55.205867'),(38,'api','0009_alter_support_issue_caption_and_more','2024-08-30 13:32:48.305716'),(39,'services','0012_followupappointments','2024-08-30 14:20:49.556841'),(40,'api','0010_alter_support_assigned_to_alter_support_comments_and_more','2024-08-31 02:54:33.720763'),(41,'api','0011_alter_support_resolution_date','2024-08-31 03:30:49.975368'),(42,'api','0012_support_created_by','2024-08-31 06:22:32.599810'),(43,'services','0013_prescription_messege_report_messege','2024-08-31 10:53:09.365935'),(44,'services','0014_rename_messege_prescription_message_and_more','2024-08-31 10:59:13.756866');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('elij4ariuwihh7rdvbipayvfum1izkgv','.eJxVjDsOwjAQBe_iGlk2C_5Q0nMGa-3dxQHkSHFSIe5OIqWA9s3Me6uEy1zT0nlKA6mLsurwu2UsT24boAe2-6jL2OZpyHpT9E67vo3Er-vu_h1U7HWtnS0uF3tmzifvioUg3gAwiwMvCAIAR0sxspPsJUQfDUbKYQ0MuaA-X-whOFA:1sfvIi:Gfn21KSTjUyOo7Rx2PlGhwIvZ1PwGAD3lpkVsE3l_2M','2024-09-02 05:51:32.006897'),('lud2ix2y3sfx38xnhmo6eeeac2l4c298','.eJxVjDsOwjAQBe_iGlk2C_5Q0nMGa-3dxQHkSHFSIe5OIqWA9s3Me6uEy1zT0nlKA6mLsurwu2UsT24boAe2-6jL2OZpyHpT9E67vo3Er-vu_h1U7HWtnS0uF3tmzifvioUg3gAwiwMvCAIAR0sxspPsJUQfDUbKYQ0MuaA-X-whOFA:1sfz1Q:davelUApPW87nPN13zcB6vjDN-2NdlBaOPBVX2-ePbs','2024-09-02 09:49:56.323967');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_appointment`
--

DROP TABLE IF EXISTS `services_appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `booked_on` datetime(6) NOT NULL,
  `updated_on` datetime(6) NOT NULL,
  `booked_by` varchar(50) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` varchar(255) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_appointment_doctor_id_0ddaf6d8_fk_api_doctor_id` (`doctor_id`),
  KEY `services_appointment_patient_id_5afc949e_fk_api_patient_uuid` (`patient_id`),
  CONSTRAINT `services_appointment_doctor_id_0ddaf6d8_fk_api_doctor_id` FOREIGN KEY (`doctor_id`) REFERENCES `api_doctor` (`id`),
  CONSTRAINT `services_appointment_patient_id_5afc949e_fk_api_patient_uuid` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_appointment`
--

LOCK TABLES `services_appointment` WRITE;
/*!40000 ALTER TABLE `services_appointment` DISABLE KEYS */;
INSERT INTO `services_appointment` VALUES (1,'2024-08-25','2024-08-19 05:55:10.041793','2024-08-31 13:03:08.081135','',1,'P200203032','Cheaked'),(2,'2024-08-30','2024-08-20 12:56:06.619713','2024-08-31 01:43:35.553891','',2,'P200201013','active'),(3,'2024-08-25','2024-08-20 12:59:44.609726','2024-08-31 13:12:06.525967','',1,'P200201013','Cheaked'),(4,'2024-09-07','2024-08-28 14:12:26.733381','2024-08-28 14:12:26.764588','',2,'P200002024','active'),(5,'2024-08-30','2024-08-28 16:48:44.133959','2024-08-31 09:15:22.779237','',1,'P200002024','Cheaked'),(6,'2024-09-07','2024-08-30 03:28:56.128912','2024-08-30 03:28:56.131222','',3,'P200206118','active'),(7,'2024-10-09','2024-08-30 03:29:10.071392','2024-08-30 03:29:10.071392','',1,'P200206118','active'),(8,'2024-09-03','2024-08-31 11:57:02.589035','2024-08-31 12:43:41.857812','',1,'P200203031','Active');
/*!40000 ALTER TABLE `services_appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_followupappointments`
--

DROP TABLE IF EXISTS `services_followupappointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_followupappointments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `followUpDate` datetime(6) NOT NULL,
  `booked_on` date NOT NULL,
  `updated_on` date NOT NULL,
  `updated_by` varchar(100) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_followupapp_doctor_id_57ebd2dc_fk_api_docto` (`doctor_id`),
  KEY `services_followupapp_patient_id_e59f7c15_fk_api_patie` (`patient_id`),
  CONSTRAINT `services_followupapp_doctor_id_57ebd2dc_fk_api_docto` FOREIGN KEY (`doctor_id`) REFERENCES `api_doctor` (`id`),
  CONSTRAINT `services_followupapp_patient_id_e59f7c15_fk_api_patie` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_followupappointments`
--

LOCK TABLES `services_followupappointments` WRITE;
/*!40000 ALTER TABLE `services_followupappointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `services_followupappointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_hospitalvisitlog`
--

DROP TABLE IF EXISTS `services_hospitalvisitlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_hospitalvisitlog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `patiend_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_hospitalvis_patiend_id_4a8ec802_fk_api_patie` (`patiend_id`),
  CONSTRAINT `services_hospitalvis_patiend_id_4a8ec802_fk_api_patie` FOREIGN KEY (`patiend_id`) REFERENCES `api_patient` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_hospitalvisitlog`
--

LOCK TABLES `services_hospitalvisitlog` WRITE;
/*!40000 ALTER TABLE `services_hospitalvisitlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `services_hospitalvisitlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_prescription`
--

DROP TABLE IF EXISTS `services_prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_prescription` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `prescription_file` varchar(100) NOT NULL,
  `uploaded_on` datetime(6) NOT NULL,
  `uploaded_by` varchar(100) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` varchar(255) NOT NULL,
  `message` longtext NOT NULL DEFAULT (_utf8mb3''),
  PRIMARY KEY (`id`),
  KEY `services_prescription_doctor_id_80a40db0_fk_api_doctor_id` (`doctor_id`),
  KEY `services_prescription_patient_id_05f79413_fk_api_patient_uuid` (`patient_id`),
  CONSTRAINT `services_prescription_doctor_id_80a40db0_fk_api_doctor_id` FOREIGN KEY (`doctor_id`) REFERENCES `api_doctor` (`id`),
  CONSTRAINT `services_prescription_patient_id_05f79413_fk_api_patient_uuid` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_prescription`
--

LOCK TABLES `services_prescription` WRITE;
/*!40000 ALTER TABLE `services_prescription` DISABLE KEYS */;
INSERT INTO `services_prescription` VALUES (1,'Dr Ankit  Das_20245208/31/24_035248','prescription_files/2024/P200201013/drankit_1725076368.pdf','2024-08-31 03:52:48.835444','Abhay Smaran',1,'P200201013',''),(2,'Dr Ankit  Das_20245308/31/24_035303','prescription_files/2024/P200203032/drankit_1725076383.pdf','2024-08-31 03:53:03.181898','Abhay Smaran',1,'P200203032',''),(3,'Dr Ankit  Das_20240408/31/24_120446','prescription_files/2024/P200203031/drankit_1725105886.pdf','2024-08-31 12:04:46.658350','umasankar',1,'P200203031','');
/*!40000 ALTER TABLE `services_prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_report`
--

DROP TABLE IF EXISTS `services_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_report` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `report_file` varchar(100) NOT NULL,
  `uploaded_on` datetime(6) NOT NULL,
  `uploaded_by` varchar(50) NOT NULL,
  `patient_id` varchar(255) NOT NULL,
  `test_id` bigint NOT NULL,
  `year` int DEFAULT NULL,
  `message` longtext NOT NULL DEFAULT (_utf8mb3''),
  PRIMARY KEY (`id`),
  KEY `services_report_patient_id_d9bd0b0e_fk_api_patient_uuid` (`patient_id`),
  KEY `services_report_test_id_699d9d70_fk_services_test_id` (`test_id`),
  CONSTRAINT `services_report_patient_id_d9bd0b0e_fk_api_patient_uuid` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`uuid`),
  CONSTRAINT `services_report_test_id_699d9d70_fk_services_test_id` FOREIGN KEY (`test_id`) REFERENCES `services_test` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_report`
--

LOCK TABLES `services_report` WRITE;
/*!40000 ALTER TABLE `services_report` DISABLE KEYS */;
INSERT INTO `services_report` VALUES (1,'WBC','report_files/2024/P200203031/WBC_1725076308.pdf','2024-08-31 03:51:48.024817','Abhay Smaran','P200203031',8,2024,''),(2,'DT_1','report_files/2024/P200203032/DT_1_1725076328.pdf','2024-08-31 03:52:08.853007','Abhay Smaran','P200203032',10,2024,''),(3,'BLD','report_files/2024/P200201017/BLD_1725076346.pdf','2024-08-31 03:52:26.149943','Abhay Smaran','P200201017',9,2024,''),(4,'BLD','report_files/2024/P200203031/BLD_1725102638.pdf','2024-08-31 11:10:38.996689','umasankar','P200203031',9,2024,'Reports are good no need for next cheak up');
/*!40000 ALTER TABLE `services_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services_test`
--

DROP TABLE IF EXISTS `services_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services_test` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `test_name` varchar(200) NOT NULL,
  `test_code` varchar(10) NOT NULL,
  `test_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_test_test_code_4907ae5e_uniq` (`test_code`),
  UNIQUE KEY `services_test_test_name_daabd6ad_uniq` (`test_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services_test`
--

LOCK TABLES `services_test` WRITE;
/*!40000 ALTER TABLE `services_test` DISABLE KEYS */;
INSERT INTO `services_test` VALUES (8,'White Blood Cell','WBC','Test'),(9,'Blood Test','BLD','Test'),(10,'diagnostic-1','DT_1','Diagnostic');
/*!40000 ALTER TABLE `services_test` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-31 18:47:28
