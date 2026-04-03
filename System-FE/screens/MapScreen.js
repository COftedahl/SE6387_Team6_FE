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

import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { UrlTile, Marker, Polyline } from 'react-native-maps';
import MapSearchSheet from '../sheets/MapSearchSheet';
import useLocation from '../hooks/useLocation';

export default function MapScreen() {
  const { location, error, loading } = useLocation();

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#FF3B00" />
      <Text>Getting your location...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.centered}>
      <Text>{error}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {/* OSM Tiles - shows real airport layout */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <MapSearchSheet />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  map: { ...StyleSheet.absoluteFillObject },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
});