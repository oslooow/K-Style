import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { Linking } from "expo";
import Spinner from "react-native-loading-spinner-overlay";

export default function Homescreen({ navigation }) {
  const [weatherData, setWeatherData] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationData, setLocationData] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied.");
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      setError("Error retrieving location.");
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const fetchLocationData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=9b0583b2c8cdb9c5f664575d6e58a2b6`
      );
      const data = await response.json();
      setLocationData(data);
    } catch (error) {
      console.error("Error fetching location data: ", error);
    } finally {
      setIsLoading(false); // Set isLoading to false after fetching location data
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=9b0583b2c8cdb9c5f664575d6e58a2b6`
      );
      const data = await response.json();
      setWeatherData(data.list);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchLocation();
      if (location) {
        const { latitude, longitude } = location.coords;
        fetchLocationData(latitude, longitude);
        fetchWeatherData(latitude, longitude);
        setGreeting(getGreeting());
      }
    };

    fetchData();
  }, [location]);
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

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 2 && currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon!";
    } else if (currentHour >= 18 && currentHour < 12) {
      return "Good Evening!";
    } else {
      return "Hello!";
    }
  };

  const renderWeatherCard = ({ item }) => {
    const { dt_txt, main, weather } = item;

    const formattedDate =
      new Date(dt_txt).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      " | " +
      new Date(dt_txt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    const navigateToDetails = () => {
      navigation.navigate("DetailsScreen", { item, locationData });
    };

    const capitalizeFirstLetter = (string) => {
      const words = string.split(" ");
      const capitalizedWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedWords.join(" ");
    };

    const backgroundImage = getBackgroundImage(weather[0].icon);

    return (
      <TouchableOpacity onPress={navigateToDetails}>
        <ImageBackground source={backgroundImage} style={styles.weatherCard}>
          <View style={styles.cardContent}>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
              }}
              style={styles.weatherIcon}
            />
            <View>
              <Text style={styles.dateText}>{formattedDate}</Text>
              <Text style={styles.descriptionText}>
                {capitalizeFirstLetter(weather[0].description)}
              </Text>
              <Text style={styles.temperatureText}>{main.temp}&deg;C</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
        <Button title="Open Settings" onPress={handleOpenSettings} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.gettingLocation}>
        <Spinner
          visible={true}
          textContent={"Getting your location..."}
          textStyle={styles.spinnerText}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {greeting} {"\n"}Here is weather today in {locationData[0].name},{" "}
        {locationData[0].state}!
      </Text>
      <FlatList
        data={weatherData}
        renderItem={renderWeatherCard}
        keyExtractor={(item) => item.dt.toString()}
      />
    </View>
  );
}

const styles = {
  gettingLocation: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerText: {
    color: "#ffffff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
    marginVertical: 15,
  },
  weatherCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    resizeMode: "cover",
    marginBottom: 10,
    overflow: "hidden",
    borderRadius: 30,
    marginHorizontal: 5,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 10,
  },
  descriptionText: {
    fontSize: 16,
    textTransform: "capitalize",
    marginBottom: 5,
    marginLeft: 10,
  },
  temperatureText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    margin: 10,
  },
};
