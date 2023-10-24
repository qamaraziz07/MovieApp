import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
import { debounce } from "lodash";
import Loading from "../components/loading";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333", // This seems to be the color-neutral-800
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(187, 187, 187, 1)", // This seems to be the color-neutral-500
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    paddingBottom: 4,
    paddingLeft: 24,
  },
  searchClearButton: {
    borderRadius: 20,
    padding: 12,
    margin: 4,
    backgroundColor: "rgba(187, 187, 187, 1)", // This seems to be the color-neutral-500
  },
  resultsContainer: {
    paddingHorizontal: 15,
    marginTop: 3,
  },
  resultsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 4,
    marginBottom: 16,
  },
  resultItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  resultItem: {
    marginBottom: 16,
  },
  movieImage: {
    width: width * 0.44,
    height: height * 0.3,
    borderRadius: 20,
  },
  movieTitle: {
    color: "lightgrey",
    marginLeft: 4,
    marginTop: 8,
    fontSize: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsImage: {
    width: width * 0.6,
    height: height * 0.4,
  },
});

export default function SearchScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = (search) => {
    if (search && search.length > 2) {
      setLoading(true);
      searchMovies({
        query: search,
        include_adult: false,
        language: "en-US",
        page: "1",
      }).then((data) => {
        console.log("got search results");
        setLoading(false);
        if (data && data.results) setResults(data.results);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search input */}
      <View style={styles.searchBar}>
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movie"
          placeholderTextColor="lightgray"
          style={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.searchClearButton}
        >
          <XMarkIcon size={25} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search results */}
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsContainer}
        >
          <Text style={styles.resultsText}>Results ({results.length})</Text>
          <View style={styles.resultItems}>
            {results.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => navigation.push("Movie", item)}
              >
                <View style={styles.resultItem}>
                  <Image
                    source={{
                      uri: image185(item.poster_path) || fallbackMoviePoster,
                    }}
                    style={styles.movieImage}
                  />
                  <Text style={styles.movieTitle}>
                    {item.title.length > 22
                      ? item.title.slice(0, 22) + "..."
                      : item.title}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.movieTitle}>It's Movie time..</Text>
          <Text style={styles.movieTitle}>Search your favorite movie..</Text>

          <Image
            source={require("../assets/images/movieTime.png")}
            style={styles.noResultsImage}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
