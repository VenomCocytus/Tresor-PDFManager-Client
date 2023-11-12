import React from "react";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as MdIcons from "react-icons/md";
import styles from "../../../styles/start.module.css";

export default function BackButton({ path }) {
	const navigate = useNavigate();

	return (
		<div className='textbox flex flex-col items-center'>
			<IconButton
				className={styles.backbtn}
				onClick={() => {
					navigate(`/${path}`);
				}}
				sx={{ p: 1 }}
			>
				<MdIcons.MdArrowBack size={24} />
			</IconButton>
		</div>
	);
}
