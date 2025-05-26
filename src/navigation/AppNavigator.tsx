import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "../screens/DashboardScreen";
import GameDetailScreen from "../screens/GameDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { TouchableOpacity, Text } from "react-native";

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
				<Stack.Screen
					name="Dashboard"
					component={DashboardScreen}
					options={({ navigation }) => ({
						headerRight: () => (
							<TouchableOpacity
								style={{ marginRight: 15 }}
								onPress={() => navigation.navigate("Profile")}
							>
								<Text style={{ color: "#007bff" }}>Profile</Text>
							</TouchableOpacity>
						),
					})}
				/>
				<Stack.Screen name="GameDetail" component={GameDetailScreen} />
				<Stack.Screen name="Profile" component={ProfileScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default AppNavigator;
