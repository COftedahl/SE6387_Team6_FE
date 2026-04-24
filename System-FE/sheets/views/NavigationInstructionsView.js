import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NavigationInstructionsView({ 
  instructions, 
  rerouteOffer, 
  onAcceptReroute, 
  onDeclineReroute, 
  onCancel 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getReasonText = (reason) => {
    switch (reason) {
      case 'LOCATION_CHANGED': return 'Your location has changed';
      case 'INFRASTRUCTURE_CHANGED': return 'Route conditions have changed';
      case 'AMENITIES_CHANGED': return 'Amenity availability has changed';
      default: return 'A better route is available';
    }
  };

  if (!instructions || instructions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Navigation</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF3B00" />
          <Text style={{ color: '#999', marginTop: 10 }}>Calculating route...</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>End Navigation</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getInstructionIcon = (instruction) => {
    if (instruction.toLowerCase().includes('right')) return 'arrow-forward';
    if (instruction.toLowerCase().includes('left')) return 'arrow-back';
    if (instruction.toLowerCase().includes('straight')) return 'arrow-up';
    return 'navigate-outline';
  };

  const isLastInstruction = currentIndex === instructions.length - 1;
  const remainingInstructions = instructions.slice(currentIndex + 1);

  return (
    <View style={styles.container}>

      {/* reroute offer modal */}
      {rerouteOffer && (
        <Modal
          transparent={true}
          visible={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="warning" size={40} color="#FF9500" />
              <Text style={styles.modalTitle}>Reroute Available</Text>
              <Text style={styles.modalMessage}>
                {getReasonText(rerouteOffer.reason)}
              </Text>
              <Text style={styles.modalSubmessage}>
                Would you like to take the new route?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.declineButton} 
                  onPress={onDeclineReroute}
                >
                  <Text style={styles.declineText}>No, Keep Current</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.acceptButton} 
                  onPress={onAcceptReroute}
                >
                  <Text style={styles.acceptText}>Yes, Reroute</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Navigation</Text>
        <Text style={styles.stepCount}>
          {currentIndex + 1} / {instructions.length}
        </Text>
      </View>

      {/* Current instruction highlight */}
      <View style={styles.currentInstruction}>
        <Ionicons
          name={getInstructionIcon(instructions[currentIndex])}
          size={32}
          color="white"
        />
        <Text style={styles.currentInstructionText}>
          {instructions[currentIndex]}
        </Text>
      </View>

      {/* Remaining instructions */}
      <FlatList
        data={remainingInstructions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.instructionRow}>
            <View style={styles.instructionIcon}>
              <Ionicons name={getInstructionIcon(item)} size={20} color="#FF3B00" />
            </View>
            <Text style={styles.instructionText}>{item}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* DEV ONLY: Next button to simulate moving */}
        {!isLastInstruction && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => setCurrentIndex(currentIndex + 1)}
          >
            <Text style={styles.nextText}>Next (Dev)</Text>
          </TouchableOpacity>
        )}
        {isLastInstruction && (
          <View style={styles.arrivedBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.arrivedText}>You have arrived!</Text>
          </View>
        )}
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>End Navigation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  title: { fontSize: 17, fontWeight: '600', color: '#333' },
  stepCount: { fontSize: 13, color: '#999' },
  currentInstruction: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF3B00', margin: 16, padding: 16, borderRadius: 12, gap: 12 },
  currentInstructionText: { color: 'white', fontSize: 16, fontWeight: '600', flex: 1 },
  instructionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 12, paddingHorizontal: 16 },
  instructionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFE9E4', justifyContent: 'center', alignItems: 'center' },
  instructionText: { fontSize: 14, color: '#333', flex: 1 },
  buttonContainer: { padding: 16, gap: 10 },
  nextButton: { paddingVertical: 14, borderRadius: 10, backgroundColor: '#007AFF', alignItems: 'center' },
  nextText: { color: 'white', fontSize: 16, fontWeight: '600' },
  arrivedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10 },
  arrivedText: { color: '#34C759', fontSize: 15, fontWeight: '600' },
  cancelButton: { paddingVertical: 14, borderRadius: 10, borderWidth: 1.5, borderColor: '#FF3B00', alignItems: 'center' },
  cancelText: { color: '#FF3B00', fontSize: 16, fontWeight: '600' },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  modalContent: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 24, 
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#333',
    marginTop: 8,
  },
  modalMessage: { 
    fontSize: 15, 
    color: '#666', 
    textAlign: 'center',
  },
  modalSubmessage: { 
    fontSize: 14, 
    color: '#999', 
    textAlign: 'center',
    marginBottom: 8,
  },
  modalButtons: { 
    flexDirection: 'row', 
    gap: 12, 
    width: '100%',
    marginTop: 8,
  },
  declineButton: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 10, 
    borderWidth: 1.5, 
    borderColor: '#FF3B00', 
    alignItems: 'center',
  },
  declineText: { 
    color: '#FF3B00', 
    fontSize: 15, 
    fontWeight: '600',
  },
  acceptButton: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 10, 
    backgroundColor: '#FF3B00', 
    alignItems: 'center',
  },
  acceptText: { 
    color: 'white', 
    fontSize: 15, 
    fontWeight: '600',
  },
});