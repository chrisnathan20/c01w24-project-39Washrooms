import express, { response } from "express";
import cors from "cors";
import pool from "./db.mjs";
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 4000;
const saltRounds = 10;

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

app.get("/nearbywashroomsalongroute", async (req, res) => {
  const steps = req.query.steps;
  if (steps == undefined) {
    res.status(422).json("Missing required parameters" );
    return;
  }

  const radius = 1500;
  const earthRadius = 6371000; // Radius of the earth in meters
  const decodedSteps = JSON.parse(decodeURIComponent(steps));

  let washrooms = [];

  console.log(decodedSteps);
  for (let i = 0; i < decodedSteps.length; i++) {
    let latitude = decodedSteps[i].latitude;
    let longitude = decodedSteps[i].longitude;
    // Check if the required parameters are defined
    if (latitude == undefined || longitude == undefined) {
      res.status(422).json("Missing required parameters" );
      return;
    }

    // Check if the required parameters are of the correct type
    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(422).json("Invalid parameter type");
      return;
    }

    // inverse Haversine formula to calculate the bounding box of the search area for a given location and radius
    // Convert latitude and longitude from degrees to radians
    let lat = latitude * Math.PI / 180;
    let lon = longitude * Math.PI / 180;

    // Calculate the bounding box
    let minLat = lat - (radius / earthRadius);
    let maxLat = lat + (radius / earthRadius);
    let minLon = lon - (radius / (earthRadius * Math.cos(lat)));
    let maxLon = lon + (radius / (earthRadius * Math.cos(lat)));

    // Convert latitude and longitude from radians to degrees
    let minLatDegrees = minLat * 180 / Math.PI;
    let maxLatDegrees = maxLat * 180 / Math.PI;
    let minLonDegrees = minLon * 180 / Math.PI;
    let maxLonDegrees = maxLon * 180 / Math.PI;

    let query = `
    SELECT w.washroomid, w.washroomname, w.longitude, w.latitude, w.address1, w.address2, w.city, w.province, w.postalcode, w.distance, w.email,
    CASE
        WHEN r.email IS NOT NULL THEN 4
        ELSE COALESCE(b.sponsorship, 0)
    END AS sponsorship
    FROM (
    SELECT *,
      ROUND((2 * ${earthRadius} * asin(sqrt(pow(sin((radians(latitude) - radians(${latitude})) / 2), 2)
      + cos(radians(${latitude})) * cos(radians(latitude)) * pow(sin((radians(longitude) 
      - radians(${longitude})) / 2), 2))))) AS distance
      FROM (SELECT * FROM washrooms WHERE latitude BETWEEN ${minLatDegrees} AND ${maxLatDegrees} AND 
                                      longitude BETWEEN ${minLonDegrees} AND ${maxLonDegrees}
    )
    ) AS w
    LEFT JOIN BusinessOwners AS b ON w.email = b.email
    LEFT JOIN RubyBusiness AS r ON w.email = r.email
    WHERE w.distance < ${radius}
    ORDER BY w.distance
    `;

    try {
      let result = await pool.query(query);
      let currentTimestamp = new Date().toISOString(); // Get the current date and time in ISO format
      result = result.rows.map((row) => ({ ...row, actionTimestamp: currentTimestamp }));
    
      result.forEach((newWashroom) => {
        const existingIndex = washrooms.findIndex(curr => curr.washroomid === newWashroom.washroomid);
    
        if (existingIndex === -1) {
          // Washroom not already in array, add it
          washrooms.push(newWashroom);
        } else if (newWashroom.distance < washrooms[existingIndex].distance) {
          // Washroom already in array, but new distance is smaller, update it
          washrooms[existingIndex] = newWashroom;
        }
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  washrooms.sort((a, b) => a.distance - b.distance);

  res.json(washrooms);
});

// get the 20 nearest washrooms to a given location (latitude, longitude) within a set radius
app.get("/nearbywashrooms", async (req, res) => {
  const radius = 5000;
  const washroom_count = 20;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  // Check if the required parameters are defined
  if (latitude == undefined || longitude == undefined) {
    res.status(422).json("Missing required parameters" );
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
    SELECT w.washroomid, w.washroomname, w.longitude, w.latitude, w.address1, w.address2, w.city, w.province, w.postalcode, w.openinghours, w.closinghours, w.distance, w.email,
    CASE
        WHEN r.email IS NOT NULL THEN 4
        ELSE COALESCE(b.sponsorship, 0)
    END AS sponsorship
    FROM (
    SELECT *,
      ROUND((2 * ${earthRadius} * asin(sqrt(pow(sin((radians(latitude) - radians(${latitude})) / 2), 2)
      + cos(radians(${latitude})) * cos(radians(latitude)) * pow(sin((radians(longitude) 
      - radians(${longitude})) / 2), 2))))) AS distance
      FROM (SELECT * FROM washrooms WHERE latitude BETWEEN ${minLatDegrees} AND ${maxLatDegrees} AND 
                                      longitude BETWEEN ${minLonDegrees} AND ${maxLonDegrees}
    )
    ) AS w
    LEFT JOIN BusinessOwners AS b ON w.email = b.email
    LEFT JOIN RubyBusiness AS r ON w.email = r.email
    WHERE w.distance < ${radius}
    ORDER BY w.distance
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

// Create
app.post("/businessowner/signup/", async (req, res) => {
  const { email, password, businessName } = req.body;

  if (!email || !password || !businessName) {
    return res.status(400).json({response: "Email, password, and business name are required"});
  }

  const emailTaken = await pool.query("SELECT email FROM businessowners WHERE email = $1", [email]);
  if (emailTaken.rows.length > 0) {
    return res.status(400).send({response: "Email already taken"});
  } else {
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);
    await pool.query("INSERT INTO businessowners (email, password, businessname) VALUES ($1, $2, $3)", [email, hashedPassword, businessName]);

    // Returning JSON Web Token (search JWT for more explanation)
    const token = jwt.sign({ email }, "secret-key", { expiresIn: "1h" });
    res.status(201).json({ response: "User registered successfully.", token });
  }
});

// Login
app.post("/businessowner/login/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({response: "Email and password are required"});
  }

  const user = await pool.query("SELECT * FROM businessowners WHERE email = $1", [email]);
  if (user.rows.length === 0) {
    return res.status(400).send({response: "Incorrect email or password"});
  }

  const validPassword = await compare(password, user.rows[0].password);
  if (!validPassword) {
    return res.status(400).send({response: "Incorrect email or password"});
  }

  // Returning JSON Web Token (search JWT for more explanation)
  const token = jwt.sign({ email }, "secret-key", { expiresIn: "1h" });
  res.status(200).json({ response: "Login successful", token });
});

// Logout
app.post("/businessowner/logout/", async (req, res) => {
  res.status(200).send({ response: "Login successful"});
});

// Token check
app.get("/businessowner/whoami/", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header as "Bearer <token>"

  if (!token) {
    return res.status(401).send({ response: "No Token Provided"});
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    const email = decoded.email;

    if (!email) {
      return res.status(401).send({ response: "Invalid Token"});
    }

    return res.status(200).json({ response: email });
  } catch (error) {
    return res.status(401).send({ response: "Invalid Token"});
  }
});

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});