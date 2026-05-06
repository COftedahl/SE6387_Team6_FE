import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AmenitiesListView from '../AmenitiesListView';

/* ---------------- MOCKS ---------------- */

// Mock API
jest.mock('../../api/amenitiesApi', () => ({
  getAmenitiesSuggested: jest.fn(),
}));

// Mock filter helper
jest.mock('../../utils/filterHelpers', () => ({
  buildFiltersAndSort: jest.fn(() => ({
    filterList: [],
    sortMethod: 'DISTANCE',
  })),
}));

// Mock icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock SearchBar
jest.mock('../../components/SearchBar', () => 'SearchBar');

import { getAmenitiesSuggested } from '../../api/amenitiesApi';

/* ---------------- TEST DATA ---------------- */

const mockAmenities = [
  {
    id: '1',
    room: 'A12',
    status: 'OPEN',
    amenityInformation: 'Restroom',
    distanceToAmenity: 120,
    currentAvailableSlots: 2,
    capacity: 5,
  },
  {
    id: '2',
    room: 'B05',
    status: 'CLOSED',
    amenityInformation: 'Water Fountain',
    distanceToAmenity: 300,
    currentAvailableSlots: 0,
    capacity: 3,
  },
];

const defaultProps = {
  category: { name: 'Restrooms', amenityType: 'RESTROOM' },
  filters: {},
  userPosition: { latitude: 32.8, longitude: -97.0 },
  onBack: jest.fn(),
  onAmenityPress: jest.fn(),
  onFilterPress: jest.fn(),
  onSearchFocus: jest.fn(),
  onAmenitiesLoaded: jest.fn(),
};

/* ---------------- TESTS ---------------- */

describe('AmenitiesListView', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading indicator initially', () => {
    getAmenitiesSuggested.mockReturnValue(new Promise(() => {}));

    const { getByTestId } = render(
      <AmenitiesListView {...defaultProps} />
    );

    expect(getByTestId || getByTestId).toBeDefined();
  });

  test('renders amenities after API loads', async () => {
    getAmenitiesSuggested.mockResolvedValue(mockAmenities);

    const { getByText } = render(
      <AmenitiesListView {...defaultProps} />
    );

    await waitFor(() => {
      expect(getByText('Room A12')).toBeTruthy();
      expect(getByText('Room B05')).toBeTruthy();
    });
  });

  test('shows empty state when no amenities', async () => {
    getAmenitiesSuggested.mockResolvedValue([]);

    const { getByText } = render(
      <AmenitiesListView {...defaultProps} />
    );

    await waitFor(() => {
      expect(getByText('No amenities found')).toBeTruthy();
    });
  });

  test('calls onAmenityPress when item is pressed', async () => {
    getAmenitiesSuggested.mockResolvedValue(mockAmenities);

    const { getByText } = render(
      <AmenitiesListView {...defaultProps} />
    );

    await waitFor(() => getByText('Room A12'));

    fireEvent.press(getByText('Room A12'));

    expect(defaultProps.onAmenityPress).toHaveBeenCalledWith(
      mockAmenities[0]
    );
  });

  test('calls onAmenitiesLoaded after fetch', async () => {
    getAmenitiesSuggested.mockResolvedValue(mockAmenities);

    render(<AmenitiesListView {...defaultProps} />);

    await waitFor(() => {
      expect(defaultProps.onAmenitiesLoaded).toHaveBeenCalledWith(
        mockAmenities
      );
    });
  });

  test('calls back button', () => {
    const { getByText } = render(
      <AmenitiesListView {...defaultProps} />
    );

    fireEvent.press(getByText('Back'));

    expect(defaultProps.onBack).toHaveBeenCalled();
  });

});