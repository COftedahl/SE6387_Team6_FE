import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NavigationInstructionsView from '../NavigationInstructionsView';

/* ---------------- MOCKS ---------------- */

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

/* ---------------- TEST DATA ---------------- */

const mockInstructions = [
  'Go straight for 10 meters',
  'Turn left at gate A12',
  'Continue straight',
];

const baseProps = {
  instructions: mockInstructions,
  rerouteOffer: null,
  onAcceptReroute: jest.fn(),
  onDeclineReroute: jest.fn(),
  onCancel: jest.fn(),
};

/* ---------------- TESTS ---------------- */

describe('NavigationInstructionsView', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state when no instructions', () => {
    const { getByText } = render(
      <NavigationInstructionsView
        {...baseProps}
        instructions={[]}
      />
    );

    expect(getByText('Calculating route...')).toBeTruthy();
    expect(getByText('End Navigation')).toBeTruthy();
  });

  test('renders current instruction and step count', () => {
    const { getByText } = render(
      <NavigationInstructionsView {...baseProps} />
    );

    expect(getByText('Navigation')).toBeTruthy();
    expect(getByText('1 / 3')).toBeTruthy();
    expect(getByText('Go straight for 10 meters')).toBeTruthy();
  });

  test('renders remaining instructions list', () => {
    const { getByText } = render(
      <NavigationInstructionsView {...baseProps} />
    );

    expect(getByText('Turn left at gate A12')).toBeTruthy();
    expect(getByText('Continue straight')).toBeTruthy();
  });

  test('moves to next instruction when Next button is pressed', () => {
    const { getByText } = render(
      <NavigationInstructionsView {...baseProps} />
    );

    fireEvent.press(getByText('Next (Dev)'));

    // after state update, step count changes
    expect(getByText('2 / 3')).toBeTruthy();
  });

  test('calls onCancel when End Navigation is pressed', () => {
    const { getAllByText } = render(
      <NavigationInstructionsView {...baseProps} />
    );

    fireEvent.press(getAllByText('End Navigation')[0]);

    expect(baseProps.onCancel).toHaveBeenCalled();
  });

});