export default function CustomerService(db){
    //All calls to the CUSTOMERS table
    async function addCustomer(name, email, hashedPassword){
        await db.none('INSERT INTO customers (name, email, password, has_cart) values ($1, $2, $3, $4);', [name, email, hashedPassword, false]);
    }

    async function getPassword(email){
        let pswd = await db.oneOrNone('SELECT * FROM customers WHERE email = $1', [email]);
        return pswd;
    }


    async function emails(){
        let results = await db.manyOrNone('select email from customers');
        let emails = [];

        results.forEach(element => {
            emails.push(element.email);
        });

        return emails;
    }

    return{
        addCustomer,
        getPassword,
        emails
    }
}