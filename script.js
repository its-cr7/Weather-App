const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector(".wbtn");
const enterBtn = inputPart.querySelector(".btn");
const weatherPart = wrapper.querySelector(".weather-part");
const wIcon = weatherPart.querySelector("img");
const arrowBack = wrapper.querySelector("header i");

let api;

// Function to handle keyup event on input field
inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField.value.trim() !== "") {
    requestApi(inputField.value.trim());
  }
});

// Function to handle click event on submit button
enterBtn.addEventListener("click", () => {
  if (inputField.value.trim() !== "") {
    requestApi(inputField.value.trim());
  }
});

// Function to handle click event on location button
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    infoTxt.innerText = "Your browser does not support geolocation API";
    infoTxt.classList.add("error");
  }
});

// Function to request weather data from API
function requestApi(location) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=ef22685646035411a734039f1d2dfa01`;
  fetchData();
}

// Function to handle success response from geolocation API
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=ef22685646035411a734039f1d2dfa01`;
  fetchData();
}

// Function to handle error response from geolocation API
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

// Function to fetch weather data from API
function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.innerText = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}

// Function to display weather details
function weatherDetails(info) {
  if (info.cod === "404") {
    infoTxt.innerText = `${inputField.value.trim()} is not a valid city name`;
    infoTxt.classList.add("error");
  } else {
    const { name: city, sys: { country }, weather: [{ description, id }], main: { temp, feels_like, humidity } } = info;
    const iconId = id === 800 ? "01d" : (id >= 200 && id <= 232) ? "11d" : (id >= 600 && id <= 622) ? "13d" : (id >= 701 && id <= 781) ? "50d" : (id >= 801 && id <= 804) ? "10d" : "10d";
    const iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`;

    wIcon.src = iconUrl;
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

// Function to handle click event on arrow back button
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
