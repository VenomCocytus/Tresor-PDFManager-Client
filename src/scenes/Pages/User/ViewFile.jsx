import { Box, Button, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components";
import { tokens } from "../../../Theme";
import * as MdIcons from "react-icons/md";

export default function ViewFile() {
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

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
							onClick={() => navigate("/adminmngt")}
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
