import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ value, onChange, onFocus }) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#666666" style={styles.icon} />

            <TextInput
                placeholder="Search for desired amenity"
                value={value}
                onChangeText={onChange}
                onFocus={onFocus}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
        borderRadius: 25,
        paddingHorizontal: 12
    },

    input: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 10,
    },
});