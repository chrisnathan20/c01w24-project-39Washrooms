import express from "express";
import cors from "cors";
import pool from "./db.mjs";
import multer from "multer";

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

//insert information into ruby business
//make sure to post only jpeg images
app.post("/storeRubyBusinesses", upload.array('images', 1), async (req, res) => {
  try {
    const {email} = req.body;
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

    res.status(200).json({ message: " Ruby Business stored successfully"});
  } catch (err) {
    console.error(err.message);
  }
});

//insert into the News table
//make sure to post only jpeg images
app.post("/storeNews", upload.array('images', 2), async (req, res) => {
  try {
    const {newsUrl, headline, newsDate } = req.body;
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
app.get("/getAllNews", async(req, res) => {
  try{
    const result = await pool.query('SELECT * FROM News');
    if (result.rows.length > 0){
      const responseBody = result.rows.map(News => ({
        title: News.title,
        content: News.content,
        cardImage: News.cardImage,
        createdAt: News.createdAt,
        updatedAt: News.updatedAt
      }));
      res.status(200).json(responseBody); //Return the list of news as JSON
    } else {
      res.status(404).json({error: "No News Found."});
    }
  } catch (err){
      console.error(err.message);
      res.status(500).json({error: "Internal Server Error"});
  }
});

//get the list of URLS
app.get("/allNewsURL", async(req, res) => {
  try {
    const result = await pool.query('SELECT n.newsUrl FROM News as n');
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

//get the cardImage associated with the given newsId
app.get("/newsCardImage/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params; // Correct way to access route parameters
    // Assuming newsId is an integer, validate accordingly
    const newsIdInt = parseInt(newsId, 10);
    if (isNaN(newsIdInt)) {
      return res.status(400).json({ error: "Invalid news ID." });
    }
    //console.log("newsIdInt:", newsIdInt); // Print newsIdInt for debugging
    const result = await pool.query(`SELECT n.cardImage FROM News as n WHERE n.newsId = ${newsIdInt}`);
    console.log(result.rows.length);
    //console.log("Rows:", result.rows);
    if (result.rows.length > 0 && result.rows[0].cardimage) {
      const imageBuffer = result.rows[0].cardimage;
      res.writeHead(200, {
        'Content-Type': `image/jpeg`,
        'Content-Length': imageBuffer.length
      });
      res.end(imageBuffer); // Send the binary data as the response
    } else {
      res.status(404).json({ error: "Image not found." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allNewsBannerImages", async (req, res) => {
  try {
    const result = await pool.query('SELECT n.bannerImage FROM News as n');
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

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
