import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import ChatPage from "./Pages/ChatPage.jsx";

const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/",
		element: <Register />,
	},
	{
		path: "/chat",
		element: <ChatPage />,
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
