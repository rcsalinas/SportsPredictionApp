import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ScoreDisplayProps = {
	awayScore?: number;
	homeScore?: number;
	period?: string;
	clock?: string;
	status: string;
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
	awayScore,
	homeScore,
	period,
	clock,
	status,
}) => {
	return (
		<View style={styles.scoreBox}>
			<Text style={styles.scoreText}>
				{awayScore ?? "-"} - {homeScore ?? "-"}
			</Text>
			<Text style={styles.periodText}>
				{period}, {clock}
			</Text>
			<Text style={styles.statusText}>{status.toUpperCase()}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	scoreBox: {
		alignItems: "center",
		justifyContent: "center",
	},
	scoreText: {
		fontSize: 30,
		fontWeight: "bold",
		marginBottom: 4,
	},
	periodText: {
		fontSize: 14,
		color: "#555",
	},
	statusText: {
		fontSize: 12,
		color: "#007bff",
		marginTop: 2,
	},
});
