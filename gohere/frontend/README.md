# Setting Up: Frontend
Follow the steps below to set-up the backend portion of the app.

## Prerequisites
Ensure you have the following:
1.  Expo Go installed: [https://expo.dev/client](https://expo.dev/client)
2.  Finished setting up the Backend : Refer to the README file in the backend directory.

## Running the Frontend

1. go to the **gohere-admin-app** directory
```
...\c01w24-project-39Washrooms\gohere\frontend\gohere-app
```
2. Open terminal in VS code and run "**npm install**"
3. Then run "**npm start**".
4. If the setup for both frontend and backend went well you should see the web displaying **"Successfully setup user app"**
5. Redo the steps above but now in the **gohere-admin-app** directory. The web should display **Successfully setup admin app**

## Troubleshooting
If web shows "**no connection to backend**", it is most likely caused by the database not being connected properly. Recheck the names of the database and tables to ensure that they are correct. Ensure that the password is set to "1" and the port for the database is "5432". 

