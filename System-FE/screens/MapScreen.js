import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import MapSearchSheet from '../sheets/MapSearchSheet';

const { height } = Dimensions.get('window');

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 32.8998,
                    longitude: -97.0403,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            />

            <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                <MapSearchSheet />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});