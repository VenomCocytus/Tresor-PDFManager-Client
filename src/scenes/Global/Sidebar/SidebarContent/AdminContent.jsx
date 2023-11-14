import React, { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { MenuItem } from "react-pro-sidebar";
import { tokens } from "../../../../Theme";
import * as MdIcons from "react-icons/md";

const Item = ({ title, to, icon, selected, setSelected }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<MenuItem
			active={selected === title}
			style={{
				color: colors.grey[100],
			}}
			onClick={() => setSelected(title)}
			icon={icon}
		>
			<Typography>{title}</Typography>
			<Link to={to} />
		</MenuItem>
	);
};

export default function AdminContent({ isCollapsed }) {
	const [selected, setSelected] = useState("Manage PDF Files");
	return (
		<Box
			paddingX={isCollapsed ? undefined : "5%"}
			paddingY={isCollapsed ? undefined : "5%"}
		>
			<Item
				title='Dashboard'
				to='/dashboard'
				icon={<MdIcons.MdOutlineDashboard />}
				selected={selected}
				setSelected={setSelected}
			/>

			<Item
				title='Manage PDF Files'
				to='/adminmngt'
				icon={<MdIcons.MdFileOpen />}
				selected={selected}
				setSelected={setSelected}
			/>
		</Box>
	);
}
