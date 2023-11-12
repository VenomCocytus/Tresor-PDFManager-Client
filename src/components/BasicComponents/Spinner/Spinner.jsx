import { CircularProgress, LinearProgress } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../Theme";

export default function Spinner() {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const Linear = false;

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			{Linear ? (
				<LinearProgress style={{ color: colors.greenAccent[400] }} />
			) : (
				<CircularProgress style={{ color: colors.greenAccent[400] }} />
			)}
		</div>
	);
}
