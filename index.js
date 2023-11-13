import express from 'express';
import axios from 'axios';


const app = express();

app.get('/', async (req, res)=>{
    await getUser();
    async function getUser() {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/');
          console.log(response);
        } catch (error) {
          console.error(error);
        }
    res.send('This is a message from the server');
    }
});

const port  = 4000;
app.listen(port, ()=>{
    console.log(`Server started at port ${port}`)
});
