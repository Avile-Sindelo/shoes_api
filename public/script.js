// axios call somewhere here 
const data = axios.get('https://shoes-api-chdd.onrender.com/api/shoes')
         .then(function (response) {
             // handle success
             console.log(response);
            })
        .catch(function (error) {
         // handle error
        console.log(error);
    });

    console.log('API data: ', data);

const success = document.getElementById('success_message');
if(success.value != ''){
         setInterval(funtion(){
                  success.textContent = ''; 
         }, 3000);
}
