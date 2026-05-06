import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterMenu from '../FilterMenu';

/* ---------------- MOCKS ---------------- */

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

/* ---------------- TEST DATA ---------------- */

const mockFilters = {
  sort: "Best Route",
  restroom: "Male",
  useAccessibleRouting: false,
};

const mockProps = {
  filters: mockFilters,
  onBack: jest.fn(),
  onFiltersChange: jest.fn(),
};

/* ---------------- TESTS ---------------- */

describe('FilterMenu', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders filter sections', () => {
    const { getByText } = render(
      <FilterMenu {...mockProps} />
    );

    expect(getByText('Sort Suggestions By:')).toBeTruthy();
    expect(getByText('Preferred Restroom Type:')).toBeTruthy();
    expect(getByText('Use Accessible Navigation Routes:')).toBeTruthy();
  });

  test('calls onBack when back button is pressed', () => {
    const { getByRole } = render(
      <FilterMenu {...mockProps} />
    );

    const backButton = getByRole('button');
    fireEvent.press(backButton);

    expect(mockProps.onBack).toHaveBeenCalled();
  });

  test('updates sort filter when option is selected', () => {
    const { getByText } = render(
      <FilterMenu {...mockProps} />
    );

    fireEvent.press(getByText('Least Walking'));

    expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: 'Least Walking',
      })
    );
  });

  test('updates restroom filter when option is selected', () => {
    const { getByText } = render(
      <FilterMenu {...mockProps} />
    );

    fireEvent.press(getByText('Accessible'));

    expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        restroom: 'Accessible',
      })
    );
  });

  test('toggles accessible navigation checkbox', () => {
    const { getByText } = render(
      <FilterMenu {...mockProps} />
    );

    fireEvent.press(
      getByText('Enable wheelchair-accessible navigation')
    );

    expect(mockProps.onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        useAccessibleRouting: true,
      })
    );
  });

});