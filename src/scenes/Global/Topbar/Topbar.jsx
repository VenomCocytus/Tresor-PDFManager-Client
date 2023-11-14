import { React, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Avatar,
	Box,
	IconButton,
	Menu,
	MenuItem,
	useTheme,
	Typography,
	ListItemIcon,
	Divider,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { ColorModeContext, tokens } from "../../../Theme";
import Swal from "sweetalert2";
import InputBase from "@mui/material/InputBase";
import * as MdIcons from "react-icons/md";
import avatar from "../../../assets/profile.png";

const Item = ({ title, to, icon, onClick }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<MenuItem
			component={Link}
			style={{
				color: colors.grey[100],
				fontSize: "16px",
			}}
			to={to}
			onClick={onClick}
		>
			<ListItemIcon style={{ fontSize: "16px" }}>{icon}</ListItemIcon>
			<Typography>{title}</Typography>
		</MenuItem>
	);
};

export default function Topbar() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const colorMode = useContext(ColorModeContext);
	const navigate = useNavigate();

	const [anchorElUser, setAnchorElUser] = useState(null);

	// Set the popup color
	const themeColor = colors.primary[400];
	const textColor = colors.grey[100];
	document.documentElement.style.setProperty("--theme-color", themeColor);
	document.documentElement.style.setProperty("--text-color", textColor);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

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

	const handleLogout = async () => {
		handleCloseUserMenu();
		try {
			await showConfirmationPopup();

			// redirect to user page
			navigate("/viewpdf");
		} catch (error) {
			// user cancelled the action
		}
	};

	return (
		<Box display='flex' justifyContent='space-between' p={2} boxShadow={15}>
			{/* SEARCH BAR */}
			<Box display='flex' backgroundColor={colors.primary[400]} borderRadius='3px'>
				<InputBase sx={{ ml: 2, flex: 1 }} placeholder='Search' />
				<IconButton type='button' sx={{ p: 1 }}>
					<MdIcons.MdSearch />
				</IconButton>
			</Box>

			{/* ICONS */}
			<Box display='flex'>
				<IconButton onClick={colorMode.toggleColorMode}>
					{theme.palette.mode === "dark" ? (
						<MdIcons.MdOutlineDarkMode />
					) : (
						<MdIcons.MdOutlineLightMode />
					)}
				</IconButton>

				<IconButton>
					<MdIcons.MdOutlineNotifications />
				</IconButton>

				<Box ml='5px' display='flex' alignItems='center'>
					<Tooltip title='User Settings'>
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar alt='userImage' src={avatar} />
						</IconButton>
					</Tooltip>

					<Menu
						sx={{ mt: "45px" }}
						anchorEl={anchorElUser}
						anchorOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						keepMounted
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						open={Boolean(anchorElUser)}
						onClose={handleCloseUserMenu}
						PaperProps={{
							style: {
								backgroundColor: colors.primary[400],
								borderRadius: "10px",
								boxShadow: "15px",
							},
						}}
					>
						<Item
							title='Profile'
							to='/profile_settings'
							icon={<MdIcons.MdPersonOutline />}
							onClick={handleCloseUserMenu}
						/>

						<Item
							title='Dashboard'
							to='/dashboard'
							icon={<MdIcons.MdOutlineDashboard />}
							onClick={handleCloseUserMenu}
						/>

						<Divider />

						<Item
							title='Logout'
							icon={<MdIcons.MdOutlineLogout />}
							onClick={handleLogout}
						/>
					</Menu>
				</Box>
			</Box>
		</Box>
	);
}
