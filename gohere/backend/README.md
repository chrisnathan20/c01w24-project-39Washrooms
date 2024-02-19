# Setting Up: Backend
Follow the steps below to set-up the backend portion of the app.

## Prerequisites
Ensure you have the following:
1. Node.js installed : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
2. Clone the repository : Remember to checkout to the sprint-1 branch.
3.  PostgreSQL installed : [https://www.enterprisedb.com/downloads/postgres-postgresql-downloads]

If you do the labs with the same device, you should already have Node.js and Expo Go. Just need to install PostgreSQL and clone the repository.

## PostgreSQL Installation

1. Go to  [https://www.enterprisedb.com/downloads/postgres-postgresql-downloads](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).

2. Download the latest version of the installer (**PostgreSQL Version 16.2**).
3.  Once downloaded open the .exe file.
4.  In the **Select Components** section, ensure all boxes are checked.
5.  In the **Password** section, set password to "**1**".
6.  In the **Port** section, leave port as "**5432**".
7.  Click next for the other sections.
8.  In the **Completing the PostgreSQL Setup Wizard** section, uncheck the Stack Builder box, you do not need this for now.
9. Click Finish
10. In your computer's Search bar, search and open **pgAdmin 4**. 

## pgAdmin: Setting Up the Database

1. open pgAdmin 4

2. Navigate to **Object Explorer** section on the left.
3. Expand **Servers** >  Expand **Databases** > Click **postgres**.
4. Click **Query Tool** icon (top left, beside Object Explorer).
5. In the newly opened query tool copy-paste the code written in **database.sql**.

```SQL
CREATE DATABASE gohere; 

CREATE TABLE testconnection( 
connectionstatus VARCHAR(50) PRIMARY KEY NOT NULL 
); 

INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup admin app'); 
INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup user app'); 

```
6. Select the first line and click the **execute script** button (the triangle icon above your query) this will create a new database.
```SQL
CREATE DATABASE gohere; 
```
7. Expand the connection dropdown (the bar on top of your query saying "postgres/postgres@PostgreSQL 16") 
8. and click **< New Connection... >**

9. Change database to **gohere** > Save.
10. Now on Object Explorer right click on **Databases** > Refresh.
11. Now you should see a new gohere database.
12. Now select the rest of the code and execute script, this will create a table called test connection and insert 2 string items.
```SQL
CREATE TABLE testconnection( 
connectionstatus VARCHAR(50) PRIMARY KEY NOT NULL 
); 

INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup admin app'); 
INSERT INTO testconnection (connectionstatus) VALUES ('Successfully setup user app'); 
```
13. to check if your database has been set up correctly type "SELECT * FROM testconnection;" and execute it. You should get the following table in your terminal:
```SQL
SELECT * FROM testconnection; 
```
Terminal output:
|  | connectionstatus  | 
 |----------|----------|----------|  
 |  1 | Successfully setup admin app  |
  |  2  |  Successfully setup user app  |

# Running the Backend
> Before starting this ensure that the Database has been properly set up and repository has been cloned
1. Go to the **backend** directory
```
...\c01w24-project-39Washrooms\gohere\backend
```
2. Open terminal in VS code and run "**npm install**"

3. Then run "**npm run dev**"

4. If done correctly should see "**Server is running on http://localhost:4000**" in the terminal.

