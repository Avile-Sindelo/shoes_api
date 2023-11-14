export default function Routes(database){
    async function listAllShoes(req, res){
        
        //call the database method that returns all the shoes
        //render a view to show the shoes returned from the database
    }

    async function listAllBrandShoes(req, res){
        //Get the shoe brand from the request
        //Call the database method that returns all shoes for a specific brand
        //Render a view to display all the shoes of the same brand
    }

    async function listAllSizeShoes(req, res){
        //Get the shoes size from the request object
        //Call the database method that returns all the shoes of the given size
        //Render a view too display all the shoes of that given size 
    }

    async function shoesBrandAndSize(req, res){
        //Get the brand and size from the request object
        //Call the database method that returns the shoes for a given brand and size
        //Render a view to display the shoes
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