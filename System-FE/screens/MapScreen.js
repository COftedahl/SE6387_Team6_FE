import * as React from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';

export default function MapScreen({navigation}) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: 32.8998,
                    longitude: -97.0403,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            />
        </View>

    );
}