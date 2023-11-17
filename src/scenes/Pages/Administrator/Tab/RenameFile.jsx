import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import {
	useFetchFileByNameQuery,
	useUpdateFileByNameMutation,
} from "../../../../redux/reducers/file/fileApiSlice";
import Swal from "sweetalert2";
import { Spinner } from "../../../../components";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField } from "@mui/material";

const validationSchema = Yup.object().shape({
	filename: Yup.string(),
});

export default function RenameFile() {
	const { file_detail_name } = useParams();
	const [error, setError] = useState(false);
	const isNonMobile = useMediaQuery("(min-width:600px)");

	const [updateFileInfo, { isLoading: isUpdating }] =
		useUpdateFileByNameMutation();
	const { data, isLoading, refetch } = useFetchFileByNameQuery(file_detail_name);

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

	const formik = useFormik({
		initialValues: {
			newFileName: file_detail_name || "",
		},
		validationSchema: validationSchema,
		enableReinitialize: true,
		validateOnBlur: false,
		validateOnChange: false,
		onSubmit: async (values) => {
			const formData = new FormData();
			formData.append("newFileName", values.filename);
			formData.append("state", data.fileIsArchived);

			let updatePromise = updateFileInfo({
				filename: file_detail_name,
				formData: formData,
			}).then((res) => {
				if (res.error) {
					console.log(res.error);

					Toast.fire({
						icon: "error",
						title: "Error updating file info",
					});

					setError(true);
				}
			});

			if (!error) {
				updatePromise.then(function () {
					Toast.fire({
						icon: "success",
						title: "File successfully updated",
					});
				});
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (isLoading)
		return (
			<h1 className='text-2xl font-bold'>
				<Spinner />
			</h1>
		);

	return (
		<>
			{isUpdating ? (
				<Spinner />
			) : (
				<Formik validationSchema={validationSchema} sx={{ m: "10px" }}>
					{({ errors, touched }) => (
						<form className='py-5 w-full' onSubmit={formik.handleSubmit}>
							<Box
								mt='10px'
								display='grid'
								gap='30px'
								gridTemplateColumns='repeat(4, minmax(0, 1fr))'
								sx={{
									"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
								}}
							>
								<TextField
									fullWidth
									variant='filled'
									type='text'
									label='Filename'
									{...formik.getFieldProps("filename")}
									error={!!touched.filename && !!errors.filename}
									helperText={touched.filename && errors.filename}
									sx={{ gridColumn: "span 2" }}
								/>
							</Box>
							<Box display='flex' justifyContent='end' mt='20px'>
								<Button type='submit' color='secondary' variant='contained'>
									Update
								</Button>
							</Box>
						</form>
					)}
				</Formik>
			)}
		</>
	);
}
