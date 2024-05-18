export default function CustomerService(db){
    //All calls to the CUSTOMERS table
    async function addCustomer(name, email, hashedPassword){
        await db.none('INSERT INTO customers (name, email, password, has_cart) values ($1, $2, $3, $4);', [name, email, hashedPassword, false]);
    }

    async function getPassword(email){
        let pswd = await db.one('SELECT * FROM customers WHERE email = $1', [email]);
        return pswd;
    }

    return{
        addCustomer,
        getPassword
    }
}