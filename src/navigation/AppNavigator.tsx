import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import GameDetailScreen from "../screens/GameDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type RootStackParamList = {
	Dashboard: undefined;
	GameDetail: { gameId: string };
	Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Dashboard">
				<Stack.Screen name="Dashboard" component={DashboardScreen} />
				<Stack.Screen name="GameDetail" component={GameDetailScreen} />
				<Stack.Screen name="Profile" component={ProfileScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
