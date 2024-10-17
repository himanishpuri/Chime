import { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext({
	username: "",
	setUsername: () => {},
});

export const UserProvider = ({ children }) => {
	const [username, setUsername] = useState("");

	const user = useMemo(() => ({ username, setUsername }), [username]);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	return useContext(UserContext);
};

UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
