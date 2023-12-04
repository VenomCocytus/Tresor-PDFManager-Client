import { Box, Tab, Tabs, useTheme } from "@mui/material";
import React, { useState } from "react";
import { tokens } from "../../../Theme";
import { Header, InAppBackButton } from "../../../components";
import { RenameFile, FileDetailTable, PDFViewer } from "../../../scenes";
import PDFViewerComponent from "../Utils/PDFViewer";

const TabPanel = ({ children, value, index, ...other }) => {
	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
};

const a11yProps = (index) => {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
};

export default function FileDetails() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box m='20px'>
			<Header
				title='File Detail Page'
				subtitle='Visualize and update the file in your database'
			/>

			<Box>
				<Box boxShadow={15} sx={{ bgcolor: colors.primary[400], borderRadius: 2 }}>
					<Box
						sx={{
							borderBottom: 1,
							borderColor: "divider",
							boxShadow: 10,
							borderRadius: 2,
						}}
					>
						<Tabs
							value={value}
							onChange={handleChange}
							textColor='secondary'
							indicatorColor='secondary'
							// variant='fullWidth'
							aria-label='full_with_tabs'
							centered
							sx={{
								borderRadius: 2,
								"& .MuiTabs-indicator": {
									display: "flex",
									justifyContent: "center",
									// backgroundColor: "transparent",
								},
							}}
						>
							<Tab
								label='Details'
								{...a11yProps(0)}
								sx={{
									textTransform: "none",
									fontWeight: "bold",
									fontSize: 14,
									marginRight: 2,
									color: colors.grey[100],
									"&.Mui-selected": {
										color: colors.greenAccent[400],
									},
									"&.Mui-focusVisible": {
										bgcolor: "rgba(100, 95, 228, 0.32)",
									},
								}}
							/>
							<Tab
								label='Rename'
								{...a11yProps(1)}
								sx={{
									textTransform: "none",
									fontWeight: "bold",
									fontSize: 14,
									marginRight: 2,
									color: colors.grey[100],
									"&.Mui-selected": {
										color: colors.greenAccent[400],
									},
									"&.Mui-focusVisible": {
										bgcolor: "rgba(100, 95, 228, 0.32)",
									},
								}}
							/>
						</Tabs>
					</Box>
					<TabPanel value={value} index={0}>
						<FileDetailTable />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<RenameFile />
					</TabPanel>
				</Box>
			</Box>

			<Box display='flex' justifyContent='flex-end' mt={10}>
				<InAppBackButton path='adminmngt' />
			</Box>

			<Box>
				<PDFViewerComponent />
			</Box>
		</Box>
	);
}
