import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Game } from "../types";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type GameItemProps = {
	game: Game;
};

const GameItem: React.FC<GameItemProps> = ({ game }) => {
	const navigation =
		useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "scheduled":
				return "#007bff";
			case "inprogress":
				return "#ff9800";
			case "final":
				return "#28a745";
			default:
				return "#666";
		}
	};

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => navigation.navigate("GameDetail", { gameId: game.id })}
		>
			<View style={styles.header}>
				<Text style={styles.status}>{game.status.toUpperCase()}</Text>
				{game.status === "scheduled" && game.startTime && (
					<Text style={styles.time}>
						{new Date(game.startTime).toLocaleString()}
					</Text>
				)}
			</View>

			<View style={styles.teamsContainer}>
				<View style={styles.teamColumn}>
					<Text style={styles.teamAbbr}>{game.awayTeam.abbreviation}</Text>
					<Text style={styles.teamName}>{game.awayTeam.name}</Text>
				</View>

				<View style={styles.scoreContainer}>
					{game.status === "inProgress" || game.status === "final" ? (
						<Text style={styles.score}>
							{game.awayTeam.score ?? 0} - {game.homeTeam.score ?? 0}
						</Text>
					) : (
						<Text style={styles.vs}>VS</Text>
					)}
				</View>

				<View style={styles.teamColumn}>
					<Text style={styles.teamAbbr}>{game.homeTeam.abbreviation}</Text>
					<Text style={styles.teamName}>{game.homeTeam.name}</Text>
				</View>
			</View>

			{game.status === "final" && (
				<View style={styles.winnerContainer}>
					<Text style={styles.winner}>
						Winner: <Text style={styles.winnerTeam}>{game.winner}</Text>
					</Text>
				</View>
			)}

			{game.status === "scheduled" && (
				<TouchableOpacity
					style={styles.betButton}
					onPress={() => navigation.navigate("GameDetail", { gameId: game.id })}
				>
					<Text style={styles.betButtonText}>Place Bet</Text>
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	status: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#007bff",
		backgroundColor: "#e6f0ff",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 4,
	},
	time: {
		fontSize: 12,
		color: "#666",
	},
	teamsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 8,
	},
	teamColumn: {
		flex: 1,
		alignItems: "center",
	},
	teamAbbr: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	teamName: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
		textAlign: "center",
	},
	scoreContainer: {
		paddingHorizontal: 16,
	},
	score: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
	},
	vs: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#666",
	},
	winnerContainer: {
		borderTopWidth: 1,
		borderTopColor: "#eee",
		marginTop: 12,
		paddingTop: 12,
	},
	winner: {
		fontSize: 14,
		color: "#666",
	},
	winnerTeam: {
		color: "#28a745",
		fontWeight: "bold",
	},
	betButton: {
		backgroundColor: "#007bff",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginTop: 12,
		alignItems: "center",
	},
	betButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default GameItem;
