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

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => navigation.navigate("GameDetail", { gameId: game.id })}
		>
			<Text style={styles.team}>
				{game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
			</Text>
			<Text style={styles.status}>{game.status.toUpperCase()}</Text>
			{game.status === "inProgress" && (
				<Text style={styles.score}>
					{game.awayTeam.score} - {game.homeTeam.score}
				</Text>
			)}
			{game.status === "scheduled" && game.startTime && (
				<Text style={styles.time}>
					{new Date(game.startTime).toLocaleString()}
				</Text>
			)}
			{game.status === "final" && (
				<Text style={styles.winner}>Winner: {game.winner}</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 12,
		marginVertical: 6,
		borderRadius: 8,
		backgroundColor: "#f7f7f7",
	},
	team: { fontSize: 16, fontWeight: "bold" },
	status: { fontSize: 12, color: "#666" },
	score: { fontSize: 14, color: "#007bff", marginTop: 4 },
	time: { fontSize: 12, color: "#444", marginTop: 4 },
	winner: { fontSize: 14, color: "green", marginTop: 4 },
});

export default GameItem;
