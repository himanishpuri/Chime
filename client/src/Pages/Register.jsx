import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Utils/Context.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Register = () => {
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();
	const { setUsername, connectSocket } = useUser();

	const onSubmit = async (data) => {
		console.log(data);
		console.log(BACKEND_URI);
		try {
			const response = await axios.post(`${BACKEND_URI}/api/register`, data);
			if (response.statusText === "Created") {
				console.log("User registered successfully");
				setUsername(data.username);
				connectSocket();
				navigate("/chat");
			}
		} catch (error) {
			console.log("Error registering user");
			if (error.response.data.message === "UserAlreadyExists") {
				navigate("/login");
			} else {
				toast.error("Error creating user");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-800">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							{...register("username", { required: true })}
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="name"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							{...register("name", { required: true })}
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							{...register("email", { required: true })}
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							{...register("password", { required: true })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Register
						</button>
						<button
							onClick={() => navigate("/login")}
							type="button"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						>
							Have an Account?
						</button>
					</div>
				</form>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Register;
