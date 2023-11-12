import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./Routes/Routes";
import { Layout } from "../../components";

export default function RouterComponent() {
	return (
		<>
			<div className='app'>
				<Router>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								exact={route.exact}
								element={
									<Layout
										topbar={route.topbar}
										sidebar={route.sidebar}
										footer={route.footer}
									>
										{route.component}
									</Layout>
								}
							/>
						))}
					</Routes>
				</Router>
			</div>
		</>
	);
}
