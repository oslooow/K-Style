import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function DetailsScreen({ route }) {
  const { item } = route.params;
  const { dt_txt, main, weather } = item;
console.log(weather)
  const getBackgroundImage = (weatherIcon) => {
    switch (weatherIcon) {
      case "01d":
      case "01n":
        return require("./images/sunny.jpg");
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return require("./images/cloudy.jpg");
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return require("./images/rainy.jpg");
      case "11d":
      case "11n":
        return require("./images/thunderstorm.jpg");
      case "13d":
      case "13n":
        return require("./images/snowy.jpg");
      case "50d":
      case "50n":
        return require("./images/mist.jpg");
      default:
        return require("./images/sunny.jpg");
    }
  };

  const formattedDate = new Date(dt_txt).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const hour = new Date(dt_txt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const capitalizeFirstLetter = (string) => {
    const words = string.split(" ");
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  };

  return (
    <View style={styles.container}>
      <Image
        source={getBackgroundImage(weather[0].icon)}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.hourText}>{hour}</Text>
        <View style={styles.temperatureImg}>
          <Text style={styles.temperatureText}>
            {main.temp.toFixed(1)}&deg;C
          </Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`,
            }}
            style={styles.weatherIcon}
          />
        </View>
        <Text style={styles.descriptionText}>
          {capitalizeFirstLetter(weather[0].description)}
        </Text>
        <View style={styles.temperature}>
          <View style={styles.minTemp}>
            <Text style={styles.tempTitle}>Min Temp</Text>
            <Text style={styles.tempText}>{main.temp_min}&deg;C</Text>
          </View>
          <View style={styles.minTemp}>
            <Text style={styles.tempTitle}>Max Temp</Text>
            <Text style={styles.tempText}>{main.temp_min}&deg;C</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(128, 128, 125, 0.7)",
    alignItems: "center",
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 40,
    marginTop: 30,
  },
  hourText: {
    fontSize: 40,
  },
  temperatureImg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  temperatureText: {
    fontSize: 60,
    marginRight: -20,
    marginLeft: 20,
  },
  weatherIcon: {
    width: 200,
    height: 200,
    padding: 0,
  },
  descriptionText: {
    fontSize: 30,
  },
  temperature: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  minTemp: {
    alignItems: "center",
    marginHorizontal: 40,
  },
  tempTitle: {
    fontWeight: "bold",
    fontSize: 30,
  },
  tempText: {
    fontSize: 30,
  }
});
