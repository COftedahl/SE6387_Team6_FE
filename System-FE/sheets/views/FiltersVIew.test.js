import React from 'react';
import { render } from '@testing-library/react-native';
import FiltersView from '../FiltersView';

/* ---------------- MOCK ---------------- */

jest.mock('../../components/FilterMenu', () => 'FilterMenu');

/* ---------------- TESTS ---------------- */

describe('FiltersView', () => {

  const mockProps = {
    onBack: jest.fn(),
    filters: { wifi: true },
    onFiltersChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders FilterMenu component', () => {
    const { getByText } = render(<FiltersView {...mockProps} />);

    expect(getByText('FilterMenu')).toBeTruthy();
  });

});