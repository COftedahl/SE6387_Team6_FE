import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

/* ---------------- MOCKS ---------------- */

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

/* ---------------- TESTS ---------------- */

describe('SearchBar', () => {

  const mockProps = {
    value: '',
    onChange: jest.fn(),
    onFocus: jest.fn(),
    onFilterPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input correctly', () => {
    const { getByPlaceholderText } = render(
      <SearchBar {...mockProps} />
    );

    expect(
      getByPlaceholderText('Search for desired amenity')
    ).toBeTruthy();
  });

  test('calls onChange when typing', () => {
    const { getByPlaceholderText } = render(
      <SearchBar {...mockProps} />
    );

    fireEvent.changeText(
      getByPlaceholderText('Search for desired amenity'),
      'Coffee'
    );

    expect(mockProps.onChange).toHaveBeenCalledWith('Coffee');
  });

  test('calls onFocus when input is focused', () => {
    const { getByPlaceholderText } = render(
      <SearchBar {...mockProps} />
    );

    fireEvent(getByPlaceholderText('Search for desired amenity'), 'focus');

    expect(mockProps.onFocus).toHaveBeenCalled();
  });

  test('calls onFilterPress when filter button is pressed', () => {
    const { UNSAFE_getByType } = render(
      <SearchBar {...mockProps} />
    );

    const button = UNSAFE_getByType('TouchableOpacity');
    fireEvent.press(button);

    expect(mockProps.onFilterPress).toHaveBeenCalled();
  });

});