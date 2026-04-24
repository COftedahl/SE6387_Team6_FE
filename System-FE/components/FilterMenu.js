import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function FilterMenu({ onBack, filters, onFiltersChange }) {
  const FilterSection = ({ title, options, stateKey }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.radioOption}
          onPress={() => onFiltersChange({ ...filters, [stateKey]: opt })}
        >
          <Ionicons
            name={filters[stateKey] === opt ? "radio-button-on" : "radio-button-off"}
            size={20}
            color={filters[stateKey] === opt ? "#FF3B00" : "#666"}
          />
          <Text style={[styles.optionText, filters[stateKey] === opt && styles.selectedText]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#666666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
      </View>
      <FilterSection
        title="Sort Suggestions By:"
        options={["Best Route", "Least Walking", "Least Waiting Time"]}
        stateKey="sort"
      />
      <FilterSection
        title="Preferred Restroom Type:"
        options={["Male", "Female", "Accessible"]}
        stateKey="restroom"
      />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Use Accessible Navigation Routes:</Text>
        <TouchableOpacity
          style={styles.checkboxOption}
          onPress={() => onFiltersChange({ 
            ...filters, 
            useAccessibleRouting: !filters.useAccessibleRouting 
          })}
        >
          <Ionicons
            name={filters.useAccessibleRouting ? "checkbox" : "square-outline"}
            size={22}
            color={filters.useAccessibleRouting ? "#FF3B00" : "#666"}
          />
          <Text style={[
            styles.optionText, 
            filters.useAccessibleRouting && styles.selectedText
          ]}>
            Enable wheelchair-accessible navigation
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerNote}>
        If no filters are selected, the default settings are to provide the best accessible route.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginRight: 24, color: '#666' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#666666', marginBottom: 10 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  optionText: { marginLeft: 10, fontSize: 13, color: '#666' },
  selectedText: { color: '#333', fontWeight: '500' },
  footerNote: { fontSize: 12, color: '#666666', textAlign: 'center', marginTop: 10, paddingBottom: 30 },
    checkboxOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 6,
  },
});