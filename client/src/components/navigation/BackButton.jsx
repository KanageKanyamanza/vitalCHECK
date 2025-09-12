import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ 
	to = "/", 
	text = "Retour à l'accueil", 
	variant = "default",
	className = "" 
}) => {
	const baseClasses = "inline-flex items-center space-x-2 transition-colors duration-200";
	
	const variants = {
		default: "text-gray-600 hover:text-primary-600",
		primary: "px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600",
		secondary: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
	};

	const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;

	return (
		<Link to={to} className={buttonClasses}>
			<ArrowLeft className="w-5 h-5" />
			<span>{text}</span>
		</Link>
	);
};

export default BackButton;
