import { apiSlice } from "../api/apiSlice";

const File_Url = "/file";

const apiWithTags = apiSlice.enhanceEndpoints({
	addTagTypes: ["Files"],
});

export const fileApiSlice = apiWithTags.injectEndpoints({
	endpoints: (builder) => ({
		uploadFile: builder.mutation({
			query: (formData) => {
				return {
					url: `${File_Url}/uploads`,
					method: "POST",
					body: formData,
					// headers: {
					// 	"Content-Type":
					// 		"multipart/form-data; boundary=<calculated when request is sent>",
					// },
				};
			},
		}),
		fetchAllFiles: builder.query({
			query: () => `${File_Url}/files`,
		}),
		fetchAllAvailableFiles: builder.query({
			query: () => `${File_Url}/files/available`,
		}),
		fetchFileByName: builder.query({
			query: (filename) => `${File_Url}/files/${filename}`,
		}),
		// downloadFileByName: builder.query({
		// 	query: (filename) => `${File_Url}/files/get/${filename}`,
		// }),
		downloadFileByName: builder.mutation({
			query: (filename) => ({
				url: `${File_Url}/files/download/${filename}`,
				method: "POST",
			}),
		}),
		renameFileByName: builder.mutation({
			query: ({ data, filename }) => ({
				url: `${File_Url}/files/${filename}/rename`,
				method: "PUT",
				body: data,
			}),
		}),
		deleteFileByName: builder.mutation({
			query: (filename) => ({
				url: `${File_Url}/files/${filename}/delete`,
				method: "DELETE",
			}),
		}),
		archiveFileByName: builder.mutation({
			query: (filename) => ({
				url: `${File_Url}/files/${filename}/archive`,
				method: "PUT",
			}),
		}),
		unarchiveFileByName: builder.mutation({
			query: (filename) => ({
				url: `${File_Url}/files/${filename}/unarchive`,
				method: "PUT",
			}),
		}),
	}),
});

export const {
	useUploadFileMutation,
	useFetchAllFilesQuery,
	useFetchAllAvailableFilesQuery,
	useFetchFileByNameQuery,
	useDownloadFileByNameMutation,
	useRenameFileByNameMutation,
	useDeleteFileByNameMutation,
	useArchiveFileByNameMutation,
	useUnarchiveFileByNameMutation,
} = fileApiSlice;
