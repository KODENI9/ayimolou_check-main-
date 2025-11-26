import React, { useRef, useState, useCallback } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Dimensions,
  ListRenderItem,
  ViewToken,
  // Importation manquante (à ajouter si nécessaire)
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import markers from "../markers"; // Assurez-vous que le chemin est correct
// --- Constantes et Configuration ---
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.8; // 80% de la largeur de l'écran
const ITEM_MARGIN = 10;
const SNAP_OFFSET = ITEM_WIDTH + ITEM_MARGIN * 2; // Intervalle de snapping pour inclure les marges

// --- Types et Données (Hypothétiques) ---
type MarkerType = {
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  image: string;
  standNumber: string;
};

// Données fictives (à remplacer par votre import markers)


// --- Composant Principal ---
const HomeScreen = () => {
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList<MarkerType>>(null);
  const [selectedMarker, setSelectedMarker] = useState<string>(markers[0]?.name || "");

  const centerMap = useCallback((coords: Region) => {
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: coords.latitudeDelta || 0.01, 
      longitudeDelta: coords.longitudeDelta || 0.01,
    }, 500);
  }, []);

  // Logique pour mettre à jour la carte et la FlatList lorsqu'un élément devient visible (lors du swipe)
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length === 1 && viewableItems[0].isViewable) {
      const item = viewableItems[0].item as MarkerType;
      if (item.name !== selectedMarker) {
        setSelectedMarker(item.name);
        centerMap(item.coordinates as Region);
      }
    }
  }).current;

  // Lorsque l'utilisateur clique sur un marqueur sur la carte ou une carte dans le carrousel
  const handleItemSelect = useCallback((item: MarkerType, index: number) => {
    setSelectedMarker(item.name);
    centerMap(item.coordinates as Region);
    // Assurez-vous que l'élément est centré dans la FlatList
    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  }, [centerMap]);

  // Rendu de chaque carte du carrousel
  const renderMarkerItem: ListRenderItem<MarkerType> = ({ item, index }) => {
    const isSelected = item.name === selectedMarker;
    
    // --- Correction majeure: Utiliser la prop style pour les dimensions dynamiques ---
    const cardStyle = {
      width: ITEM_WIDTH,
      marginHorizontal: ITEM_MARGIN,
      transform: [{ scale: isSelected ? 1 : 0.95 }] // Effet de zoom sur la carte sélectionnée
    };
    
    // Correction de l'espacement pour le centrage de la première et dernière carte
    const firstLastMargin = (width - ITEM_WIDTH - ITEM_MARGIN * 2) / 2 + ITEM_MARGIN;

    if (index === 0) {
      cardStyle.marginLeft = firstLastMargin;
    } else if (index === markers.length - 1) {
      cardStyle.marginRight = firstLastMargin;
    }

    return (
      <TouchableOpacity
        style={cardStyle}
        className={`h-64 bg-white rounded-2xl overflow-hidden shadow-xl mb-4 transition-all duration-300 ${isSelected ? 'shadow-yellow-400/50' : 'shadow-slate-300/50'}`}
        onPress={() => handleItemSelect(item, index)}
      >
        <Image
          source={{ uri: item.image }}
          className="w-full h-3/5"
          resizeMode="cover"
        />
        <View className="p-4 flex-1 justify-center">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-xl font-bold text-slate-800" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="bg-yellow-100 px-2 py-1 rounded-lg">
              <Text className="text-xs font-bold text-yellow-700">{item.standNumber}</Text>
            </View>
          </View>
          <Text className="text-sm text-slate-500" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Search Bar */}
      <View className="px-6 py-4 bg-white shadow-sm border-b border-gray-100 z-10">
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
          <Ionicons name="search" size={20} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Recherchez par stand, nom ou catégorie"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-gray-900 text-base"
          />
        </View>
      </View>

      {/* Map View */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        ref={mapRef}
        initialRegion={markers[0]?.coordinates}
        showsUserLocation={true}
        className="flex-1"
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            title={marker.name}
            coordinate={marker.coordinates}
            // Changement de la couleur du marqueur pour le feedback visuel
            pinColor={marker.name === selectedMarker ? "#EAB308" : "#EF4444"}
            onPress={() => handleItemSelect(marker, index)}
          />
        ))}
      </MapView>

      {/* Carousel des Marques */}
      <View className="absolute bottom-0 left-0 right-0 z-20 pb-4">
        <FlatList
          ref={flatListRef}
          horizontal
          data={markers}
          keyExtractor={(item) => item.name}
          renderItem={renderMarkerItem}
          showsHorizontalScrollIndicator={false}
          
          // Propriétés de Snapping
          snapToInterval={SNAP_OFFSET}
          decelerationRate="fast"
          
          // Correction pour le centrage des cartes
          contentContainerStyle={{ 
            paddingHorizontal: (width - ITEM_WIDTH - ITEM_MARGIN * 2) / 2
          }}
          
          // Gestion du changement de vue
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 70, // Considère l'élément comme visible à 70%
            minimumViewTime: 300,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

// Un style minimal pour la carte est nécessaire pour positionner la MapView correctement
const styles = StyleSheet.create({
    absoluteFillObject: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});

export default HomeScreen;