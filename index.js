import express from 'express';
import bodyParser from 'body-parser';
import pgp from "pg-promise";
import { engine } from 'express-handlebars';
import Routes from './routes/routes.js';
import Database from './database/database.js';

const app = express();
const connectionString = process.env.DATABASE_URL || 'postgres://dbkwvzir:cWanj6tlVAm7d3vn-RxLGv6WSK1StBgg@trumpet.db.elephantsql.com/dbkwvzir';
const postgresP = pgp();
const db = postgresP(connectionString);
const database = Database(db);
const routes = Routes(database);


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', async function(req, res){
  // try {
  //   const response = await axios.get('https://jsonplaceholder.typicode.com/');
  //   console.log(response);
  // } catch (error) {
  //   console.error(error);
  // }

  let shoeResults = await database.getAllShoes();
  let shoeBrands = await database.getAllBrandNames();
  let shoeSizes = await database.getAllShoeSizes();
  
  res.render('updateShoe', {shoes: shoeResults, brand: shoeBrands, size: shoeSizes});
    
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
