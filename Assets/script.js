var responseText = document.getElementById('response-text');
var badRequestUrl = "api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=858c53e89b222f3c6abb400167b0fee4"

function getApi(request) {
    fetch(request) 
    .then(function(response) {
        console.log(response.status);
       return response.json();

    })
}



getApi(badRequestUrl);


