import express, { response } from "express";
import cors from "cors";
import pool from "./db.mjs";
import multer from "multer";
import fs from 'fs';
import { compare, genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Stripe } from "stripe";


const app = express();
const PORT = 4000;
const saltRounds = 10;

const SECRET_KEY_STRIPE = "sk_test_51Osv0FILaeH045jxu8tXi0oKyoPxUecHTE6AzDtQyV4p9nEsywSYjd4sZPXrgIo4VXszLKERpkThUb0BuFySQnFl000A2Nccei";
//const PUBLISHABLE_KEY_STRIPE="pk_test_51Osv0FILaeH045jx2v6duOwIm87GQaAvPdgSqFUtT1CRxrQkugMOeCubolzbfsS6rDW1Tvht1ZInSeOkYQwZL9Lb00vd1nr2dO";
const stripe = Stripe(SECRET_KEY_STRIPE, { apiVersion: "2023-10-16" });

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

//insert information into ruby business
//make sure to post only jpeg images
app.post("/storeRubyBusinesses", upload.array('images', 1), async (req, res) => {
  try {
    const { email } = req.body;
    const imagePaths = req.files.map(file => file.path);


    // Check for required fields
    if (!email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert the data into the PublicApplication table
    const result = await pool.query(
      `INSERT INTO RubyBusiness (
        email, banner) VALUES (
         $1, $2)`,
      [
        email, imagePaths[0],
      ]
    );

    res.status(200).json({ message: " Ruby Business stored successfully" });
  } catch (err) {
    console.error(err.message);
  }
});

//get the list of URLS
app.get("/allNewsURL", async (req, res) => {
  try {
    const result = await pool.query('SELECT n.newsUrl FROM News as n ORDER BY n.newsdate desc');
    const urls = result.rows.map(row => row.newsurl);

    if (urls.length === 0) {
      res.status(404).send('No URLs found');
      return;
    }

    res.status(200).send(urls);
  } catch (err) {
    console.error('Error fetching URLs from database:', err);
    res.status(500).send('Internal server error');
  }
});

app.get("/allNewsBannerImages", async (req, res) => {
  try {
    const result = await pool.query('SELECT n.bannerImage FROM News as n ORDER BY n.newsdate desc');
    //console.log(result);
    const images = result.rows.map(row => row.bannerimage);
    //console.log(images);


    if (images.length === 0) {
      res.status(404).send('No images found');
      return;
    }

    res.status(200).send(images);
  } catch (err) {
    console.error('Error fetching images from database:', err);
    res.status(500).send('Internal server error');
  }
});

app.get('/allRubyBusinessBanners', async (req, res) => {
  try {
    const result = await pool.query('SELECT r.banner FROM RubyBusiness as r');
    const images = result.rows.map(row => row.banner);

    if (images.length === 0) {
      res.status(404).send('No images found');
      return;
    }

    res.status(200).send(images);
  } catch (err) {
    console.error('Error fetching images from database:', err);
    res.status(500).send('Internal server error');
  }
});

//insert into the News table
//make sure to post only jpeg images
app.post("/storeNews", upload.array('images', 2), async (req, res) => {
  try {
    const { newsUrl, headline, newsDate } = req.body;
    const imagePaths = req.files.map(file => file.path);


    // Check for required fields
    if (!newsUrl || !headline || !newsDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert the data into the PublicApplication table
    const result = await pool.query(
      `INSERT INTO News (
        newsUrl, headline, newsDate,cardImage,bannerImage) VALUES (
         $1, $2, $3, $4, $5) RETURNING newsId`,
      [
        newsUrl, headline, newsDate, imagePaths[0], imagePaths[1],
      ]
    );

    res.status(200).json({ message: " News stored successfully", newsId: result.rows[0].newsId });
  } catch (err) {
    console.error(err.message);
  }
});

//get the list of news
//Note: changed the response body
app.get("/getAllNews", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM News ORDER BY News.newsdate desc');
    if (result.rows.length > 0) {
      const responseBody = result.rows.map(News => ({
        id: News.newsid,
        url: News.newsurl,
        headline: News.headline,
        createdAt: News.newsdate
      }));
      res.status(200).json(responseBody); //Return the list of news as JSON
    } else {
      res.status(404).json({ error: "No News Found." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get the cardImage for given news id
app.get('/newsCardImage/:newsId', async (req, res) => {
  const { newsId } = req.params; // Correct way to access route parameters
  // Assuming newsId is an integer, validate accordingly
  const newsIdInt = parseInt(newsId, 10);
  if (isNaN(newsIdInt)) {
    return res.status(400).json({ error: "Invalid news ID." });
  }

  try {
    //const client = await pool.connect();
    const result = await pool.query(`SELECT n.cardImage FROM News as n WHERE n.newsId = ${newsIdInt}`);
    const image = result.rows[0];
    if (!image) {
      res.status(404).send('Image not found');
      return;
    }

    const filePath = image.cardimage;

    // Serve the image file or data
    res.status(200).send(filePath);

  } catch (error) {
    console.error('Error fetching image from database:', error);
    res.status(500).send('Internal server error');
  }
});


app.get("/nearbywashroomsalongroute", async (req, res) => {
  console.log("test");
  const steps = req.query.steps;
  if (steps == undefined) {
    res.status(422).json("Missing required parameters");
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
      res.status(422).json("Missing required parameters");
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

    for (const day of ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']) {
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

// Endpoint to get aggregated reports for the admin dashboard
app.get("/admin/reports", async (req, res) => {
  try {
    const query = `
      SELECT 
        w.washroomId, 
        w.washroomName, 
        w.address1, 
        w.address2, 
        w.city, 
        w.province, 
        w.postalCode,
        COUNT(r.reportId) FILTER (WHERE r.reportTime >= NOW() - INTERVAL '3 hours') AS reports_past_3_hours,
        COUNT(r.reportId) FILTER (WHERE r.reportTime >= NOW() - INTERVAL '48 hours') AS reports_past_48_hours,
        COUNT(r.reportId) FILTER (WHERE r.reportTime >= NOW() - INTERVAL '1 week') AS reports_past_week,
        COUNT(r.reportId) FILTER (WHERE r.reportTime >= NOW() - INTERVAL '1 month') AS reports_past_month,
        COUNT(r.reportId) FILTER (WHERE r.reportTime >= NOW() - INTERVAL '1 year') AS reports_past_year,
        COUNT(r.reportId) AS reports_all_time
      FROM 
        Washrooms w
      INNER JOIN 
        Report r ON w.washroomId = r.locationId
      GROUP BY 
        w.washroomId;`;

    const result = await pool.query(query);

    res.status(200).json({
      reports: result.rows
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).send({ error: "Internal server error" });
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

// Create
app.post("/businessowner/signup/", async (req, res) => {
  const { email, password, businessName } = req.body;

  if (!email || !password || !businessName) {
    return res.status(400).json({ response: "Email, password, and business name are required" });
  }

  const emailTaken = await pool.query("SELECT email FROM businessowners WHERE email = $1", [email]);
  if (emailTaken.rows.length > 0) {
    return res.status(400).send({ response: "Email already taken" });
  } else {
    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(password, salt);
    await pool.query("INSERT INTO businessowners (email, password, businessname) VALUES ($1, $2, $3)", [email, hashedPassword, businessName]);

    // Returning JSON Web Token (search JWT for more explanation)
    const token = jwt.sign({ email }, "secret-key", { expiresIn: "999y" });
    res.status(201).json({ response: "User registered successfully.", token });
  }
});

// Login
app.post("/businessowner/login/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ response: "Email and password are required" });
  }

  const user = await pool.query("SELECT * FROM businessowners WHERE email = $1", [email]);
  if (user.rows.length === 0) {
    return res.status(400).send({ response: "Incorrect email or password" });
  }

  const validPassword = await compare(password, user.rows[0].password);
  if (!validPassword) {
    return res.status(400).send({ response: "Incorrect email or password" });
  }

  // Returning JSON Web Token (search JWT for more explanation)
  const token = jwt.sign({ email }, "secret-key", { expiresIn: "999y" });
  res.status(200).json({ response: "Login successful", token });
});

// Logout
app.post("/businessowner/logout/", async (req, res) => {
  res.status(200).send({ response: "Login successful" });
});

// Token check
app.get("/businessowner/whoami/", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header as "Bearer <token>"

  if (!token) {
    return res.status(401).send({ response: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    const email = decoded.email;

    if (!email) {
      return res.status(401).send({ response: "Invalid Token" });
    }

    return res.status(200).json({ response: email });
  } catch (error) {
    return res.status(401).send({ response: "Invalid Token" });
  }
});

app.get("/businessowner/getname", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header as "Bearer <token>"

  if (!token) {
    return res.status(401).send({ response: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    const email = decoded.email;

    if (!email) {
      return res.status(401).send({ response: "Invalid Token" });
    }

    const data = await pool.query("SELECT businessname FROM businessowners WHERE email = $1", [email]);

    return res.status(200).json({ response: data });
  } catch (error) {
    return res.status(401).send({ response: "Invalid Token" });
  }
});

// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ response: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    req.user = decoded; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).send({ response: "Invalid Token" });
  }
};

// Endpoint to get applications for the logged-in business owner
app.get("/businessowner/applications", verifyToken, async (req, res) => {
  const businessOwnerEmail = req.user.email;

  try {
    // Query the database for applications associated with the business owner's email
    const applicationsResult = await pool.query(
      "SELECT applicationId, locationName, status, lastupdated, address1, address2, city, province, postalCode FROM BusinessApplication WHERE email = $1",
      [businessOwnerEmail]
    );

    console.log(applicationsResult.rows);

    // Send the applications back to the client
    res.status(200).json({
      applications: applicationsResult.rows
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Endpoint to get applications for the logged-in business owner
app.get("/businessowner/washrooms", verifyToken, async (req, res) => {
  const businessOwnerEmail = req.user.email;

  try {
    // Query the database for applications associated with the business owner's email
    const washroomsResult = await pool.query(
      "SELECT washroomId, washroomName, address1, address2, city, province, postalCode FROM Washrooms WHERE email = $1",
      [businessOwnerEmail]
    );

    // Send the applications back to the client
    res.status(200).json({
      washrooms: washroomsResult.rows
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/businessowner/submitwashroom", verifyToken, upload.array('images', 3), async (req, res) => {
  try {
    const email = req.user.email; // Extract email from the verified token
    const { longitude, latitude, locationName, address1, address2, city, province, postalCode, additionalDetails } = req.body;
    const hours = JSON.parse(req.body.hours);
    const imagePaths = req.files.map(file => file.path);
    const openingHours = [];
    const closingHours = [];

    // Check for required fields
    if (!locationName || !address1 || !city || !province || !postalCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    for (const day of ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']) {
      if (hours[day].open) {
        openingHours.push(hours[day].opening);
        closingHours.push(hours[day].closing);
      } else {
        openingHours.push(null);
        closingHours.push(null);
      }
    }

    // Insert the data into the BusinessApplication table
    const result = await pool.query(
      `INSERT INTO BusinessApplication (
         email, locationName, status, longitude, latitude, openingHours, closingHours, 
         address1, address2, city, province, postalCode, additionalDetails, 
         imageOne, imageTwo, imageThree
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
       ) RETURNING applicationId`,
      [
        email, locationName, 0, longitude, latitude, openingHours, closingHours,
        address1, address2, city, province, postalCode, additionalDetails,
        imagePaths[0], imagePaths[1], imagePaths[2]
      ]
    );

    res.status(200).json({ message: "Business application submitted successfully", applicationId: result.rows[0].applicationId });
  } catch (err) {
    console.error(err.message);
  }
});

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Make a payment intent and return client secret
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("payment request arrived:", amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount),
      currency: "cad",
      payment_method_types: ["card"],
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret
    })

  } catch (e) {
    console.log("request processing fail:");
    console.log(e.message);
    res.json({ error: e.message });
  }
});

// Get Washrooms by Ids
// /washroomsbyids?ids=[1,2,3]
app.get("/washroomsbyids", async (req, res) => {
  const ids = req.query.ids;
  if (ids == undefined) {
    res.status(422).json("Missing required parameters");
    return;
  }

  if (ids == "[]") {
    res.json("[]");
    return;
  }

  //slice the first and last character from the string
  const idsString = ids.slice(1, -1);

  const query = `
    SELECT w.washroomid, w.washroomname, w.longitude, w.latitude, w.address1, w.address2, w.city, w.province, w.postalcode, w.openinghours, w.closinghours, w.email,
    CASE
        WHEN r.email IS NOT NULL THEN 4
        ELSE COALESCE(b.sponsorship, 0)
    END AS sponsorship
    FROM washrooms AS w
    LEFT JOIN BusinessOwners AS b ON w.email = b.email
    LEFT JOIN RubyBusiness AS r ON w.email = r.email
    WHERE w.washroomid IN (${idsString})
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows.map((row) => ({ ...row }))); // convert the result to an array of washrooms for easier use in the frontend
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});