import React, { useState } from "react";
import {
	ProSidebar,
	Menu,
	MenuItem,
	SidebarFooter,
	SidebarHeader,
	SidebarContent,
} from "react-pro-sidebar";
import Swal from "sweetalert2";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../Theme";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import logo from "../../../assets/logo.png";
import "../../../styles/popup.css";

import AdminContent from "./SidebarContent/AdminContent";

export default function Sidebar() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const navigate = useNavigate();

	// const [logout, { isLoading }] = useLogoutMutation();
	let sidebar_content;
	sidebar_content = <AdminContent isCollapsed={isCollapsed} />;

	// Set the popup color
	const themeColor = colors.primary[400];
	const textColor = colors.grey[100];
	document.documentElement.style.setProperty("--theme-color", themeColor);
	document.documentElement.style.setProperty("--text-color", textColor);

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
				title: "Are you sure you want to log out?",
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
						title: "Signed out successfully",
					});

					resolve();
				} else {
					reject();
				}
			});
		});
	};

	const handleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	const handleLogout = async () => {
		try {
			// show confirmation popup
			await showConfirmationPopup();
			navigate("/viewpdf");
		} catch (error) {
			// user cancelled the action
		}
	};

	return (
		<>
			<Box
				boxShadow={15}
				sx={{
					display: "flex",
					"& .pro-sidebar-inner": {
						background: `${colors.primary[400]} !important`,
					},
					"& .pro-icon-wrapper": {
						backgroundColor: "transparent !important",
					},
					"& .pro-inner-sub-menu": {
						padding: "5px 35px 5px 20px !important",
					},
					"& .pro-inner-item": {
						padding: "5px 35px 5px 20px !important",
					},
					"& .pro-inner-item:hover": {
						color: `${colors.greenAccent[200]} !important`,
					},
					"& .pro-menu-item.active": {
						color: `${colors.grey[100]} !important`,
						borderRadius: "10px !important",
						backgroundColor: `${colors.greenAccent[500]} !important`,
						boxShadow: "10px !important",
					},
				}}
			>
				<ProSidebar collapsed={isCollapsed} onToggle={handleCollapse}>
					<Menu iconShape='square'>
						{/* LOGO AND MENU ICON */}
						<SidebarHeader>
							<Box
								display='flex'
								justifyContent='center'
								alignItems='center'
								mb='9px'
								sx={{ cursor: "pointer" }}
							>
								<img
									alt='logo'
									width='40px'
									height='40px'
									src={logo}
									style={{
										cursor: "pointer",
										overflow: "hidden",
									}}
								/>
								{!isCollapsed && (
									<>
										<Typography
											variant='h5'
											fontWeight={700}
											sx={{ color: "#151632", ml: "10px" }}
										>
											TresorPDF Reader
										</Typography>
									</>
								)}
							</Box>

							<Divider />

							<MenuItem
								onClick={() => setIsCollapsed(!isCollapsed)}
								icon={
									isCollapsed ? <BsIcons.BsArrowRightSquare size={20} /> : undefined
								}
								style={{
									margin: "10px 0 20px 0",
									color: colors.grey[100],
								}}
							>
								{!isCollapsed && (
									<Box
										display='flex'
										justifyContent='space-between'
										alignItems='center'
										ml='15px'
									>
										<Typography variant='h4' color={colors.grey[100]} sx={{ ml: "25px" }}>
											{"Administrator"}
										</Typography>
										<IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
											<BsIcons.BsArrowLeftSquare size={20} />
										</IconButton>
									</Box>
								)}
							</MenuItem>
						</SidebarHeader>

						<SidebarContent>{sidebar_content}</SidebarContent>

						<SidebarFooter>
							<Box
								onClick={handleLogout}
								paddingLeft={isCollapsed ? undefined : "10%"}
								sx={{
									cursor: "pointer",
								}}
							>
								<MenuItem
									style={{
										color: colors.grey[100],
									}}
									icon={<MdIcons.MdOutlineLogout size={20} />}
								>
									<Typography>Logout</Typography>
								</MenuItem>
							</Box>
						</SidebarFooter>
					</Menu>
				</ProSidebar>
			</Box>
		</>
	);
}
