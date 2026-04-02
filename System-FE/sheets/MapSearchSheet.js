import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import SearchBar from "../components/SearchBar";
import FilterMenu from "../components/FilterMenu";

const CATEGORIES = [
    { name: "Coffee", icon: "cafe-outline" },
    { name: "Bars", icon: "beer-outline" },
    { name: "Restrooms", icon: "restroom", lib: "FontAwesome" },
    { name: "Lounges", icon: "bed-outline" },
    { name: "Restaurants", icon: "restaurant-outline" },
    { name: "Shops", icon: "bag-handle-outline" },
];

export default function MapSearchSheet() {
    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => [100, '50%', '90%'], []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [view, setView] = useState("categories");

    const renderRestroomIcon = () => (
        <View style={styles.dualIcon}>
            <Ionicons name="man-outline" size={18} color="#FF3B00" />
            <Ionicons name="woman-outline" size={18} color="#FF3B00" style={{ marginLeft: -6 }} />
        </View>
    );

    return (
        <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={setCurrentIndex}
            bottomInset={0}
            backgroundStyle={styles.sheetBackground}
        >
            <BottomSheetView style={{ flex: 1 }}>
                {view === "categories" ? (
                    <>
                        <View style={styles.searchWrapper}>
                            <SearchBar 
                                onFocus={() => sheetRef.current?.snapToIndex(1)}
                                onFilterPress={() => {
                                    setView("filters");
                                    sheetRef.current?.snapToIndex(2);
                                }}
                            />
                        </View>
                        {currentIndex > 0 && (
                            <FlatList
                                data={CATEGORIES}
                                keyExtractor={(item) => item.name}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.item}>
                                        <View style={styles.itemRow}>
                                            {item.name === "Restrooms" ? renderRestroomIcon() : 
                                             <Ionicons name={item.icon} size={22} color="#FF3B00" style={styles.icon} />}
                                            <Text style={styles.itemText}>{item.name}</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color="#CCC" />
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            />
                        )}
                    </>
                ) : (
                    <FilterMenu onBack={() => {
                        setView("categories");
                        sheetRef.current?.snapToIndex(1);
                    }} />
                )}
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetBackground: { borderRadius: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    searchWrapper: { paddingHorizontal: 16, paddingBottom: 15 },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    itemRow: { flexDirection: 'row', alignItems: 'center' },
    icon: { marginRight: 15, width: 25, textAlign: 'center' },
    dualIcon: { flexDirection: 'row', width: 25, marginRight: 15, justifyContent: 'center' },
    itemText: { fontSize: 16, color: '#333' }
});