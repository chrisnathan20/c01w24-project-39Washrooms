-- CREATE DATABASE gohere;

-- The BusinessOwners table consists of all the business owners who have chosen their washrooms to be in our GoHere system
-- Businesses are identified by their unique email addresses
CREATE TABLE BusinessOwners (
    email           VARCHAR(30) PRIMARY KEY,
    password        VARCHAR(60) NOT NULL,
    businessName    VARCHAR(30) NOT NULL,
    sponsorship     INTEGER NOT NULL DEFAULT 0, -- 0: Basic, 1: Bronze, 2: Silver, 3: Gold
    imageTwo        BYTEA,
    imageThree      BYTEA,
    description     VARCHAR(100));

-- The BusinessDonations table contains all the donations made by businesses
CREATE TABLE BusinessDonations (
    email           VARCHAR(30) PRIMARY KEY,
    amount          NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    donationDate    DATE,
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The PlatinumBusinesses table contain the top three business of every month
CREATE TABLE RubyBusiness (
    email             VARCHAR(30) PRIMARY KEY,
    banner            VARCHAR(255) NOT NULL,
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The Washroom table contains all details about washrooms that has been submitted by the businesses and regular users
CREATE TABLE Washrooms (
    washroomId          INTEGER PRIMARY KEY,
    email	            VARCHAR(30),
    washroomName	    VARCHAR(30) NOT NULL,
    longitude           DECIMAL NOT NULL,
    latitude            DECIMAL NOT NULL,
    openingHours         TIME[7],
    closingHours         TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    city                VARCHAR(30),
    province            VARCHAR(5),
    postalCode          VARCHAR(10) NOT NULL,
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The Report table contains all reports submitted by GoHere app users
CREATE TABLE Report (
    reportId            INTEGER PRIMARY KEY,
    locationId          INTEGER NOT NULL REFERENCES Washrooms(washroomId) ON DELETE RESTRICT,
    reason	            INTEGER NOT NULL,
    reportTime          TIMESTAMP NOT NULL);

-- The BusinessApplication table contains all applications that businesses have submittd in order to register their business into the GoHere system
CREATE TABLE BusinessApplication (
    applicationId       INTEGER PRIMARY KEY,
    email	            VARCHAR(20) NOT NULL,
    locationName	    VARCHAR(20) NOT NULL,
    status              INTEGER NOT NULL, 
    longitude           DECIMAL NOT NULL UNIQUE,
    latitude            DECIMAL NOT NULL UNIQUE,
    openingHours         TIME[7],
    closingHours         TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    city                VARCHAR(30),
    province            VARCHAR(5),
    postalCode          VARCHAR(10) NOT NULL,
    additionalDetails   VARCHAR(100),
    imageOne            BYTEA,
    imageTwo            BYTEA,
    imageThree          BYTEA,
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The PublicApplication are all the applications GoHere app users have submitted to register a washroom into the GoHere system       
CREATE TABLE PublicApplication (
    applicationId       SERIAL PRIMARY KEY,
    locationName	    VARCHAR(20) NOT NULL,
    status              INTEGER NOT NULL,
    longitude           DECIMAL NOT NULL UNIQUE,
    latitude            DECIMAL NOT NULL UNIQUE,
    openingHours         TIME[7],
    closingHours         TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    city                VARCHAR(30),
    province            VARCHAR(5),
    postalCode          VARCHAR(10),
    additionalDetails   VARCHAR(100),

    imageOne            VARCHAR(255),
    imageTwo            VARCHAR(255),
    imageThree          VARCHAR(255));

 -- create a table for storing news info
CREATE TABLE News (
    newsId              SERIAL PRIMARY KEY,
    newsUrl	            VARCHAR(500) NOT NULL,
    headline            VARCHAR(100) NOT NULL,
    newsDate            DATE NOT NULL,
    cardImage            VARCHAR(255) NOT NULL,
    bannerImage           VARCHAR(255) NOT NULL);   

-- this is just to test initial setup
CREATE TABLE testconnection(
    connectionstatus VARCHAR(50) PRIMARY KEY NOT NULL
);

INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup admin app');
INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup user app');

-- mock database entries for API development
INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('mock@business.com', '1', 'Basic Business', 0);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('bronze@business.com', '1', 'Bronze Business', 1);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('silver@business.com', '1', 'Silver Business', 2);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('gold@business.com', '1', 'Gold Business', 3);

INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('ruby@business.com', '1', 'Ruby Business', 3);

INSERT INTO RubyBusiness (email) VALUES ('ruby@business.com');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (1, 'bronze@business.com', 'Bronze Washroom', -79.255925, 43.773509, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '123 Mock Street', 'M0C 0K1', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (2, 'silver@business.com', 'Silver Washroom', -79.258508, 43.777109, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '456 Mock Drive', 'M0C 0K2', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (3, 'gold@business.com', 'Gold Washroom', -79.25136341839746, 43.77406336459605, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '789 Mock Hallway', 'M0D 0K3', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (4, null, 'Public Washroom 4', -79.25275149516722, 43.77147621079455, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '101 Mock Avenue', 'M0E 0K4', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (5, 'ruby@business.com', 'Ruby Washroom', -79.25100578778502, 43.77270892981182, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '202 Mock Lane', 'M0F 0K5', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (6, 'mock@business.com', 'Basic Washroom', -79.25403390014448, 43.774044700506856, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '202 Some Lane', 'M0A 4R5', 'Scarborough', 'ON');

-- Mock Washrooms around UTSC for Demo
INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (7, 'mock@business.com', 'Instructional Centre', -79.18944690907648, 43.78673656421037, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1095 Military Trail', 'M1C 5J9', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (8, 'mock@business.com', 'Centennial College Morningside', -79.19307806696587, 43.786375987944496, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '755 Morningside Ave', 'M1C 4Z4', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (9, 'mock@business.com', 'Highland Hall', -79.18594117370135, 43.78466852399364, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A4', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (10, 'mock@business.com', 'Student Centre', -79.18705002508955, 43.78494404294854,
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A3', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (11, 'mock@business.com', 'Pan Am Sports Centre', -79.19449710102484, 43.79062082358538,
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '875 Morningside Ave', 'M1C 0C7', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (12, 'mock@business.com', 'Science Wing', -79.18857225341199, 43.783310502205474, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A4', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (13, 'mock@business.com', 'Humanities Wing', -79.18706003061244, 43.78283192264464, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1265 Military Trail', 'M1C 1A4', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (14, 'mock@business.com', 'Google B41', -122.0856086, 37.4224082, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1600 Amphitheatre Pkwy Building 41', '94043', 'Mountain View', 'CA');
    
INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (15, 'mock@business.com', 'Google B42', -122.0880254, 37.4218232, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '1600 Amphitheatre Pkwy Building 42', '94043', 'Mountain View', 'CA');
