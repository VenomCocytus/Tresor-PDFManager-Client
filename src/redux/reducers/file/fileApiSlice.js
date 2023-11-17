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
		downloadFileByName: builder.mutation({
			query: (filename) => ({
				url: `${File_Url}/files/download/${filename}`,
				method: "POST",
				responseHandler: (response) => response.blob(),
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
				responseHandler: (response) => response.text(),
			}),
		}),
		unarchiveFileByName: builder.mutation({
			query: (filename) => ({
				url: `${File_Url}/files/${filename}/unarchive`,
				method: "PUT",
				responseHandler: (response) => response.text(),
			}),
		}),
		updateFileByName: builder.mutation({
			query: ({ filename, formData }) => ({
				url: `${File_Url}/files/${filename}/update`,
				method: "PUT",
				body: formData,
				responseHandler: (response) => response.text(),
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
	useUpdateFileByNameMutation,
} = fileApiSlice;
