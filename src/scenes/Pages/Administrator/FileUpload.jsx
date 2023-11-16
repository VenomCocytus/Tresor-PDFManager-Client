import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useMemo, useState } from "react";
import { Header, Spinner } from "../../../components";
import { tokens } from "../../../Theme";
import * as MdIcons from "react-icons/md";
import {
	useFetchAllFilesQuery,
	useUploadFileMutation,
} from "../../../redux/reducers/file/fileApiSlice";
import Swal from "sweetalert2";
import { Toaster } from "react-hot-toast";

export default function FileUpload() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [pageSize, setPageSize] = useState(5);
	const [upload, { isLoading: isSending }] = useUploadFileMutation();
	const { data, isLoading, refetch } = useFetchAllFilesQuery();
	console.log(data);

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

	const columns = useMemo(() => [
		{ field: "fileName", headerName: "Name", width: 250, editable: true },
		{ field: "fileSize", headerName: "Size", width: 100 },
		{
			field: "fileIsArchived",
			headerName: "Archived",
			width: 100,
			type: "boolean",
			editable: true,
		},
		{
			field: "createdAt",
			headerName: "Created At",
			width: 100,
		},
	]);

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

			{isLoading || isSending ? (
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
						checkboxSelection={true}
						columns={columns}
						rows={data}
						getRowId={(row) => row._id || generateRowId()}
						components={{
							Toolbar: GridToolbar,
						}}
						autoHeight
						// autoPageSize
						pageSize={pageSize}
						onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
						rowsPerPageOptions={[5, 10, 20, 30]}
						pagination
					/>
				</Box>
			)}
		</Box>
	);
}
