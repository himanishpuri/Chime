import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Utils/Context.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Login = () => {
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	const { setUsername } = useUser();

	const onSubmit = async (data) => {
		console.log("Login data:", data);
		console.log(BACKEND_URI);
		try {
			const response = await axios.post(`${BACKEND_URI}/api/login`, data);
			if (response.statusText === "OK") {
				console.log("User logged in successfully");
				setUsername(data.username);
				navigate("/chat");
			}
		} catch (error) {
			console.log("Error logging in user");
			if (error.response.data.message === "UserNotFound") {
				toast.error("User not found");
				navigate("/register");
			} else if (error.response.data.message === "InvalidCredentials") {
				toast.error("Invalid credentials");
			}
		}
	};
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-center text-gray-900">
					Login to Chat
				</h2>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 space-y-6"
				>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label
								htmlFor="email-address"
								className="sr-only"
							>
								Email address
							</label>
							<input
								id="username"
								type="text"
								{...register("username", {
									required: true,
									autoComplete: "username",
								})}
								className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="sr-only"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								{...register("password", {
									required: true,
									autoComplete: "current-password",
								})}
								className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								type="checkbox"
								className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
								{...register("rememberMe")}
							/>
							<label
								htmlFor="remember-me"
								className="block ml-2 text-sm text-gray-900"
							>
								Remember me
							</label>
						</div>
						<div className="text-sm">
							<a
								href="#"
								className="font-medium text-indigo-600 hover:text-indigo-500"
							>
								Forgot your password?
							</a>
						</div>
					</div>
					<div>
						<button
							type="submit"
							className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Sign in
						</button>
					</div>
				</form>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Login;
