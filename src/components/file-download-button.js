import React from "react";
import { saveAs } from 'file-saver';

const downloadFile = (blob, fileName) => {
  saveAs(blob, fileName);
};

export const FileDownloadButton = ({ fileBlob, fileName}) => {
  return <button className="dl-link" onClick={() => downloadFile(fileBlob, fileName)}>Download {fileName}</button>;
};
