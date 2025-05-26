import axios from "axios";

const apiClient = axios.create({
	baseURL: "http://192.168.58.104:4000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

export const fetchGames = async () => {
	const response = await apiClient.get("/games");
	return response.data.games;
};

export const submitPrediction = async (
	gameId: string,
	pick: string,
	amount: number
) => {
	const response = await apiClient.post("/games/predict", {
		gameId,
		pick,
		amount,
	});
	return response.data;
};
