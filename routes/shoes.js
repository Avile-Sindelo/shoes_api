
export default function shoeRoutes(shoesService, shoesAPI){
    // const saltRounds = 10;
    let messages = {error: '', success: ''};
    //Make all the calls to table SHOES & Render them to Home
    async function showAll(req, res){
        try{

            let shoeResults = await shoesService.getAllShoes();
            let shoeBrands = await shoesService.getAllBrandNames();
            let shoeSizes = await shoesService.getAllShoeSizes();
            
            res.render('login', {shoes: shoeResults, brands: shoeBrands, sizes: shoeSizes, messages});
        } catch(err){
            console.error(err);
        }
    }

 
    async function showBrandShoes(req, res){
        try{
            let brand = req.query.brandname;
            let verified = await shoesAPI.verifyBrand(brand);
            let results = await shoesService.getBrandShoes(verified);
            let brands = await shoesService.getAllBrandNames();
            let sizes = await shoesService.getAllShoeSizes();
            // console.log('Results: ', results);
            if(results == `No shoes were returned for the brand ${verified}`){
                res.redirect('/api/shoes');
            } else {
                messages.error = '';
                messages.success = `Available ${brand} shoes below`;
                res.render('updateShoe', {shoes: results, brands, sizes, messages})
            }
            
        } catch(err){
            console.error(err)
        }
    }

    async function showSizeShoes(req, res){
        try{

            let size = req.query.size;
            let sizeResults = await shoesService.getShoesOfSize(size);
            let sizes = await shoesService.getAllShoeSizes();
            let brands = await shoesService.getAllBrandNames();
            if(sizeResults == `No shoes were returned for size ${size}`){
                res.redirect('/api/shoes');
            } else {
                messages.error = '';
                messages.success = `Available size ${size} shoes displayed below`;
                res.render('updateShoe', {shoes: sizeResults, sizes, brands, messages})
            }

        } catch(err){
            console.error(err)
        }
    }

    async function showBrandAndSize(req, res){
        try{
            let brand = req.query.brand_name;
            let size = req.query.size;
            let verified = await shoesAPI.verifyBrand(brand);
            let sizes = await shoesService.getAllShoeSizes();
            let brands = await shoesService.getAllBrandNames();
    
            let results = await shoesService.getShoesSizeAndBrand(verified, size); 
            
            if(results == `No shoes were found for ${brand} size ${size}`){
                messages.success = '';
                messages.error = results;
            } else{
                messages.error = '';
                messages.success = `${verified} size ${size} shoes displayed below`;

            }
            res.render('updateShoe', {shoes: results, sizes, brands, messages});

        } catch(err){
            console.error(err);
        }
    }

    async function showIndex(req, res){
        try{
            res.render('index')
        } catch(err) {
            console.log(err);
        }
    }

    async function sellShoe(req, res){
        try{
            let shoeId = req.params.id;
            console.log('Shoe ID', shoeId);
            let result = await shoesService.updateSoldShoe(shoeId);
           
            if(result == 'Out of stock!!!'){
                messages.success = '';
                messages.error = result;
            } else {
                messages.error = '';
                messages.success = result;
            }
            console.log('Result :', result);
            res.redirect('/api/shoes');

        } catch(err){
            console.error(err)
        }

    }

    async function addShoe(req, res){
        try{

            // grab the details from request & store them in an object
            let details = {
                brand : req.body.brandname,
                size : req.body.size,
                color : req.body.color,
                stock : req.body.stock,
                price : req.body.price,
                image : req.body.image
            }
            
            await shoesAPI.addNewShoe
            
            //reder a view
            res.redirect('/')

        } catch(err){
            console.error(err);
        }
    }

    return {
        showAll,
        showBrandShoes,
        showSizeShoes,
        showBrandAndSize,
        sellShoe,
        showIndex
    }
}
