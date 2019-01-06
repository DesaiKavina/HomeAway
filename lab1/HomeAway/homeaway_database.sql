-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2018 at 07:55 AM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `homeaway_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `checkproperty`
--

CREATE TABLE IF NOT EXISTS `checkproperty` (
  `Srno` int(3) NOT NULL,
  `propertyName` varchar(30) DEFAULT NULL,
  `ownerEmail` varchar(30) DEFAULT NULL,
  `travelerEmail` varchar(30) DEFAULT NULL,
  `blockStart` varchar(20) DEFAULT NULL,
  `blockEnd` varchar(20) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `checkproperty`
--

INSERT INTO `checkproperty` (`Srno`, `propertyName`, `ownerEmail`, `travelerEmail`, `blockStart`, `blockEnd`) VALUES
(1, 'Vegas property', 'owner@owner.com', 'adamsmith23@gmail.com', '2019-01-02', '2019-01-07'),
(2, 'SF property', 'randomowner@gmail.com', 'adamsmith23@gmail.com', '2018-12-15', '2018-12-18'),
(5, 'Miami property', 'owner@owner.com', 'randomtraveler@gmail.com', '2018-11-01', '2018-11-07'),
(7, 'TreeHome Las Vegas', 'michael@gmail.com', 'rachel123@gmail.com', '2018-11-02', '2018-10-07');

-- --------------------------------------------------------

--
-- Table structure for table `propertydetails`
--

CREATE TABLE IF NOT EXISTS `propertydetails` (
  `email` varchar(40) NOT NULL,
  `country` varchar(20) NOT NULL,
  `address` varchar(100) NOT NULL,
  `city` varchar(20) NOT NULL,
  `state` varchar(20) NOT NULL,
  `zipcode` int(10) NOT NULL,
  `propertyName` varchar(50) NOT NULL,
  `propertyDescription` varchar(500) NOT NULL,
  `propertyType` varchar(15) NOT NULL,
  `bedrooms` int(3) NOT NULL,
  `bathrooms` int(3) NOT NULL,
  `accomodates` int(4) NOT NULL,
  `imageFiles` varchar(1000) DEFAULT NULL,
  `availableStart` varchar(20) NOT NULL,
  `availableEnd` varchar(20) NOT NULL,
  `pricePerNight` int(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `propertydetails`
--

INSERT INTO `propertydetails` (`email`, `country`, `address`, `city`, `state`, `zipcode`, `propertyName`, `propertyDescription`, `propertyType`, `bedrooms`, `bathrooms`, `accomodates`, `imageFiles`, `availableStart`, `availableEnd`, `pricePerNight`) VALUES
('randomowner@gmail.com', 'United States', '245 San Carlos street', 'Bloomington', 'Indiana', 45778, 'Bloomington property', 'This is a very beautiful condo', 'Condo', 5, 5, 15, 'C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\propertyimage1.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\propertyimage2.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\propertyimage3.jpg', '2018-10-08', '2018-11-03', 195),
('owner@owner.com', 'United States', '343 Canterra park', 'Miami', 'Florida', 98337, 'Miami property', 'This property has its own private beach', 'House', 4, 4, 12, 'C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\beachhouse.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\beachhouse1.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\beachhouse2.jpg', '2018-10-01', '2018-12-31', 250),
('rohanp@gmail.com', 'India', 'Bandra linking road', 'Mumbai', 'Maharashtra', 78002, 'Oyo Room Mumbai', 'This property is located quite near to sightseeing spots', 'Bungalow', 3, 3, 6, 'C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\mumbai1.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\mumbai2.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\mumbai3.jpg', '2018-10-22', '2018-12-22', 130),
('randomowner@gmail.com', 'United States', '201 south market street', 'San Francisco', 'California', 95334, 'SF property', 'This SF property has a good neighborhood', 'Apartment', 2, 2, 4, 'C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\sf_image1.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\sf_image2.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\sf_image3.jpg', '2018-11-01', '2019-01-31', 210),
('michael@gmail.com', 'United States', '223 Treehome residency', 'Las Vegas', 'Nevada', 67002, 'TreeHome Las Vegas', 'This bungalow is quite spacious and it has its own swimming pool', 'Bungalow', 5, 5, 12, 'C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\lasvegas1.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\lasvegas2.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\lasvegas3.jpg', '2018-11-01', '2018-12-31', 260),
('owner@owner.com', 'United States', '223 Ceasers palace', 'Las Vegas', 'Nevada', 95002, 'Vegas property', 'This las vegas property is huge', 'House', 4, 4, 8, 'C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\condo1.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\condo2.jpg,C:\\Users\\DELL\\Desktop\\SJSU\\Sem 1\\CMPE273-Shim\\CMPE273-16\\lab1\\HomeAway\\backend\\uploads\\condo3.jpg', '2018-10-15', '2019-02-28', 270);

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE IF NOT EXISTS `userinfo` (
  `Srno` int(5) NOT NULL,
  `firstname` varchar(15) NOT NULL,
  `lastname` varchar(15) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `aboutme` varchar(100) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL,
  `company` varchar(30) DEFAULT NULL,
  `school` varchar(40) DEFAULT NULL,
  `hometown` varchar(20) DEFAULT NULL,
  `languages` varchar(40) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `phoneno` int(13) DEFAULT NULL,
  `userflag` varchar(2) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userinfo`
--

INSERT INTO `userinfo` (`Srno`, `firstname`, `lastname`, `email`, `password`, `aboutme`, `city`, `country`, `company`, `school`, `hometown`, `languages`, `gender`, `profileImage`, `phoneno`, `userflag`) VALUES
(5, 'Adam', 'Smith', 'adamsmith23@gmail.com', 'adam', 'I currently work as a data engineer', 'San Francisco', 'United States', 'IBM', 'New High School', 'San Francisco', 'English, French', 'Male', 'DSCN6303.JPG', 2147483647, 'T'),
(1, 'admin', 'admin', 'admin@admin.com', 'admin', 'I am the admin traveler', 'San Diego', 'United States', 'Kulture enterprises', 'St. Xaviers ', 'San Diego', 'English', 'Male', 'admin_image.png', 2147483647, 'T'),
(6, 'Michael', 'Ross', 'michael@gmail.com', 'mike', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'O'),
(2, 'owner', 'owner', 'owner@owner.com', 'owner', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'O'),
(7, 'Rachel', 'Greene', 'rachel123@gmail.com', 'rach', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'T'),
(4, 'random', 'owner', 'randomowner@gmail.com', 'rororo', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'O'),
(3, 'random', 'traveler', 'randomtraveler@gmail.com', 'rtrtrt', NULL, 'san jose', 'california', NULL, 'seventh day ', 'San Francisco', 'English, French', 'Male', NULL, 2147483647, 'T'),
(9, 'Rohan', 'Patil', 'rohanp@gmail.com', 'rohan', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'O');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checkproperty`
--
ALTER TABLE `checkproperty`
  ADD PRIMARY KEY (`Srno`), ADD KEY `propertyName` (`propertyName`);

--
-- Indexes for table `propertydetails`
--
ALTER TABLE `propertydetails`
  ADD PRIMARY KEY (`propertyName`);

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`email`), ADD UNIQUE KEY `Srno` (`Srno`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checkproperty`
--
ALTER TABLE `checkproperty`
  MODIFY `Srno` int(3) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `Srno` int(5) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `checkproperty`
--
ALTER TABLE `checkproperty`
ADD CONSTRAINT `checkproperty_ibfk_1` FOREIGN KEY (`propertyName`) REFERENCES `propertydetails` (`propertyName`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
