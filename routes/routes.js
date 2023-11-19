export default function Routes(database){
    async function verifyBrand(brandname){
        //test again regex
        if(validateBrand(brandname)){
           //capitalize
           return capitalizeBrand(brandname);
        } else {
            //invalid name
            return "Invalid name";
        }
    }

    function validateBrand(brand){
        let regex = /^[a-zA-Z\s]+$/;

        return regex.test(brand);
    }

    function capitalizeBrand(brand){
        let brandCapital = brand.toLowerCase();
        return brandCapital[0].toUpperCase() + brandCapital.slice(1);
    }

    async function listAllShoes(req, res){
        //call the database method that returns all the shoes
        let shoes = await database.getAllShoes();
       
        //Send the returned information to the client via the Response object
        res.send(shoes);
    }

    async function listAllBrandShoes(req, res){
        //Get the shoe brand from the request
        let brandname = req.params.brandname;
        let brand = await verifyBrand(brandname);
      
        //Call the database method that returns all shoes for a specific brand
        let brandShoes = brand == `Invalid name` ? brand : await database.getBrandShoes(brand);
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
        let brandname = req.params.brandname;
        let size = req.params.size;
        let brand = await verifyBrand(brandname);
        
        //Call the database method that returns the shoes for a given brand and size
        let shoes = await database.getShoesSizeAndBrand(brand, size);
        //Render a view to display the shoes
        res.send(shoes);
    }

    async function updateShoeStock(req, res){
        //Get the update information from the request - shoe id
        let shoeId = req.params.id;
        console.log(shoeId);
        //Call the database and update the "in-stock" value when a shoe is sold - decrement the stock
        let updateResult = await database.updateSoldShoe(shoeId); 
        console.log(updateResult)
        //Render a view that shows all the shoes  
        res.send(updateResult);
    }

    async function addNewShoe(req, res){
        //Get the new shoe details from the request
        console.log(req.body)
        //Validate the shoe details
        //Call the database and add the new shoe
        //image handling
        //Render a view to display 
        res.send("...Still working on it");
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