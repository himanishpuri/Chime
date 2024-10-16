import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Register = () => {
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();

	const onSubmit = async (data) => {
		console.log(data);
		console.log(BACKEND_URI);
		try {
			const response = axios.post(`${BACKEND_URI}/api/register`, data);
			if (response.statusText === "OK") {
				console.log("User registered successfully");
				navigate("/chat");
			}
		} catch (error) {
			console.log("Error registering user");
			console.error(error);
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
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
