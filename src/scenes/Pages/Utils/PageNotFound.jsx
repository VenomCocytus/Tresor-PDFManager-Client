import React, { useEffect } from "react";

export default function PageNotFound() {
	useEffect(() => {
		document.title = "Page not found";
	});

	return <div>PageNotFound</div>;
}
