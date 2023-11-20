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
        let brand = req.body.brandName;
        let color = req.body.color;
        let size = req.body.size;
        let stock = req.body.stock;
        let price = req.body.price;
        
        let shoeDetails = {
            brand: brand,
            color: color,
            size: size,
            stock: stock,
            price: price
        
        }

        //Validate the shoe details
    
        if(verifyShoeDetails(shoeDetails) == true){
            
            //Call the database and add the new shoe
            await database.addShoeToStock(shoeDetails);
            //image handling    
            res.send(shoeDetails);
        } else {
            res.send(verifyShoeDetails(shoeDetails));
        }

        

    }

    function verifyShoeDetails(details){
        //Regex to test the brand name and the shoe color
        let stringRegex = /^[a-zA-Z ]+$/;
        
        //Another one for price
        let priceRegex = /^\d+(\.\d{1,2})?$/;

        if(!stringRegex.test(details.brand)){
            return "Please make sure you enter a vaild Brand name";
        }

        if(!stringRegex.test(details.color)){
            return "Please make sure you enter a valid shoe color";
        }

        if(!priceRegex.test(details.price)){
            return "Please make sure you enter the correct price";
        }

        if(details.stock < 1){
            return "Please make sure you add at least 1 shoe in the stock";
        }

        if(details.size < 1 || details.size > 15){
            return "Please enter a valid shoe size";
        }

        return true;
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