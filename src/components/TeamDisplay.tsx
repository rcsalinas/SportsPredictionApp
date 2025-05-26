import React from "react";
import { View, Text, StyleSheet } from "react-native";

type TeamDisplayProps = {
	abbreviation: string;
	name: string;
	record?: string;
	isLeading?: boolean;
	isFavorite?: boolean;
	isBettingOpen?: boolean;
	color: string;
};

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
	abbreviation,
	name,
	record,
	isLeading,
	isFavorite,
	isBettingOpen,
	color,
}) => {
	return (
		<View style={styles.teamBox}>
			<Text
				style={[
					styles.teamAbbr,
					{ color },
					isLeading && isBettingOpen && styles.leading,
					isFavorite && isBettingOpen && styles.favorite,
				]}
			>
				{abbreviation}
			</Text>
			<Text style={styles.teamName}>{name}</Text>
			{record && <Text style={styles.teamRecord}>{record}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	teamBox: {
		alignItems: "center",
		width: 100,
		justifyContent: "space-evenly",
		height: "100%",
	},
	teamAbbr: {
		fontSize: 24,
		fontWeight: "bold",
	},
	teamName: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	teamRecord: {
		fontSize: 12,
		color: "#888",
		marginBottom: 4,
	},
	leading: {
		color: "#ff9800",
	},
	favorite: {
		color: "#28a745",
		fontWeight: "bold",
	},
});
