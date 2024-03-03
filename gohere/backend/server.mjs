import express from "express";
import cors from "cors";
import pool from "./db.mjs";

const app = express();
const PORT = 4000;

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

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});