import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
} from "react-native";
import { Prediction } from "../types";
import { fetchUserPredictions } from "../services/api";

const ProfileScreen: React.FC = () => {
	const [predictions, setPredictions] = useState<Prediction[]>([]);
	const [balance, setBalance] = useState<number>(1000);
	const [stats, setStats] = useState({ wins: 0, losses: 0, pending: 0 });
	const [loading, setLoading] = useState(true);

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

	const renderPredictionItem = ({ item }: { item: Prediction }) => (
		<View style={styles.predictionCard}>
			<View style={styles.predictionHeader}>
				<Text style={styles.gameId}>Game ID: {item.gameId}</Text>
				<View style={[styles.resultBadge, styles[`${item.result}Badge`]]}>
					<Text style={styles.resultText}>{item.result.toUpperCase()}</Text>
				</View>
			</View>
			<View style={styles.predictionDetails}>
				<Text style={styles.pickText}>
					Pick: <Text style={styles.highlightText}>{item.pick}</Text>
				</Text>
				<Text style={styles.amountText}>
					Amount: <Text style={styles.highlightText}>${item.amount}</Text>
				</Text>
				{item.payout && item.result === "win" && (
					<Text style={styles.payoutText}>
						Payout: <Text style={styles.highlightText}>${item.payout}</Text>
					</Text>
				)}
			</View>
		</View>
	);

	if (loading) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size="large" color="#007bff" />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>User Profile</Text>
				<Text style={styles.balanceText}>${balance}</Text>
			</View>

			<View style={styles.statsCard}>
				<View style={styles.statItem}>
					<Text style={styles.statValue}>{stats.wins}</Text>
					<Text style={styles.statLabel}>Wins</Text>
				</View>
				<View style={[styles.statItem, styles.statBorder]}>
					<Text style={styles.statValue}>{stats.losses}</Text>
					<Text style={styles.statLabel}>Losses</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statValue}>{stats.pending}</Text>
					<Text style={styles.statLabel}>Pending</Text>
				</View>
			</View>

			<Text style={styles.subtitle}>Prediction History</Text>
			<FlatList
				data={predictions}
				keyExtractor={(item, idx) => `${item.gameId}-${idx}`}
				renderItem={renderPredictionItem}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		padding: 20,
		backgroundColor: "#fff",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	balanceText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#28a745",
	},
	statsCard: {
		flexDirection: "row",
		backgroundColor: "#fff",
		margin: 16,
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	statItem: {
		flex: 1,
		alignItems: "center",
	},
	statBorder: {
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: "#eee",
	},
	statValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	statLabel: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
	},
	subtitle: {
		fontSize: 20,
		fontWeight: "600",
		marginHorizontal: 16,
		marginTop: 8,
		marginBottom: 16,
		color: "#333",
	},
	listContainer: {
		padding: 16,
	},
	predictionCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 2,
	},
	predictionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	gameId: {
		fontSize: 14,
		color: "#666",
	},
	resultBadge: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
	},
	winBadge: {
		backgroundColor: "#28a74520",
	},
	lossBadge: {
		backgroundColor: "#dc354520",
	},
	pendingBadge: {
		backgroundColor: "#ffc10720",
	},
	resultText: {
		fontSize: 12,
		fontWeight: "bold",
	},
	win: {
		color: "#28a745",
	},
	loss: {
		color: "#dc3545",
	},
	pending: {
		color: "#ffc107",
	},
	predictionDetails: {
		gap: 4,
	},
	pickText: {
		fontSize: 16,
		color: "#666",
	},
	amountText: {
		fontSize: 16,
		color: "#666",
	},
	payoutText: {
		fontSize: 16,
		color: "#666",
	},
	highlightText: {
		color: "#333",
		fontWeight: "600",
	},
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ProfileScreen;
