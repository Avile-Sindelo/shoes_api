import express from 'express';
import bodyParser from 'body-parser';
import pgp from "pg-promise";
import { engine } from 'express-handlebars';

import Shoes from "./routes/shoes.js";
import Basket from "./routes/basket.js";
import Customer from "./routes/customer.js";

import ShoesAPI from "./api/shoes-api.js";
import BasketAPI from "./api/basket-api.js";
import CustomerAPI from "./api/customer-api.js";

import ShoesService from "./services/shoes-service.js";
import BasketService from './services/basket-service.js';
import CustomerService from './services/customer-service.js';


const app = express();
const connectionString = process.env.DATABASE_URL || 'postgres://dbkwvzir:cWanj6tlVAm7d3vn-RxLGv6WSK1StBgg@trumpet.db.elephantsql.com/dbkwvzir';
const postgresP = pgp();
const db = postgresP(connectionString);

//services
const shoesService = ShoesService(db);
const basketService = BasketService(db);
const customerService = CustomerService(db);

//APIs
const shoesAPI = ShoesAPI(shoesService); 
const basketAPI = BasketAPI(basketService); 
const customerAPI = CustomerAPI(customerService); 


//routes
const shoesRoutes = Shoes(shoesService, shoesAPI);
const basketRoutes = Basket(basketService, basketAPI);
const customerRoutes = Customer(customerService, customerAPI, shoesService);




app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', 'views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// temporary
app.get('/', async function(req, res){
  res.redirect('/addShoe');
});

app.post('/register', customerRoutes.register);
app.post('/login', customerRoutes.login)
app.get('/register', async function(req, res){
    res.render('index');
});

// app.get('/', shoesRoutes.showIndex); //show the Register page 
app.get('/api/shoes', shoesRoutes.showAll); //List all shoes in stock
app.get('/api/shoes/brand/', shoesRoutes.showBrandShoes); //list all shoes for a specific brand
app.get('/api/shoes/size/', shoesRoutes.showSizeShoes); //List all shoes for a given size
app.get('/api/shoes/brand/size/', shoesRoutes.showBrandAndSize); //List all shoes for a given brand and size
app.post('/api/shoes/sold/:id', shoesRoutes.sellShoe); //Update the stock levels when a shoe is sold
// app.post('/api/shoes', shoesRoutes.addNewShoe); //Add a new shoe to his stock

const PORT  = process.env.PORT || 4000;
app.listen(PORT, ()=>{
  console.log(`Server started at port ${PORT}`)
});
