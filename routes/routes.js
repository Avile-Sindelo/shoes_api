export default function Routes(database){
    async function listAllShoes(req, res){
        //call the database method that returns all the shoes
        let shoes = await database.getAllShoes();
       //HTTP status - Ok
        res.status(200);
        //Send the returned information to the client via the Response object
        res.send(shoes);
    }

    async function listAllBrandShoes(req, res){
        //Get the shoe brand from the request
        let brand = req.params.brandname;
        
        //Call the database method that returns all shoes for a specific brand
        let brandShoes = await database.getBrandShoes(brand);
        //Render a view to display all the shoes of the same brand
        res.send(brandShoes);
    }

    async function listAllSizeShoes(req, res){
        //Get the shoes size from the request object
        let size = req.params.size;
        console.log(size);
        //Call the database method that returns all the shoes of the given size
        let sizeShoes = await database.getShoesOfSize(size);
        //Render a view too display all the shoes of that given size 
        res.send(sizeShoes);
    }

    async function shoesBrandAndSize(req, res){
        //Get the brand and size from the request object
        let brand = req.params.brandname;
        let size = req.params.size;
        
        //Call the database method that returns the shoes for a given brand and size
        let shoes = await database.getShoesSizeAndBrand(brand, size);
        //Render a view to display the shoes
        res.send(shoes);
    }

    async function updateShoeStock(req, res){
        //Get the update information from the request - shoe id
        //Call the database and update the "in-stock" value when a shoe is sold - decrement the stock
        //Render a view that shows all the shoes  
    }

    async function addNewShoe(req, res){
        //Get the new shoe details from the request
        //Validate the shoe details
        //Call the database and add the new shoe
        //Render a view to display 
    }

    return{
        listAllShoes,
        listAllBrandShoes,
        listAllSizeShoes,
        shoesBrandAndSize,
        updateShoeStock,
        addNewShoe
    }
}