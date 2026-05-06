import React from 'react';
import { render } from '@testing-library/react-native';
import NavContainer from '../NavContainer';

/* -------------------- MOCKS -------------------- */

// Mock screens so navigation doesn’t depend on real implementations
jest.mock('../screens/MapScreen', () => 'MapScreen');
jest.mock('../screens/ReportScreen', () => 'ReportScreen');
jest.mock('../screens/ProfileScreen', () => 'ProfileScreen');

// Mock React Navigation container (we only test structure, not library internals)
jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({ children }) => children,
  };
});

// Mock bottom tabs (avoid native navigation dependencies)
jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: () => {
      return {
        Navigator: ({ children }) => children,
        Screen: ({ name }) => <>{name}</>,
      };
    },
  };
});

// Mock icons
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: 'Ionicons',
  };
});

/* -------------------- TESTS -------------------- */

describe('NavContainer', () => {

  test('renders all tab names', () => {
    const { getByText } = render(<NavContainer />);

    expect(getByText('Report')).toBeTruthy();
    expect(getByText('Navigate')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  test('renders map screen on initial load', () => {
    const { getByText } = render(<NavContainer />);

    // Because MapScreen is mocked as a string component
    expect(getByText('MapScreen')).toBeTruthy();
  });

  test('renders all screens in navigator', () => {
    const { getByText } = render(<NavContainer />);

    expect(getByText('ReportScreen')).toBeTruthy();
    expect(getByText('MapScreen')).toBeTruthy();
    expect(getByText('ProfileScreen')).toBeTruthy();
  });

});