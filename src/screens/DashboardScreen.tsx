import React, { useEffect, useState } from "react";
import {
	View,
	FlatList,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import gamesData from "../data/sample-games.json";
import { Game } from "../types";
import GameItem from "../components/GameItem";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type GameStatus = "all" | "scheduled" | "inProgress" | "final";

const DashboardScreen: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [filter, setFilter] = useState<GameStatus>("all");
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					style={{ marginRight: 15 }}
					onPress={() => navigation.navigate("Profile")}
				>
					<Text style={{ color: "#007bff" }}>Profile</Text>
				</TouchableOpacity>
			),
		});
	}, [navigation]);

	useEffect(() => {
		setGames(gamesData.games as Game[]);
	}, []);

	const filteredGames =
		filter === "all" ? games : games.filter((game) => game.status === filter);

	return (
		<View style={styles.container}>
			<View style={styles.filters}>
				{(["all", "scheduled", "inProgress", "final"] as GameStatus[]).map(
					(status) => (
						<TouchableOpacity
							key={status}
							style={[
								styles.filterButton,
								filter === status && styles.activeFilter,
							]}
							onPress={() => setFilter(status)}
						>
							<Text style={styles.filterText}>{status.toUpperCase()}</Text>
						</TouchableOpacity>
					)
				)}
			</View>
			<FlatList
				data={filteredGames}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <GameItem game={item} />}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: "#fff" },
	filters: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 16,
	},
	filterButton: { padding: 8, borderRadius: 8, backgroundColor: "#ececec" },
	activeFilter: { backgroundColor: "#007bff" },
	filterText: { color: "#000" },
});

export default DashboardScreen;
