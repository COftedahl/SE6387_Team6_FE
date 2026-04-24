import { useState, useEffect, useRef, useCallback } from 'react';
import WS_MESSAGE_TYPE from '../constants/WSMessageType';

const WS_URL = 'ws://10.0.2.2:5000/nav';

const useNavigation = () => {
  const [navID, setNavID] = useState(null);
  const [route, setRoute] = useState([]);
  const [instructions, setInstructions] = useState([]); // add this
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);
  const pendingNavigation = useRef(null); // stores navigate call if ws is reconnecting

  const connect = useCallback(() => {
    // don't reconnect if already open
    if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.messageType) {
        case WS_MESSAGE_TYPE.SEND_NAV_ID:
          setNavID(message.body);
          // if there was a pending navigation waiting for reconnect, fire it now
          if (pendingNavigation.current) {
            const { source, target, useAccessibleRouting } = pendingNavigation.current;
            ws.current.send(JSON.stringify({
              messageType: WS_MESSAGE_TYPE.REQUEST_NAVIGATE,
              body: {
                source: { x: String(source.longitude), y: String(source.latitude) },
                target: { x: String(target.longitude), y: String(target.latitude) },
                useAccessibleRouting,
              }
            }));
            pendingNavigation.current = null;
          }
          break;

        case WS_MESSAGE_TYPE.SEND_PATH:
          const path = message.body;
          console.log('Received path:', path);
          const coords = path.route.map(loc => ({
            latitude: parseFloat(loc.y),
            longitude: parseFloat(loc.x),
          }));
          setRoute(coords);
          setInstructions(path.instructions || []); // add this
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
      setNavID(null);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [connect]);

  const navigate = (source, target, useAccessibleRouting = false) => {
    // if disconnected, store the request and reconnect
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !navID) {
      console.log('WebSocket not ready, reconnecting...');
      pendingNavigation.current = { source, target, useAccessibleRouting };
      connect();
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
    if (ws.current && navID) {
      ws.current.send(JSON.stringify({
        messageType: WS_MESSAGE_TYPE.CANCEL_NAVIGATION,
        body: navID,
      }));
      ws.current.close();
    }
    setRoute([]);
    setNavID(null);
    setConnected(false);
  };

  return { navID, route, instructions, connected, navigate, cancelNavigation };
};

export default useNavigation;