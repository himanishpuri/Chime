import PropTypes from "prop-types";

// Message component for sender
const Message = ({ message, sender, type }) => {
	if (type === "sender") {
		return (
			<div className="bg-gray-200 p-4 w-3/4 rounded-lg mb-2 max-w-max self-end">
				<p className="text-sm font-semibold text-gray-700">{sender}</p>
				<p className="text-base text-gray-900 break-words">{message}</p>
			</div>
		);
	} else if (type === "receiver") {
		return (
			<div className="bg-blue-500 text-white p-4 w-3/4 rounded-lg mb-2 max-w-max self-start">
				<p className="text-sm font-semibold">{sender}</p>
				<p className="text-base break-words">{message}</p>
			</div>
		);
	} else {
		return (
			<div className="bg-yellow-100 text-yellow-800 p-2 w-3/4 rounded-lg mb-2 max-w-max mx-auto">
				<p className="text-sm text-center break-words">{message}</p>
			</div>
		);
	}
};

Message.propTypes = {
	message: PropTypes.string.isRequired,
	sender: PropTypes.string,
	type: PropTypes.oneOf(["sender", "receiver", "event"]).isRequired,
};

export default Message;
