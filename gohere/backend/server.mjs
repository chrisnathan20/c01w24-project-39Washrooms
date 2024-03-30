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

let lastExecutedMonth = null;

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
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/testconnection/user", async (req, res) => {
  try {
    const result = await pool.query("SELECT connectionstatus FROM testconnection WHERE connectionstatus ILIKE '%user%';");
    res.json(result.rows[0].connectionstatus);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//insert information into ruby business
//make sure to post only jpeg images
app.post("/storeRubyBusinesses", upload.array('images', 1), async (req, res) => {
  try {

    const {email} = req.body;
    let imagePaths = [];

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.path);
    }


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
        email, imagePaths.length > 0 ? imagePaths[0] : null,
      ]
    );

    res.status(200).json({ message: " Ruby Business stored successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
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
    const images = result.rows.map(row => row.bannerimage);

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

//get all the ruby business banners if any
app.get('/allRubyBusinessBanners', async (req, res) => {
  
  try {
    const result = await pool.query("SELECT r.banner FROM (SELECT * FROM RubyBusiness r2 WHERE r2.banner <> 'null') as r");
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
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/deleteNews/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;
    const newsIdInt = parseInt(newsId, 10);
    if (isNaN(newsIdInt)) {
      return res.status(400).json({ error: "Invalid news ID." });
    }

    // Fetch the image paths from the database before deleting the entry
    const imagePathsResult = await pool.query(
      `SELECT cardImage, bannerImage FROM News WHERE newsId = $1`,
      [newsIdInt]
    );
    console.log(imagePathsResult.rows[0]);
    if (imagePathsResult.rows.length === 0) {
      return res.status(404).json({ error: "News entry not found" });
    }

    const { cardimage, bannerimage } = imagePathsResult.rows[0];
    console.log(cardimage);
    console.log(bannerimage);
    // Delete the news entry from the database
    const deleteResult = await pool.query(
      `DELETE FROM News WHERE newsId = $1`,
      [newsIdInt]
    );

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: "News entry not found" });
    }

    // Delete the image files from the server
    fs.unlink(cardimage, (err) => {
      if (err) console.error('Failed to delete card image:', err);
    });
    fs.unlink(bannerimage, (err) => {
      if (err) console.error('Failed to delete banner image:', err);
    });

    res.status(200).json({ message: "News deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update a news item
app.patch("/updateNews/:newsId", upload.array('images', 2), async (req, res) => {
  try {
    const { newsId } = req.params;
    const { newsUrl, headline, newsDate } = req.body;
    
    const imageNames = req.files.map(file => file.originalname);
    const imagePaths = req.files.map(file => file.path);
    
    const newsIdInt = parseInt(newsId, 10);
    if (isNaN(newsIdInt)) {
      return res.status(400).json({ error: "Invalid news ID." });
    }

    // Check for required fields
    if (!newsUrl || !headline || !newsDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    var result=null;
    
    //Checking if any of the images have the name 'nullImage.png', indicating that the image shouldn't be updated,
    // and updating accordingly
    if(imageNames[0] === 'nullImage.png' && imageNames[1] === 'nullImage.png'){
      result = await pool.query(
        `UPDATE News SET
           newsUrl = $1,
           headline = $2,
           newsDate = $3
         WHERE newsId = $4`,
        [
          newsUrl, headline, newsDate, newsIdInt
        ]
      );
      console.log(imagePaths[0], imagePaths[1]);
      // Delete the old images
      fs.unlink(imagePaths[0], (err) => {
        if (err) console.error('Failed to delete old card image:', err);
      });
      fs.unlink(imagePaths[1], (err) => {
          if (err) console.error('Failed to delete old banner image:', err);
      });
    }
    else if(imageNames[1] === 'nullImage.png'){
      result = await pool.query(
        `UPDATE News SET
           newsUrl = $1,
           headline = $2,
           newsDate = $3,
           cardImage = $4
         WHERE newsId = $5`,
        [
          newsUrl, headline, newsDate, imagePaths[0], newsIdInt
        ]
      );
    }
    else if(imageNames[0] === 'nullImage.png'){
      result = await pool.query(
        `UPDATE News SET
           newsUrl = $1,
           headline = $2,
           newsDate = $3,
           bannerImage = $4
         WHERE newsId = $5`,
        [
          newsUrl, headline, newsDate, imagePaths[1], newsIdInt
        ]
      );
    }
    else{
    // Update the data in the News table
    result = await pool.query(
      `UPDATE News SET
         newsUrl = $1,
         headline = $2,
         newsDate = $3,
         cardImage = $4,
         bannerImage = $5
       WHERE newsId = $6`,
      [
        newsUrl, headline, newsDate, imagePaths[0], imagePaths[1], newsIdInt
      ]
    );
    }

    // Check if any rows were affected by the update
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "News item not found" });
    }

    res.status(200).json({ message: "News updated successfully", newsId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
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


//get the bannerImage for given news id
app.get('/newsBannerImage/:newsId', async (req, res) => {
  const { newsId } = req.params; // Correct way to access route parameters
  // Assuming newsId is an integer, validate accordingly
  const newsIdInt = parseInt(newsId, 10);
  if (isNaN(newsIdInt)) {
    return res.status(400).json({ error: "Invalid news ID." });
  }

  try {
    //const client = await pool.connect();
    const result = await pool.query(`SELECT n.bannerImage FROM News as n WHERE n.newsId = ${newsIdInt}`);
    const image = result.rows[0]; 
    if (!image) {
      res.status(404).send('Image not found');
      return;
    }

    const filePath = image.bannerimage;

    // Serve the image file or data
    res.status(200).send(filePath);

  } catch (error) {
    console.error('Error fetching image from database:', error);
    res.status(500).send('Internal server error');
  }});


app.get("/nearbywashroomsalongroute", async (req, res) => {
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
    SELECT w.washroomid, w.washroomname, w.longitude, w.latitude, w.address1, w.address2, w.city, w.province, w.postalcode, w.openinghours, w.closinghours, w.distance, w.email, w.imageone, w.imagetwo, w.imagethree,
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
    SELECT w.washroomid, w.washroomname, w.longitude, w.latitude, w.address1, w.address2, w.city, w.province, w.postalcode, w.openinghours, w.closinghours, w.distance, w.email, w.imageone, w.imagetwo, w.imagethree,
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
    res.status(500).json({ error: "Internal server error" });
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
        w.email,
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

app.get('/admin/applicationscount', async (req, res) => {
  try {
      const businessResult = await pool.query(`
          SELECT status, COUNT(*) AS application_count
          FROM BusinessApplication
          WHERE status IN (0, 1, 2, 3)
          GROUP BY status;
      `);
      
      const publicResult = await pool.query(`
          SELECT status, COUNT(*) AS application_count
          FROM PublicApplication
          WHERE status IN (0, 1, 2, 3)
          GROUP BY status;
      `);
      
      // Construct the final JSON structure
      const responseJson = {
          business: businessResult.rows,
          public: publicResult.rows
      };
      res.status(200).json(responseJson);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

app.get('/admin/businessapplications', async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT applicationId, email, locationName, status, address1, address2, city, province, postalCode, lastupdated
          FROM BusinessApplication;
      `);
      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

app.get('/admin/publicapplications', async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT applicationId, locationName, status, address1, address2, city, province, postalCode, lastupdated
          FROM PublicApplication;
      `);
      res.status(200).json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
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
  //const validPassword = password == user.rows[0].password;

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

app.get("/businessowner/getData", async (req, res) => {
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

    const data = await pool.query("SELECT * FROM businessowners WHERE email = $1", [email]);

    return res.status(200).json({ response: data });
  } catch (error) {
    return res.status(401).send({ response: "Invalid Token" });
  }
});

app.get("/businessowner/getBOImages", async (req, res) => {
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


    const data = await pool.query("SELECT imageOne, imageTwo, imageThree FROM BusinessOwners WHERE email = $1", [email]);
    //console.log("this is data", data.rows[0])
    return res.status(200).json(data.rows[0]);

  } catch (error) {
    return res.status(401).send({ response: "Invalid Token" });
  }
});

app.get("/businessowner/getSponsorship", async (req, res) => {
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

    const data = await pool.query("SELECT * FROM businessowners WHERE email = $1", [email]);
    if (data.rows.length === 0) {
      return res.status(400).send({ response: "Invalid token" });
    }
    const sponsorship = data.rows[0].sponsorship;
    //return res.status(200).json({ response: sponsorship });
    switch (sponsorship) {
      case 0:
        return res.status(200).json({ response: "null" });
      case 1:
        return res.status(200).json({ response: "bronze" });
      case 2:
        return res.status(200).json({ response: "silver" });
      case 3:
        const data = await pool.query("SELECT * FROM RubyBusiness WHERE email = $1", [email]);
        if (data.rows.length == 0) { //if there is no entry in rubybusiness, it is gold
          return res.status(200).json({ response: "gold" });
        } else {
          return res.status(200).json({ response: "ruby" });
        }
      default:
        return res.status(400).json({ response: "Invalid token" });

    }
  } catch (error) {
    return res.status(401).send({ response: "Invalid Token" });
  }
});

app.put("/businessowner/description/", async (req, res) => {
  const { email, name, details } = req.body;

  try {
    if (details && name){
      await pool.query("UPDATE businessowners SET businessname = $1, description = $2 WHERE email = $3", [name, details, email]);
    } else if (details){
      await pool.query("UPDATE businessowners SET description = $1 WHERE email = $2", [details, email]);
    } else if (name) {
      await pool.query("UPDATE businessowners SET businessname = $1 WHERE email = $2", [name, email]);
    }

    res.status(200).json({ response: "Description updated" });
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }

});



app.get("/rubybusiness/getBanner", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header as "Bearer <token>"
  console.log("token has been split")
  if (!token) {
    return res.status(401).send({ response: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    const email = decoded.email;

    if (!email) {
      return res.status(401).send({ response: "Invalid Token" });
    }

    const data = await pool.query("SELECT banner FROM RubyBusiness WHERE email = $1", [email]);
    console.log(data)
    const images = data.rows.map(row => row.banner); // Corrected to access "row.banner"
    console.log(images)
    return res.status(200).send(images);

  } catch (error) {
    console.log("Error in fetching banner:", error);
    return res.status(401).send({ response: "Invalid Token" });
  }
});

app.get("/businessowner/getImageOne", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  console.log("token has been split")
  if (!token) {
    return res.status(401).send({ response: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    const email = decoded.email;

    if (!email) {
      return res.status(401).send({ response: "Invalid Token" });
    }

    const data = await pool.query("SELECT imageOne FROM BusinessOwners WHERE email = $1", [email]);
    console.log("this is data", data.rows[0].imageone)
    const images = data.rows[0].imageone; // Corrected to access "row"
    console.log("this is images", images)
    return res.status(200).send({ image: images }); // Send as JSON object

  } catch (error) {
    console.log("Error in fetching imageOne:", error);
    return res.status(401).send({ response: "Invalid Token" });
  }
});

app.get("/businessowner/getImageTwo", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  console.log("token has been split")
  if (!token) {
    return res.status(401).send({ response: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    const email = decoded.email;

    if (!email) {
      return res.status(401).send({ response: "Invalid Token" });
    }

    const data = await pool.query("SELECT imageTwo FROM BusinessOwners WHERE email = $1", [email]);
    console.log("this is data", data.rows[0].imagetwo)
    const images = data.rows[0].imagetwo; // Corrected to access "row"
    console.log("this is images", images)
    return res.status(200).send({ image: images }); // Send as JSON object

  } catch (error) {
    console.log("Error in fetching imageTwo:", error);
    return res.status(401).send({ response: "Invalid Token" });
  }
});

app.get("/businessowner/getImageThree", async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 
  console.log("token has been split")
  if (!token) {
    return res.status(401).send({ response: "No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret-key"); // Replace "secret-key" with your actual secret key
    const email = decoded.email;

    if (!email) {
      return res.status(401).send({ response: "Invalid Token" });
    }

    const data = await pool.query("SELECT imageThree FROM BusinessOwners WHERE email = $1", [email]);
    console.log("this is data", data.rows[0].imagethree)
    const images = data.rows[0].imagethree; // Corrected to access "row"
    console.log("this is images", images)
    return res.status(200).send({ image: images }); // Send as JSON object

  } catch (error) {
    console.log("Error in fetching imageThree:", error);
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

app.patch('/businessowner/manageImages/:sponsorship', verifyToken, upload.array('images', 3), async (req, res) => {
  const email = req.user.email; // Extract email from the verified token
  const { sponsorship } = req.params;
  
  const imagePaths = req.files.map(file => file.path);
  console.log(email, sponsorship, imagePaths[0]);
  console.log(imagePaths.length);

  try {
    if (sponsorship === "silver" && imagePaths.length > 0) {

      await pool.query("UPDATE businessowners SET imageOne = $1 WHERE email = $2", [imagePaths[0], email]);
      res.status(200).json({ response: "Images updated" });

    } else if (sponsorship === "gold" || sponsorship === "ruby") {

      if (imagePaths.length === 1) {

        await pool.query("UPDATE businessowners SET imageOne = $1 WHERE email = $2", [imagePaths[0], email]);
        console.log("first", imagePaths[0])
        res.status(200).json({ response: "Image updated" });

      } else if (imagePaths.length === 2) {

        await pool.query("UPDATE businessowners SET imageOne = $1, imageTwo = $2 WHERE email = $3", [imagePaths[0], imagePaths[1], email]);
        console.log("first", imagePaths[0])
        console.log("second", imagePaths[1])
        res.status(200).json({ response: "Images updated" });

      } else if (imagePaths.length === 3) {
        console.log("first", imagePaths[0])
        console.log("second", imagePaths[1])
        console.log("third", imagePaths[2])
        await pool.query("UPDATE businessowners SET imageOne = $1, imageTwo = $2, imageThree = $3 WHERE email = $4", [imagePaths[0], imagePaths[1], imagePaths[2], email]);
        res.status(200).json({ response: "Images updated" });
      }
    } 
  } catch (error) {
    console.log("here is error")
    res.status(400).json({ error: "Internal Server Error" });
  }
});


app.patch('/rubybusiness/updateBanner', verifyToken, upload.array('images', 1), async (req, res) => {
  const email = req.user.email;

  if (!req.files || req.files.length === 0) {
      console.log("No file uploaded.");
      return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imagePath = req.files[0].path;

  try {
      const data = await pool.query("UPDATE RubyBusiness SET banner = $1 WHERE email = $2", [imagePath, email]);
      res.status(200).json({ message: 'Banner image updated successfully.', imagePath: imagePath });
  } catch (error) {
      console.error('Error updating banner image in database:', error);
      res.status(500).json({ error: 'Failed to update banner image.' });
  }
});

app.patch('/businessowner/updateImageOne', verifyToken, upload.array('images', 1), async (req, res) => {
  const email = req.user.email;

  if (!req.files || req.files.length === 0) {
      console.log("No file uploaded.");
      return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imagePath = req.files[0].path;

  try {
      const data = await pool.query("UPDATE BusinessOwners SET imageONe = $1 WHERE email = $2", [imagePath, email]);
      res.status(200).json({ message: 'imageONe updated successfully.', imagePath: imagePath });
  } catch (error) {
      console.error('Error updating image one in database:', error);
      res.status(500).json({ error: 'Failed to update image one.' });
  }
});

app.patch('/businessowner/updateImageTwo', verifyToken, upload.array('images', 1), async (req, res) => {
  const email = req.user.email;

  if (!req.files || req.files.length === 0) {
      console.log("No file uploaded.");
      return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imagePath = req.files[0].path;

  try {
      const data = await pool.query("UPDATE BusinessOwners SET imageTwo = $1 WHERE email = $2", [imagePath, email]);
      res.status(200).json({ message: 'image two updated successfully.', imagePath: imagePath });
  } catch (error) {
      console.error('Error updating image two in database:', error);
      res.status(500).json({ error: 'Failed to update image two.' });
  }
});

app.patch('/businessowner/updateImageThree', verifyToken, upload.array('images', 1), async (req, res) => {
  const email = req.user.email;

  if (!req.files || req.files.length === 0) {
      console.log("No file uploaded.");
      return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imagePath = req.files[0].path;

  try {
      const data = await pool.query("UPDATE BusinessOwners SET imageThree = $1 WHERE email = $2", [imagePath, email]);
      res.status(200).json({ message: 'image three updated successfully.', imagePath: imagePath });
  } catch (error) {
      console.error('Error updating image three in database:', error);
      res.status(500).json({ error: 'Failed to update image three.' });
  }
});

// Endpoint to get applications for the logged-in business owner
app.get("/businessowner/applications", verifyToken, async (req, res) => {
  const businessOwnerEmail = req.user.email;

  try {
    // Query the database for applications associated with the business owner's email
    const applicationsResult = await pool.query(
      "SELECT applicationId, locationName, status, lastupdated, address1, address2, city, province, postalCode FROM BusinessApplication WHERE email = $1",
      [businessOwnerEmail]
    );

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
    res.status(500).json({ error: "Internal server error" });
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
    }catch (e){
      console.log("request processing fail:");
      console.log(e.message);
      res.status(500).json({error: e.message});
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

// Get Application by Id
app.get("/application/:applicationId", async (req, res) => {
  const applicationId = req.params.applicationId;

  if (applicationId == undefined) {
    res.status(422).json("Missing required parameters" );
    return;
  }

  const query = `
    SELECT ba.*, CASE WHEN r.email IS NOT NULL THEN 4 ELSE bo.sponsorship END AS sponsorship
    FROM BusinessApplication AS ba
    LEFT JOIN BusinessOwners AS bo ON ba.email = bo.email
    LEFT JOIN RubyBusiness AS r ON ba.email = r.email
    WHERE ba.applicationId = $1
  `;

  try {
    const result = await pool.query(query, [applicationId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Application by Id
app.get("/publicapplication/:applicationId", async (req, res) => {
  const applicationId = req.params.applicationId;

  if (applicationId == undefined) {
    res.status(422).json("Missing required parameters" );
    return;
  }

  const query = `
    SELECT pa.*
    FROM PublicApplication AS pa
    WHERE pa.applicationId = $1
  `;

  try {
    const result = await pool.query(query, [applicationId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Washroom by Id
app.get("/washroom/:washroomId", async (req, res) => {
  const washroomId = req.params.washroomId;

  if (washroomId == undefined) {
    res.status(422).json("Missing required parameters" );
    return;
  }

  const query = `
    SELECT w.*, CASE WHEN r.email IS NOT NULL THEN 4 ELSE bo.sponsorship END AS sponsorship
    FROM washrooms AS w
    LEFT JOIN BusinessOwners AS bo ON w.email = bo.email
    LEFT JOIN RubyBusiness AS r ON w.email = r.email
    WHERE w.washroomId = $1
  `;

  try {
    const result = await pool.query(query, [washroomId]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }});



// Endpoint to get all washrooms for admin
app.get("/admin/washrooms", async (req, res) => {

  try {
    // Query the database for applications associated with the business owner's email
    const washroomsResult = await pool.query(
      "SELECT washroomId, washroomName, address1, address2, city, province, postalCode, email FROM Washrooms",
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

// Get Business Owner by Email
app.get("/businessowner/details/:email", async (req, res) => {
  const email = req.params.email;

  if (email == undefined) {
    res.status(422).json("Missing required parameters" );
    return;
  }
  
  const query = `
    SELECT email, businessname, sponsorship, imageone, imagetwo, imagethree, description
    FROM BusinessOwners
    WHERE email = $1
  `;

  try {
    const result = await pool.query(query, [email]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// delete washjroom by id, also deletes dependent reports (locationId)
app.delete("/washroom/:washroomId", async (req, res) => {
  const washroomId = req.params.washroomId;

  if (washroomId == undefined) {
    res.status(422).json("Missing required parameters" );
    return;
  }

  const queryReport = `
    DELETE FROM Report
    WHERE locationId = $1
  `;

  const queryWashroom = `
    DELETE FROM Washrooms
    WHERE washroomId = $1
  `;

  try {
    await pool.query(queryReport, [washroomId]);
    await pool.query(queryWashroom, [washroomId]);
    res.status(200).json({ message: "Washroom deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/userReport", async (req, res) => {
  const { washroomid } = req.body;

  if (!washroomid) {
    return res.status(400).json({ error: "Missing washroom id for user report" });
  }

  try {
    // Insert the data into the Report table
    const result = await pool.query(
      `INSERT INTO Report (
         locationId
       ) VALUES (
         $1
       ) RETURNING reportId`,
      [
        washroomid
      ]
    );

    res.status(200).json({ message: "Report submitted successfully", reportId: result.rows[0].reportId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/publicapplication/setnextstatus", async (req, res) => {
  const { applicationid } = req.body;

  console.log(applicationid);
  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM PublicApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus < 3) {
        currentStatus++;
        await pool.query(
          'UPDATE PublicApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );
        res.send(`Status incremented to ${currentStatus}`);
      } else {
        res.send('Status is already greater than 3');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/application/setnextstatus", async (req, res) => {
  const { applicationid } = req.body;

  console.log(applicationid);
  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM BusinessApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus < 3) {
        currentStatus++;
        await pool.query(
          'UPDATE BusinessApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );
        res.send(`Status incremented to ${currentStatus}`);
      } else {
        res.send('Status is already greater than 3');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/publicapplication/setprevstatus", async (req, res) => {
  const { applicationid } = req.body;

  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM PublicApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus <= 3 && currentStatus > 0) {
        currentStatus--;
        await pool.query(
          'UPDATE PublicApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );
        res.send(`Status incremented to ${currentStatus}`);
      } else {
        res.send('Status is already greater than 3 or less than 1');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/application/setprevstatus", async (req, res) => {
  const { applicationid } = req.body;

  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM BusinessApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus <= 3 && currentStatus > 0) {
        currentStatus--;
        await pool.query(
          'UPDATE BusinessApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );
        res.send(`Status incremented to ${currentStatus}`);
      } else {
        res.send('Status is already greater than 3 or less than 1');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/publicapplication/reject", async (req, res) => {
  const { applicationid } = req.body;

  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM PublicApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus <= 3) {
        currentStatus=5;
        await pool.query(
          'UPDATE PublicApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );
        res.send(`Status set to ${currentStatus}`);
      } else {
        res.send('Status is already greater than 3');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/application/reject", async (req, res) => {
  const { applicationid } = req.body;

  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM BusinessApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus <= 3) {
        currentStatus=5;
        await pool.query(
          'UPDATE BusinessApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );
        res.send(`Status set to ${currentStatus}`);
      } else {
        res.send('Status is already greater than 3');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/publicapplication/accept", async (req, res) => {
  const { applicationid } = req.body;

  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM PublicApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus == 3) {
        currentStatus++;
        await pool.query(
          'UPDATE PublicApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );

        // Insert the data into the Washrooms table
        const applicationResult = await pool.query(
          'SELECT * FROM PublicApplication WHERE applicationId = $1',
          [applicationid]
        );

        const application = applicationResult.rows[0];

        await pool.query(
          `INSERT INTO Washrooms (
            washroomname, longitude, latitude, openinghours, closinghours, address1, address2, city, province, postalcode, email, imageone, imagetwo, imagethree
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
          )`,
          [
            application.locationname, application.longitude, application.latitude, application.openinghours, application.closinghours,
            application.address1, application.address2, application.city, application.province, application.postalcode, application.email,
            application.imageone, application.imagetwo, application.imagethree
          ]
        );

        res.send(`Status incremented to ${currentStatus}`);
      } else {
        res.send('Status is not 3');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/application/accept", async (req, res) => {
  const { applicationid } = req.body;

  if (!applicationid) {
    return res.status(400).json({ error: "Missing application id for user report" });
  }

  try {
    const result = await pool.query(
      'SELECT status FROM BusinessApplication WHERE applicationId = $1',
      [applicationid]
    );

    if (result.rows.length === 0) {
      res.status(404).send('Application not found');
    } else {
      let currentStatus = result.rows[0].status;

      if (currentStatus == 3) {
        currentStatus++;
        await pool.query(
          'UPDATE BusinessApplication SET status = $1, lastUpdated = CURRENT_TIMESTAMP WHERE applicationId = $2',
          [currentStatus, applicationid]
        );

        // Insert the data into the Washrooms table
        const applicationResult = await pool.query(
          'SELECT * FROM BusinessApplication WHERE applicationId = $1',
          [applicationid]
        );

        const application = applicationResult.rows[0];

        await pool.query(
          `INSERT INTO Washrooms (
            washroomname, longitude, latitude, openinghours, closinghours, address1, address2, city, province, postalcode, email, imageone, imagetwo, imagethree
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
          )`,
          [
            application.locationname, application.longitude, application.latitude, application.openinghours, application.closinghours,
            application.address1, application.address2, application.city, application.province, application.postalcode, application.email,
            application.imageone, application.imagetwo, application.imagethree
          ]
        );

        res.send(`Status incremented to ${currentStatus}`);
      } else {
        res.send('Status is not 3');
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/checkRecentReports", async (req, res) => {
  const { washroomid } = req.query;

  if (!washroomid) {
    return res.status(400).json({ error: "Missing washroom id for recent reports" });
  }

  const query = `
      SELECT 
        COUNT(r.reportId) FILTER (WHERE r.reportTime >= NOW() - INTERVAL '3 hours') AS reports_past_3_hours
      FROM 
        Report r
      WHERE
        r.locationId = $1
      GROUP BY 
        r.locationId;`;

  try {
    // Get number of reports from query
    const result = await pool.query(query, [washroomid]);

    res.status(200).json({ message: "Reports fetched successfully", reports: result.rows[0] ? result.rows[0].reports_past_3_hours : 0 });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Get donation by email
app.get("/businessowner/donations", verifyToken, async (req, res) => {
  const email = req.user.email;

  try{
    const donationResult = await pool.query(`
      SELECT SUM(amount) AS totalDonation FROM BusinessDonations WHERE email = $1
    `, [email]);

    let totalDonation = donationResult.rows[0].totaldonation;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based month, so add 1 to get the current month
    const currentYear = currentDate.getFullYear();

    const donationMonthResult = await pool.query(`
      SELECT SUM(amount) AS totalDonationMonth FROM BusinessDonations 
      WHERE email = $1 AND EXTRACT(MONTH FROM donationdate) = $2 AND EXTRACT(YEAR FROM donationdate) = $3
    `, [email, currentMonth, currentYear]);

    let totalDonationMonth = donationMonthResult.rows[0].totaldonationmonth;

    if (totalDonation == null){
      totalDonation = 0;
    };

    if (totalDonationMonth== null){
      totalDonationMonth = 0;
    };

  

    res.status(200).json({ totalDonation: totalDonation, totalDonationMonth: totalDonationMonth });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }

});


//Get business name and sponsorship tier by email
app.get("/businessowner/getinfo", verifyToken, async (req, res) => {
  const email = req.user.email;
  

  try{
    const infoResult = await pool.query(`
      SELECT businessname, sponsorship FROM BusinessOwners WHERE email = $1
    `, [email]);

    const businessName = infoResult.rows[0].businessname;
    const sponsorshipTier = infoResult.rows[0].sponsorship;

   

    res.status(200).json({ businessName: businessName, sponsorshipTier: sponsorshipTier});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }

});

//update sponsorship tier of business once they exceed threshold
app.patch("/businessowner/updateSponsorship", verifyToken, async (req, res) => {
  const email = req.user.email;
  let nextSponsorship;

  try {
    const sponsorshipResult = await pool.query(`
    SELECT sponsorship FROM BusinessOwners WHERE email = $1
  `, [email]);

    const currentSponsorship = sponsorshipResult.rows[0].sponsorship;
    nextSponsorship = currentSponsorship;
    if (currentSponsorship < 3){
      nextSponsorship = currentSponsorship + 1;
    }

    await pool.query(`
      UPDATE BusinessOwners
      SET sponsorship = $1
      WHERE email = $2
    `, [nextSponsorship, email]);

    res.status(200).json({ message: "Sponsorship tier updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update donation database after every successful payment
app.post("/businessowner/donate", verifyToken, async (req, res) => {
  const email = req.user.email;
  const { amount } = req.body;
  const date = new Date().toISOString();

  try {
    await pool.query(`
      INSERT INTO BusinessDonations (email, amount, donationdate) VALUES ($1, $2, $3)
    `, [email, amount, date]);

    res.status(200).json({ message: "Donation submitted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }});


  //check if a gold sponsor is in the ruby list
app.get("/businessowner/checkruby", verifyToken, async (req, res) => {
  const email = req.user.email;
  

  try {
    const result = await pool.query(`
      SELECT email FROM RubyBusiness WHERE email = $1
    `, [email]);

    if (result.rows.length > 0) {
      
      res.status(200).json({ isRuby: true });
    } else {
      res.status(200).json({ isRuby: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

//check the email of the top 3 donator of a certain month
app.get("/businessowner/topdonators", async (req, res) => {
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based month, so add 1 to get the current month
  const currentYear = currentDate.getFullYear();
  let prevMonth = currentMonth;
  let prevYear = currentYear;
  if (currentMonth != 1){
    prevMonth = currentMonth - 1;
  }else if (currentMonth == 1){
    prevMonth = 12;
    prevYear -= 1;
  }

  try {
    const result = await pool.query(`
      SELECT email, SUM(amount) AS totaldonation FROM BusinessDonations
      WHERE EXTRACT(MONTH FROM donationdate) = $1 AND EXTRACT(YEAR FROM donationdate) = $2
      GROUP BY email
      ORDER BY totaldonation DESC
      LIMIT 3
    `, [currentMonth, currentYear]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/businessowner/getnames", verifyToken, async (req, res) => {
  const emails = req.query.emails ? req.query.emails.split(',') : [];
  console.log(emails)
  if (!emails || emails.length === 0) {
    return res.status(422).json("Missing or empty email array");
  }
  const placeholders = emails.map((_, index) => `$${index + 1}`).join(', ');
  try {
    const result = await pool.query(`
      SELECT email, businessname FROM BusinessOwners
      WHERE email IN (${placeholders})
    `, emails);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


//middleware to update the ruby list everymonth
const updateRuby = async (req, res, next) => {
  const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based month, so add 1 to get the current month
    const currentYear = currentDate.getFullYear();
    let prevMonth;
    let prevYear;
    if (currentMonth == 1) {
      prevMonth = 12;
      prevYear = currentYear - 1;
    } else {
      prevMonth = currentMonth - 1;
      prevYear = currentYear;
    }
  
    if (lastExecutedMonth !== currentMonth) {
      // Update the Ruby list
      try {
        const result = await pool.query(`
        SELECT bd.email, SUM(bd.amount) AS totaldonation
        FROM BusinessDonations bd
        WHERE EXTRACT(MONTH FROM bd.donationdate) = $1 
          AND EXTRACT(YEAR FROM bd.donationdate) = $2
          AND bd.email IN (
            SELECT bo.email
            FROM BusinessOwners bo
            WHERE bo.sponsorship = 3
          )
        GROUP BY bd.email
        ORDER BY totaldonation DESC
        LIMIT 3;
        `, [prevMonth, prevYear]);
  
        const topDonators = result.rows;
        const topDonatorEmails = topDonators.map(donator => donator.email);
  
        // Delete rows that are not in the top donators list
        await pool.query(`
          DELETE FROM RubyBusiness
          WHERE email NOT IN (${topDonatorEmails.map(email => `'${email}'`).join(',')})
        `);
  
        // Insert the top donators into the Ruby list if they are not already there
        for (const email of topDonatorEmails) {
          await pool.query(`
            INSERT INTO RubyBusiness (email)
            SELECT $1
            WHERE NOT EXISTS (
              SELECT 1 FROM RubyBusiness WHERE email = $1
            )
          `, [email]);
        }
  
        console.log("Ruby list updated.");
        lastExecutedMonth = currentMonth;
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  
    next();
  };

//check database for ruby sponsor in the rubybusiness table. then return their email and total donation last month //REPLACE THE MIDDLEWARE
app.get("/businessowner/lastmonthruby", verifyToken, async (req, res) => {
  await updateRuby;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based month, so add 1 to get the current month
  const currentYear = currentDate.getFullYear();
  let prevMonth;
  let prevYear;
  if (currentMonth == 1) {
    prevMonth = 12;
    prevYear = currentYear - 1;
  }else{
    prevMonth = currentMonth - 1;
    prevYear = currentYear;
  }
  try {
    const result = await pool.query(`
      SELECT r.email, SUM(b.amount) AS totaldonation 
      FROM RubyBusiness AS r
      LEFT JOIN BusinessDonations AS b ON r.email = b.email
      WHERE EXTRACT(MONTH FROM b.donationdate) = $1 AND EXTRACT(YEAR FROM b.donationdate) = $2
      GROUP BY r.email
    `, [prevMonth, prevYear]);
   
    result.rows.sort((a, b) => b.totaldonation - a.totaldonation); //sort result by decending totaldonation
    //console.log(result.rows);
    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
