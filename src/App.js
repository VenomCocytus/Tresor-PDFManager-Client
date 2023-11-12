import React from "react";
import { ColorModeContext, useMode } from "./Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

import RouterComponent from "./components/Router/Router";
import Global from "./styles/Global";

function App() {
	const [theme, colorMode] = useMode();
	return (
		<>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Global />
					<RouterComponent />
				</ThemeProvider>
			</ColorModeContext.Provider>
		</>
	);
}

export default App;
