import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
			const response = await axios.post(
				`${BACKEND_URI}/api/auth/register`,
				data,
			);
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
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<label
								className="sr-only"
								htmlFor="username"
							>
								Username
							</label>
							<input
								type="text"
								id="username"
								placeholder="Username"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								{...register("username", { required: true })}
							/>
						</div>
						<div>
							<label
								className="sr-only"
								htmlFor="name"
							>
								Name
							</label>
							<input
								type="text"
								id="name"
								placeholder="Name"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								{...register("name", { required: true })}
							/>
						</div>
						<div>
							<label
								className="sr-only"
								htmlFor="email"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								placeholder="Email"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								{...register("email", { required: true })}
							/>
						</div>
						<div>
							<label
								className="sr-only"
								htmlFor="password"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								placeholder="Password"
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
								{...register("password", { required: true })}
							/>
						</div>
						<div className="text-sm flex items-center justify-end">
							<Link
								to="/login"
								className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
							>
								Already have an Account?
							</Link>
						</div>
					</div>
					<button
						type="submit"
						className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Sign in
					</button>
				</form>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Register;
