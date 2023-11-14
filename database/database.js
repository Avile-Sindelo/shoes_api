export default function Database(db){
    async function getAllShoes(){
        let allShoes = await db.many('SELECT * FROM shoes');
        return allShoes ? allShoes : "No shoes were found in the database";
    }

    return{
        getAllShoes
    }
}