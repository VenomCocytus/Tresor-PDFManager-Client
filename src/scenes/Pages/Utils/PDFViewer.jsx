import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useDownloadFileByNameMutation } from "../../../redux/reducers/file/fileApiSlice";
import { Button } from "@mui/base";

export default function PDFViewerComponent() {
	const { file_detail_name } = useParams();
	const [fetchData] = useDownloadFileByNameMutation();
	const [pdfData, setPdfData] = useState(null);
	const [res, setRes] = useState(null);

	const Toast = Swal.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	const handleDownload = async () => {
		let downloadPromise = fetchData(file_detail_name).then((res) => {
			if (res.error) {
				console.log(res.error);

				Toast.fire({
					icon: "error",
					title: "Error downloading the file",
				});
			} else {
				downloadPromise.then(async function () {
					const data = res.data;

					try {
						Toast.fire({
							icon: "success",
							title: "Successfully download the file",
						});
					} catch (error) {
						console.log(error);
					}
				});
			}
		});
	};

	return (
		<div>
			<Button onClick={handleDownload}>Read</Button>
		</div>
	);
}
