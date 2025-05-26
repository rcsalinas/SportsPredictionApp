import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Game } from "../types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { submitPrediction } from "../services/api";
import { useSocket } from "../context/SocketContext";

type GameDetailRouteProp = RouteProp<RootStackParamList, "GameDetail">;

const GameDetailScreen: React.FC = () => {
	const route = useRoute<GameDetailRouteProp>();
	const [game, setGame] = useState<Game | null>(null);
	const socket = useSocket();

	useEffect(() => {
		if (!socket) return;

		socket.on("gamesUpdate", (updatedGames: Game[]) => {
			const updatedGame = updatedGames.find(
				(g) => g.id === route.params.gameId
			);
			if (updatedGame) {
				setGame(updatedGame);
			}
		});

		return () => {
			socket.off("gamesUpdate");
		};
	}, [socket, route.params.gameId]);

	const handlePrediction = async (teamPick: string) => {
		if (!game) return;
		console.log("Submitting prediction for game:", game.id, "Team:", teamPick);
		const result = await submitPrediction(game.id, teamPick, 50);

		Alert.alert("Prediction Submitted!", result.message);
	};

	if (!game) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{game.awayTeam.name} @ {game.homeTeam.name}
			</Text>
			<Text style={styles.info}>Status: {game.status.toUpperCase()}</Text>
			{game.status === "inProgress" && (
				<Text style={styles.info}>
					{game.awayTeam.score} - {game.homeTeam.score} ({game.period},{" "}
					{game.clock})
				</Text>
			)}
			{game.odds && (
				<View style={styles.odds}>
					<Text style={styles.oddsText}>Spread: {game.odds.spread}</Text>
					<Text style={styles.oddsText}>Favorite: {game.odds.favorite}</Text>
				</View>
			)}

			<Text style={styles.subtitle}>Make your prediction:</Text>
			{game.status === "inProgress" && (
				<>
					<Text style={styles.subtitle}>Make your prediction:</Text>
					<View style={styles.buttons}>
						<TouchableOpacity
							style={styles.button}
							onPress={() => handlePrediction(game.homeTeam.abbreviation)}
						>
							<Text>{game.homeTeam.abbreviation}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.button}
							onPress={() => handlePrediction(game.awayTeam.abbreviation)}
						>
							<Text>{game.awayTeam.abbreviation}</Text>
						</TouchableOpacity>
					</View>
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#fff" },
	loading: { fontSize: 16 },
	title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
	subtitle: { fontSize: 18, fontWeight: "600", marginTop: 20 },
	info: { fontSize: 16, marginVertical: 4 },
	odds: { marginVertical: 10 },
	oddsText: { fontSize: 16, color: "#007bff" },
	buttons: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 20,
	},
	button: {
		padding: 10,
		borderRadius: 8,
		backgroundColor: "#ececec",
		alignItems: "center",
		justifyContent: "center",
		width: 120,
	},
	loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default GameDetailScreen;
