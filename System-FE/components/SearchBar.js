import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ value, onChange, onFocus, onFilterPress }) {
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
            <TouchableOpacity onPress={onFilterPress} style={styles.filterBtn}>
                <Ionicons name="options-outline" size={22} color="#666" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eaeaea',
        borderRadius: 25,
        paddingHorizontal: 12,
        height: 50
    },
    input: { flex: 1, marginHorizontal: 8 },
    filterBtn: { paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: '#ccc' }
});