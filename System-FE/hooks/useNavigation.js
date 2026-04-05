import { useState, useEffect, useRef } from 'react';
import WS_MESSAGE_TYPE from '../constants/WSMessageType';

const useNavigation = () => {
  const [navID, setNavID] = useState(null);
  const [route, setRoute] = useState([]); // array of {x, y} ILocation
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket('ws://10.0.2.2:5000/nav');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WS message received:', message);

      switch (message.messageType) {
        case WS_MESSAGE_TYPE.SEND_NAV_ID:
          // Server sends navID on connect
          setNavID(message.body);
          break;

        case WS_MESSAGE_TYPE.SEND_PATH:
          // Server sends route after REQUEST_NAVIGATE
          const path = message.body;
          // Convert ILocation {x, y} to react-native-maps {latitude, longitude}
          const coords = path.route.map(loc => ({
            latitude: parseFloat(loc.y),
            longitude: parseFloat(loc.x),
          }));
          setRoute(coords);
          break;

        default:
          console.log('Unhandled message type:', message.messageType);
      }
    };

    ws.current.onerror = (error) => {
      console.log('WebSocket error:', error.message);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const navigate = (source, target, useAccessibleRouting = false) => {
    if (!ws.current || !navID) {
      console.log('WebSocket not ready or navID missing');
      return;
    }

    ws.current.send(JSON.stringify({
      messageType: WS_MESSAGE_TYPE.REQUEST_NAVIGATE,
      body: {
        source: { x: String(source.longitude), y: String(source.latitude) },
        target: { x: String(target.longitude), y: String(target.latitude) },
        useAccessibleRouting,
      }
    }));
  };

  const cancelNavigation = () => {
    if (!ws.current || !navID) return;
    ws.current.send(JSON.stringify({
      messageType: WS_MESSAGE_TYPE.CANCEL_NAVIGATION,
      body: navID,
    }));
    setRoute([]);
  };

  return { navID, route, connected, navigate, cancelNavigation };
};

export default useNavigation;