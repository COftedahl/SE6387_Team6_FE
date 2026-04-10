// import * as React from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import MapView from 'react-native-maps';
// import MapSearchSheet from '../sheets/MapSearchSheet';

// const { height } = Dimensions.get('window');

// export default function MapScreen() {
//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.map}
//                 initialRegion={{
//                     latitude: 32.8998,
//                     longitude: -97.0403,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                 }}
//             />

//             <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
//                 <MapSearchSheet />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     map: {
//         ...StyleSheet.absoluteFillObject,
//     },
// });

import { View, StyleSheet, ActivityIndicator, Text, Button } from 'react-native';
import MapView, {PROVIDER_GOOGLE, UrlTile, Marker, Polyline } from 'react-native-maps';
import { useState } from 'react';
import MapSearchSheet from '../sheets/MapSearchSheet';
import useLocation from '../hooks/useLocation';
import useNavigation from '../hooks/useNavigation';

export default function MapScreen() {
//   const { location, error, loading } = useLocation();

//   if (loading) return (
//     <View style={styles.centered}>
//       <ActivityIndicator size="large" color="#FF3B00" />
//       <Text>Getting your location...</Text>
//     </View>
//   );

//   if (error) return (
//     <View style={styles.centered}>
//       <Text>{error}</Text>
//     </View>
//   );

// latitude: location?.latitude || 32.8998,
//             longitude: location?.longitude || -97.0403,


// navigation stuff

  const { route, instructions, connected, navigate, cancelNavigation } = useNavigation();
  const [amenities, setAmenities] = useState([]); // add this

  // Test navigation on mount (remove this once UI triggers it)
  const source = { latitude: 32.897257, longitude: -97.0419 };
  const target = { latitude: 32.895, longitude: -97.0419 };



  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
      provider={PROVIDER_GOOGLE}
        mapType="none"
      initialRegion={{
        latitude: 32.897257,
        longitude: -97.0419,
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
            description={`${amenity.accessibilityClass} · ${amenity.status}`}
            pinColor="#eec334ff"
            zIndex={5}
          />
      ))}


      <Marker
        coordinate={source}
        title="Start"
      />

      {/* Draw route if available */}
        {route.length > 0 && (
          <>
            <Polyline
              coordinates={route}
              strokeColor="#FF3B00"
              strokeWidth={4}
              zIndex={10}
            />
            <Marker
              coordinate={route[route.length - 1]}
              title="Destination"
              pinColor="green"
              zIndex={11}
            />
          </>
        )}

    </MapView>

    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <MapSearchSheet
          navigate={navigate}
          cancelNavigation={cancelNavigation}
          instructions={instructions}
          onAmenitiesChange={setAmenities}  
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