// MapSearchSheet.js - only manages view state and sheet ref
import CategoriesView from './views/CategoriesView';
import AmenitiesListView from './views/AmenitiesListView';
import AmenityDetailView from './views/AmenityDetailView';
import FiltersView from './views/FiltersView';
import NavigationInstructionsView from './views/NavigationInstructionsView';
import { buildFiltersAndSort } from '../utils/filterHelpers';

import React, { useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from '@expo/vector-icons';

const MapSearchSheet = forwardRef(function MapSearchSheet(
  {userPosition, navigate, cancelNavigation, rerouteOffer, acceptReroute, declineReroute, instructions, onAmenitiesChange, onAmenitySelect },
  ref
) {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => [100, '50%', '90%'], []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  // expose selectAmenity to parent (MapScreen)
  useImperativeHandle(ref, () => ({
    selectAmenity: (amenity) => {
      setSelectedAmenity(amenity);
      onAmenitiesChange([]);
      onAmenitySelect(amenity); // show green marker
      goTo("detail", 2);
    }
  }));

  // filters live here so they persist across view changes
  const [filters, setFilters] = useState({
    sort: "Best Route",   // always preset
    restroom: null,       // no preset
    useAccessibleRouting: false, // add this for navigation routing
  });

  const goTo = (viewName, snapIndex = 1) => {
    if (viewName === "categories") {
      setFilters({
        sort: "Best Route",
        restroom: null,
        useAccessibleRouting: false, // add this for navigation routing
      });
      onAmenitiesChange([]); // clear markers when leaving amenities
      onAmenitySelect(null); // clear green marker
    }
    setView(viewName);
    sheetRef.current?.snapToIndex(snapIndex);
  };

  const handleStart = (amenity) => {
    const target = { 
      latitude: parseFloat(amenity.location.y), 
      longitude: parseFloat(amenity.location.x) 
    };

    navigate(userPosition, target, filters.useAccessibleRouting);
    goTo("instructions", 0);
  };

  const handleCancel = () => {
    cancelNavigation();
    onAmenitySelect(null);
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
            filters={filters}
            userPosition={userPosition}
            onBack={() => goTo("categories", 1)}
            onAmenityPress={(amenity) => {
              setSelectedAmenity(amenity);
              onAmenitiesChange([]); // clear markers
              onAmenitySelect(amenity);
              goTo("detail", 2);
            }}
            onFilterPress={() => goTo("filters", 2)}
            onSearchFocus={() => sheetRef.current?.snapToIndex(2)}
            onAmenitiesLoaded={onAmenitiesChange}
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
        {view === "instructions" && (
          <NavigationInstructionsView
            instructions={instructions}
            rerouteOffer={rerouteOffer}
            onAcceptReroute={acceptReroute}
            onDeclineReroute={declineReroute}
            onCancel={handleCancel}
          />
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetBackground: { 
    borderRadius: 0, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
});

export default MapSearchSheet;