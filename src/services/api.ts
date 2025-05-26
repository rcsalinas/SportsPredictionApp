import axios from "axios";

const apiClient = axios.create({
	baseURL: "http://192.168.58.104:4000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

export const fetchGames = async () => {
	try {
		const response = await apiClient.get("/games");
		return response.data.games;
	} catch (error) {
		throw error;
	}
};

export const submitPrediction = async (
	gameId: string,
	pick: string,
	amount: number,
	homeTeam?: string,
	awayTeam?: string,
	startTime?: string
) => {
	console.log("Submitting prediction:", {
		gameId,
		pick,
		amount,
		homeTeam,
		awayTeam,
		startTime,
	});
	try {
		const response = await apiClient.post("/predictions", {
			gameId,
			pick,
			amount,
			homeTeam,
			awayTeam,
			startTime,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getGameById = async (gameId: string) => {
	try {
		const response = await apiClient.get(`/games/${gameId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const fetchUserPredictions = async (userId: string) => {
	try {
		const response = await apiClient.get(`/predictions?userId=${userId}`);
		return response.data.predictions;
	} catch (error) {
		throw error;
	}
};
