import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../../Theme";

export default function Footer() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<footer
			className='w-full'
			style={{
				backgroundColor: colors.indigo[900],
				color: colors.grey[100],
			}}
		>
			<div
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
      text-center pt-5 text-sm pb-8'
				style={{
					color: colors.grey[100],
				}}
			>
				<span>© 2023 TresorPDF Reader. All rights reserved.</span>
				<span>Terms · Privacy Policy</span>
			</div>
		</footer>
	);
}
