export default function Database(db){
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

    return{
        getAllShoes,
        getBrandShoes,
        getShoesOfSize,
        getShoesSizeAndBrand
    }
}