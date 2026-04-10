import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import { getAmenitiesSuggested } from '../../api/amenitiesApi';
import { buildFiltersAndSort } from '../../utils/filterHelpers';

export default function AmenitiesListView({ category, filters, onBack, onAmenityPress, onFilterPress, onSearchFocus }) {

  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      const { filterList, sortMethod } = buildFiltersAndSort(filters, category.amenityType);
      const data = await getAmenitiesSuggested({
        x: "-97.0419",
        y: "32.897257",
        filters: filterList,
        sortMethod,
      });
      setAmenities(data || []);
      setLoading(false);
    };
    fetchAmenities();
  }, [category, filters]); // refetches when filters change

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#34C759';
      case 'CLOSED': return '#FF3B00';
      default: return '#999';
    }
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#FF3B00" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category?.name}</Text>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar onFocus={onSearchFocus} onFilterPress={onFilterPress} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF3B00" />
        </View>
      ) : amenities.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No amenities found</Text>
        </View>
      ) : (
        <FlatList
          data={amenities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => onAmenityPress(item)}>
              <View style={styles.amenityInfo}>
                <Text style={styles.itemText}>Room {item.room}</Text>
                <Text style={styles.subtext}>
                  {/* {item.accessibilityClass} · {item.amenityInformation ? `${item.amenityInformation} · ` : ''}{item.distanceToAmenity.toFixed(0)}m away                </Text> */}
                  {item.amenityInformation ? `${item.amenityInformation} · ` : ''}{item.distanceToAmenity.toFixed(0)}m away                </Text>
                <Text style={styles.subtext}>
                  {item.currentAvailableSlots}/{item.capacity} slots available
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#FF3B00', fontSize: 16, marginLeft: 2 },
  title: { fontSize: 17, fontWeight: '600', color: '#333', marginLeft: 12 },
  searchWrapper: { paddingHorizontal: 16, paddingVertical: 10 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingHorizontal: 16 },
  amenityInfo: { flex: 1, marginRight: 12 },
  subtext: { fontSize: 12, color: '#999', marginTop: 2 },
  itemText: { fontSize: 16, color: '#333' },
  rightColumn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontSize: 12, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  emptyText: { color: '#999', fontSize: 15 },
});