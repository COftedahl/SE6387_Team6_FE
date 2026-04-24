import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';

const CATEGORIES = [
  { name: "Coffee",      icon: "cafe-outline",       amenityType: "COFFEE"     },
  { name: "Bars",        icon: "beer-outline",        amenityType: "BAR"        },
  { name: "Restrooms",   icon: "restroom",            amenityType: "RESTROOM"   },
  { name: "Lounges",     icon: "bed-outline",         amenityType: "LOUNGE"     },
  { name: "Restaurants", icon: "restaurant-outline",  amenityType: "RESTAURANT" },
  { name: "Shops",       icon: "bag-handle-outline",  amenityType: "SHOP"       },
];

export default function CategoriesView({ currentIndex, onCategoryPress, onFilterPress, onSearchFocus }) {
  const renderRestroomIcon = () => (
    <View style={styles.dualIcon}>
      <Ionicons name="man-outline" size={18} color="#FF3B00" />
      <Ionicons name="woman-outline" size={18} color="#FF3B00" style={{ marginLeft: -6 }} />
    </View>
  );

  return (
    <>
      {/* <View style={styles.searchWrapper}>
        <SearchBar onFocus={onSearchFocus} onFilterPress={onFilterPress} />
      </View> */}
      {currentIndex > 0 && (
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => onCategoryPress(item)}>
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
  );
}

const styles = StyleSheet.create({
  searchWrapper: { paddingHorizontal: 16, paddingBottom: 15 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingHorizontal: 16 },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 15, width: 25, textAlign: 'center' },
  dualIcon: { flexDirection: 'row', width: 25, marginRight: 15, justifyContent: 'center' },
  itemText: { fontSize: 16, color: '#333' },
});