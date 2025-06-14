import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToCSV = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "export.csv");
};

export const exportToExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(blob, "export.xlsx");
};

export const exportToPDF = (data) => {
  const doc = new jsPDF();

  // Set smaller font size for the title (default is 12, reducing by 4 makes it 8)
  doc.setFontSize(8);
//   doc.text("Exported Data", 14, 20);

  const headers = Object.keys(data[0]);
  const body = data.map((row) => headers.map((header) => row[header]));

  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 30,
    // Set smaller font size for the table (default is 10, reducing by 2 makes it 8)
    styles: {
      fontSize: 8,
    },
    // Optional: set smaller font size specifically for header
    headStyles: {
      fontSize: 8,
    },
    // Optional: set smaller font size specifically for body
    bodyStyles: {
      fontSize: 8,
    },
  });

  doc.save("export.pdf");
};
