import axios from 'axios';
import './App.css'
import { useRef, useState, useEffect } from 'react';
import cloudy from './assets/img/cloudy.jpg'
import foggy from './assets/img/foggy.jpg'
import rain_lightening from './assets/img/rain_lightening.jpg'
import overcast from './assets/img/overcast.jpg'
import rainy from './assets/img/rainy.jpg'
import sleet from './assets/img/sleet.jpg'
import snow_lightening from './assets/img/snow_lightening.jpg'
import snowy from './assets/img/snowy.jpg'
import sunny from './assets/img/sunny.jpg'
import thunderstorm from './assets/img/thunderstorm.jpg'


// API usage link:  https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API key = 0e67aa1753380ba20619da288d7b4edd

// https://api.openweathermap.org/data/2.5/weather?q=London&appid=0e67aa1753380ba20619da288d7b4edd

function App() {

  let [city, setcity] = useState("Dehradun");
  let [temp_data, setdata] = useState({});
  let [forecast, setforecast] = useState({});
  // let [code, setcode] = useState();
  let [changes_measure, setChangeMeasure] = useState(0);
  let bg = useRef();
  let forecast_box = useRef();

  useEffect(() => {
    if (temp_data?.current?.condition?.code) {
      const code2 = `${temp_data.current.condition.code}`;
      // setcode(code2); //Not required

      // Set background based on the code value
      let bg_image;

      if (code2 == 1000) {
        bg_image = sunny;
      } else if (code2 == 1003 || code2 == 1006) {
        bg_image = cloudy;
        forecast_box.current.style.color = "black";
      } else if (code2 == 1009) {
        bg_image = overcast;
        forecast_box.current.style.color = "red";
      } else if ([1030, 1135, 1147].includes(parseInt(code2))) {
        bg_image = foggy;
        forecast_box.current.style.color = "red";
      } else if ([1063, 1072, 1150, 1153, 1168, 1171, 1180, 1186, 1089, 1192, 1195, 1198, 1201, 1240, 1243, 1246, 1249].includes(parseInt(code2))) {
        bg_image = rainy;
      } else if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264, 1252].includes(parseInt(code2))) {
        bg_image = thunderstorm;
      } else if ([1204, 1207].includes(parseInt(code2))) {
        bg_image = sleet;
      } else if ([1273, 1276].includes(parseInt(code2))) {
        bg_image = rain_lightening;
        forecast_box.current.style.color = "white";
      } else if ([1279, 1282].includes(parseInt(code2))) {
        bg_image = snow_lightening;
      } else {
        bg_image = "linear-gradient(to bottom left, blue, whitesmoke)";
      }

      bg.current.style.backgroundImage = `url(${bg_image})`;
    }

    let date = new Date;
    let current_day = date.getDay();
    let day_name = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    let all_day = document.querySelectorAll(".day");

    let setday = current_day + 1;

    all_day.forEach((day, i) => {

      if (setday > 6) {
        setday = 0;
      }

      if (!(i === 0 || i === 1)) {
        day.innerHTML = `${day_name[setday]}`;
        setday += 1;
        console.log(day.innerHTML)
      }
    })

  }, [temp_data, forecast]);  // This will run whenever `temp_data` changes

  useEffect(() => {
    weather();    // Calling weather on first render of component so that initially we don't get blank screen
  }, [])


  function change_city(e) {

    if (document.querySelector(".city_input").value === "") {
      alert("Enter city...")
    }
    else {
      weather();
    }

  }

  function change_temp_measure() {

    changes_measure == 0? setChangeMeasure(1) : setChangeMeasure(0);

  }

  // ------------------------------ Using promise ------------------------------ 
  // let fetched_data = axios.get(url).then((res)=>{console.log(res.data)}); 


  //------------------------------  Using async-await ------------------------------


  let weather = async () => {

    // let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0e67aa1753380ba20619da288d7b4edd&units=metric`;

    let url = `https://api.weatherapi.com/v1/current.json?key=ca7779e4dbf74ca8ad455029241411&q=${city}&aqi=yes`;
    let forecast = `https://api.weatherapi.com/v1/forecast.json?key=ca7779e4dbf74ca8ad455029241411&q=${city}&days=7`;

    try {
      let fetched_data2 = await axios.get(url);
      console.log("url data", fetched_data2.data)
      setdata(() => fetched_data2.data)

      let forecast_data = await axios.get(forecast);
      console.log("forecast data", forecast_data.data)
      setforecast(() => forecast_data.data);
    }

    catch (error) {
      console.log("ERROR occured: ", error);
      // if (city == "") {
      //   setdata({ "name": "Empty city", "main": { "temp": "Empty city" } })
      // }
      // else {
      //   setdata({ "name": "Invalid city input", "main": { "temp": "Invalid input" } })
      // }
    }


  }


  return (
    <>

      <div className='app relative min-h-min w-screen bg-cover bg-no-repeat flex flex-wrap flex-col items-center justofy-start gap-8' ref={bg}>
        <button className="change_temp_measure" onClick={(event) => { change_temp_measure() }}>{changes_measure == 0? "°C" : "°F" }</button>

        <div className="today flex flex-wrap justify-around items-center gap-64 p-10">

          <div className="temp p-8">
            <span className="main_temp">{changes_measure == 0 ? `${temp_data?.current?.temp_c || ""}` : `${temp_data?.current?.temp_f || ""}`}</span>
            <span className="celsius_show"><sup>{changes_measure == 0 ? "°C" : "°F" }</sup></span>
            <div className="city">
              <input type="text" className="city city_input ps-2" value={city} onChange={(e) => setcity(e.target.value)} />

              <button onClick={(e) => { change_city(e) }}> &nbsp;<i className="fa-solid fa-magnifying-glass"></i></button>

            </div>
          </div>

          <div className="other p-8">
            <div className="aqi">AQI : {temp_data?.current?.air_quality?.co || ""} CO</div>
            <div className="wind_speed">Wind Speed : {temp_data?.current?.wind_kph || ""} kph</div>

            <div className="humidity">Humidity : {temp_data?.current?.humidity || ""}</div>
            <div className="weather_type">Weather : {temp_data?.current?.condition?.text || ""} </div>
            <div className="temp_c">Temp : {temp_data?.current?.temp_c || ""} °C</div>
            <div className="temp_f">Temp : {temp_data?.current?.temp_f || ""} °F</div>
          </div>

        </div>


        <div ref={forecast_box} className="forecast flex flex-wrap items-center justify-center ">

          <div className="one w-40">
            <div className="day text-center p-4">Today</div>
            <div className="min_max p-2 text-center">
            <span className="min">{changes_measure == 0 ? `${forecast?.forecast?.forecastday[0]?.day?.mintemp_c || ""}` : `${forecast?.forecast?.forecastday[0]?.day?.mintemp_f || ""}`} <sup>{changes_measure == 0 ? "°C" : "°F" }</sup>  / </span>
            <span className="max">{changes_measure == 0 ? `${forecast?.forecast?.forecastday[0]?.day?.maxtemp_c || ""}` : `${forecast?.forecast?.forecastday[0]?.day?.maxtemp_f || ""}`} <sup>{changes_measure == 0 ? "°C" : "°F" }</sup></span>
            </div>
          </div>
          <div className="two w-40">
            <div className="day text-center p-4">Tomorrow</div>
            <div className="min_max p-2 text-center">
            <span className="min">{changes_measure == 0 ? `${forecast?.forecast?.forecastday[1]?.day?.mintemp_c || ""}` : `${forecast?.forecast?.forecastday[1]?.day?.mintemp_f || ""}`} <sup>{changes_measure == 0 ? "°C" : "°F" }</sup>  / </span>
            <span className="max">{changes_measure == 0 ? `${forecast?.forecast?.forecastday[1]?.day?.maxtemp_c || ""}` : `${forecast?.forecast?.forecastday[1]?.day?.maxtemp_f || ""}`} <sup>{changes_measure == 0 ? "°C" : "°F" }</sup></span>
            </div>
          </div>
          <div className="three w-40">
            <div className="day text-center p-4"></div>
            <div className="min_max p-2 text-center">
            <span className="min">{changes_measure == 0 ? `${forecast?.forecast?.forecastday[2]?.day?.mintemp_c || ""}` : `${forecast?.forecast?.forecastday[2]?.day?.mintemp_f || ""}`} <sup>{changes_measure == 0 ? "°C" : "°F" }</sup>  / </span>
            <span className="max">{changes_measure == 0 ? `${forecast?.forecast?.forecastday[2]?.day?.maxtemp_c || ""}` : `${forecast?.forecast?.forecastday[2]?.day?.maxtemp_f || ""}`} <sup>{changes_measure == 0 ? "°C" : "°F" }</sup></span>
            </div>
            {forecast?.forecast?.forecastday[2]?.day?.condition?.text || ""}
            <div>
              
            </div>
          </div>


        </div>


      </div>


      {/* 
      We used ternary operator above because sometimes data inside data doesn't come on time and there can be some gap of even some milli seconds, and in that 
      case, react gives error while putting value of state in components. 
      So we have to use ternary operator so that whenever the data comes, the value gets updated and if there is no data then something else will get printed.
      In our case, if data comes then it gets put in h3 tag else an empty string is put in h3 tag.
    */}

    </>
  )
}

export default App
