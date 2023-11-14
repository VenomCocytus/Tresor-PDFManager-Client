import { Box, Button, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components";
import { tokens } from "../../../Theme";
import * as MdIcons from "react-icons/md";
import Swal from "sweetalert2";

export default function ViewFile() {
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

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

	const showConfirmationPopup = () => {
		return new Promise((resolve, reject) => {
			Swal.fire({
				title: "Are you sure you are an administrator?",
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "Yes, I'm sure",
				cancelButtonText: "No, I'm not",
				customClass: {
					popup: "popup",
				},
			}).then((result) => {
				if (result.isConfirmed) {
					Toast.fire({
						icon: "success",
						title: "Successfully signin as an Administrator",
					});

					resolve();
				} else {
					reject();
				}
			});
		});
	};

	const handleLogin = async () => {
		try {
			await showConfirmationPopup();

			// redirect to user page
			navigate("/adminmngt");
		} catch (error) {
			// user cancelled the action
		}
	};

	return (
		<>
			<Box m='20px'>
				{/* HEADER */}
				<Box display='flex' justifyContent='space-between' alignItems='center'>
					<Header title='PDF Visualizer' subtitle='See available PDF files' />

					<Box>
						<Button
							sx={{
								backgroundColor: colors.blueAccent[300],
								color: colors.grey[100],
								fontSize: "14px",
								fontWeight: "bold",
								padding: "10px 20px",
								justifyContent: "space-between",
								boxShadow: "20px",
							}}
							onClick={() => handleLogin()}
						>
							<MdIcons.MdOutlineLogin sx={{ marginRight: "5px" }} />
							<span className='mr-1'>Login as an administrator</span>
						</Button>
					</Box>
				</Box>
			</Box>
		</>
	);
}
