import {
	createContext,
	useState,
	useContext,
	useMemo,
	useCallback,
} from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const UserContext = createContext({
	username: "",
	setUsername: () => {},
	connectSocket: () => {},
	disconnectSocket: () => {},
});

const UserProvider = ({ children }) => {
	const [username, setUsername] = useState("");
	const [socket, setSocket] = useState(null);

	const connectSocket = useCallback(() => {
		if (!socket) {
			const newSocket = io(`${BACKEND_URI}`);
			setSocket(newSocket);
		}
	}, [socket]);

	const disconnectSocket = useCallback(() => {
		if (socket) {
			socket.disconnect();
			setSocket(null);
		}
	}, [socket]);

	const user = useMemo(
		() => ({
			username,
			setUsername,
			connectSocket,
			disconnectSocket,
			socket,
		}),
		[username, connectSocket, disconnectSocket, socket],
	);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;

export const useUser = () => {
	return useContext(UserContext);
};

UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
