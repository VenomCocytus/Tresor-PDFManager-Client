import { Box, useTheme } from "@mui/material";
import React from "react";
import { InAppBackButton, Spinner } from "../../../components";
import styles from "../../../styles/start.module.css";
import extend from "../../../styles/app.module.css";
import pdf from "../../../assets/excel.png";
import { useState } from "react";
import { useUploadFileMutation } from "../../../redux/reducers/file/fileApiSlice";
import Swal from "sweetalert2";
import { tokens } from "../../../Theme";
import { Document, Page } from "react-pdf";
import pokemon from "../../../assets/Pokemon.pdf";

export default function FileUpload() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [pdfData, setPdfData] = useState(null);
	const [file, setFile] = useState(null);
	const [buffer, setBuffer] = useState(null);
	const [upload, { isLoading: isSending }] = useUploadFileMutation();
	const fileType = ["application/pdf"];

	const handleChange = (event) => {
		let selectedfile = event.target.files[0];
		setFile(event.target.files[0]);

		if (selectedfile) {
			if (selectedfile && fileType.includes(selectedfile.type)) {
				let reader = new FileReader();
				reader.readAsDataURL(selectedfile);
				reader.onload = (event) => {
					setPdfData(event.target.result);
				};
			} else {
				setPdfData(null);
			}
		} else {
			console.log("Please select a file");
		}
	};

	const showConfirmationPopup = (isArchived) => {
		return new Promise((resolve, reject) => {
			Swal.fire({
				title: "Are you sure?",
				text: isArchived
					? "Are you sure of your decision?"
					: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: isArchived ? colors.greenAccent[300] : "#d33",
				cancelButtonColor: "#3085d6",
				confirmButtonText: isArchived ? "Yes, restore it!" : "Yes, delete it!",
			}).then((result) => {
				if (result.isConfirmed) {
					resolve();
				} else {
					reject();
				}
			});
		});
	};

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

	const fileUpload = async (file) => {
		const formData = new FormData();
		formData.append("files", file);

		// Convert FormData to plain object
		const formDataObject = Object.fromEntries(formData.entries());
		console.log(formDataObject);

		let uploadPromise = upload(formData).then((res) => {
			if (res.error) {
				console.log(res.error);

				Toast.fire({
					icon: "error",
					title: "Error uploading the file",
				});
			} else {
				uploadPromise.then(function () {
					Toast.fire({
						icon: "success",
						title: "Successfully upload the file",
					});
				});
			}
		});
	};

	return (
		<Box m='20px'>
			{isSending ? (
				<Spinner />
			) : (
				<>
					<div className='flex flex-col items-center gap-10'>
						<div className='container mx-auto px-4'>
							<h1 className='text-3xl font-bold text-center my-8'>
								Choose an PDF file
							</h1>

							<div className='flex items-center justify-center py-4 shadow-2xl pb-5 rounded-2xl'>
								<label htmlFor='pdf-file'>
									<img
										src={pdf}
										className={`${styles.profile_img}} ${extend.profile_img}`}
										alt='pdf'
									/>
								</label>

								<input
									onChange={handleChange}
									type='file'
									id='pdf-file'
									name='pdf_file'
									className='hidden'
									accept='.pdf'
								/>
							</div>
						</div>

						<div></div>
					</div>
				</>
			)}

			<Box display='flex' justifyContent='flex-end' mt={10}>
				<InAppBackButton path='adminmngt' />
			</Box>
		</Box>
	);
}
