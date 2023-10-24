import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieList from "../components/movieList";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovies,
  image342,
} from "../api/moviedb";
import Loading from "../components/loading";
import { useNavigation, useRoute } from "@react-navigation/native";

const ios = Platform.OS == "ios";
const verticalMargin = ios ? { marginTop: 0 } : { marginTop: 12 };
var { width, height } = Dimensions.get("window");

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
    zIndex: 10,
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
  personImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "gray",
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    marginTop: height * 0.1,
  },
  personImage: {
    borderRadius: 20,
    overflow: "hidden",
    height: height * 0.43,
    width: width * 0.74,
  },
  personDetails: {
    marginTop: 24,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  placeOfBirth: {
    color: "rgba(187, 187, 187, 1)",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#444",
    borderRadius: 20,
    padding: 16,
    marginTop: 24,
    marginHorizontal: 8,
  },
  detailsItem: {
    paddingHorizontal: 4,
    borderRightWidth: 2,
    borderRightColor: "rgba(187, 187, 187, 1)",
    alignItems: "center",
  },
  detailsText: {
    color: "white",
    fontWeight: "500",
  },
  detailsValue: {
    color: "rgba(187, 187, 187, 1)",
    fontSize: 16,
  },
  biographyContainer: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  biographyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  biographyText: {
    color: "rgba(187, 187, 187, 1)",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 1,
  },
});

export default function PersonScreen() {
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const navigation = useNavigation();
  const [person, setPerson] = useState({});
  const [personMovies, setPersonMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
  }, [item]);

  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    console.log("got person details");
    setLoading(false);
    if (data) {
      setPerson(data);
    }
  };

  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    console.log("got person movies");
    if (data && data.cast) {
      setPersonMovies(data.cast);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <View style={styles.header}>
        <SafeAreaView style={[styles.headerContent, verticalMargin]}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon
              size={35}
              color={isFavourite ? "red" : "white"}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Person details */}
        {loading ? (
          <Loading />
        ) : (
          <View>
            <View style={styles.personImageContainer}>
              <View style={styles.personImage}>
                <Image
                  source={{
                    uri: image342(person?.profile_path) || fallbackPersonImage,
                  }}
                  style={{ height: height * 0.43, width: width * 0.74 }}
                />
              </View>
            </View>

            <View style={styles.personDetails}>
              <Text style={styles.title}>{person?.name}</Text>
              <Text style={styles.placeOfBirth}>{person?.place_of_birth}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsText}>Gender</Text>
                <Text style={styles.detailsValue}>
                  {person?.gender === 1 ? "Female" : "Male"}
                </Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsText}>Birthday</Text>
                <Text style={styles.detailsValue}>{person?.birthday}</Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsText}>Known for</Text>
                <Text style={styles.detailsValue}>
                  {person?.known_for_department}
                </Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsText}>Popularity</Text>
                <Text style={styles.detailsValue}>
                  {person?.popularity?.toFixed(2)} %
                </Text>
              </View>
            </View>

            <View style={styles.biographyContainer}>
              <Text style={styles.biographyTitle}>Biography</Text>
              <Text style={styles.biographyText}>
                {person?.biography || "N/A"}
              </Text>
            </View>

            {/* Person movies */}
            {person?.id && personMovies.length > 0 && (
              <MovieList title="Movies" hideSeeAll={true} data={personMovies} />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
