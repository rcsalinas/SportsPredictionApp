import React, { createContext, useContext, useMemo, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = "http://192.168.58.104:4000";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const socket = useMemo(
		() =>
			io(SOCKET_URL, {
				transports: ["websocket"],
			}),
		[]
	);

	useEffect(() => {
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
