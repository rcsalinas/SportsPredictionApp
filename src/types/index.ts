export type Team = {
	name: string;
	abbreviation: string;
	record: string;
	score?: number;
};

export type Odds = {
	spread: string;
	favorite: string;
};

export type Game = {
	id: string;
	status: "scheduled" | "inProgress" | "final";
	startTime?: string;
	period?: string;
	clock?: string;
	homeTeam: Team;
	awayTeam: Team;
	odds?: Odds;
	winner?: string;
};

export type Prediction = {
	gameId: string;
	pick: string;
	amount: number;
	result: "win" | "loss" | "pending";
	payout?: number;
};

export type User = {
	id: string;
	username: string;
	balance: number;
	predictions: Prediction[];
	stats: {
		wins: number;
		losses: number;
		pending: number;
	};
};
