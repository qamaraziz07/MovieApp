import React from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useNavigation } from "@react-navigation/native";
import { image500 } from "../api/moviedb";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  carouselItem: {
    display: "flex",
    alignItems: "center",
  },
  movieImage: {
    width: width * 0.6,
    height: height * 0.4,
    borderRadius: 20,
  },
});

export default function TrendingMovies({ data }) {
  const navigation = useNavigation();

  const handleClick = (item) => {
    navigation.navigate("Movie", item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Trending</Text>
      <Carousel
        data={data}
        renderItem={({ item }) => (
          <MovieCard handleClick={handleClick} item={item} />
        )}
        firstItem={1}
        inactiveSlideOpacity={0.4}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={styles.carouselItem}
      />
    </View>
  );
}

const MovieCard = ({ item, handleClick }) => {
  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <Image
        source={{ uri: image500(item.poster_path) }}
        style={styles.movieImage}
      />
    </TouchableWithoutFeedback>
  );
};
