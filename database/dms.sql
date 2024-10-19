
CREATE TABLE `api_customuser` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `last_login` datetime(6) DEFAULT NULL,
  `username` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `api_customuser` VALUES (1,NULL,'Admin','umasankar@forants.com','pbkdf2_sha256$720000$xQ7vBko4z2U1gltPKP3nJ9$n84ooc7YEyPCTf51zVXDQB84kyv43oAFBIXAwSgP3Po=','super_admin',1,1,1,1,'active');

CREATE TABLE `api_department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(255) NOT NULL,
  `dept_code` varchar(255) NOT NULL,
  `dept_location` varchar(255) DEFAULT NULL,
  `dept_contact_no` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_department_dept_code_3e296de2_uniq` (`dept_code`),
  UNIQUE KEY `api_department_dept_name_cbf1d7ad_uniq` (`dept_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `api_doctor` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `doc_uid` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `specialization` varchar(50) NOT NULL,
  `fee` int DEFAULT NULL,
  `degree` varchar(100) NOT NULL,
  `joined_on` date NOT NULL,
  `department_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `api_doctor_department_id_ed318b57_fk` (`department_id`),
  CONSTRAINT `api_doctor_department_id_ed318b57_fk` FOREIGN KEY (`department_id`) REFERENCES `api_department` (`id`),
  CONSTRAINT `api_doctor_user_id_e8d1c7b8_fk_api_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `api_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `api_patient` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` varchar(10) NOT NULL,
  `dob` date DEFAULT NULL,
  `address` longtext DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `contact_no` varchar(20) NOT NULL,
  `joined_on` date NOT NULL,
  `updated_on` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




CREATE TABLE `auth_group_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


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
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_api_customuser_id` FOREIGN KEY (`user_id`) REFERENCES `api_customuser` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `django_migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `services_appointment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `booked_on` datetime(6) NOT NULL,
  `updated_on` datetime(6) NOT NULL,
  `booked_by` varchar(50) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` varchar(255) NOT NULL,
  `status` varchar(20) NOT NULL,
  `advice` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_appointment_doctor_id_0ddaf6d8_fk_api_doctor_id` (`doctor_id`),
  KEY `services_appointment_patient_id_5afc949e_fk_api_patient_uuid` (`patient_id`),
  CONSTRAINT `services_appointment_doctor_id_0ddaf6d8_fk_api_doctor_id` FOREIGN KEY (`doctor_id`) REFERENCES `api_doctor` (`id`),
  CONSTRAINT `services_appointment_patient_id_5afc949e_fk_api_patient_uuid` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `services_followupappointments` (
  `id` int NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `services_prescription` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `prescription_file` varchar(100) NOT NULL,
  `uploaded_on` datetime(6) NOT NULL,
  `uploaded_by` varchar(100) NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `appointment_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_prescription_doctor_id_80a40db0_fk_api_doctor_id` (`doctor_id`),
  KEY `services_prescription_patient_id_05f79413_fk_api_patient_uuid` (`patient_id`),
  KEY `services_prescriptio_appointment_id_bbaf9bfa_fk_services_` (`appointment_id`),
  CONSTRAINT `services_prescriptio_appointment_id_bbaf9bfa_fk_services_` FOREIGN KEY (`appointment_id`) REFERENCES `services_appointment` (`id`),
  CONSTRAINT `services_prescription_doctor_id_80a40db0_fk_api_doctor_id` FOREIGN KEY (`doctor_id`) REFERENCES `api_doctor` (`id`),
  CONSTRAINT `services_prescription_patient_id_05f79413_fk_api_patient_uuid` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `services_test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_name` varchar(200) NOT NULL,
  `test_code` varchar(10) NOT NULL,
  `test_type` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_test_test_code_4907ae5e_uniq` (`test_code`),
  UNIQUE KEY `services_test_test_name_daabd6ad_uniq` (`test_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `services_report` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `report_file` varchar(100) NOT NULL,
  `uploaded_on` datetime(6) NOT NULL,
  `uploaded_by` varchar(50) NOT NULL,
  `patient_id` varchar(255) NOT NULL,
  `test_id` int NOT NULL,
  `year` int DEFAULT NULL,
  `message` longtext NOT NULL,
  `appointment_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `services_report_patient_id_d9bd0b0e_fk_api_patient_uuid` (`patient_id`),
  KEY `services_report_appointment_id_8621bb2a_fk_services_` (`appointment_id`),
  KEY `services_report_test_id_699d9d70_fk` (`test_id`),
  CONSTRAINT `services_report_appointment_id_8621bb2a_fk_services_` FOREIGN KEY (`appointment_id`) REFERENCES `services_appointment` (`id`),
  CONSTRAINT `services_report_patient_id_d9bd0b0e_fk_api_patient_uuid` FOREIGN KEY (`patient_id`) REFERENCES `api_patient` (`uuid`),
  CONSTRAINT `services_report_test_id_699d9d70_fk` FOREIGN KEY (`test_id`) REFERENCES `services_test` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



