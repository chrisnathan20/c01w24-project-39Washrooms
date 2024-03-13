import express from "express";
import cors from "cors";
import pool from "./db.mjs";
import multer from "multer";
import fs from 'fs';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.jpeg');
  }
});

const upload = multer({ storage: storage });

// prints out information about request received for easier debugging
app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.use('/uploads', express.static('uploads'));

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

app.post("/submitpublicwashroom", upload.array('images', 3), async (req, res) => {
  try {
    const { longitude, latitude, locationName, address1, address2, city, province, postalCode, additionalDetails } = req.body;
    const hours = JSON.parse(req.body.hours);
    const imagePaths = req.files.map(file => file.path);
    const openingHours = [];
    const closingHours = [];

    // Check for required fields
    if (!locationName || !address1 || !city || !province || !postalCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(hours);
    for (const day of ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']) {
      console.log(hours[day]);
      if (hours[day].open) {
        openingHours.push(hours[day].opening);
        closingHours.push(hours[day].closing);
      } else {
        openingHours.push(null);
        closingHours.push(null);
      }
    }

    // Insert the data into the PublicApplication table
    const result = await pool.query(
      `INSERT INTO PublicApplication (
         locationName, status, longitude, latitude, openingHours, closingHours, 
         address1, address2, city, province, postalCode, additionalDetails, 
         imageOne, imageTwo, imageThree
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
       ) RETURNING applicationId`,
      [
        locationName, 1, longitude, latitude, openingHours, closingHours,
        address1, address2, city, province, postalCode, additionalDetails,
        imagePaths[0], imagePaths[1], imagePaths[2]
      ]
    );

    res.status(200).json({ message: "Public washroom submitted successfully", applicationId: result.rows[0].applicationId });
  } catch (err) {
    console.error(err.message);
  }
});

// to get images for testing
// app.get('/uploads', (req, res) => {
//   const uploadsDir = 'uploads/';

//   fs.readdir(uploadsDir, (err, files) => {
//     if (err) {
//       console.error('Error reading uploads directory:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     const fileUrls = files.map(file => `${req.protocol}://${req.get('host')}/${uploadsDir}${file}`);
//     res.json({ files: fileUrls });
//   });
// });

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});