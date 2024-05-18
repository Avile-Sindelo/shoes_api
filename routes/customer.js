import bcrypt from 'bcrypt';

export default function customerRoutes(customerService, customerAPI){
    const saltRounds = 10;
    let messages = {error: '', success: ''};
    

    async function register(req, res){
        try {
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
                    }
                });
            } else {
                console.log('Passwords do not match!!');
                messages.success = '';
                messages.error = 'Passwords do not match.'
                //redirect to the Register view
            }
            } else {
            console.log('Invalid name!');
            messages.success = '';
            messages.error = 'Oops! Invalid name.';
            }
        } catch (error) {
            console.error(error);
        }
       
        //redirect to login screen
        res.redirect('/api/shoes');
    }

    async function login(req, res){
        try {
            //Extract the email & pasword from the request object
            let email = req.body.email;
            let password = req.body.password;
            
            console.log('Email :', email);
            console.log('Password :', password);
            
            //use the email to retrieve the hashed password from the DB
            let hashedPassword = await customerService.getPassword(email);
            console.log('Details :', hashedPassword);

            //use BCRYPT to COMPARE the 2 passwords
            bcrypt.compare(password, hashedPassword.password, function(err, isMatch){
                if(err){
                    console.error(err);
                } else if(isMatch){
                    console.log('Cheers! Passwords Match!!');
                    //render showAll
                    // res.redirect('/api/shoes/')
                } else {
                    console.log('Whoops! Passwords do not match.');
                    //redirect to login
                    res.redirect('/login');
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