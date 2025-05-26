import React, { useEffect, useState } from "react";
import {
	View,
	FlatList,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
} from "react-native";
import { Game } from "../types";
import GameItem from "../components/GameItem";
import { useSocket } from "../context/SocketContext";

type GameStatus = "all" | "scheduled" | "inProgress" | "final";

const DashboardScreen: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [filter, setFilter] = useState<GameStatus>("all");
	const [loading, setLoading] = useState(true);
	const socket = useSocket();

	useEffect(() => {
		if (!socket) return;

		const handleGamesUpdate = (updatedGames: Game[]) => {
			setGames(updatedGames);
			setLoading(false);
		};

		const handleError = (error: unknown) => {
			console.error("WebSocket Error (Dashboard):", error);
			setLoading(false);
		};

		socket.on("gamesUpdate", handleGamesUpdate);
		socket.on("connect_error", handleError);

		const timeout = setTimeout(() => {
			setLoading(false);
		}, 8000);

		return () => {
			socket.off("gamesUpdate", handleGamesUpdate);
			socket.off("connect_error", handleError);
			clearTimeout(timeout);
		};
	}, [socket]);

	const filteredGames =
		filter === "all" ? games : games.filter((game) => game.status === filter);

	if (loading) {
		return (
			<SafeAreaView style={styles.loader}>
				<ActivityIndicator size="large" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
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
		</SafeAreaView>
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
	loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DashboardScreen;
