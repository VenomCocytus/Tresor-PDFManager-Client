import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import { Header, Spinner } from "../../../components";
import { tokens } from "../../../Theme";
import * as MdIcons from "react-icons/md";
import {
	useArchiveFileByNameMutation,
	useDownloadFileByNameMutation,
	useFetchAllFilesQuery,
	useUnarchiveFileByNameMutation,
	useUploadFileMutation,
} from "../../../redux/reducers/file/fileApiSlice";
import Swal from "sweetalert2";
import { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import FileDownload from "js-file-download";
import { useNavigate } from "react-router-dom";

export default function ManageFile() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();
	const [pageSize, setPageSize] = useState(6);
	const [upload, { isLoading: isSending }] = useUploadFileMutation();
	const [download, { isLoading: isDownloading }] =
		useDownloadFileByNameMutation();
	const { data, isLoading, refetch } = useFetchAllFilesQuery();

	const [archiveFile] = useArchiveFileByNameMutation();
	const [unArchivedFile] = useUnarchiveFileByNameMutation();

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

	const showApprobationPopup = () => {
		return new Promise((resolve, reject) => {
			Swal.fire({
				title: "Are you sure you want to upload this file?",
				icon: "question",
				showCancelButton: true,
				confirmButtonText: "Yes, I'm sure",
				cancelButtonText: "No, I'm not",
				customClass: {
					popup: "popup",
				},
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

	const handleDelete = async ({ filename, isArchived }) => {
		try {
			await showConfirmationPopup(isArchived);

			let archivePromise = archiveFile(filename).then((res) => {
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

	const handleRestore = async ({ filename, isArchived }) => {
		try {
			await showConfirmationPopup(isArchived);

			let archivePromise = unArchivedFile(filename).then((res) => {
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

	const generateRowId = () => {
		return uuidv4();
	};

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

	const handleFileUpload = async (file) => {
		try {
			await showApprobationPopup();
			fileUpload(file);
			if (!isSending) {
				refetch();
			}
		} catch (error) {
			// cancel the action
			console.log(error);
		}
	};

	useEffect(() => {
		refetch();
	}, [refetch]);

	const columns = [
		{
			field: "fileName",
			headerName: "Name",
			width: 350,
			editable: true,
			cellClassName: "name-column--cell",
			headerAlign: "center",
		},
		{
			field: "fileSize",
			headerName: "Size",
			width: 100,
			headerAlign: "center",
			alignItems: "center",
		},
		{
			field: "fileIsArchived",
			headerName: "Archived",
			width: 200,
			type: "boolean",
			editable: true,
			headerAlign: "center",
			renderCell: ({ row: { fileIsArchived } }) => {
				return (
					<Box
						width='60%'
						m='0 auto'
						p='5px'
						display='flex'
						justifyContent='center'
						backgroundColor={
							fileIsArchived === true ? colors.redAccent[400] : colors.greenAccent[400]
						}
						borderRadius='10px'
					>
						{fileIsArchived === true && <MdIcons.MdOutlineAdminPanelSettings />}
						{fileIsArchived === false && <MdIcons.MdAdminPanelSettings />}
						<Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
							{fileIsArchived === true && "Archived"}
							{fileIsArchived === false && "Unarchived"}
						</Typography>
					</Box>
				);
			},
		},
		{
			field: "createdAt",
			headerName: "Created At",
			width: 200,
			headerAlign: "center",
		},
		{
			field: "actions",
			headerName: "Actions",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => {
				const rowName = params.row.fileName;
				const isArchived = params.row.fileIsArchived;

				const handleDownload = async () => {
					let downloadPromise = download(rowName).then((res) => {
						if (res.error) {
							console.log(res.error);

							Toast.fire({
								icon: "error",
								title: "Error downloading the file",
							});
						} else {
							downloadPromise.then(function () {
								FileDownload(res.data, `${rowName}`);
								Toast.fire({
									icon: "success",
									title: "Successfully download the file",
								});
							});
						}
					});
				};

				return (
					<>
						<GridActionsCellItem
							icon={<MdIcons.MdCloudDownload size={25} />}
							label='Delete'
							onClick={handleDownload}
						/>
						<GridActionsCellItem
							icon={<MdIcons.MdInfoOutline size={25} />}
							label='Info'
							onClick={() => {
								navigate(`/adminmngt/${rowName}`);
							}}
						/>
						<GridActionsCellItem
							icon={
								isArchived ? (
									<MdIcons.MdOutlineRestoreFromTrash size={25} />
								) : (
									<MdIcons.MdDeleteOutline size={25} />
								)
							}
							label='State'
							onClick={() => {
								isArchived
									? handleRestore({ rowName, isArchived })
									: handleDelete({ rowName, isArchived });
							}}
						/>
					</>
				);
			},
		},
	];

	return (
		<Box
			m='20px'
			// sx={{
			// 	height: "100%",
			// 	width: "100%",
			// }}
		>
			{/* HEADER */}
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				<Header title='Admin PDF Management' subtitle='Manage your PDF Files' />

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
						onClick={() => {
							document.getElementById("pdf-file").click();
						}}
						// onClick={() => navigate("/file_upload")}
					>
						<MdIcons.MdOutlineUploadFile sx={{ marginRight: "5px" }} />
						<span className='mr-1'>Upload a file</span>
					</Button>

					<input
						onChange={(e) => handleFileUpload(e.target.files[0])}
						type='file'
						id='pdf-file'
						name='pdf_file'
						className='hidden'
						accept='.pdf'
					/>
				</Box>
			</Box>

			<Toaster position='top-center' reverseOrder={false}></Toaster>

			{isLoading || isSending || isDownloading ? (
				<Spinner />
			) : (
				<Box
					m='40px 0 0 0'
					// height='75vh'
					sx={{
						"& .MuiDataGrid-root": {
							border: "none",
						},
						"& .MuiDataGrid-cell": {
							borderBottom: "none",
						},
						"& .name-column--cell": {
							color: colors.greenAccent[300],
						},
						"& .MuiDataGrid-columnHeaders": {
							backgroundColor: colors.greenAccent[200],
							borderBottom: "none",
						},
						"& .MuiDataGrid-virtualScroller": {
							backgroundColor: colors.primary[400],
						},
						"& .MuiDataGrid-footerContainer": {
							borderTop: "none",
							backgroundColor: colors.greenAccent[200],
						},
						"& .MuiCheckbox-root": {
							color: `${colors.greenAccent[200]} !important`,
						},
					}}
				>
					<DataGrid
						checkboxSelection={false}
						columns={columns}
						rows={data}
						getRowId={(row) => row._id || generateRowId()}
						components={{
							Toolbar: GridToolbar,
						}}
						autoHeight
						sx={{ "--DataGrid-overlayHeight": "300px" }}
						// autoPageSize
						pageSize={pageSize}
						onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
						rowsPerPageOptions={[5, 6, 10, 20, 30]}
						pagination
					/>
				</Box>
			)}
		</Box>
	);
}
