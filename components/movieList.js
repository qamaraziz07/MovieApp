import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { moviesData } from "../constants";
import {
  fallbackMoviePoster,
  image185,
  image342,
  poster342,
} from "../api/moviedb";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 16,
  },
  header: {
    marginHorizontal: 12,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
  },
  seeAllText: {
    color: "white",
    fontSize: 18,
  },
  scrollViewContent: {
    paddingHorizontal: 15,
  },
  movieContainer: {
    marginTop: 4,
    marginRight: 4,
  },
  movieImage: {
    borderRadius: 20,
    width: width * 0.33,
    height: height * 0.22,
  },
  movieTitle: {
    color: "rgba(187, 187, 187, 1)",
    marginTop: 2,
    marginLeft: 1,
    marginHorizontal: 2,
  },
});

export default function MovieList({ title, hideSeeAll, data }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {data.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.push("Movie", item)}
            >
              <View style={styles.movieContainer}>
                <Image
                  source={{
                    uri: image185(item.poster_path) || fallbackMoviePoster,
                  }}
                  style={styles.movieImage}
                />
                <Text style={styles.movieTitle}>
                  {item.title.length > 14
                    ? item.title.slice(0, 14) + "..."
                    : item.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}
