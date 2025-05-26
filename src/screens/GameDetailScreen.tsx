import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
} from "react-native";
import { Game } from "../types";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { submitPrediction } from "../services/api";
import { useSocket } from "../context/SocketContext";
import { getGameById } from "../services/api";

type GameDetailRouteProp = RouteProp<RootStackParamList, "GameDetail">;

const GameDetailScreen: React.FC = () => {
	const route = useRoute<GameDetailRouteProp>();
	const navigation = useNavigation();
	const [game, setGame] = useState<Game | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedPick, setSelectedPick] = useState<string | null>(null);
	const [betAmount, setBetAmount] = useState<string>("50");
	const [submitting, setSubmitting] = useState(false);
	const socket = useSocket();

	useEffect(() => {
		let isMounted = true;
		getGameById(route.params.gameId)
			.then((data) => {
				if (isMounted) {
					setGame(data);
					setLoading(false);
				}
			})
			.catch(() => setLoading(false));
		return () => {
			isMounted = false;
		};
	}, [route.params.gameId]);

	useEffect(() => {
		if (
			!socket ||
			!game ||
			(game.status !== "inProgress" && game.status !== "scheduled")
		)
			return;

		const handleGamesUpdate = (updatedGames: Game[]) => {
			const updatedGame = updatedGames.find(
				(g) => g.id === route.params.gameId
			);
			if (updatedGame) {
				setGame(updatedGame);
			}
		};

		socket.on("gamesUpdate", handleGamesUpdate);
		return () => {
			socket.off("gamesUpdate", handleGamesUpdate);
		};
	}, [socket, game, route.params.gameId]);

	// Set dynamic title
	useEffect(() => {
		if (game) {
			navigation.setOptions({
				title: `${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}`,
			});
		}
	}, [navigation, game]);

	const handleSubmitBet = async () => {
		if (!game || !selectedPick || !betAmount) return;
		setSubmitting(true);
		try {
			const amount = parseInt(betAmount, 10) || 0;
			const result = await submitPrediction(game.id, selectedPick, amount);
			Alert.alert("Prediction Submitted!", result.message);
			setSelectedPick(null);
		} catch (error: any) {
			const message =
				error.response?.data?.message || "An unknown error occurred";
			Alert.alert("Error submitting prediction:", message);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading || !game) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	const isBettingOpen =
		game.status === "scheduled" || game.status === "inProgress";
	const leading =
		(game.awayTeam.score ?? 0) > (game.homeTeam.score ?? 0)
			? game.awayTeam.abbreviation
			: (game.homeTeam.score ?? 0) > (game.awayTeam.score ?? 0)
			? game.homeTeam.abbreviation
			: null;

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.container}>
					{/* Teams and Score */}
					<View style={styles.teamsRow}>
						<View style={styles.teamBox}>
							<Text
								style={[
									styles.teamAbbr,
									{ color: "#388e3c" },
									leading === game.awayTeam.abbreviation && isBettingOpen
										? styles.leading
										: null,
									game.odds?.favorite === game.awayTeam.abbreviation &&
									isBettingOpen
										? styles.favorite
										: null,
								]}
							>
								{game.awayTeam.abbreviation}
							</Text>
							<Text style={styles.teamName}>{game.awayTeam.name}</Text>
							{game.awayTeam.record && (
								<Text style={styles.teamRecord}>{game.awayTeam.record}</Text>
							)}
						</View>
						<View style={styles.scoreBox}>
							<Text style={styles.scoreText}>
								{game.awayTeam.score ?? "-"} - {game.homeTeam.score ?? "-"}
							</Text>
							<Text style={styles.periodText}>
								{game.period}, {game.clock}
							</Text>
							<Text style={styles.statusText}>{game.status.toUpperCase()}</Text>
						</View>
						<View style={styles.teamBox}>
							<Text
								style={[
									styles.teamAbbr,
									{ color: "#1976d2" },
									leading === game.homeTeam.abbreviation && isBettingOpen
										? styles.leading
										: null,
									game.odds?.favorite === game.homeTeam.abbreviation &&
									isBettingOpen
										? styles.favorite
										: null,
								]}
							>
								{game.homeTeam.abbreviation}
							</Text>
							<Text style={styles.teamName}>{game.homeTeam.name}</Text>
							{game.homeTeam.record && (
								<Text style={styles.teamRecord}>{game.homeTeam.record}</Text>
							)}
						</View>
					</View>

					{/* Odds Card */}
					{isBettingOpen && game.odds && (
						<View style={styles.oddsCard}>
							<View style={styles.oddsRow}>
								<Text style={styles.oddsLabel}>Spread:</Text>
								<Text style={styles.oddsValue}>{game.odds.spread}</Text>
							</View>
							<View style={styles.oddsRow}>
								<Text style={styles.oddsLabel}>Favorite:</Text>
								<Text style={[styles.oddsValue, styles.favorite]}>
									{game.odds.favorite}
								</Text>
							</View>
						</View>
					)}

					{/* Prediction Interface */}
					{isBettingOpen && (
						<>
							<Text style={styles.subtitle}>Place Your Bet</Text>
							<View style={styles.buttonsRow}>
								<TouchableOpacity
									style={[
										styles.pickButton,
										selectedPick === game.awayTeam.abbreviation &&
											styles.selectedPick,
									]}
									onPress={() => setSelectedPick(game.awayTeam.abbreviation)}
								>
									<Text style={styles.pickText}>
										{game.awayTeam.abbreviation}
									</Text>
									<Text style={styles.pickTeamName}>{game.awayTeam.name}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.pickButton,
										selectedPick === game.homeTeam.abbreviation &&
											styles.selectedPick,
									]}
									onPress={() => setSelectedPick(game.homeTeam.abbreviation)}
								>
									<Text style={styles.pickText}>
										{game.homeTeam.abbreviation}
									</Text>
									<Text style={styles.pickTeamName}>{game.homeTeam.name}</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.amountRow}>
								<Text style={styles.amountLabel}>Bet Amount: $</Text>
								<TextInput
									style={styles.amountInput}
									value={betAmount}
									onChangeText={setBetAmount}
									keyboardType="numeric"
									maxLength={5}
									placeholder="Amount"
								/>
							</View>
							<TouchableOpacity
								style={[
									styles.submitButton,
									(!selectedPick || !betAmount || submitting) &&
										styles.submitButtonDisabled,
								]}
								onPress={handleSubmitBet}
								disabled={!selectedPick || !betAmount || submitting}
							>
								<Text style={styles.submitButtonText}>
									{submitting ? "Submitting..." : "Submit Bet"}
								</Text>
							</TouchableOpacity>
						</>
					)}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	teamsRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 24,
		height: 120,
	},
	teamBox: {
		alignItems: "center",
		width: 100,

		justifyContent: "space-evenly",
		height: "100%",
	},
	scoreBox: {
		alignItems: "center",
		justifyContent: "center",
	},
	loader: { flex: 1, justifyContent: "center", alignItems: "center" },

	teamAbbr: { fontSize: 24, fontWeight: "bold" },
	teamName: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
	teamRecord: { fontSize: 12, color: "#888", marginBottom: 4 },

	scoreText: {
		fontSize: 30,
		fontWeight: "bold",
		marginBottom: 4,
		flexDirection: "row",
		flexWrap: "nowrap",
	},
	periodText: { fontSize: 14, color: "#555" },
	statusText: { fontSize: 12, color: "#007bff", marginTop: 2 },
	oddsCard: {
		backgroundColor: "#f7f7f7",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		marginBottom: 24,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	oddsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "80%",
		marginBottom: 4,
	},
	oddsLabel: { fontSize: 14, color: "#888", marginRight: 8 },
	oddsValue: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
	favorite: { color: "#28a745", fontWeight: "bold" },
	leading: { color: "#ff9800" },
	subtitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
		textAlign: "center",
	},
	buttonsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 16,
	},
	pickButton: {
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 10,
		backgroundColor: "#ececec",
		alignItems: "center",
		marginHorizontal: 8,
		borderWidth: 2,
		borderColor: "transparent",
		width: 130,
	},
	selectedPick: {
		backgroundColor: "#007bff22",
		borderColor: "#007bff",
	},
	pickText: { fontSize: 18, fontWeight: "bold" },
	pickTeamName: { fontSize: 12, color: "#555" },
	amountRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},
	amountLabel: { fontSize: 16, color: "#333" },
	amountInput: {
		borderBottomWidth: 1,
		borderColor: "#007bff",
		fontSize: 16,
		width: 60,
		marginLeft: 4,
		textAlign: "center",
		padding: 2,
	},
	submitButton: {
		marginTop: 18,
		backgroundColor: "#007bff",
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: "center",
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 3,
		elevation: 2,
	},
	submitButtonDisabled: {
		backgroundColor: "#b0c4de",
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});

export default GameDetailScreen;
