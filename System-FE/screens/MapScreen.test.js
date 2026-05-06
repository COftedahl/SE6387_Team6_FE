import React from 'react';
import { render } from '@testing-library/react-native';
import MapScreen from '../MapScreen';

/* ---------------- MOCKS ---------------- */

// Mock react-native-maps (VERY IMPORTANT)
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: View,
    Marker: (props) => <View {...props} />,
    Polyline: (props) => <View {...props} />,
    UrlTile: () => null,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock hooks
jest.mock('../hooks/useUserPosition', () => ({
  __esModule: true,
  default: () => ({
    position: {
      latitude: 32.897257,
      longitude: -97.0419,
    },
  }),
}));

jest.mock('../hooks/useNavigation', () => ({
  __esModule: true,
  default: () => ({
    route: [],
    instructions: [],
    connected: true,
    isNavigating: false,
    navigate: jest.fn(),
    cancelNavigation: jest.fn(),
    rerouteOffer: false,
    acceptReroute: jest.fn(),
    declineReroute: jest.fn(),
    updatePosition: jest.fn(),
  }),
}));

// Mock bottom sheet
jest.mock('../sheets/MapSearchSheet', () => 'MapSearchSheet');

/* ---------------- TESTS ---------------- */

describe('MapScreen', () => {

  test('renders map screen without crashing', () => {
    render(<MapScreen />);
  });

  test('renders user marker', () => {
    const { UNSAFE_getAllByProps } = render(<MapScreen />);

    const markers = UNSAFE_getAllByProps({ title: 'You' });
    expect(markers.length).toBeGreaterThan(0);
  });

  test('does not render route when not navigating', () => {
    const { queryByTestId } = render(<MapScreen />);

    // Polyline is mocked, so we check absence via props behavior
    const routes = queryByTestId?.('route-line');
    expect(routes).toBeNull();
  });

  test('renders MapSearchSheet', () => {
    const { getByText } = render(<MapScreen />);

    expect(getByText('MapSearchSheet')).toBeTruthy();
  });

});