-- CREATE DATABASE gohere;

-- The BusinessOwners table consists of all the business owners who have chosen their washrooms to be in our GoHere system
-- Businesses are identified by their unique email addresses
CREATE TABLE BusinessOwners (
    email           VARCHAR(30) PRIMARY KEY,
    password        VARCHAR(30) NOT NULL,
    businessName    VARCHAR(30) NOT NULL,
    sponsorship     VARCHAR(20) NOT NULL,
    icon            BYTEA,
    imageOne        BYTEA,
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
CREATE TABLE PlatinumBusiness (
    email             VARCHAR(30) PRIMARY KEY,
    banner            BYTEA,
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
    applicationId       INTEGER PRIMARY KEY,
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
    imageOne            BYTEA,
    imageTwo            BYTEA,
    imageThree          BYTEA);
        

-- this is just to test initial setup
CREATE TABLE testconnection(
    connectionstatus VARCHAR(50) PRIMARY KEY NOT NULL
);

INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup admin app');
INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup user app');

-- mock database entries for API development
INSERT INTO BusinessOwners (email, password, businessName, sponsorship) 
VALUES ('mock@business.com', '1', 'Mock Business', 'Basic');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (1, 'mock@business.com', 'Mock Washroom 1', -79.255925, 43.773509, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '123 Mock Street', 'M0C 0K1', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (2, 'mock@business.com', 'Mock Washroom 2', -79.258508, 43.777109, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '456 Mock Drive', 'M0C 0K2', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province)
VALUES (3, 'mock@business.com', 'Mock Washroom 3', -79.257084, 43.772374, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '789 Mock Hallway', 'M0D 0K3', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (4, 'mock@business.com', 'Mock Washroom 4', -79.260508, 43.780709, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '101 Mock Avenue', 'M0E 0K4', 'Scarborough', 'ON');

INSERT INTO Washrooms (washroomId, email, washroomName, longitude, latitude, openingHours, closingHours, address1, postalCode, city, province) 
VALUES (5, 'mock@business.com', 'Mock Washroom 5', -79.264308, 43.794309, 
    ARRAY[TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00', TIME '00:00:00'], 
    ARRAY[TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59', TIME '23:59:59'], 
    '202 Mock Lane', 'M0F 0K5', 'Scarborough', 'ON');
