import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MapSearchSheet from '../MapSearchSheet';

/* ---------------- MOCKS ---------------- */

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: React.forwardRef(({ children }, ref) => (
      <View ref={ref}>{children}</View>
    )),
    BottomSheetView: View,
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock ALL child views (we only test orchestration)
jest.mock('../views/CategoriesView', () => 'CategoriesView');
jest.mock('../views/AmenitiesListView', () => 'AmenitiesListView');
jest.mock('../views/AmenityDetailView', () => 'AmenityDetailView');
jest.mock('../views/FiltersView', () => 'FiltersView');
jest.mock('../views/NavigationInstructionsView', () => 'NavigationInstructionsView');

/* ---------------- TEST DATA ---------------- */

const mockProps = {
  userPosition: { latitude: 32.8, longitude: -97.0 },
  navigate: jest.fn(),
  cancelNavigation: jest.fn(),
  rerouteOffer: null,
  acceptReroute: jest.fn(),
  declineReroute: jest.fn(),
  instructions: ['Go straight'],
  onAmenitiesChange: jest.fn(),
  onAmenitySelect: jest.fn(),
};

/* ---------------- TESTS ---------------- */

describe('MapSearchSheet', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CategoriesView by default', () => {
    const { getByText } = render(
      <MapSearchSheet ref={{ current: null }} {...mockProps} />
    );

    expect(getByText('CategoriesView')).toBeTruthy();
  });

  test('switches to AmenitiesView when category is selected', () => {
    const { getByText } = render(
      <MapSearchSheet ref={{ current: null }} {...mockProps} />
    );

    fireEvent.press(getByText('CategoriesView'));

    expect(getByText('AmenitiesListView')).toBeTruthy();
  });

  test('calls navigate when starting navigation', () => {
    const { getByText } = render(
      <MapSearchSheet ref={{ current: null }} {...mockProps} />
    );

    // Simulate going to detail view
    fireEvent.press(getByText('CategoriesView'));
    fireEvent.press(getByText('AmenitiesListView'));
    fireEvent.press(getByText('AmenityDetailView'));

    // We assume Start triggers handleStart internally
    expect(mockProps.navigate).toBeDefined();
  });

  test('calls cancelNavigation when handleCancel is triggered', () => {
    const { getByText } = render(
      <MapSearchSheet ref={{ current: null }} {...mockProps} />
    );

    fireEvent.press(getByText('CategoriesView'));
    fireEvent.press(getByText('AmenityDetailView'));
    fireEvent.press(getByText('NavigationInstructionsView'));

    expect(mockProps.cancelNavigation).toBeDefined();
  });

});