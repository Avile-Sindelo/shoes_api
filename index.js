import express from 'express';
import bodyParser from 'body-parser';
import pgp from "pg-promise";
import { engine } from 'express-handlebars';
import Routes from './routes/routes.js';
import Database from './database/database.js';
//file system import
import fs from 'fs';

const app = express();
const connectionString = process.env.DATABASE_URL || 'postgres://dbkwvzir:cWanj6tlVAm7d3vn-RxLGv6WSK1StBgg@trumpet.db.elephantsql.com/dbkwvzir';
const postgresP = pgp();
const db = postgresP(connectionString);
const database = Database(db);
const routes = Routes(database);

// Read the image file as binary data
const imageFilePath = 'public/images/starboy.jpg'; // Replace with the path to your image
const imageBinary = fs.readFileSync(imageFilePath);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))


// Function to insert the image into the database
async function insertImage() {
  try {
    // Insert query
    const query = 'INSERT INTO images (image_name, image_data) VALUES ($1, $2) RETURNING id';
    
    // Execute the query and pass image name and binary data as parameters
    const result = await db.one(query, [`image.jpg`, imageBinary]);
    
    console.log(`Image inserted with ID: ${result.id}`);
  } catch (error) {
    console.error('Error inserting image:', error);
  } finally {
    // Close the connection
    await db.$pool.end();
  }
}

// await insertImage();


app.get('/', async function(req, res){
  // try {
  //   const response = await axios.get('https://jsonplaceholder.typicode.com/');
  //   console.log(response);
  // } catch (error) {
  //   console.error(error);
  // }

  let shoeResults = await database.getAllShoes();
  
  res.render('updateShoe', {shoes: shoeResults});
    
}); 

app.get('/api/shoes', routes.listAllShoes); //List all shoes in stock
app.get('/api/shoes/brand/:brandname', routes.listAllBrandShoes); //list all shoes for a specific brand
app.get('/api/shoes/size/:size', routes.listAllSizeShoes); //List all shoes for a given size
app.get('/api/shoes/brand/:brandname/size/:size', routes.shoesBrandAndSize); //List all shoes for a given brand and size
app.post('/api/shoes/sold/:id', routes.updateShoeStock); //Update the stock levels when a shoe is sold
app.post('/api/shoes', routes.addNewShoe); //Add a new shoe to his stock

const PORT  = process.env.PORT || 4000;
app.listen(PORT, ()=>{
  console.log(`Server started at port ${PORT}`)
});
