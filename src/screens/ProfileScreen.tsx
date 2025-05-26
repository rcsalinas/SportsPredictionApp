import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { Prediction } from "../types";
import { fetchUserPredictions } from "../services/api";

const ProfileScreen: React.FC = () => {
	const [predictions, setPredictions] = useState<Prediction[]>([]);
	const [balance, setBalance] = useState<number>(1000);
	const [stats, setStats] = useState({ wins: 0, losses: 0, pending: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const preds = await fetchUserPredictions("usr123");
				setPredictions(preds);
				calculateStats(preds);
			} catch (e) {
				setPredictions([]);
				calculateStats([]);
			} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);

	const calculateStats = (preds: Prediction[]) => {
		const wins = preds.filter((p) => p.result === "win").length;
		const losses = preds.filter((p) => p.result === "loss").length;
		const pending = preds.filter((p) => p.result === "pending").length;

		const calculatedBalance = preds.reduce((total, pred) => {
			if (pred.result === "win") return total + (pred.payout || 0);
			if (pred.result === "loss") return total - pred.amount;
			return total;
		}, 1000);

		setStats({ wins, losses, pending });
		setBalance(calculatedBalance);
	};

	if (loading) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>User Profile</Text>

			<View style={styles.statsContainer}>
				<Text style={styles.stat}>Balance: ${balance}</Text>
				<Text style={styles.stat}>Wins: {stats.wins}</Text>
				<Text style={styles.stat}>Losses: {stats.losses}</Text>
				<Text style={styles.stat}>Pending: {stats.pending}</Text>
			</View>

			<Text style={styles.subtitle}>Prediction History</Text>
			<FlatList
				data={predictions}
				keyExtractor={(item, idx) => `${item.gameId}-${idx}`}
				renderItem={({ item }) => (
					<View style={styles.predictionItem}>
						<Text style={styles.predictionText}>
							Game: {item.gameId} | Pick: {item.pick} | ${item.amount}
						</Text>
						<Text style={[styles.result, styles[item.result]]}>
							{item.result.toUpperCase()}
						</Text>
					</View>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#fff" },
	title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
	subtitle: {
		fontSize: 18,
		fontWeight: "600",
		marginTop: 20,
		marginBottom: 10,
	},
	statsContainer: { marginVertical: 10 },
	stat: { fontSize: 16, marginVertical: 2 },
	predictionItem: {
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderColor: "#ddd",
	},
	predictionText: { fontSize: 14 },
	result: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
	win: { color: "green" },
	loss: { color: "red" },
	pending: { color: "orange" },
	loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ProfileScreen;
