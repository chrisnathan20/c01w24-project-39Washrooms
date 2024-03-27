-- CREATE DATABASE gohere;

-- Initialize database tables
CREATE TABLE BusinessOwners (
    email           VARCHAR(30) PRIMARY KEY,
    password        VARCHAR(60) NOT NULL,
    businessName    VARCHAR(30) NOT NULL,
    sponsorship     INTEGER NOT NULL DEFAULT 0, -- 0: Basic, 1: Bronze, 2: Silver, 3: Gold
    imageOne        VARCHAR(255),
    imageTwo        VARCHAR(255),
    imageThree      VARCHAR(255),
    description     VARCHAR(255));

-- The BusinessDonations table contains all the donations made by businesses
CREATE TABLE BusinessDonations (
    donationId   SERIAL PRIMARY KEY,
    email           VARCHAR(30),
    amount          NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    donationDate    DATE,
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The PlatinumBusinesses table contain the top three business of every month
CREATE TABLE RubyBusiness (
    email             VARCHAR(30) PRIMARY KEY,
    banner            VARCHAR(255),
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The Washroom table contains all details about washrooms that has been submitted by the businesses and regular users
CREATE TABLE Washrooms (
    washroomId          SERIAL PRIMARY KEY,
    email	            VARCHAR(30),
    washroomName	    VARCHAR(30) NOT NULL,
    longitude           DECIMAL NOT NULL,
    latitude            DECIMAL NOT NULL,
    openingHours        TIME[7],
    closingHours        TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    city                VARCHAR(30),
    province            VARCHAR(5),
    postalCode          VARCHAR(10) NOT NULL,
    imageOne            VARCHAR(255),
    imageTwo            VARCHAR(255),
    imageThree          VARCHAR(255),
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The Report table contains all reports submitted by GoHere app users
CREATE TABLE Report (
    reportId            SERIAL PRIMARY KEY,
    locationId          INTEGER NOT NULL REFERENCES Washrooms(washroomId) ON DELETE RESTRICT,
    reportTime          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);

-- The BusinessApplication table contains all applications that businesses have submittd in order to register their business into the GoHere system
CREATE TABLE BusinessApplication (
    applicationId       SERIAL PRIMARY KEY,
    email	            VARCHAR(20) NOT NULL,
    locationName	    VARCHAR(20) NOT NULL,
    status              INTEGER NOT NULL, 
    longitude           DECIMAL NOT NULL,
    latitude            DECIMAL NOT NULL,
    openingHours        TIME[7],
    closingHours        TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    city                VARCHAR(30),
    province            VARCHAR(5),
    postalCode          VARCHAR(10) NOT NULL,
    additionalDetails   VARCHAR(100),
    imageOne            VARCHAR(255),
    imageTwo            VARCHAR(255),
    imageThree          VARCHAR(255),
	lastUpdated 		DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The PublicApplication are all the applications GoHere app users have submitted to register a washroom into the GoHere system       
CREATE TABLE PublicApplication (
    applicationId       SERIAL PRIMARY KEY,
    locationName	    VARCHAR(20) NOT NULL,
    status              INTEGER NOT NULL,
    longitude           DECIMAL NOT NULL,
    latitude            DECIMAL NOT NULL,
    openingHours        TIME[7],
    closingHours        TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    city                VARCHAR(30),
    province            VARCHAR(5),
    postalCode          VARCHAR(10),
    additionalDetails   VARCHAR(100),
    lastUpdated 		DATE DEFAULT CURRENT_DATE,
    imageOne            VARCHAR(255),
    imageTwo            VARCHAR(255),
    imageThree          VARCHAR(255));

 -- create a table for storing news info
CREATE TABLE News (
    newsId              SERIAL PRIMARY KEY,
    newsUrl	            VARCHAR(500) NOT NULL,
    headline            VARCHAR(100) NOT NULL,
    newsDate            DATE NOT NULL,
    cardImage           VARCHAR(255) NOT NULL,
    bannerImage         VARCHAR(255) NOT NULL); 

CREATE TABLE testconnection(
    connectionstatus VARCHAR(50) PRIMARY KEY NOT NULL
);

-- END OF INITIALIZATION --

-- Mock data for testing purposes

-- Mock Business
INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('mock@business.com', '1', 'UTSC', 0);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('bronze@business.com', '1', 'Bronze Business', 1);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('silver@business.com', '1', 'Silver Business', 2);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('gold@business.com', '1', 'Gold Business', 3);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('walmart@business.com', '1', 'Walmart', 3);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('prevruby1@business.com', '1', 'World Mart', 3);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('prevruby2@business.com', '1', 'Platinum Coffee', 3);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('ruby@business.com', '1', 'Pharmacy Shop', 3);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('hello@gmail.com', '1', 'Hello Donuts', 1);



-- Mock Basic/Public Washroom

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES ('mock@business.com', 'Instructional Centre', -79.18944690907648, 43.78673656421037, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1095 Military Trail', 'M1C 5J9', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES ('mock@business.com', 'Centennial College Morningside', -79.19307806696587, 43.786375987944496, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '755 Morningside Ave', 'M1C 4Z4', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES ('mock@business.com', 'Highland Hall', -79.18594117370135, 43.78466852399364, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A4', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES ('mock@business.com', 'Student Centre', -79.18705002508955, 43.78494404294854,
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A3', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES ('mock@business.com', 'Pan Am Sports Centre', -79.19449710102484, 43.79062082358538,
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '875 Morningside Ave', 'M1C 0C7', 'Scarborough', 'ON');

INSERT INTO Washrooms ( email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES ('mock@business.com', 'Science Wing', -79.18857225341199, 43.783310502205474, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A4', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES ('mock@business.com', 'Humanities Wing', -79.18706003061244, 43.78283192264464, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A4', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (null, 'Gas Station Public Washroom', -79.25096865061427, 43.77189447635052, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1651 Ellesmere Rd', 'M1H 2V4', 'Scarborough', 'ON');

INSERT INTO Washrooms ( email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES ('mock@business.com', 'Bar&Grill Washroom', -79.25403390014448, 43.774044700506856, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '55 Town Centre Court', 'M1P 4X4', 'Scarborough', 'ON');


-- Mock Tiered Washroom
INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES ('bronze@business.com', 'Gong Cha Washroom', -79.255925, 43.773509, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '60 Town Centre Court', 'M1P 0B1', 'Scarborough', 'ON');


INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES ('ruby@business.com', 'Shoppers Washroom', -79.25100578778502, 43.77270892981182, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1235 McCowan Rd', 'M1H 3K3', 'Scarborough', 'ON');


INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES ('walmart@business.com', 'Walmart Washroom', -79.20045499041872, 43.79736949211188, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '799 Milner Ave', 'M1B3C3', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES ('gold@business.com', 'FreshCo Washroom', -79.25136341839746, 43.77406336459605, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1255 McCowan Rd', 'M1H 2K3', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES ('silver@business.com', 'Cineplex Washroom', -79.258508, 43.777109, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '300 Borough Dr', 'M1P 4P5', 'Scarborough', 'ON');

INSERT INTO Washrooms (email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES ('silver@business.com', 'Long&Mcquade Washroom',  -79.19753911076802, 43.798875184582684, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '863 Milner Ave', 'M1B 5N6', 'Scarborough', 'ON');

-- Mock BO Donations
INSERT INTO BusinessDonations (email, amount, donationDate)
VALUES
('silver@business.com', 50.00, '2024-02-01'),
('bronze@business.com', 15.00, '2024-02-01'),
('ruby@business.com', 150.00, '2024-02-01'),
('prevruby1@business.com', 178.00, '2024-02-01'),
('prevruby2@business.com', 144.00, '2024-02-01'),
('gold@business.com', 90.00, '2024-03-01'),
('ruby@business.com', 110.00, '2024-03-01'),
('walmart@business.com', 133.00, '2024-03-03');

-- Mock Ruby List
INSERT INTO RubyBusiness (email)
VALUES 
('ruby@business.com'),
('prevruby1@business.com'),
('prevruby2@business.com');


-- Mock BO Applications

INSERT INTO BusinessApplication (email, locationName, status, longitude, latitude, openingHours, closingHours, address1, address2, city, province, postalCode)
VALUES
-- Status 0: Pending
('hello@gmail.com', 'Washroom 1A', 0, -79.38, 43.65, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '123 Main St', 'Suite 100', 'Toronto', 'ON', 'M5A 1B2'),
('hello@gmail.com', 'Washroom 1B', 0, -79.39, 43.66, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '456 Elm St', 'Unit 200', 'Toronto', 'ON', 'M5B 3C3'),
('hello@gmail.com', 'Washroom 1C', 0, -79.40, 43.67, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '789 Oak St', 'Apt 300', 'Toronto', 'ON', 'M5C 4D4'),
('hello@gmail.com', 'Washroom 1D', 0, -79.41, 43.68, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1010 Pine St', 'Apt 400', 'Toronto', 'ON', 'M5D 5E5'),

-- Status 1: Pre-screening
('hello@gmail.com', 'Washroom 2A', 1, -79.42, 43.69, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1111 Birch St', 'Apt 500', 'Toronto', 'ON', 'M5E 6F6'),
('hello@gmail.com', 'Washroom 2B', 1, -79.43, 43.70, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1212 Cedar St', 'Apt 600', 'Toronto', 'ON', 'M5F 7G7'),

-- Status 2: On-site review
('hello@gmail.com', 'Washroom 3A', 2, -79.45, 43.72, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1313 Maple St', 'Apt 700', 'Toronto', 'ON', 'M5G 8H8'),
('hello@gmail.com', 'Washroom 3B', 2, -79.46, 43.73, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1414 Spruce St', 'Apt 800', 'Toronto', 'ON', 'M5H 9J9'),
('hello@gmail.com', 'Washroom 3C', 2, -79.47, 43.74, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1515 Willow St', 'Apt 900', 'Toronto', 'ON', 'M5I 0A0'),
('hello@gmail.com', 'Washroom 3D', 2, -79.48, 43.75, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1616 Oak St', 'Apt 1000', 'Toronto', 'ON', 'M5J 1P1'),

-- Status 3: Final review
('hello@gmail.com', 'Washroom 4A', 3, -79.49, 43.76, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1717 Pine St', 'Apt 1100', 'Toronto', 'ON', 'M5K 2Q2'),
('hello@gmail.com', 'Washroom 4B', 3, -79.50, 43.77, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '1818 Cedar St', 'Apt 1200', 'Toronto', 'ON', 'M5L 3R3'),

-- Status 4: Accepted
('hello@gmail.com', 'Washroom 5A', 4, -79.52, 43.79, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '2020 Maple St', 'Apt 1300', 'Toronto', 'ON', 'M5M 4S4'),
('hello@gmail.com', 'Washroom 5B', 4, -79.53, 43.80, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '2121 Elm St', 'Apt 1400', 'Toronto', 'ON', 'M5N 5S5'),
('hello@gmail.com', 'Washroom 5C', 4, -79.54, 43.81, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '2222 Spruce St', 'Apt 1500', 'Toronto', 'ON', 'M5O 6T6'),
('hello@gmail.com', 'Washroom 5D', 4, -79.55, 43.82, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '2323 Willow St', 'Apt 1600', 'Toronto', 'ON', 'M5P 7U7'),

-- Status 5: Rejected
('hello@gmail.com', 'Washroom 6A', 5, -79.56, 43.83, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '2424 Oak St', 'Apt 1700', 'Toronto', 'ON', 'M5Q 8V8'),
('hello@gmail.com', 'Washroom 6B', 5, -79.57, 43.84, ARRAY[TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00', TIME '09:00'], ARRAY[TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00', TIME '17:00'], '2525 Pine St', 'Apt 1800', 'Toronto', 'ON', 'M5R 9W9');


-- Mock Public Applications

INSERT INTO PublicApplication 
(locationName, status, longitude, latitude, openingHours, closingHours, address1, address2, city, province, postalCode, additionalDetails)
VALUES 
('Washroom 1', 0, -123.1207, 49.2827, '{09:00:00, 09:00:00, 09:00:00, 09:00:00, 09:00:00, 09:00:00, 09:00:00}', '{17:00:00, 17:00:00, 17:00:00, 17:00:00, 17:00:00, 17:00:00, 17:00:00}', '123 Main St', 'Suite 101', 'Vancouver', 'BC', 'V6B 3P7', 'First floor, near entrance.'),
('Washroom 2', 1, -123.1340, 49.2900, '{08:00:00, 08:00:00, 08:00:00, 08:00:00, 08:00:00, 08:00:00, 08:00:00}', '{18:00:00, 18:00:00, 18:00:00, 18:00:00, 18:00:00, 18:00:00, 18:00:00}', '456 Elm St', 'Suite 202', 'Vancouver', 'BC', 'V6B 4N9', 'Second floor, near the cafeteria.'),
('Washroom 3', 2, -123.1410, 49.2630, '{07:00:00, 07:00:00, 07:00:00, 07:00:00, 07:00:00, 07:00:00, 07:00:00}', '{19:00:00, 19:00:00, 19:00:00, 19:00:00, 19:00:00, 19:00:00, 19:00:00}', '789 Pine St', 'Suite 303', 'Vancouver', 'BC', 'V6B 2B1', 'Third floor, near the conference room.'),
('Washroom 4', 3, -123.1010, 49.2730, '{06:00:00, 06:00:00, 06:00:00, 06:00:00, 06:00:00, 06:00:00, 06:00:00}', '{20:00:00, 20:00:00, 20:00:00, 20:00:00, 20:00:00, 20:00:00, 20:00:00}', '1012 Oak St', 'Suite 404', 'Vancouver', 'BC', 'V6B 3M1', 'Fourth floor, near the library.'),
('Washroom 5', 4, -123.1150, 49.2750, '{10:00:00, 10:00:00, 10:00:00, 10:00:00, 10:00:00, 10:00:00, 10:00:00}', '{16:00:00, 16:00:00, 16:00:00, 16:00:00, 16:00:00, 16:00:00, 16:00:00}', '1314 Maple St', 'Suite 505', 'Vancouver', 'BC', 'V6B 5K2', 'Fifth floor, near the gym.'),
('Washroom 6', 5, -123.1100, 49.2670, '{11:00:00, 11:00:00, 11:00:00, 11:00:00, 11:00:00, 11:00:00, 11:00:00}', '{15:00:00, 15:00:00, 15:00:00, 15:00:00, 15:00:00, 15:00:00, 15:00:00}', '1618 Birch St', 'Suite 606', 'Vancouver', 'BC', 'V6B 6N3', 'Sixth floor, near the rooftop garden.');


--Mock Report

-- Insert two reports for "Past 3 hours"
INSERT INTO Report (locationId, reportTime) VALUES
(1, NOW() - INTERVAL '1 hour'),
(1, NOW() - INTERVAL '2 hours');

-- Insert two reports for "Past 48 hours" (but not in the past 3 hours)
INSERT INTO Report (locationId, reportTime) VALUES
(1, NOW() - INTERVAL '4 hours'),
(1, NOW() - INTERVAL '30 hours');

-- Insert two reports for "Past week" (but not in the past 48 hours)
INSERT INTO Report (locationId, reportTime) VALUES
(1, NOW() - INTERVAL '3 days'),
(1, NOW() - INTERVAL '5 days');

-- Insert two reports for "Past month" (but not in the past week)
INSERT INTO Report (locationId, reportTime) VALUES
(1, NOW() - INTERVAL '10 days'),
(1, NOW() - INTERVAL '20 days');

-- Insert two reports for "Past year" (but not in the past month)
INSERT INTO Report (locationId, reportTime) VALUES
(1, NOW() - INTERVAL '2 months'),
(1, NOW() - INTERVAL '6 months');

-- Insert two reports for "All time" (but not in the past year)
INSERT INTO Report (locationId, reportTime) VALUES
(1, NOW() - INTERVAL '2 years'),
(1, NOW() - INTERVAL '3 years');

-- Reports for washroom with locationId 2
-- Insert two reports for "Past 3 hours"
INSERT INTO Report (locationId, reportTime) VALUES
(2, NOW() - INTERVAL '1 hour'),
(2, NOW() - INTERVAL '2 hours');

-- Insert two reports for "Past 48 hours" (but not in the past 3 hours)
INSERT INTO Report (locationId, reportTime) VALUES
(2, NOW() - INTERVAL '4 hours'),
(2, NOW() - INTERVAL '30 hours');

-- Insert two reports for "Past week" (but not in the past 48 hours)
INSERT INTO Report (locationId, reportTime) VALUES
(2, NOW() - INTERVAL '3 days'),
(2, NOW() - INTERVAL '5 days');

-- Reports for washroom with locationId 3
-- Insert two reports for "Past month" (but not in the past week)
INSERT INTO Report (locationId, reportTime) VALUES
(3, NOW() - INTERVAL '10 days'),
(3, NOW() - INTERVAL '20 days');

-- Insert two reports for "Past year" (but not in the past month)
INSERT INTO Report (locationId, reportTime) VALUES
(3, NOW() - INTERVAL '2 months'),
(3, NOW() - INTERVAL '6 months');

-- Insert two reports for "All time" (but not in the past year)
INSERT INTO Report (locationId, reportTime) VALUES
(3, NOW() - INTERVAL '2 years'),
(3, NOW() - INTERVAL '3 years');

-- Insert two reports for "All time" for locationId 5
INSERT INTO Report (locationId, reportTime) VALUES
(5, NOW() - INTERVAL '2 years'),
(5, NOW() - INTERVAL '3 years');

-- Insert two reports for "All time" for locationId 6
INSERT INTO Report (locationId, reportTime) VALUES
(6, NOW() - INTERVAL '2 years'),
(6, NOW() - INTERVAL '3 years');

-- Insert two reports for "All time" for locationId 7
INSERT INTO Report (locationId, reportTime) VALUES
(7, NOW() - INTERVAL '2 years'),
(7, NOW() - INTERVAL '3 years');

-- Insert two reports for "All time" for locationId 8
INSERT INTO Report (locationId, reportTime) VALUES
(8, NOW() - INTERVAL '2 years'),
(8, NOW() - INTERVAL '3 years');

-- Insert two reports for "All time" for locationId 9
INSERT INTO Report (locationId, reportTime) VALUES
(9, NOW() - INTERVAL '2 years'),
(9, NOW() - INTERVAL '3 years');