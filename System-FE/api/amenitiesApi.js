// api/amenitiesApi.js
import BASE_URL from './config';

export const getAllAmenities = async (body) => {
  const res = await fetch(`${BASE_URL}/amenities/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const getAmenitiesOfType = async (body) => {
  const res = await fetch(`${BASE_URL}/amenities/oftype`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const getAmenitiesDetails = async (body) => {
  const res = await fetch(`${BASE_URL}/amenities/details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

export const getAmenitiesSuggested = async (body) => {
  try {
    const res = await fetch(`${BASE_URL}/amenities/suggested`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log('getAmenitiesSuggested status:', res.status);
    return data;
  } catch (err) {
    console.log('getAmenitiesSuggested error:', err);
    return null;
  }
};

export const getAmenitiesFilter = async (body) => {
  const res = await fetch(`${BASE_URL}/amenities/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};