export default function shoeRoutes(shoesService, shoesAPI){
    //Make all the calls to table SHOES & Render them to Home
    async function showAll(req, res){
        try{

            let shoeResults = await shoesService.getAllShoes();
            let shoeBrands = await shoesService.getAllBrandNames();
            let shoeSizes = await shoesService.getAllShoeSizes();
            
            res.render('updateShoe', {shoes: shoeResults, brands: shoeBrands, sizes: shoeSizes});
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
                res.render('updateShoe', {shoes: results, brands, sizes})
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
                res.render('updateShoe', {shoes: sizeResults, sizes, brands})
            }

        } catch(err){
            console.error(err)
        }
    }

    async function showBrandAndSize(req, res){
        try{
            let brand = req.params.brandname;
            let size = req.params.size;
            let verified = await shoesAPI.verifyBrand(brand);
    
            let results = await shoesService.getShoesSizeAndBrand(verified, size); 
            res.render('updateShoe', {shoes: results});

        } catch(err){
            console.error(err);
        }
    }

    async function sellShoe(req, res){
        // try{
        //     let shoeId = req.params.id;
        //     console.log(id)
        //     let result = await shoesService.updateSoldShoe(shoeId);
        //     console.log(result);

        // } catch(err){
        //     console.error(err)
        // }

        console.log(req.params.id);
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
        sellShoe
    }
}