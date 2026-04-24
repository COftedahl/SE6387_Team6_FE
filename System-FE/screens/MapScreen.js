import { View, StyleSheet, ActivityIndicator, Text, Button } from 'react-native';
import MapView, {PROVIDER_GOOGLE, UrlTile, Marker, Polyline } from 'react-native-maps';
import { useRef, useState, useEffect } from 'react';
import MapSearchSheet from '../sheets/MapSearchSheet';
import useLocation from '../hooks/useLocation';
import useNavigation from '../hooks/useNavigation';
import useUserPosition from '../hooks/useUserPosition';

export default function MapScreen() {

  const { position } = useUserPosition(); 

  // navigation stuff
  const { 
    route, 
    instructions, 
    connected, 
    isNavigating,
    navigate, 
    cancelNavigation,
    rerouteOffer,
    acceptReroute,
    declineReroute,
    updatePosition,
  } = useNavigation();


  const [amenities, setAmenities] = useState([]); // add this
  const mapSheetRef = useRef(null); // ref to call sheet methods
  const [selectedAmenity, setSelectedAmenity] = useState(null); // add this

  // // Test navigation on mount (remove this once UI triggers it)
  // const source = { latitude: 32.897257, longitude: -97.0419 };
  // const target = { latitude: 32.895, longitude: -97.0419 };


  // Send position updates while navigating
  useEffect(() => {
    if (!isNavigating || !position) return;

    const interval = setInterval(() => {
      updatePosition(position);
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [isNavigating, position, updatePosition]);



  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
      provider={PROVIDER_GOOGLE}
        mapType="none"
      initialRegion={{
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <UrlTile
        urlTemplate="http://10.0.2.2:5000/nav/map/{z}/{x}/{y}"
        maximumZ={19}
        minimumZ={10}
        zIndex={1}
      />

      {/* Amenity markers */}
        {amenities.map((amenity) => (
          <Marker
            key={amenity.id}
            coordinate={{
              latitude: parseFloat(amenity.location.y),
              longitude: parseFloat(amenity.location.x),
            }}
            title={`Room ${amenity.room}`}
            description={`${amenity.status}`}
            pinColor="#eec334ff"
            zIndex={5}
            onPress={() => mapSheetRef.current?.selectAmenity(amenity)}
          />
      ))}

      {/* Destination marker — shows when amenity is selected */}
      {selectedAmenity && (
        <Marker
          coordinate={{
            latitude: parseFloat(selectedAmenity.location.y),
            longitude: parseFloat(selectedAmenity.location.x),
          }}
          title={`Room ${selectedAmenity.room}`}
          pinColor="green"
          zIndex={11}
        />
      )}


      <Marker
        coordinate={position}
        title="You"
      />


      {/* Route polyline — shows when navigation starts */}
      {route.length > 0 && (
        <Polyline
          coordinates={route}
          strokeColor="#FF3B00"
          strokeWidth={4}
          zIndex={10}
        />
      )}

    </MapView>

    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <MapSearchSheet
          ref={mapSheetRef}
          userPosition={position}
          navigate={navigate}
          cancelNavigation={cancelNavigation}
          rerouteOffer={rerouteOffer}
          acceptReroute={acceptReroute}
          declineReroute={declineReroute}
          instructions={instructions}
          onAmenitiesChange={setAmenities}
          onAmenitySelect={setSelectedAmenity}
        />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  map: { ...StyleSheet.absoluteFillObject },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
});