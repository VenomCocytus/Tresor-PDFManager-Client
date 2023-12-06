import { Box, Button, useTheme } from "@mui/material";
import React from "react";
import { InAppBackButton, Spinner } from "../../../components";
import styles from "../../../styles/start.module.css";
import extend from "../../../styles/app.module.css";
import pdf from "../../../assets/pdf.png";
import { useState } from "react";
import { useUploadFileMutation } from "../../../redux/reducers/file/fileApiSlice";
import Swal from "sweetalert2";
import { tokens } from "../../../Theme";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/cjs/Page/AnnotationLayer.css";
import "react-pdf/dist/cjs/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

export default function FileUpload() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [pdfData, setPdfData] = useState(null);
  const [file, setFile] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const [upload, { isLoading: isSending }] = useUploadFileMutation();
  const fileType = ["application/pdf"];

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleShowPdf = () => {
    setShowPdf(!showPdf);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  const handleChange = (event) => {
    let selectedfile = event.target.files[0];
    setFile(event.target.files[0]);

    if (selectedfile) {
      if (selectedfile && fileType.includes(selectedfile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedfile);
        reader.onload = (event) => {
          setPdfData(event.target.result);
        };
      } else {
        setPdfData(null);
      }
    } else {
      console.log("Please select a file");
    }
  };

  const showConfirmationPopup = (isArchived) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "Are you sure?",
        text: isArchived
          ? "Are you sure of your decision?"
          : "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: isArchived ? colors.greenAccent[300] : "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: isArchived ? "Yes, restore it!" : "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          resolve();
        } else {
          reject();
        }
      });
    });
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

  const handleFileUpload = async (file) => {
    try {
      await showConfirmationPopup();

      const formData = new FormData();
      formData.append("files", file);

      // Convert FormData to plain object
      const formDataObject = Object.fromEntries(formData.entries());
      console.log(formDataObject);

      let uploadPromise = upload(formData).then((res) => {
        if (res.error) {
          console.log(res.error);

          Toast.fire({
            icon: "error",
            title: "Error uploading the file",
          });
        } else {
          uploadPromise.then(function () {
            Toast.fire({
              icon: "success",
              title: "Successfully upload the file",
            });
          });
        }
      });

      setShowPdf(false);
      setFile();
      setPdfData();
    } catch (error) {
      // user cancelled the action
    }
  };

  return (
    <Box m="20px">
      {isSending ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-col items-center gap-10">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-center my-8">
                Choose an PDF file
              </h1>

              <div className="flex items-center justify-center py-4 shadow-2xl pb-5 rounded-2xl">
                <label htmlFor="pdf-file">
                  <img
                    src={pdf}
                    className={`${styles.profile_img}} ${extend.profile_img}`}
                    alt="pdf"
                  />
                </label>

                <input
                  onChange={handleChange}
                  type="file"
                  id="pdf-file"
                  name="pdf_file"
                  className="hidden"
                  accept=".pdf"
                />
              </div>

              {pdfData && (
                <div className="m-3 flex justify-between">
                  <Button
                    sx={{
                      backgroundColor: colors.greenAccent[200],
                      color: colors.grey[100],
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      justifyContent: "space-between",
                      boxShadow: "20px",
                    }}
                    onClick={() => handleFileUpload(file)}
                  >
                    Upload
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: colors.greenAccent[200],
                      color: colors.grey[100],
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      justifyContent: "space-between",
                      boxShadow: "20px",
                    }}
                    onClick={handleShowPdf}
                  >
                    {showPdf ? "Hide File" : "Show File"}
                  </Button>
                </div>
              )}
            </div>

            {showPdf && (
              <div className="flex flex-col">
                <div className="flex justify-between m-3">
                  <Button
                    onClick={goToPrevPage}
                    sx={{
                      backgroundColor: colors.blueAccent[300],
                      color: colors.grey[100],
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      justifyContent: "space-between",
                      boxShadow: "20px",
                    }}
                  >
                    Prev
                  </Button>

                  <p>
                    Page {pageNumber} of {numPages}
                  </p>

                  <Button
                    onClick={goToNextPage}
                    sx={{
                      backgroundColor: colors.blueAccent[300],
                      color: colors.grey[100],
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                      justifyContent: "space-between",
                      boxShadow: "20px",
                    }}
                  >
                    Next
                  </Button>
                </div>

                <Document
                  file={pdfData}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
              </div>
            )}
          </div>
        </>
      )}

      <Box display="flex" justifyContent="flex-end" mt={10}>
        <InAppBackButton path="adminmngt" />
      </Box>
    </Box>
  );
}
