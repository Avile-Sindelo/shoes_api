import bcrypt from 'bcrypt';

export default function customerRoutes(customerService, customerAPI, shoesService){
    const saltRounds = 10;
    let messages = {error: '', success: ''};
    
    async function duplicate(email){
        let emails = await customerService.emails();

        if(emails.includes(email)){
            // console.log('Duplicate!!!');
            return true;
        } else {
            // console.log('new customer');
            return false;
        };
    }

    async function register(req, res){
        try {
            //clear the messages
            messages.error = '';
            messages.success = '';

            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;
            let confirmPassword = req.body.confirm;
            
            console.log('Customer name :', name);
            console.log('Customer email :', email);
            console.log('Customer password :', password);
            console.log('Customer confirm pswd :', confirmPassword);
        
            // regex to verify the format
            const nameRegex = /^[A-Za-z]+$/;
        
            if(nameRegex.test(name)){
            console.log('Valid name!');
            // make sure the passwords match 
            if(password === confirmPassword){
                console.log('Passwords match!!');
                //check for duplicacy
                console.log('Duplicate? :', await duplicate(email));
                console.log('Sent email: ', email);
                // console.log('List of stored emails: ', emails);

                if(await duplicate(email)){
                    //duplicate
                    messages.error = 'Customer already exists. Please login below.';
                    messages.success = ''; 
                    res.render('login', {messages});
                } else {
                    //not a duplicate

                    //hash it & store in DB
                    bcrypt.hash(password, saltRounds, async function(err, hash){
                        if(err){
                            console.error(err);
                        } else {
                            console.log(hash);
                            //store the details in the database
                            await customerService.addCustomer(name, email, hash);
                            messages.error = '';
                            messages.success = 'Yay! Registration successful.';
                            console.log(messages);
                            res.render('login', {messages});
                        }
                    });

                }
            } else {
                console.log('Passwords do not match!!');
                messages.success = '';
                messages.error = 'Passwords do not match.'
                //redirect to the Register view
                res.render('index', {messages});
            }
            } else {
                console.log('Invalid name!');
                messages.success = '';
                messages.error = 'Oops! Invalid name.';
                res.render('index', {messages});
            }
        } catch (error) {
                console.error(error);
        }
    }

    async function login(req, res){
        try {

            //clear the messages
            messages.error = '';
            messages.success = '';
            //Extract the email & pasword from the request object
            let email = req.body.email;
            let password = req.body.password;
            
            console.log('Email :', email);
            console.log('Password :', password);
            
            //use the email to retrieve the hashed password from the DB
            let details = await customerService.getPassword(email);
            console.log('Details :', details);

            //use BCRYPT to COMPARE the 2 passwords
            bcrypt.compare(password, details.password, async function(err, isMatch){
                if(err){
                    console.error(err);
                } else if(isMatch){
                    console.log('Cheers! Passwords Match!!');
                    //render showAll

                    let shoeResults = await shoesService.getAllShoes();
                    let shoeBrands = await shoesService.getAllBrandNames();
                    let shoeSizes = await shoesService.getAllShoeSizes();
                    
                    res.render('updateShoe', {shoes: shoeResults, brands: shoeBrands, sizes: shoeSizes, messages, details});
                } else {
                    console.log('Whoops! Passwords do not match.');
                    messages.error = 'Whoops! Incorrect password. Try again...';
                    messages.success = '';
                    // login screen
                    res.render('login', {messages});
                }
            });
        } catch (error) {
            console.error(error)
        }
    }

    return {
        register, 
        login
    }
}