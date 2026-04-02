// api/navApi.js
import BASE_URL from './config';

export const getNav = async () => {
  const res = await fetch(`${BASE_URL}/nav`);
  return res.json();
};

export const postNavMap = async (body) => {
  const res = await fetch(`${BASE_URL}/nav/map`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};