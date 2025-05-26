import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Alert,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { Game } from "../types";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { submitPrediction } from "../services/api";
import { useSocket } from "../context/SocketContext";
import { getGameById } from "../services/api";
import { TeamDisplay } from "../components/TeamDisplay";
import { ScoreDisplay } from "../components/ScoreDisplay";
import { BettingInterface } from "../components/BettingInterface";

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

	const isBettingOpen = game?.status === "scheduled";
	const leading = React.useMemo(() => {
		if (!game || game.status === "scheduled") return null;
		if (!game.awayTeam.score || !game.homeTeam.score) return null;
		return game.awayTeam.score > game.homeTeam.score
			? game.awayTeam.abbreviation
			: game.homeTeam.abbreviation;
	}, [game]);

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
					<View style={styles.teamsRow}>
						<TeamDisplay
							abbreviation={game.awayTeam.abbreviation}
							name={game.awayTeam.name}
							record={game.awayTeam.record}
							isLeading={leading === game.awayTeam.abbreviation}
							isFavorite={game.odds?.favorite === game.awayTeam.abbreviation}
							isBettingOpen={isBettingOpen}
							color="#388e3c"
						/>

						<ScoreDisplay
							awayScore={game.awayTeam.score}
							homeScore={game.homeTeam.score}
							period={game.period}
							clock={game.clock}
							status={game.status}
						/>

						<TeamDisplay
							abbreviation={game.homeTeam.abbreviation}
							name={game.homeTeam.name}
							record={game.homeTeam.record}
							isLeading={leading === game.homeTeam.abbreviation}
							isFavorite={game.odds?.favorite === game.homeTeam.abbreviation}
							isBettingOpen={isBettingOpen}
							color="#1976d2"
						/>
					</View>

					{isBettingOpen && (
						<BettingInterface
							game={game}
							selectedPick={selectedPick}
							setSelectedPick={setSelectedPick}
							betAmount={betAmount}
							setBetAmount={setBetAmount}
							onSubmit={handleSubmitBet}
							submitting={submitting}
						/>
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
