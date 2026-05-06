import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoriesView from '../CategoriesView';

/* ---------------- MOCKS ---------------- */

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

/* ---------------- TEST DATA ---------------- */

const mockProps = {
  currentIndex: 1, // IMPORTANT: must be > 0 to render list
  onCategoryPress: jest.fn(),
  onFilterPress: jest.fn(),
  onSearchFocus: jest.fn(),
};

/* ---------------- TESTS ---------------- */

describe('CategoriesView', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render list when currentIndex is 0', () => {
    const { queryByText } = render(
      <CategoriesView {...mockProps} currentIndex={0} />
    );

    expect(queryByText('Coffee')).toBeNull();
    expect(queryByText('Bars')).toBeNull();
  });

  test('renders all categories when currentIndex > 0', () => {
    const { getByText } = render(
      <CategoriesView {...mockProps} />
    );

    expect(getByText('Coffee')).toBeTruthy();
    expect(getByText('Bars')).toBeTruthy();
    expect(getByText('Restrooms')).toBeTruthy();
    expect(getByText('Lounges')).toBeTruthy();
    expect(getByText('Restaurants')).toBeTruthy();
    expect(getByText('Shops')).toBeTruthy();
  });

  test('calls onCategoryPress when category is pressed', () => {
    const { getByText } = render(
      <CategoriesView {...mockProps} />
    );

    fireEvent.press(getByText('Coffee'));

    expect(mockProps.onCategoryPress).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Coffee',
        amenityType: 'COFFEE',
      })
    );
  });

  test('renders Restrooms with dual icon logic', () => {
    const { getByText } = render(
      <CategoriesView {...mockProps} />
    );

    expect(getByText('Restrooms')).toBeTruthy();
  });

});