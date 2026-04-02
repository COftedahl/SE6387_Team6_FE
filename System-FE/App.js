import * as React from 'react';
import NavContainer from './containers/NavContainer';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(){
  return(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavContainer/>
    </GestureHandlerRootView>
  );
}

export default App;