export default function Routes(database){
    async function verifyBrand(brandname){
        //test again regex
        if(validateBrand(brandname)){
           //capitalize
           return capitalizeBrand(brandname);
        } else {
            //invalid name
            return "Invalid brand name";
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
        try{
            //call the database method that returns all the shoes
            let shoes = await database.getAllShoes();
            res.json({
                status: 'success',
                data: shoes
            });
        } catch(err){
            res.json({
                status: 'error',
                error: err.stack
            })
        }
    
    }

    async function listAllBrandShoes(req, res){
        try{
            //Get the shoe brand from the request
            let brandname = req.params.brandname;
            let brand = await verifyBrand(brandname);
          
            //Call the database method that returns all shoes for a specific brand
            // let brandShoes = brand == `Invalid brand name` ? brand : await database.getBrandShoes(brand);
            if(brand == `Invalid brand name`){
                res.json({
                    status: 'error',
                    error: brand
                });
            } else {
                let brandShoes = await database.getBrandShoes(brand)
                
                //Render a view to display all the shoes of the same brand
                res.json({
                    status: 'success',
                    data: brandShoes
                });
            }

        } catch(err){
            res.json({
                status: 'error',
                error: err.stack
            })
        }
    }

    async function listAllSizeShoes(req, res){
        try{
            //Get the shoes size from the request object
            let size = req.params.size;
            console.log(size);
            //Call the database method that returns all the shoes of the given size
            let sizeShoes = await database.getShoesOfSize(size);
            //Render a view too display all the shoes of that given size 
            res.json({
                status: 'success',
                data: sizeShoes
            })

        } catch(err){
            res.json({
                status: 'error',
                error: err.stack
            });
        }
    }

    async function shoesBrandAndSize(req, res){
        try{
            //Get the brand and size from the request object
            let brandname = req.params.brandname;
            let size = req.params.size;

            cosole.log('Brand :', brandname)
            cosole.log('Size :', size)
            let brand = await verifyBrand(brandname);
            
            //Call the database method that returns the shoes for a given brand and size
            let shoes = await database.getShoesSizeAndBrand(brand, size);
            //Render a view to display the shoes
            res.json({
                status: 'success',
                data: shoes
            });

        } catch(err){
            res.json({
                status: 'error',
                error: err.stack
            });
        }
    }

    async function updateShoeStock(req, res){
        try{
        //Get the update information from the request - shoe id
        let shoeId = req.params.id;
        console.log(shoeId);
        //Call the database and update the "in-stock" value when a shoe is sold - decrement the stock
        let updateResult = await database.updateSoldShoe(shoeId); 
        console.log(updateResult)
        //Render a view that shows all the shoes  
        res.json({
            status: 'success',
            data: updateResult
        });
        
        } catch(err){
            res.json({
                status: 'error', 
                error: err.stack
            })
        }
    }

    async function addNewShoe(req, res){
        try{
        
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
        } catch(err){
            res.json({
                status: 'error',
                error: err.stack
            });
        }

    }

    function verifyShoeDetails(details){
        //Make sure the input fields are not empty
       
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