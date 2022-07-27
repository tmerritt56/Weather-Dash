$(document).ready(function() {

    var NowMoment = moment().format("MM-DD-YYYY, hh:mm");

    var dayOne= moment().add(1, "days").format("MM-DD-YYYY, hh:mm");
    var dayTwo = moment().add(2, "days").format("MM-DD-YYYY, hh:mm");
    var daythree= moment().add(3, "days").format("MM-DD-YYYY, hh:mm");
    var dayfour = moment().add(4, "days").format("MM-DD-YYYY, hh:mm");
    var dayfive = moment().add(5, "days").format("MM-DD-YYYY, hh:mm");

    var city;
    var cities;

    function loadMostRecent () {
        var lastSearch = localStorage.getItem("mostRecent");
        if (lastSearch) {
            city = lastSearch;
            search();
        } else {
            city ="Nashville";
            search();
        }
    }

    loadMostRecent();

    function loadRecentCities () {
        var recentCities = JSON.parse(localStorage.getItem("cities"));
        if (recentCities) {
            cities = recentCities;
        } else {
            cities = [];
        }
    }

    loadRecentCities();

    $("#submit").on("click",(e) => {
        e.preventDefault();
        getCity();
        search();
        $("#cityinput").val("");
        listCities();
    });

    function saveToLocalStorage() {
        localStorage.setItem("mostRecent", city);
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    function getCity () {
        city = $("#cityinput").val();
        if (city && cities.includes(city) === false) {
            saveToLocalStorage();
            return city;
        } else (!city) 
            alert("Please enter a valid city!");
    }

    function search () {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=858c53e89b222f3c6abb400167b0fee4";
        var coords = [];
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            coords.push(response.coord.lat);
            coords.push(response.coord.lon);
            var cityName = response.name;
            var cityCond = response.weather[0].description.toUpperCase();
            var cityTemp = response.main.temp;
            var cityWind = response.wind.speed;
            var cityHum = response.main.humidity;
            var icon = response.weather[0].icon;
            $("#icon").html(
                `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
            );

            $("#cityname").html(cityName + "" + "(" + NowMoment + ")");
            $("#citycond").text("Current Conditions: " + cityCond);
            $("#temp").text("Current Temp (F): " + cityTemp.toFixed());
                $("#humidity").text("Humidity: " + cityHum + "%");
                $("#windspeed").text("Wind Speed: " + cityWind + "mph");
                $("#dateOne").text(dayOne);
                $("#dateTwo").text(dayTwo);
                $("#datethree").text(daythree);
                $("#datefour").text(dayfour);
                $("#datefive").text(dayfive);

                getUV(response.coord.lat, response.coord.lon);
        }).fail(function(){
            alert("could not get data")
        });
        function getUV (lat,lon) {


            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=858c53e89b222f3c6abb400167b0fee4",
                method: "GET",
            }).then(function (response) {


                var uvI = response.current.uvi;
                $("#uv-index").text("UV Index:"+ "" + uvI);
                if (uvI >= 8) {
                    $("#uv-index").css("color", "red");
                } else if (uvI > 4 && uvI < 8) {
                    $("#uv-index").css ("color", "yellow");
                } else {
                    $("#uv-index").css ("color", "green");
                }
                var day1temp = response.daily[1].temp.max;
                var day2temp = response.daily[2].temp.max;
                var day3temp = response.daily[3].temp.max;
                var day4temp = response.daily[4].temp.max;
                var day5temp = response.daily[5].temp.max;

                var day1hum = response.daily[1].humidity;
                var day2hum = response.daily[2].humidity;
                var day3hum = response.daily[3].humidity;
                var day4hum = response.daily[4].humidity;
                var day5hum = response.daily[5].humidity;

                var icon1 = response.daily[1].weather[0].icon;
                var icon2 = response.daily[2].weather[0].icon;
                var icon3 = response.daily[3].weather[0].icon;
                var icon4 = response.daily[4].weather[0].icon;
                var icon5 = response.daily[5].weather[0].icon;

                $("#tempOne").text("Temp(F):" + " " + day1temp.toFixed(1));
                $("#tempTwo").text("Temp(F):" + " " + day2temp.toFixed(1));
                $("#tempthree").text("Temp(F):" + " " + day3temp.toFixed(1));
                $("#tempfour").text("Temp(F):" + " " + day4temp.toFixed(1));
                $("#tempfive").text("Temp(F):" + " " + day5temp.toFixed(1));

                $("#humOne").text("Humidity:" + " " + day1hum + "%");
                $("#humTwo").text("Humidity:" + " " + day2hum + "%");
                $("#humthree").text("Humidity:" + " " + day3hum + "%");
                $("#humfour").text("Humidity:" + " " + day4hum + "%");
                $("#humfive").text("Humidity:" + " " + day5hum + "%");

                $("#iconOne").html(`<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
                );
                $("#iconTwo").html(
                  `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
                );
                $("#iconthree").html(
                  `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
                );
                $("#iconfour").html(
                  `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
                );
                $("#iconfive").html(
                  `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
                );
        
            });
        }

    }

    function listCities () {
        $("#citylist").text("");
        cities.forEach((city)=> {
            $("#citylist").prepend("<tr><td>" + city + "</td></tr>");
        });
    }

    listCities ();

    $(document).on("click", "td", (e) => {
        e.preventDefault ();
        var listedCity = $(e.target).text();
        city =listedCity;
        search();
    });

    $("#clrbtn").click(() => {
        localStorage.removeItem("cities");
        loadRecentCities();
        listCities();
    });

});


