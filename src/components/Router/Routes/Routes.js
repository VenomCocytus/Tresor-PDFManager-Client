import { Start, ViewFile, ManageFile, PageNotFound } from "../../../scenes";

/** root routes */
export const routes = [
	{
		path: "/start",
		component: <Start />,
		exact: true,
		topbar: false,
		sidebar: false,
		footer: false,
	},
	{
		path: "/viewpdf",
		component: <ViewFile />,
		exact: true,
		topbar: false,
		sidebar: false,
		footer: false,
	},
	{
		path: "/adminmngt",
		component: <ManageFile />,
		exact: true,
		topbar: false,
		sidebar: false,
		footer: false,
	},
	{
		path: "*",
		component: <PageNotFound />,
		exact: true,
		topbar: false,
		sidebar: false,
		footer: false,
	},
];
