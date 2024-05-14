export default function ShoesService(db){
    async function getAllShoes(){
        let allShoes = await db.manyOrNone('SELECT * FROM shoes');
        return allShoes ? allShoes : "No shoes were found in the database";
    }

    async function getBrandShoes(brand){
        let brandShoes = await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1', [brand]);
        return brandShoes.length == 0 ? `No shoes were returned for the brand ${brand}` : brandShoes;
    }

    async function getShoesOfSize(size){
        let shoesForSize = await db.manyOrNone('SELECT * FROM shoes WHERE size=$1', [size]);
        return shoesForSize.length == 0? `No shoes were returned for size ${size}` : shoesForSize;
    }

    async function getShoesSizeAndBrand(brand, size){
        let sizeAndBrand = await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1 AND size=$2', [brand, size]);
        return sizeAndBrand.length == 0 ? `No shoes were returned for ${brand} size ${size}` : sizeAndBrand;
    }

    async function updateSoldShoe(id){
        //Retrieve the shoe whose ID is the passed parameter
        let soldShoe = await db.one('SELECT * FROM shoes WHERE id=$1', [id]);
            //if "in_stock" of the shoe is greater than 0
                if(soldShoe.in_stock > 0){
                    //Decrement the "in_stock" value for the shoe retrieved
                   await db.none(`UPDATE shoes
                                    SET in_stock = in_stock - 1
                                    WHERE id=$1`, [id]);

                    return 'Stock updated successfully!';
                }
            //else
                else{
                    return 'Out of stock!!!';
                }
                //return "Out of stock" message 

        
        // shoesIDs.forEach(async (shoe)=>{
        //     if(shoe.id == id){
        //         console.log('FOund!!!');
        //         //get the available stock to check if its not less than zero
        //         let  shoeStock = await db.one('SELECT in_stock FROM shoes WHERE id=$1', [id]);
        //         console.log('Shoe stock :', shoeStock.in_stock);
        //         //make sure the stock is not less than zero
        //         if(shoeStock.in_stock < 1){
        //             //Out of stock
        //             console.log('Out of stock');
        //             return 'Out of stock';
        //         } else {
        //             //update logic goes here...
        //             console.log('Sell and update');
        //             await db.none(`UPDATE shoes 
        //                             SET in_stock = in_stock - 1
        //                             WHERE id=$1`, [id]);
        //             return 'Shoe stock updated successfully';
        //         }
        //     } else {
        //         return 'No shoe with that ID was found';
        //     }
        // });

    }

    async function addShoeToStock(shoeDetails){
        await db.none(`INSERT INTO shoes (brand, color, size, in_stock, price, image_url)
                        VALUES ($1, $2, $3, $4, $5, $6)`, [shoeDetails.brand, shoeDetails.color, shoeDetails.size, shoeDetails.stock, shoeDetails.price, shoeDetails.image]);
    }

    async function getAllBrandNames(){
        let brands = await db.manyOrNone('SELECT brand FROM shoes');
        //remove duplicates
        let trimmedBrands = [];
        brands.forEach((shoe)=>{
            if(!trimmedBrands.includes(shoe.brand)){

                trimmedBrands.push(shoe.brand);
            }

        })

        return trimmedBrands;
    }

    async function getAllShoeSizes(){
        let sizes = await db.manyOrNone('SELECT size FROM shoes');
        let trimmedSize = [];
        sizes.forEach((shoe)=>{
            if(!trimmedSize.includes(shoe.size)){
                trimmedSize.push(shoe.size)
            }
        });
        return trimmedSize;
    }

    return{
        getAllShoes,
        getBrandShoes,
        getShoesOfSize,
        getShoesSizeAndBrand,
        updateSoldShoe,
        addShoeToStock,
        getAllBrandNames,
        getAllShoeSizes
    }
} 
