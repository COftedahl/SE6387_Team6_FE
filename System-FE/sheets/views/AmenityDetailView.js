import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AmenityDetailView({ amenity, onBack, onStart, onCancel }) {
  if (!amenity) return null;

  const isAccessible = amenity.accessibilityClass === 'ACCESSIBLE';
  const waitingMinutes = Math.ceil(amenity.durationToAmenity / 60);
  // const distanceMiles = (amenity.distanceToAmenity * 0.000621371).toFixed(1);
  const distanceMiles = (amenity.distanceToAmenity).toFixed(1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#FF3B00" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Detail Card */}
      <View style={styles.card}>
        {/* Icon + Title */}
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={isAccessible ? "accessibility" : "walk-outline"}
              size={28}
              color="#FF3B00"
            />
          </View>
          <Text style={styles.title}>
            {amenity.type.charAt(0) + amenity.type.slice(1).toLowerCase()} - {amenity.accessibilityClass.charAt(0) + amenity.accessibilityClass.slice(1).toLowerCase()}
          </Text>
        </View>

        {/* Info rows */}
        <Text style={styles.infoText}>
          Est. waiting time: {waitingMinutes} minutes
        </Text>
        <Text style={styles.infoText}>
          Distance: {distanceMiles} meters
        </Text>
        <Text style={styles.infoText}>
          Status: <Text style={{ color: amenity.status === 'OPEN' ? '#34C759' : '#FF3B00' }}>
            {amenity.status}
          </Text>
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: '#FF3B00', fontSize: 16, marginLeft: 2 },
  card: { marginTop: 20, padding: 16, borderRadius: 12, backgroundColor: '#F9F9F9', gap: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFE9E4', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '600', color: '#333', flex: 1 },
  infoText: { fontSize: 14, color: '#555' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelButton: { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, borderColor: '#FF3B00', alignItems: 'center' },
  cancelText: { color: '#FF3B00', fontSize: 16, fontWeight: '600' },
  startButton: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#FF3B00', alignItems: 'center' },
  startText: { color: 'white', fontSize: 16, fontWeight: '600' },
});