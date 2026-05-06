import { useState, useEffect } from 'react';
// import useLocation from './useLocation'; // uncomment when ready for real GPS

const DEV_POSITION = { latitude: 32.897257, longitude: -97.0419 };

const useUserPosition = () => {
  // FOR DEV: return hardcoded position
  const [position, setPosition] = useState(DEV_POSITION);

  // FOR PRODUCTION: uncomment these lines and comment out the above
  // const { location, error, loading } = useLocation();
  // const [position, setPosition] = useState(DEV_POSITION);
  // 
  // useEffect(() => {
  //   if (location) {
  //     setPosition(location);
  //   }
  // }, [location]);
  //
  // return { position, error, loading };

  return { position, error: null, loading: false };
};

export default useUserPosition;