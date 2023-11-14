import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';
import pgp from "pg-promise";
import { engine } from 'express-handlebars';
import Routes from './routes/routes.js';
import Database from './database/database.js';

const app = express();
const connectionString = process.env.DATABASE_URL || 'postgres://shoes_api_user:VOL29ehsnuBovbbqKuhHC5gw3Z4EtP9m@dpg-cl9hi65o7jlc73fdthgg-a.singapore-postgres.render.com/shoes_api';
const postgresP = pgp();
const db = postgresP(connectionString);
const database = Database(db);
const routes = Routes(database);
console.log('Database instance :', db);


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());


app.get('/', async (req, res)=>{
    await getUser();
    async function getUser() {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/');
          console.log(response.data);
          res.json(response.data);
        } catch (error) {
          console.error(error);
        }
    res.send('This is a message from the server');
    }
});

app.get('/api/shoes', routes.listAllShoes); //List all shoes in stock
app.get('/api/shoes/brand/:brandname', routes.listAllBrandShoes); //list all shoes for a specific brand
app.get('/api/shoes/size/:size', routes.listAllSizeShoes); //List all shoes for a given size
app.get('/api/shoes/brand/:brandname/size/:size', routes.shoesBrandAndSize); //List all shoes for a given brand and size
app.post('/api/shoes/sold/:id', routes.updateShoeStock); //Update the stock levels when a shoe is sold
app.post('/api/shoes', routes.addNewShoe); //Add a new shoe to his stock

const port  = 4000;
app.listen(port, ()=>{
  console.log(`Server started at port ${port}`)
});
