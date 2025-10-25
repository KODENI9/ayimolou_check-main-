import React, { useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet,Text,View, FlatList,Pressable,Image}
from "react-native";
import markers from "@/assets/markers";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native";

const offset = 0.005; // ajuste selon la hauteur souhaitée
const HomeScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [selectedCard, setSelectedCard] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="bg-gray p-5">
        <TextInput
          placeholder="Recherchez par numéro stands"
          className="bg-white rounded-full px-4 py-3 text-center"
        />
      </View>
      <MapView
        mapPadding={{ top: 0, right: 0, bottom: 300, left: 0 }}
        style={styles.map}
        ref={mapRef}
        zoomControlEnabled={true}
        initialRegion={markers[0].coordinates}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            title={marker.name}
            coordinate={marker.coordinates}
          />
        ))}
      </MapView>
      <View style={styles.markerListContainer}>
        <FlatList
          numColumns={2}
          className="w-full h-[420px]"
          data={markers}
          keyExtractor={(item) => item.name}
          renderItem={({ item: marker }) => (
            <Pressable
              onPress={() => {
                setSelectedCard(marker.name);
                mapRef.current?.animateToRegion(marker.coordinates, 1000);
              }}
              style={
                marker.name === selectedCard
                  ? styles.activeMarkerButton
                  : styles.markerButton
              }
            >
              <Image
                source={{ uri: marker.image }}
                style={styles.markerImage}
              />
              <View style={styles.markerInfo}>
                
                <View className="mr-4 ml-4 mb-2 mt-2">
                  <Text style={
                    marker.name === selectedCard
                    ? styles.activeMarkerName
                    : styles.markerName}>
                  {marker.name}
                  </Text>
                  <Text 
                    style={
                      marker.name === selectedCard
                      ? styles.activeMarkerDescription
                      : styles.markerDescription}>
                  {marker.description}
                  </Text>
                </View>
                
              </View>
            </Pressable>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  map: {
    flex: 1,
  },
  markerListContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  activeMarkerButton: {
    backgroundColor: "#ad1616",
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 186,
    marginBottom: 10,
  },
  markerButton: {
    backgroundColor: "#FFE223",
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 186,
    marginBottom: 10
  },
  markerImage: {
    borderRadius: 10,
    width: "auto",
    height: 120,
  },
  markerInfo: {
    flex: 1,
  },
  markerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  markerDescription: {
    fontSize: 12,
    color: "#000",
  },

  activeMarkerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  activeMarkerDescription: {
    fontSize: 12,
    color: "#FFFFFF",
  },
});
export default HomeScreen;