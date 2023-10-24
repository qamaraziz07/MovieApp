import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeftIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../api/moviedb";
import Loading from "../components/loading";
import { theme } from "../theme";

const ios = Platform.OS == "ios";
const topMargin = ios ? { marginTop: 0 } : { marginTop: 12 };
var { width, height } = Dimensions.get("window");

export default function MovieScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMovieDetials(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);

  const getMovieDetials = async (id) => {
    const data = await fetchMovieDetails(id);
    console.log("got movie details");
    setLoading(false);
    if (data) {
      setMovie({ ...movie, ...data });
    }
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    console.log("got movie credits");
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    console.log("got similar movies");
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button and movie poster */}
      <View style={styles.header}>
        <SafeAreaView style={[styles.headerContent, topMargin]}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon
              size={35}
              color={isFavourite ? theme.background : "white"}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri: image500(movie.poster_path) || fallbackMoviePoster,
              }}
              style={styles.movieImage}
            />
            <LinearGradient
              colors={[
                "transparent",
                "rgba(23, 23, 23, 0.8)",
                "rgba(23, 23, 23, 1)",
              ]}
              style={styles.gradientOverlay}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>
        )}
      </View>

      {/* Movie details */}
      <View style={styles.movieDetails}>
        {/* Title */}
        <Text style={styles.title}>{movie?.title}</Text>

        {/* Status, release year, runtime */}
        {movie?.id && (
          <Text style={styles.statusReleaseRuntime}>
            {movie?.status} • {movie?.release_date?.split("-")[0] || "N/A"} •{" "}
            {movie?.runtime} min
          </Text>
        )}

        {/* Genres */}
        <View style={styles.genres}>
          {movie?.genres?.map((genre, index) => (
            <Text key={index} style={styles.genreText}>
              {genre?.name}
              {index + 1 !== movie.genres.length ? " • " : null}
            </Text>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.description}>{movie?.overview}</Text>
      </View>

      {/* Cast */}
      {movie?.id && cast.length > 0 && (
        <Cast navigation={navigation} cast={cast} />
      )}

      {/* Similar movies section */}
      {movie?.id && similarMovies.length > 0 && (
        <MovieList
          title={"Similar Movies"}
          hideSeeAll={true}
          data={similarMovies}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333",
  },
  header: {
    width: "100%",
  },
  headerContent: {
    width: "100%",
    position: "absolute",
    zIndex: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 6,
  },
  heartIcon: {
    padding: 6,
  },
  movieImage: {
    width,
    height: height * 0.6,
  },
  gradientOverlay: {
    width,
    height: height * 0.4,
    position: "absolute",
    bottom: 0,
  },
  movieDetails: {
    marginTop: -(height * 0.09),
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusReleaseRuntime: {
    color: "rgba(187, 187, 187, 1)",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  genres: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  genreText: {
    color: "rgba(187, 187, 187, 1)",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    color: "rgba(187, 187, 187, 1)",
    fontSize: 16,
    paddingHorizontal: 16,
    textAlign: "center",
  },
});
