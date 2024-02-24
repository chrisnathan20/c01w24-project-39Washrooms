DROP SCHEMA IF EXISTS gohere CASCADE;
CREATE SCHEMA gohere;
SET search_path TO gohere;

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

-- The Location table contains all details about a business' location that has been submitted by the business 
-- when registering themselves into the GoHere system
CREATE TABLE Location (
    locationId          INTEGER PRIMARY KEY,
    email	            VARCHAR(30) NOT NULL,
    locationName	    VARCHAR(30) NOT NULL,
    xcoordinate         DECIMAL NOT NULL,
    ycoordinate         DECIMAL NOT NULL,
    openingHour         TIME[7],
    closingHour         TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    postalCode          VARCHAR(10) NOT NULL
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The Report table contains all reports submitted by GoHere app users
CREATE TABLE Report (
    reportId            INTEGER PRIMARY KEY,
    locationId          INTEGER NOT NULL REFERENCES Location(locationId) ON DELETE RESTRICT,
    reason	            INTEGER NOT NULL,
    reportTime          TIMESTAMP NOT NULL);

-- The BusinessApplication table contains all applications that businesses have submittd in order to register their business into the GoHere system
CREATE TABLE BusinessApplication (
    applicationId       INTEGER PRIMARY KEY,
    email	            VARCHAR(20) NOT NULL,
    locationName	    VARCHAR(20) NOT NULL,
    status              INTEGER NOT NULL, 
    xcoordinate         DECIMAL NOT NULL UNIQUE,
    ycoordinate         DECIMAL NOT NULL UNIQUE,
    openingHour         TIME[7],
    closingHour         TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
    postalCode          VARCHAR(10) NOT NULL,
    additionalDetails   VARCHAR(100),
    imageOne            BYTEA,
    imageTwo            BYTEA,
    imageThree          BYTEA
    FOREIGN KEY (email) REFERENCES BusinessOwners(email) ON DELETE RESTRICT);

-- The PublicApplication are all the applications GoHere app users have submitted to register a washroom into the GoHere system       
CREATE TABLE PublicApplication (
    applicationId       INTEGER PRIMARY KEY,
    locationName	    VARCHAR(20) NOT NULL,
    status              INTEGER NOT NULL,
    xcoordinate         DECIMAL NOT NULL UNIQUE,
    ycoordinate         DECIMAL NOT NULL UNIQUE,
    openingHour         TIME[7],
    closingHour         TIME[7],
    address1            VARCHAR(100) NOT NULL,
    address2            VARCHAR(100),
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