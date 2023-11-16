import {
	Start,
	ViewFile,
	ManageFile,
	PageNotFound,
	FileUpload,
} from "../../../scenes";

/** root routes */
export const routes = [
	{
		path: "/",
		component: <Start />,
		exact: true,
		topbar: false,
		sidebar: false,
		footer: false,
	},
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
		topbar: true,
		sidebar: true,
		footer: true,
	},
	{
		path: "/file_upload",
		component: <FileUpload />,
		exact: true,
		topbar: true,
		sidebar: true,
		footer: true,
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
