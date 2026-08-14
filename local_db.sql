-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: tobira
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cards` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `deck_id` bigint(20) unsigned NOT NULL,
  `front_text` varchar(255) NOT NULL,
  `back_text` varchar(255) NOT NULL,
  `furigana` varchar(255) DEFAULT NULL,
  `keigo_form` varchar(255) DEFAULT NULL,
  `context_sentence` text DEFAULT NULL,
  `audio_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cards_deck_id_foreign` (`deck_id`),
  CONSTRAINT `cards_deck_id_foreign` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (3,2,'自己紹介','introduction','じこしょうかい','Teineigo','面接ではまず自己紹介をお願いします。','http://127.0.0.1:8000/storage/audio/97efee73-0db5-4d35-a46d-8566ed249c81.mp3','2026-07-23 22:52:21','2026-07-26 23:39:17'),(4,2,'志望動機','Reason for applying','しぼうどうき','Teineigo','志望動機を教えていただけますか。','http://127.0.0.1:8000/storage/audio/5d499628-23e8-4518-92bf-3463cb9d1e7b.mp3','2026-07-23 22:52:21','2026-07-24 00:41:56'),(5,2,'御社','Your company (formal, spoken)','おんしゃ','Sonkeigo','御社の企業理念に強く共感いたしました。','http://127.0.0.1:8000/storage/audio/322424bd-6ac7-42f8-a10c-0a719ed3ee5b.mp3','2026-07-23 22:52:21','2026-07-24 00:42:57'),(6,2,'弊社','Our company (humble)','へいしゃ','Kenjougo','弊社ではチームワークを大切にしております。','http://127.0.0.1:8000/storage/audio/803d4a7f-4c20-4abf-82bb-a177a69fdded.mp3','2026-07-23 22:52:21','2026-07-24 00:43:22'),(7,2,'長所と短所','Strengths and weaknesses','ちょうしょとたんしょ','Teineigo','あなたの長所と短所を教えてください。','http://127.0.0.1:8000/storage/audio/e6681b7e-66a0-4c42-8277-514e2676f0d0.mp3','2026-07-23 22:52:21','2026-07-24 00:43:49'),(8,2,'よろしくお願いいたします','Thank you / please treat me well','よろしくおねがいいたします','Teineigo','本日はお忙しい中、よろしくお願いいたします。','http://127.0.0.1:8000/storage/audio/72214ca1-b1b1-442b-ba39-f165008dcfa8.mp3','2026-07-23 22:52:21','2026-07-24 00:44:29'),(9,3,'お世話になっております','Thank you for your continued support','おせわになっております','Teineigo','いつもお世話になっております。本日はお時間をいただきありがとうございます。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(10,3,'ご足労いただき','Thank you for taking the trouble to come','ごそくろういただき','Sonkeigo','本日はご足労いただき、誠にありがとうございます。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(11,3,'お手数をおかけします','Sorry for the trouble / inconvenience','おてすうをおかけします','Teineigo','お手数をおかけしますが、ご確認をお願いいたします。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(12,3,'ご検討いただけますでしょうか','Could you please consider it','ごけんとういただけますでしょうか','Sonkeigo','こちらの提案について、ご検討いただけますでしょうか。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(13,3,'承知いたしました','Understood (humble)','しょうちいたしました','Kenjougo','かしこまりました。承知いたしました、すぐに対応いたします。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(14,3,'本日はありがとうございました','Thank you for today','ほんじつはありがとうございました','Teineigo','本日はお忙しい中、ありがとうございました。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(15,4,'拝啓','Formal opening greeting (letters)','はいけい','Teineigo','拝啓　貴社ますますご清栄のこととお慶び申し上げます。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(16,4,'お忙しいところ恐縮ですが','Sorry to bother you when busy','おいそがしいところきょうしゅくですが','Sonkeigo','お忙しいところ恐縮ですが、ご確認のほどよろしくお願いいたします。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(17,4,'ご確認ください','Please confirm/check','ごかくにんください','Sonkeigo','添付ファイルをご確認ください。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(18,4,'何卒よろしくお願い申し上げます','Kindly request your cooperation (very formal)','なにとぞよろしくおねがいもうしあげます','Kenjougo','以上、何卒よろしくお願い申し上げます。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(19,4,'取り急ぎご連絡いたします','Quick message to inform you','とりいそぎごれんらくいたします','Kenjougo','取り急ぎご連絡いたします。詳細は後日お送りいたします。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(20,4,'敬具','Formal closing (letters)','けいぐ','Teineigo','ご確認のほどよろしくお願いいたします。敬具',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(21,5,'お電話ありがとうございます','Thank you for calling','おでんわありがとうございます','Teineigo','お電話ありがとうございます、株式会社トビラでございます。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(22,5,'少々お待ちください','Please wait a moment','しょうしょうおまちください','Sonkeigo','担当の者におつなぎしますので、少々お待ちください。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(23,5,'折り返しお電話いたします','I will call you back','おりかえしおでんわいたします','Kenjougo','ただいま席を外しておりますので、折り返しお電話いたします。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(24,5,'お名前を伺ってもよろしいでしょうか','May I ask your name','おなまえをうかがってもよろしいでしょうか','Sonkeigo','恐れ入りますが、お名前を伺ってもよろしいでしょうか。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(25,5,'失礼いたします','Excuse me (polite closing)','しつれいいたします','Kenjougo','それでは失礼いたします。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(26,5,'お電話代わりました','I have taken over the call','おでんわかわりました','Teineigo','お電話代わりました、営業部の田中でございます。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(27,6,'おはようございます','Good morning (polite)','おはようございます','Teineigo','おはようございます。今日もよろしくお願いします。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(28,6,'お先に失礼します','Excuse me for leaving first','おさきにしつれいします','Teineigo','お先に失礼します。お疲れ様でした。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(29,6,'会議室','Meeting room','かいぎしつ','Teineigo','会議室は3階にございます。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(30,6,'休憩','Break / rest','きゅうけい','Teineigo','そろそろ休憩を取りましょう。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(31,6,'資料','Documents / materials','しりょう','Teineigo','会議の資料を準備しておいてください。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21'),(32,6,'お疲れ様です','Thank you for your hard work','おつかれさまです','Teineigo','お疲れ様です。今日はありがとうございました。',NULL,'2026-07-23 22:52:21','2026-07-23 22:52:21');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `decks`
--

DROP TABLE IF EXISTS `decks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `decks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `scenario_tag` varchar(255) DEFAULT NULL,
  `jlpt_level` varchar(255) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `decks_user_id_foreign` (`user_id`),
  KEY `decks_scenario_tag_index` (`scenario_tag`),
  KEY `decks_jlpt_level_index` (`jlpt_level`),
  CONSTRAINT `decks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `decks`
--

LOCK TABLES `decks` WRITE;
/*!40000 ALTER TABLE `decks` DISABLE KEYS */;
INSERT INTO `decks` VALUES (2,1,'Job Interview Essentials','Job Interview','N3',1,'Core vocabulary and set phrases for Japanese job interviews.','2026-07-23 22:52:21','2026-07-23 22:52:21'),(3,1,'Client Meeting Phrases','Client Meetings','N2',1,'Polite expressions for meeting with clients and business partners.','2026-07-23 22:52:21','2026-07-23 22:52:21'),(4,1,'Business Email Etiquette','Email Etiquette','N3',1,'Standard openings, closings, and polite requests for business emails.','2026-07-23 22:52:21','2026-07-23 22:52:21'),(5,1,'Telephone Call Manners','Telephone Calls','N4',1,'Essential phrases for answering and making business phone calls.','2026-07-23 22:52:21','2026-07-23 22:52:21'),(6,1,'Office Daily Use','Office Daily Use','N5',1,'Everyday workplace vocabulary for greetings and routine tasks.','2026-07-23 22:52:21','2026-07-23 22:52:21');
/*!40000 ALTER TABLE `decks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_path` varchar(255) NOT NULL,
  `file_type` enum('csv','json','audio') NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_valid` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `files_user_id_foreign` (`user_id`),
  CONSTRAINT `files_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (1,1,'Nada.mp3','audio/c4a26dae-b9d3-4069-afb9-d59236f17ac9.mp3','audio','2026-07-20 10:38:38',1,'2026-07-20 10:38:38','2026-07-20 10:38:38'),(2,1,'Nada.mp3','audio/47d89c76-b8b7-4d34-a658-80b6f0c67277.mp3','audio','2026-07-20 10:51:41',1,'2026-07-20 10:51:41','2026-07-20 10:51:41'),(3,1,'ttsMP3.com_VoiceText_2026-7-24_11-40-44.mp3','audio/97efee73-0db5-4d35-a46d-8566ed249c81.mp3','audio','2026-07-24 00:41:02',1,'2026-07-24 00:41:02','2026-07-24 00:41:02'),(4,1,'ttsMP3.com_VoiceText_2026-7-24_11-41-39.mp3','audio/5d499628-23e8-4518-92bf-3463cb9d1e7b.mp3','audio','2026-07-24 00:41:48',1,'2026-07-24 00:41:48','2026-07-24 00:41:48'),(5,1,'ttsMP3.com_VoiceText_2026-7-24_11-42-45.mp3','audio/322424bd-6ac7-42f8-a10c-0a719ed3ee5b.mp3','audio','2026-07-24 00:42:52',1,'2026-07-24 00:42:52','2026-07-24 00:42:52'),(6,1,'ttsMP3.com_VoiceText_2026-7-24_11-43-12.mp3','audio/803d4a7f-4c20-4abf-82bb-a177a69fdded.mp3','audio','2026-07-24 00:43:18',1,'2026-07-24 00:43:18','2026-07-24 00:43:18'),(7,1,'ttsMP3.com_VoiceText_2026-7-24_11-43-40.mp3','audio/e6681b7e-66a0-4c42-8277-514e2676f0d0.mp3','audio','2026-07-24 00:43:45',1,'2026-07-24 00:43:45','2026-07-24 00:43:45'),(8,1,'ttsMP3.com_VoiceText_2026-7-24_11-44-19.mp3','audio/72214ca1-b1b1-442b-ba39-f165008dcfa8.mp3','audio','2026-07-24 00:44:24',1,'2026-07-24 00:44:24','2026-07-24 00:44:24');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_05_15_064517_create_permission_tables',1),(5,'2026_07_09_000001_create_personal_access_tokens_table',2),(6,'2026_07_09_000010_create_decks_table',2),(7,'2026_07_09_000020_create_cards_table',2),(8,'2026_07_09_000030_create_reviews_table',2),(9,'2026_07_09_000040_create_files_table',2),(10,'2026_07_09_000050_create_study_sessions_table',2),(11,'2026_07_19_000001_make_onboarding_fields_nullable_on_users_table',3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',1),(2,'App\\Models\\User',2),(2,'App\\Models\\User',3),(2,'App\\Models\\User',4),(2,'App\\Models\\User',5),(2,'App\\Models\\User',6),(2,'App\\Models\\User',7);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (2,'App\\Models\\User',5,'tobira-spa','131c19e7b08b0606b468641037f3150a79fae5d21097f31ae3548513b532a0c4','[\"*\"]','2026-07-18 21:39:00',NULL,'2026-07-18 21:35:38','2026-07-18 21:39:00'),(11,'App\\Models\\User',5,'tobira-spa','41722ecc28e60483fee9dae1efd0654afb151b9c6f3a0deaac32590e42c68c82','[\"*\"]','2026-07-24 00:50:17',NULL,'2026-07-20 10:39:16','2026-07-24 00:50:17'),(12,'App\\Models\\User',5,'tobira-spa','2e6474434d6f3deaa6a3bf813054930dc346f8ec1465810ea7925f4af11f5c1c','[\"*\"]','2026-07-20 10:44:30',NULL,'2026-07-20 10:40:15','2026-07-20 10:44:30'),(14,'App\\Models\\User',5,'tobira-spa','a3d9ddd18d29aae353215225c463902f1b10edb0f878a9539dce9fc9ffaa3493','[\"*\"]','2026-07-20 10:48:17',NULL,'2026-07-20 10:48:14','2026-07-20 10:48:17');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `card_id` bigint(20) unsigned NOT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `interval_days` int(10) unsigned NOT NULL DEFAULT 1,
  `ease_factor` decimal(4,2) NOT NULL DEFAULT 2.50,
  `next_review_at` timestamp NULL DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_card_id_foreign` (`card_id`),
  KEY `reviews_user_id_card_id_reviewed_at_index` (`user_id`,`card_id`,`reviewed_at`),
  KEY `reviews_user_id_next_review_at_index` (`user_id`,`next_review_at`),
  CONSTRAINT `reviews_card_id_foreign` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (2,5,9,0,1,2.30,'2026-07-24 22:52:52','2026-07-23 22:52:52','2026-07-23 22:52:52','2026-07-23 22:52:52'),(3,5,10,2,3,2.50,'2026-07-26 22:53:04','2026-07-23 22:53:04','2026-07-23 22:53:04','2026-07-23 22:53:04'),(4,5,11,3,3,2.65,'2026-07-26 22:53:11','2026-07-23 22:53:11','2026-07-23 22:53:11','2026-07-23 22:53:11'),(5,5,12,3,3,2.65,'2026-07-26 22:53:17','2026-07-23 22:53:17','2026-07-23 22:53:17','2026-07-23 22:53:17'),(6,5,13,2,3,2.50,'2026-07-26 22:53:19','2026-07-23 22:53:19','2026-07-23 22:53:19','2026-07-23 22:53:19'),(7,5,14,2,3,2.50,'2026-07-26 22:53:20','2026-07-23 22:53:20','2026-07-23 22:53:20','2026-07-23 22:53:20'),(8,5,15,1,1,2.35,'2026-07-24 22:54:05','2026-07-23 22:54:05','2026-07-23 22:54:05','2026-07-23 22:54:05'),(9,5,16,2,3,2.50,'2026-07-26 22:54:35','2026-07-23 22:54:35','2026-07-23 22:54:35','2026-07-23 22:54:35'),(10,7,27,0,1,2.30,'2026-07-24 23:31:41','2026-07-23 23:31:41','2026-07-23 23:31:41','2026-07-23 23:31:41'),(11,5,3,2,3,2.50,'2026-07-26 23:44:11','2026-07-23 23:44:11','2026-07-23 23:44:11','2026-07-23 23:44:11'),(12,5,4,2,3,2.50,'2026-07-26 23:44:12','2026-07-23 23:44:12','2026-07-23 23:44:12','2026-07-23 23:44:12'),(13,5,5,2,3,2.50,'2026-07-26 23:44:13','2026-07-23 23:44:13','2026-07-23 23:44:13','2026-07-23 23:44:13'),(14,5,6,2,3,2.50,'2026-07-26 23:44:14','2026-07-23 23:44:14','2026-07-23 23:44:14','2026-07-23 23:44:14'),(15,5,7,2,3,2.50,'2026-07-26 23:44:16','2026-07-23 23:44:16','2026-07-23 23:44:16','2026-07-23 23:44:16'),(16,5,8,2,3,2.50,'2026-07-26 23:44:17','2026-07-23 23:44:17','2026-07-23 23:44:17','2026-07-23 23:44:17'),(17,7,27,3,2,2.45,'2026-07-28 21:43:03','2026-07-26 21:43:03','2026-07-26 21:43:03','2026-07-26 21:43:03'),(18,7,28,2,3,2.50,'2026-07-29 21:43:13','2026-07-26 21:43:13','2026-07-26 21:43:13','2026-07-26 21:43:13'),(19,7,29,3,3,2.65,'2026-07-29 21:43:17','2026-07-26 21:43:17','2026-07-26 21:43:17','2026-07-26 21:43:17'),(20,7,30,2,3,2.50,'2026-07-29 21:43:22','2026-07-26 21:43:22','2026-07-26 21:43:22','2026-07-26 21:43:22'),(21,7,31,1,1,2.35,'2026-07-27 21:43:32','2026-07-26 21:43:32','2026-07-26 21:43:32','2026-07-26 21:43:32'),(22,7,32,2,3,2.50,'2026-07-29 21:43:40','2026-07-26 21:43:40','2026-07-26 21:43:40','2026-07-26 21:43:40'),(24,7,3,0,1,2.30,'2026-07-27 23:42:32','2026-07-26 23:42:32','2026-07-26 23:42:32','2026-07-26 23:42:32'),(25,7,4,0,1,2.30,'2026-07-27 23:42:33','2026-07-26 23:42:33','2026-07-26 23:42:33','2026-07-26 23:42:33'),(26,7,5,2,3,2.50,'2026-07-29 23:42:34','2026-07-26 23:42:34','2026-07-26 23:42:34','2026-07-26 23:42:34'),(27,7,6,2,3,2.50,'2026-07-29 23:42:36','2026-07-26 23:42:36','2026-07-26 23:42:36','2026-07-26 23:42:36'),(28,7,7,2,3,2.50,'2026-07-29 23:42:37','2026-07-26 23:42:37','2026-07-26 23:42:37','2026-07-26 23:42:37'),(29,7,8,2,3,2.50,'2026-07-29 23:42:39','2026-07-26 23:42:39','2026-07-26 23:42:39','2026-07-26 23:42:39');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','web','2026-05-16 23:10:11','2026-05-16 23:10:11'),(2,'student','web','2026-05-16 23:10:11','2026-05-16 23:10:11');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('5KeY7gPPZcrU866vFtBbX0zk2xSlRandEcYzXPZa',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.123.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36','eyJfdG9rZW4iOiJMZFdXekF1VDRXeEE2QUJYMW5RVUU2VE5TaVhDOWVwUnJ0S0ZXZUZtIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1781852332),('969pNMBhuKsEzkascl6fULmQWxQY4g3MQ1h1NBvk',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJXbXdZaXNNNkVkQTBWUjJocndUVVZlS2xITEhZV29KSUJyYm5nRmFwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1782014452),('9wWEvLJSZHvyB8jaqcpJjrctH5CGPsAq2hv2DaeI',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','eyJfdG9rZW4iOiIyRlpxTjBZRGVxb29sSW9ETnc0czJEM1pPTjJJYjVLM0kwZHk5NnlGIiwiX2ZsYXNoIjp7Im5ldyI6W10sIm9sZCI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDBcL2xvZ2luIiwicm91dGUiOiJsb2dpbiJ9fQ==',1780915129),('AcEkz7GGuCSSC2zNg9wb8Y7IfVWXHGOD4OlLPWdo',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJiMEx0ZFd0N0dTRW1hYXZuZGR5MHA3M3g4c0dPbkVaeXpMdndFQ0pKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1782015746),('BfxaGN9bZ5CYmO3GuWuRGQl7Mibb6dMO2jXFACsR',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJzWTBZNEdlMVJCemZ6bWxXeWxUczR2Z1d4cktCSVJJVFJwaFNmMERnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hdXRoXC9nb29nbGUiLCJyb3V0ZSI6Imdvb2dsZS5yZWRpcmVjdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sIm90cF91c2VyX2lkIjozLCJzdGF0ZSI6InlpYTdzR1VDNEZXcXJReDJ0emd6U0hRTERjNU1XQWk0VUM0SmZ5b3UifQ==',1781852420),('bytAVdUAYzaHRL6Y2Ndm5FyNjjpxtWQVJ7gGKNll',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.122.1 Chrome/142.0.7444.265 Electron/39.8.8 Safari/537.36','eyJfdG9rZW4iOiJEcGcyckpmY3Fld3N3U1ZtSXZlcWN5bFJRcEtxQjJQd2ltOU53em5RIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1780641498),('fFqjaBSz2ZHuLAZvBWPiJVIVUiG8624KH8CvBnrd',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJjNjc0cHRBa2pkd3VXNERUREVWck5hNTVpcGw1eGRQZWVxS3NZMWxnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1780641707),('fKXJuxfFMmnz1IQdc4FVZO7pHcdk1s6YHA3eA1Yl',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJBdVJtdUpVRTdUeU5ubUNMRnNCMEt5STM4NjBLdTBvd08xeEpwMWFzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hdXRoXC9nb29nbGUiLCJyb3V0ZSI6Imdvb2dsZS5yZWRpcmVjdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sInN0YXRlIjoiR2hQRjBGc3FERTA5R09uWldhWFZUNmNnZXhKM2xPTmtHU01hUEJ6bSJ9',1780641506),('FmOoQJxkz830c6L1Hd8zbYpBQyq8RyoaZGYrL41D',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJPR0swVTVLbU96bUJmclZJSHFxUjJFblowekN4blpDMjRzT3NwRW56IiwiX2ZsYXNoIjp7Im5ldyI6W10sIm9sZCI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDBcL2xvZ2luIiwicm91dGUiOiJsb2dpbiJ9fQ==',1781852433),('jItO7mF61jZpZHW056Bn9V4VmdBKGxpU1vyLwEPP',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJWUHl2SmJ4TWwzRTZzNzB0ZVpmWTlncU5TOHJCY3ZGQjNMVldRbDdXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9yZWdpc3RlciIsInJvdXRlIjoicmVnaXN0ZXIifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1780639619),('tVtj3gUZPB7DphqHWQWpwu02f8ao1L6JfwwpBUtH',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiI5WndJNXZnSkFSUVptbW9mNm9aWHMwaThab28wVFphOHQ2Z3lwMWY1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1782015606),('vKGAt9REVCh5DTQfzZOy9ld9EKvshhggVNjtzzKx',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.125.1 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36','eyJfdG9rZW4iOiJCSGdQUnowaGdPZnR3SW9HYnRVM0swSm9PUEt6dlo1eHRnY0xIZzZXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1782015729),('zb0wTz4BA5uqwuuH71sPxKBNqZ8mFYKFfA8fb7oY',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJibzhGMUVlTWdzZk5ROTFnQWVNZFJGUG9tR0lRTkxUd3c4bWY0NVZ4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hdXRoXC9nb29nbGUiLCJyb3V0ZSI6Imdvb2dsZS5yZWRpcmVjdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sIm90cF91c2VyX2lkIjozLCJzdGF0ZSI6Imc3OG9KTnRUZHFESzVnNldoM3VWOTZEVTMzNjI3TlVBSnprYUJkRlIifQ==',1780915121),('ZtbgMMzhpPCzlx4qIbs1NWEr8eGJsUnjbMxfrBmz',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.123.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36','eyJfdG9rZW4iOiJkOXRSMXlDTFd3NjRydnBDRjVOVGZZNUVoTElEeTBNck8xUTAxbnAyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1780915055);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_sessions`
--

DROP TABLE IF EXISTS `study_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `study_sessions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `deck_id` bigint(20) unsigned DEFAULT NULL,
  `cards_reviewed` int(10) unsigned NOT NULL DEFAULT 0,
  `session_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `study_sessions_deck_id_foreign` (`deck_id`),
  KEY `study_sessions_user_id_session_date_index` (`user_id`,`session_date`),
  CONSTRAINT `study_sessions_deck_id_foreign` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `study_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_sessions`
--

LOCK TABLES `study_sessions` WRITE;
/*!40000 ALTER TABLE `study_sessions` DISABLE KEYS */;
INSERT INTO `study_sessions` VALUES (1,5,NULL,1,'2026-07-20','2026-07-20 10:28:39','2026-07-20 10:28:39'),(2,5,3,6,'2026-07-24','2026-07-23 22:52:52','2026-07-23 22:53:20'),(3,5,4,2,'2026-07-24','2026-07-23 22:54:05','2026-07-23 22:54:35'),(4,7,6,1,'2026-07-24','2026-07-23 23:31:41','2026-07-23 23:31:41'),(5,5,2,6,'2026-07-24','2026-07-23 23:44:11','2026-07-23 23:44:17'),(6,7,6,6,'2026-07-27','2026-07-26 21:43:03','2026-07-26 21:43:40'),(7,5,NULL,1,'2026-07-27','2026-07-26 22:56:22','2026-07-26 22:56:22'),(8,7,2,6,'2026-07-27','2026-07-26 23:42:32','2026-07-26 23:42:39');
/*!40000 ALTER TABLE `study_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `study_purpose` enum('Career','JLPT Exam','Travel','Academic','General Interest') DEFAULT NULL,
  `level` enum('Beginner','Intermediate','Advanced') DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `otp` varchar(255) DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Tobira Admin','admin','admin@tobira.com','$2y$12$Zxu1tWuCDSHCzlLjTjuSM.QkmvUtXjaUFg2e4KCa4qvm9ptGGWi5m','1990-01-01','Career','Advanced',NULL,NULL,NULL,1,'2026-05-16 23:10:12',NULL,'2026-05-16 23:10:12','2026-05-16 23:10:12'),(2,'Nuvin','Amarasinghe','nuvinment777@gmail.com','$2y$12$bwNBOHa5pGWmDI.5ZV3O..a2ZjaOjXjZtN.Q7rmKcw7AJ6vvFQDR2','2006-06-12','Career','Intermediate',NULL,'621050','2026-05-16 23:55:08',0,NULL,NULL,'2026-05-16 23:45:08','2026-05-16 23:45:08'),(5,'Nuvin test','nuvintest','labs.nuvin@gmail.com','$2y$12$B1yjxGMWCH7YtVPLNRvkweobgA3GxnKX8UdzownoABUz9afAZWBxy','2006-06-12','General Interest','Intermediate',NULL,NULL,NULL,1,'2026-07-18 21:33:36',NULL,'2026-07-18 21:33:16','2026-07-18 21:33:58'),(6,'Isuru Madusara','isuru','isurumadusara99@gmail.com','$2y$12$lS/PPjQc9mO6tyHW1nGU4.locTM0SjI.7vghsJb9/8EIA8xEdLW8.','2006-05-25','Career','Intermediate',NULL,NULL,NULL,1,'2026-07-23 22:57:56',NULL,'2026-07-23 22:57:19','2026-07-23 22:58:11'),(7,'Methul Sarutha','methul','lwmethulsasrutha@gmail.com','$2y$12$F9Xkz8HSBQYLPk2p3c0xru0CVN6MH/QGdAHA2zV1VVD4QfLedGgMy','2006-11-13','JLPT Exam','Advanced',NULL,NULL,NULL,1,'2026-07-23 23:30:55',NULL,'2026-07-23 23:30:27','2026-07-23 23:31:25');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-14 10:59:15
