import React from "react";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as MdIcons from "react-icons/md";
import { tokens } from "../../../Theme";
import { useTheme } from "@mui/material";

export default function InAppBackButton({ path }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<div className='textbox flex flex-col items-center'>
			<IconButton
				className='p-1 w-20 shadow-2xl'
				onClick={() => {
					navigate(`/${path}`);
				}}
				sx={{
					borderRadius: "5px",
					backgroundColor: colors.greenAccent[300],
				}}
			>
				<MdIcons.MdArrowBack size={24} sx={{ color: colors.grey[100] }} />
			</IconButton>
		</div>
	);
}
