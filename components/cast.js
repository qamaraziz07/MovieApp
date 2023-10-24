import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { fallbackPersonImage, image185, image342 } from "../api/moviedb";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  heading: {
    color: "white",
    fontSize: 18,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scrollViewContent: {
    paddingHorizontal: 15,
  },
  castItem: {
    marginRight: 16,
    alignItems: "center",
  },
  imageContainer: {
    overflow: "hidden",
    borderRadius: 100,
    height: 100,
    width: 100,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  castImage: {
    borderRadius: 12,
    height: 120,
    width: 100,
  },
  characterText: {
    color: "white",
    fontSize: 12,
    marginTop: 8,
  },
  originalNameText: {
    color: "rgba(187, 187, 187, 1)",
    fontSize: 12,
  },
});

export default function Cast({ cast, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Top Cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {cast &&
          cast.map((person, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate("Person", person)}
                style={styles.castItem}
              >
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.castImage}
                    source={{
                      uri:
                        image185(person?.profile_path) || fallbackPersonImage,
                    }}
                  />
                </View>
                <Text style={styles.characterText}>
                  {person?.character.length > 10
                    ? person.character.slice(0, 10) + "..."
                    : person?.character}
                </Text>
                <Text style={styles.originalNameText}>
                  {person?.original_name.length > 10
                    ? person.original_name.slice(0, 10) + "..."
                    : person?.original_name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}
