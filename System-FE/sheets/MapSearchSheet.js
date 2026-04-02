import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from '@expo/vector-icons'; 
import SearchBar from "../components/SearchBar";

const CATEGORIES = [
    { name: "Coffee", icon: "cafe-outline" },
    { name: "Bars", icon: "beer-outline" },
    { name: "Restrooms", icon: "restrooms" },
    { name: "Lounges", icon: "bed-outline" },
    { name: "Restaurants", icon: "restaurant-outline" },
    { name: "Shops", icon: "bag-handle-outline" },
];

export default function MapSearchSheet() {
    const sheetRef = useRef(null);
    
    const snapPoints = useMemo(() => [80, '50%'], []);
    const [query, setQuery] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const renderIcon = (item) => {
        if (item.name === "Restrooms") {
            return (
                <View style={{ flexDirection: 'row', marginRight: 10 }}>
                    <Ionicons name="man-outline" size={20} color="#FF3B00" />
                    <Ionicons name="woman-outline" size={20} color="#FF3B00" style={{ marginLeft: -8 }} />
                </View>
            );
        }
        return <Ionicons name={item.icon} size={22} color="#FF3B00" style={styles.icon} />;
    };

    return (
        <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={setCurrentIndex}
            bottomInset={0}
            detached={false}
            handleIndicatorStyle={{ backgroundColor: '#666', width: 40 }}
            backgroundStyle={{ 
                borderRadius: 0, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20,
                backgroundColor: 'white' 
            }}
        >
            <View style={styles.container}>
                <View style={styles.searchWrapper}>
                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onFocus={() => sheetRef.current?.expand()}
                    />
                </View>

                {currentIndex > 0 && (
                    <FlatList
                        data={CATEGORIES}
                        keyExtractor={(item) => item.name}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.item}>
                                <View style={styles.itemRow}>
                                    {renderIcon(item)}
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#CCC" />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchWrapper: {
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 15,
        width: 25,
        textAlign: 'center',
    },
    itemText: {
        fontSize: 16,
        color: '#666',
    },
});