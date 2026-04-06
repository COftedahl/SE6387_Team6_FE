// MapSearchSheet.js - only manages view state and sheet ref
import CategoriesView from './views/CategoriesView';
import AmenitiesListView from './views/AmenitiesListView';
import AmenityDetailView from './views/AmenityDetailView';
import FiltersView from './views/FiltersView';
import { buildFiltersAndSort } from '../utils/filterHelpers';

import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from '@expo/vector-icons';

export default function MapSearchSheet({ navigate, cancelNavigation }) {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => [100, '50%', '90%'], []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  // filters live here so they persist across view changes
  const [filters, setFilters] = useState({
    sort: "Best Route",   // always preset
    restroom: null,       // no preset
    accessible: null,     // no preset
  });

  const goTo = (viewName, snapIndex = 1) => {
    if (viewName === "categories") {
      setFilters({
        sort: "Best Route",
        restroom: null,
        accessible: null,
      });
    }
    setView(viewName);
    sheetRef.current?.snapToIndex(snapIndex);
  };

  const handleStart = (amenity) => {
    const source = { latitude: 32.897257, longitude: -97.0419 };
    const target = { 
      latitude: parseFloat(amenity.location.y), 
      longitude: parseFloat(amenity.location.x) 
    };

    navigate(source, target);
    goTo("categories", 0);
  };

  const handleCancel = () => {
    cancelNavigation();
    goTo("categories", 0);
  };


  return (
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={setCurrentIndex}
      backgroundStyle={styles.sheetBackground}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {view === "categories" && (
          <CategoriesView
            currentIndex={currentIndex}
            onCategoryPress={(category) => {
              setSelectedCategory(category);
              goTo("amenities", 2);
            }}
            onFilterPress={() => goTo("filters", 2)}
            onSearchFocus={() => sheetRef.current?.snapToIndex(1)}
          />
        )}
        {view === "amenities" && (
          <AmenitiesListView
            category={selectedCategory}
            filters={filters}          // make sure this line is there
            onBack={() => goTo("categories", 1)}
            onAmenityPress={(amenity) => {
              setSelectedAmenity(amenity);
              goTo("detail", 2);
            }}
            onFilterPress={() => goTo("filters", 2)}
            onSearchFocus={() => sheetRef.current?.snapToIndex(2)}
          />
        )}
        {view === "detail" && (
          <AmenityDetailView
            amenity={selectedAmenity}
            onBack={() => goTo("amenities", 2)}
            onStart={() => handleStart(selectedAmenity)}
            onCancel={() => handleCancel()}
          />
        )}
        {view === "filters" && (
          <FiltersView
            filters={filters}
            onFiltersChange={setFilters}
            onBack={() => goTo("amenities", 1)}
          />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: { 
    borderRadius: 0, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
});