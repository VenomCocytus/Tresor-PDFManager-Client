import React from "react";
import { Button, useTheme } from "@mui/material";

import { tokens } from "../../../Theme";
import styles from "../../../styles/start.module.css";
import { useNavigate } from "react-router-dom";

export default function Start() {
	const navigate = useNavigate();
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<div className='bg-main-bg'>
			<div className='container mx-auto'>
				<div className='flex justify-center items-center h-screen'>
					<div className={styles.glass}>
						<div className='title flex flex-col items-center'>
							<h4 className='text-5xl font-bold text-center'>
								Welcome to <br />
								<div className={styles.span}>TresorPDF Reader</div>
							</h4>
							<span className='py-4 text-xl w-2/3 text-center text-gray-500'>
								The absolute platorm for reading your ministery's pdf online.
							</span>
						</div>

						<div className='textbox flex flex-col items-center'>
							<Button
								onClick={() => navigate("/viewpdf")}
								sx={{
									backgroundColor: "#59981A",
									color: colors.grey[100],
									fontSize: "14px",
									fontWeight: "bold",
									padding: "10px 20px",
									justifyContent: "space-between",
									boxShadow: "20px",
									marginTop: "15px",
								}}
							>
								Let's Start
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
