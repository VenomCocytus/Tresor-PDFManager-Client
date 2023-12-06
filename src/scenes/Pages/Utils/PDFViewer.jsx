import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useDownloadFileByNameMutation } from "../../../redux/reducers/file/fileApiSlice";
import { Button, useTheme } from "@mui/material";
import { tokens } from "../../../Theme";
import { Spinner } from "../../../components";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/cjs/Page/AnnotationLayer.css";
import "react-pdf/dist/cjs/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

export default function PDFViewerComponent() {
  const { file_detail_name } = useParams();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fetchData, { isLoading }] = useDownloadFileByNameMutation();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfData, setPdfData] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [showPdf, setShowPdf] = useState(true);

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

  const handleDownload = async () => {
    let downloadPromise = fetchData(file_detail_name).then((res) => {
      if (res.error) {
        console.log(res.error);

        Toast.fire({
          icon: "error",
          title: "Error fetching the file",
        });
      } else {
        downloadPromise.then(async function () {
          setPdfData(res.data);
          setDownloaded(true);
          console.log(res.data);

          try {
            Toast.fire({
              icon: "success",
              title: "Successfully fetch the file",
            });
          } catch (error) {
            console.log(error);
          }
        });
      }
    });
  };

  return (
    <div>
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
        onClick={() => (downloaded ? handleShowPdf() : handleDownload())}
      >
        {downloaded && showPdf ? "Hide File" : "Show File"}
      </Button>

      {isLoading ? (
        <Spinner />
      ) : downloaded && showPdf ? (
        <div className="flex flex-col gap-10">
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

          <div className="flex items-center flex-col">
            <Document
              file={pdfData}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
            >
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
