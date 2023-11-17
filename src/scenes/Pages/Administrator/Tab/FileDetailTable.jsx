import {
	Box,
	Table,
	TableContainer,
	useTheme,
	Paper,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import * as MdIcons from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Spinner } from "../../../../components";
import {
	useArchiveFileByNameMutation,
	useFetchFileByNameQuery,
	useUnarchiveFileByNameMutation,
} from "../../../../redux/reducers/file/fileApiSlice";
import { tokens } from "../../../../Theme";

export default function FileDetailTable() {
	const { file_detail_name } = useParams();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();

	const { data, refetch, isLoading, isError } =
		useFetchFileByNameQuery(file_detail_name);

	const [archiveFile] = useArchiveFileByNameMutation();
	const [unArchivedFile] = useUnarchiveFileByNameMutation();

	const showConfirmationPopup = () => {
		return new Promise((resolve, reject) => {
			Swal.fire({
				title: "Are you sure?",
				text: data.fileIsArchived
					? "Are you sure of your decision?"
					: "You won't be able to revert this!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: data.fileIsArchived ? colors.greenAccent[300] : "#d33",
				cancelButtonColor: "#3085d6",
				confirmButtonText: data.fileIsArchived
					? "Yes, restore it!"
					: "Yes, delete it!",
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

	const handleDelete = async () => {
		try {
			await showConfirmationPopup();

			let archivePromise = archiveFile(file_detail_name).then((res) => {
				if (res.error) {
					console.log(res.error);

					refetch();
					Toast.fire({
						icon: "error",
						title: "Your file hasn't been deleted.",
					});
				} else {
					archivePromise.then(function () {
						navigate("/adminmngt");
						Toast.fire({
							icon: "success",
							title: "Your file has been deleted.",
						});
					});
				}
			});
		} catch (error) {}
	};

	const handleRestore = async () => {
		try {
			await showConfirmationPopup();

			let archivePromise = unArchivedFile(file_detail_name).then((res) => {
				if (res.error) {
					console.log(res.error);

					refetch();
					Toast.fire({
						icon: "error",
						title: "Your file hasn't been restored.",
					});
				} else {
					archivePromise.then(function () {
						navigate("/adminmngt");
						Toast.fire({
							icon: "success",
							title: "Your file has been restored.",
						});
					});
				}
			});
		} catch (error) {}
	};

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (isError) {
		Toast.fire({
			icon: "error",
			title: "Unable to fetch data from server",
		});
	}

	return (
		<>
			{isLoading ? (
				Spinner
			) : (
				<>
					<Box boxShadow={15} sx={{ bgcolor: colors.primary[400] }}>
						<TableContainer
							component={Paper}
							sx={{ bgcolor: colors.primary[400], borderRadius: 2 }}
						>
							<Table sx={{ minWidth: 650 }} aria-label='File details'>
								<TableHead>
									<TableRow sx={{ bgcolor: colors.greenAccent[200] }}>
										<TableCell>Name</TableCell>
										<TableCell>Size</TableCell>
										<TableCell>Create At</TableCell>
										<TableCell>Last Update</TableCell>
										<TableCell>Archived</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow key={data.fileName}>
										<TableCell component='th' scope='row'>
											{data.fileName}
										</TableCell>
										<TableCell>{data.fileSize}</TableCell>
										<TableCell>{data.fileCreatedAt}</TableCell>
										<TableCell>{data.fileUpdateAt}</TableCell>
										<TableCell>
											<Box
												width='60%'
												m='0 auto'
												p='5px'
												display='flex'
												justifyContent='center'
												backgroundColor={
													data.fileIsArchived === true
														? colors.redAccent[400]
														: colors.greenAccent[400]
												}
												borderRadius='10px'
											>
												{data.fileIsArchived === true && (
													<MdIcons.MdOutlineAdminPanelSettings />
												)}
												{data.fileIsArchived === false && <MdIcons.MdAdminPanelSettings />}
												<Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
													{data.fileIsArchived === true && "Archived"}
													{data.fileIsArchived === false && "Unarchived"}
												</Typography>
											</Box>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Box>

					<Box mt='20px'>
						<Button
							sx={{
								backgroundColor: data.fileIsArchived
									? colors.greenAccent[300]
									: colors.redAccent[300],
								color: colors.grey[100],
								fontSize: "14px",
								fontWeight: "bold",
								padding: "10px 20px",
							}}
							onClick={data.fileIsArchived ? handleRestore : handleDelete}
						>
							<MdIcons.MdOutlineLogin sx={{ marginRight: "5px" }} />
							{data.fileIsArchived ? "Restore" : "Delete"}
						</Button>
					</Box>
				</>
			)}
		</>
	);
}
