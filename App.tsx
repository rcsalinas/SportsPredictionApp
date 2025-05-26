import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { SocketProvider } from "./src/context/SocketContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
	return (
		<SafeAreaProvider>
			<SocketProvider>
				<AppNavigator />
			</SocketProvider>
		</SafeAreaProvider>
	);
}
