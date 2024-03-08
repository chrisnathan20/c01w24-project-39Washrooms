import express from "express";
import cors from "cors";
import pool from "./db.mjs";
import bcrypt from 'bcrypt';

const app = express();
const PORT = 4000;

const saltRounds = 10; //controls how encrypted the passwords are

app.use(cors());
app.use(express.json());

// prints out information about request received for easier debugging
app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

//connection checks to test if initial setup is successful
app.get("/testconnection/admin", async (req, res) => {
  try {
    const result = await pool.query("SELECT connectionstatus FROM testconnection WHERE connectionstatus ILIKE '%admin%';");
    res.json(result.rows[0].connectionstatus);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/testconnection/user", async (req, res) => {
  try {
    const result = await pool.query("SELECT connectionstatus FROM testconnection WHERE connectionstatus ILIKE '%user%';");
    res.json(result.rows[0].connectionstatus);
  } catch (err) {
    console.error(err.message);
  }
});

// get the 20 nearest washrooms to a given location (latitude, longitude) within a set radius
app.get("/nearbywashrooms", async (req, res) => {
  const radius = 5000;
  const washroom_count = 20;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  // Check if the required parameters are defined
  if (latitude == undefined || longitude == undefined) {
    res.status(422).json("Missing required parameters");
    return;
  }

  // Check if the required parameters are of the correct type
  if (isNaN(latitude) || isNaN(longitude)) {
    res.status(422).json("Invalid parameter type");
    return;
  }

  // inverse Haversine formula to calculate the bounding box of the search area for a given location and radius
  const earthRadius = 6371000; // Radius of the earth in meters

  // Convert latitude and longitude from degrees to radians
  const lat = latitude * Math.PI / 180;
  const lon = longitude * Math.PI / 180;

  // Calculate the bounding box
  const minLat = lat - (radius / earthRadius);
  const maxLat = lat + (radius / earthRadius);
  const minLon = lon - (radius / (earthRadius * Math.cos(lat)));
  const maxLon = lon + (radius / (earthRadius * Math.cos(lat)));

  // Convert latitude and longitude from radians to degrees
  const minLatDegrees = minLat * 180 / Math.PI;
  const maxLatDegrees = maxLat * 180 / Math.PI;
  const minLonDegrees = minLon * 180 / Math.PI;
  const maxLonDegrees = maxLon * 180 / Math.PI;

  // Filter the washrooms within the bounding box then use the Haversine formula to calculate the distance 
  // between the given location and the washroom location
  const query = `
    SELECT washroomid, washroomname, longitude, latitude, address1, address2, city, province, postalcode, distance
    FROM (
        SELECT *,
              ROUND((2 * ${earthRadius} * asin(sqrt(pow(sin((radians(latitude) - radians(${latitude})) / 2), 2)
              + cos(radians(${latitude})) * cos(radians(latitude)) * pow(sin((radians(longitude) 
              - radians(${longitude})) / 2), 2))))) AS distance
        FROM (SELECT * FROM washrooms WHERE latitude BETWEEN ${minLatDegrees} AND ${maxLatDegrees} AND 
                                            longitude BETWEEN ${minLonDegrees} AND ${maxLonDegrees}
        )
    )
    WHERE distance < ${radius}
    ORDER BY distance
    LIMIT ${washroom_count};
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows.map((row) => ({ ...row }))); // convert the result to an array of washrooms for easier use in the frontend
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/businesslogin", async (req, res) => {
  const { email } = req.query.email;

  // Check if the required parameters are defined
  if (email == undefined) {
    res.status(422).json("Missing required parameters");
    return;
  }
  // Execute the query to retrieve the email
  const query = `
      SELECT password
      FROM BusinessOwners
      WHERE email = $1
    `;
  try {
    //const result = await pool.query(query, [email]);
    const result = await pool.query(query, [email]);

    // If the email exists in the database, return it
    if (result.rows.length > 0) {
      res.status(200).json({ password: result.rows[0].password });
    } else {
      // If the email does not exist in the database, return an empty response
      res.status(404).json({ error: 'Email not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/businesssignup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const businessName = req.body.businessName;
  const sponsorship = "";
  const icon = null;
  const imageOne = null;
  const imageTwo = null;
  const imageThree = null;
  const description = "";

  // Hash the password
  //const hashedPassword = await bcrypt.hash(password, saltRounds);
  const hashedPassword = password;
  //sponsorship, icon, imageOne, imageTwo, imageThree, description
  // Check if the email already exists in the database
  const checkEmailQuery = `
  SELECT *
  FROM BusinessOwners
  WHERE email = $1
`;

  // Insert the new business owner into the database
  const insertQuery = `
      INSERT INTO BusinessOwners (email, password, businessName, sponsorship, icon, imageOne, imageTwo, imageThree, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

  try {
    const emailResult = await pool.query(checkEmailQuery, [email]);

    //if there already is an email 
    if (emailResult.rows.length > 0) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    await pool.query(insertQuery, [email, hashedPassword, businessName, sponsorship, icon, imageOne, imageTwo, imageThree, description]);

    res.status(201).json({ message: 'Business owner created successfully' });
  } catch (error) {
    console.error('Error creating business owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});