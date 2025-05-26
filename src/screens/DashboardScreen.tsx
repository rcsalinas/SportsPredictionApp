import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
	View,
	FlatList,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { Game } from "../types";
import GameItem from "../components/GameItem";
import { useSocket } from "../context/SocketContext";
import { fetchGames } from "../services/api";

type GameStatus = "all" | "scheduled" | "inProgress" | "final";

const DashboardScreen: React.FC = () => {
	const [games, setGames] = useState<Game[]>([]);
	const [filter, setFilter] = useState<GameStatus>("all");
	const [loading, setLoading] = useState(true);
	const socket = useSocket();

	// 1. Fetch games from API on mount/focus
	useFocusEffect(
		React.useCallback(() => {
			let isActive = true;
			setLoading(true);
			fetchGames()
				.then((data) => {
					if (isActive) {
						setGames(data);
						setLoading(false);
					}
				})
				.catch(() => setLoading(false));
			return () => {
				isActive = false;
			};
		}, [])
	);

	// 2. Listen for WebSocket updates (overrides API data)
	useFocusEffect(
		React.useCallback(() => {
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

			return () => {
				socket.off("gamesUpdate", handleGamesUpdate);
				socket.off("connect_error", handleError);
			};
		}, [socket])
	);

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
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.filtersScrollContainer}
			>
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
							<Text
								style={[
									styles.filterText,
									filter === status && styles.activeFilterText,
								]}
							>
								{status === "inProgress" ? "LIVE" : status.toUpperCase()}
							</Text>
						</TouchableOpacity>
					)
				)}
			</ScrollView>
			<FlatList
				data={filteredGames}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <GameItem game={item} />}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	filtersScrollContainer: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 3,
		gap: 8,
	},
	filterButton: {
		paddingHorizontal: 20,
		borderRadius: 20,
		backgroundColor: "#f1f3f5",
		minWidth: 80,
		alignItems: "center",
		marginRight: 8,
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
		height: 36,
	},

	activeFilter: {
		backgroundColor: "#007bff",
	},
	filterText: {
		fontSize: 13,
		fontWeight: "600",
		color: "#495057",
	},
	activeFilterText: {
		color: "#fff",
	},
	loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default DashboardScreen;
