import React from "react";
import { ColorModeContext, useMode } from "./Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import store from "./redux/store/store";

import RouterComponent from "./components/Router/Router";
import Global from "./styles/Global";

function App() {
	const [theme, colorMode] = useMode();
	return (
		<>
			<Provider store={store}>
				<ColorModeContext.Provider value={colorMode}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Global />
						<RouterComponent />
					</ThemeProvider>
				</ColorModeContext.Provider>
			</Provider>
		</>
	);
}

export default App;
