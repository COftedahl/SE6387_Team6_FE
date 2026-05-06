import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AmenityDetailView from '../AmenityDetailView';

/* ---------------- MOCKS ---------------- */

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

/* ---------------- TEST DATA ---------------- */

const mockAmenity = {
  type: 'RESTROOM',
  accessibilityClass: 'ACCESSIBLE',
  durationToAmenity: 300, // seconds → 5 minutes
  distanceToAmenity: 120, // meters
  status: 'OPEN',
};

const defaultProps = {
  amenity: mockAmenity,
  onBack: jest.fn(),
  onStart: jest.fn(),
  onCancel: jest.fn(),
};

/* ---------------- TESTS ---------------- */

describe('AmenityDetailView', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when amenity is null', () => {
    const { toJSON } = render(
      <AmenityDetailView {...defaultProps} amenity={null} />
    );

    expect(toJSON()).toBeNull();
  });

  test('renders amenity title correctly', () => {
    const { getByText } = render(
      <AmenityDetailView {...defaultProps} />
    );

    expect(getByText('Restroom - Accessible')).toBeTruthy();
  });

  test('calculates waiting time correctly', () => {
    const { getByText } = render(
      <AmenityDetailView {...defaultProps} />
    );

    // 300 seconds → 5 minutes
    expect(getByText('Est. waiting time: 5 minutes')).toBeTruthy();
  });

  test('renders distance correctly', () => {
    const { getByText } = render(
      <AmenityDetailView {...defaultProps} />
    );

    expect(getByText('Distance: 120.0 meters')).toBeTruthy();
  });

  test('shows correct status color text', () => {
    const { getByText } = render(
      <AmenityDetailView {...defaultProps} />
    );

    expect(getByText('OPEN')).toBeTruthy();
  });

  test('calls onBack when back button is pressed', () => {
    const { getByText } = render(
      <AmenityDetailView {...defaultProps} />
    );

    fireEvent.press(getByText('Back'));

    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  test('calls onStart when start button is pressed', () => {
    const { getByText } = render(
      <AmenityDetailView {...defaultProps} />
    );

    fireEvent.press(getByText('Start'));

    expect(defaultProps.onStart).toHaveBeenCalled();
  });

  test('calls onCancel when cancel button is pressed', () => {
    const { getByText } = render(
      <AmenityDetailView {...defaultProps} />
    );

    fireEvent.press(getByText('Cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

});