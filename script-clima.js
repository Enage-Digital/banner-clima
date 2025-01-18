//configuracion
const API_KEY = "9ec9e53fdacca4be970248c7e3c45b91";
const CITY = "Santiago";
const TEMP_COLOR = "#ff0080";
const CITY_COLOR = "#ff0080";
const DAY_COLOR = "#ff0080";


//obtener datos de la geolocalizacion
async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    // console.log(latitude, longitude);
                    resolve({ latitude, longitude });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported"));
        }
    });
}

//obtener datos del clima
async function getWeather(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}&units=metric`;
    let data = await fetch(url);
    let json = await data.json();
    return json;
}

// obtener ciudad
async function obtenerCiudad(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&limit=1&language=es`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.address && data.address.city) {
            // console.log(`Ciudad: ${data.address.city}`);
            return data.address.city;
        } else {
            throw new Error("No se encontró la ciudad.");
        }
    } catch (error) {
        console.error("Error al obtener la ciudad:", error);
        throw error;
    }
}

//crear html personalizado
function createCustomHtml(txtCity = "Santiago", txtTemp = "23°", txtIcon = "10d") {

    const canvas = document.getElementById("canvas");
    const clickTag = document.getElementById("clickTag");
    clickTag.style.zIndex = "2";
    //crear div temperatura
    const temp = document.createElement("div");
    temp.style.width = "83px";
    temp.style.height = "21px";
    temp.style.position = "absolute";
    temp.style.fontFamily = "Arial, sans-serif";
    temp.style.fontSize = "12px";
    temp.style.fontWeight = "bold";
    temp.style.top = "65px";
    temp.style.left = "159.33331298828px";
    temp.style.backgroundColor = "rgb(246 247 245)";
    temp.style.display = "flex";
    temp.style.justifyContent = "center";
    temp.style.alignItems = "center";
    temp.style.zIndex = "1";
    temp.style.color = TEMP_COLOR;
    temp.innerHTML = `<span>${txtCity}</span>`;
    canvas.appendChild(temp);

    //crear div temperatura
    const city = document.createElement("div");
    city.style.width = "120px";
    city.style.height = "45px";
    city.style.position = "absolute";
    city.style.fontFamily = "Arial, sans-serif";
    city.style.fontSize = "55px";
    city.style.fontWeight = "bold";
    city.style.top = "22px";
    city.style.left = "145px";
    city.style.backgroundColor = "rgb(246 247 245)";
    city.style.display = "flex";
    city.style.justifyContent = "center";
    city.style.alignItems = "center";
    city.style.zIndex = "1";
    city.innerHTML = `<span>${Math.round(txtTemp)}°</span>`;
    city.style.color = CITY_COLOR;
    canvas.appendChild(city);

    //crear div icono
    const icon = document.createElement("div");
    icon.style.display = "block";
    icon.style.position = "absolute";
    icon.style.width = "70px";
    icon.style.height = "70px";
    icon.style.visibility = "visible";
    icon.style.left = "66px";
    icon.style.opacity = "1";
    icon.style.top = "25px";
    icon.style.backgroundColor = "rgb(246 247 245)";
    icon.style.zIndex = "1";
    icon.innerHTML = `<img src="icons/${txtIcon}_t.png" alt="icon" style="width: 100%; height: 100%;" >`;
    canvas.appendChild(icon);

    //crear div dia
    const todayDay = document.createElement("div");
    const hoy = new Date();
    const dia = hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

    todayDay.style.width = "100px";
    todayDay.style.height = "11px";
    todayDay.style.position = "absolute";
    todayDay.style.fontFamily = "Arial, sans-serif";
    todayDay.style.fontSize = "10px";
    todayDay.style.fontWeight = "bold";
    todayDay.style.top = "84px";
    todayDay.style.left = "151px";
    todayDay.style.backgroundColor = "rgb(246 247 245)";
    todayDay.style.display = "flex";
    todayDay.style.justifyContent = "center";
    todayDay.style.alignItems = "center";
    todayDay.style.zIndex = "1";
    todayDay.style.color = DAY_COLOR;
    todayDay.innerHTML = `<span>${dia}</span>`;
    canvas.appendChild(todayDay);
}


//mostrar clima
async function mostrarClima() {

    try {   
        const location = await getLocation();
        const city = await obtenerCiudad(location.latitude, location.longitude); 
        const weather = await getWeather(city);
        // console.log(weather);
        createCustomHtml(city, weather.main.temp, weather.weather[0].icon, weather.weather[0].description);   
    } catch (error) {
        console.error("Error:", error.message);
    }
}

mostrarClima();