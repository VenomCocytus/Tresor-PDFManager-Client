import React from "react";
import { Topbar, Sidebar, Footer } from "../../../scenes";

export default function Layout({ topbar, sidebar, footer, children }) {
	return (
		<>
			{sidebar && <Sidebar />}
			<main className='content flex flex-col'>
				{topbar && <Topbar />}
				<div className='flex-grow'>{children}</div>
				{footer && (
					<footer className='flex-shrink-0'>
						<Footer />
					</footer>
				)}
			</main>
		</>
	);
}
