import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Spinner } from "../../../components";
import { tokens } from "../../../Theme";
import { v4 as uuidv4 } from "uuid";
import * as MdIcons from "react-icons/md";
import Swal from "sweetalert2";
import FileDownload from "js-file-download";
import {
	useDownloadFileByNameMutation,
	useFetchAllAvailableFilesQuery,
} from "../../../redux/reducers/file/fileApiSlice";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import { Toaster } from "react-hot-toast";

export default function ViewFile() {
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [pageSize, setPageSize] = useState(6);
	const [download, { isLoading: isDownloading }] =
		useDownloadFileByNameMutation();
	const { data, isLoading, refetch } = useFetchAllAvailableFilesQuery();

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

	const generateRowId = () => {
		return uuidv4();
	};

	useEffect(() => {
		refetch();
	}, [refetch]);

	const columns = useMemo(() => [
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

				const handleDownload = async () => {
					try {
						const response = await download(rowName);
						FileDownload(response.data, `${rowName}`);
						console.log(rowName);
					} catch (error) {
						console.error("Error downloading file", error);
					}
				};

				return (
					<>
						<GridActionsCellItem
							icon={<MdIcons.MdCloudDownload size={15} />}
							label='Delete'
							onClick={handleDownload}
						/>
						<IconButton
						// onClick={() => {
						// 	navigate(`/users/${params._id}`);
						// }}
						>
							<MdIcons.MdInfoOutline />
						</IconButton>
					</>
				);
			},
		},
	]);

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

				<Toaster position='top-center' reverseOrder={false}></Toaster>

				{isLoading || isDownloading ? (
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
		</>
	);
}
