import './global.css';

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { TravelProvider } from './src/state/TravelContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <TravelProvider>
        <AppNavigator />
      </TravelProvider>
    </SafeAreaProvider>
  );
}
