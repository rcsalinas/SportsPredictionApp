import React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	StyleSheet,
} from "react-native";
import { Game } from "../types";

type BettingInterfaceProps = {
	game: Game;
	selectedPick: string | null;
	setSelectedPick: (pick: string) => void;
	betAmount: string;
	setBetAmount: (amount: string) => void;
	onSubmit: () => void;
	submitting: boolean;
};

export const BettingInterface: React.FC<BettingInterfaceProps> = ({
	game,
	selectedPick,
	setSelectedPick,
	betAmount,
	setBetAmount,
	onSubmit,
	submitting,
}) => {
	return (
		<>
			<Text style={styles.subtitle}>Place Your Bet</Text>
			<View style={styles.buttonsRow}>
				<TouchableOpacity
					style={[
						styles.pickButton,
						selectedPick === game.awayTeam.abbreviation && styles.selectedPick,
					]}
					onPress={() => setSelectedPick(game.awayTeam.abbreviation)}
				>
					<Text style={styles.pickText}>{game.awayTeam.abbreviation}</Text>
					<Text style={styles.pickTeamName}>{game.awayTeam.name}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.pickButton,
						selectedPick === game.homeTeam.abbreviation && styles.selectedPick,
					]}
					onPress={() => setSelectedPick(game.homeTeam.abbreviation)}
				>
					<Text style={styles.pickText}>{game.homeTeam.abbreviation}</Text>
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
				onPress={onSubmit}
				disabled={!selectedPick || !betAmount || submitting}
			>
				<Text style={styles.submitButtonText}>
					{submitting ? "Submitting..." : "Submit Bet"}
				</Text>
			</TouchableOpacity>
		</>
	);
};

export const styles = StyleSheet.create({
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
	pickText: {
		fontSize: 18,
		fontWeight: "bold",
	},
	pickTeamName: {
		fontSize: 12,
		color: "#555",
	},
	amountRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 8,
	},
	amountLabel: {
		fontSize: 16,
		color: "#333",
	},
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
