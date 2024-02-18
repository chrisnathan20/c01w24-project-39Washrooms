CREATE DATABASE gohere;

CREATE TABLE testconnection(
    connectionstatus VARCHAR(50) PRIMARY KEY NOT NULL
);

INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup admin app');
INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup user app');