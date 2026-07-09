import { jsPDF } from "jspdf";

export default function generateCertificate(studentName) {
  const doc = new jsPDF("landscape");

  // Background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 297, 210, "F");

  // Border
  doc.setDrawColor(250, 204, 21);
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(234, 179, 8);
  doc.text("CERTIFICATE OF COMPLETION", 148.5, 40, {
    align: "center",
  });

  // Subtitle
  doc.setFontSize(16);
  doc.setTextColor(80);
  doc.text("This certificate is proudly presented to", 148.5, 60, {
    align: "center",
  });

  // Student Name
  doc.setFontSize(28);
  doc.setTextColor(0);
  doc.text(studentName || "Student", 148.5, 85, {
    align: "center",
  });

  // Description
  doc.setFontSize(16);
  doc.setTextColor(70);
  doc.text(
    "for successfully completing the",
    148.5,
    105,
    { align: "center" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(234, 179, 8);
  doc.text("Stock Market Mastery Course", 148.5, 122, {
    align: "center",
  });

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(60);

  const today = new Date().toLocaleDateString();

  doc.text(`Completion Date: ${today}`, 40, 175);

  // Signature
  doc.setFont("helvetica", "bold");
  doc.text("Founder", 230, 165);

  doc.line(210, 170, 270, 170);

  doc.setFontSize(16);
  doc.text("Aman Lohar", 240, 178);

  doc.save("Stock-Scorcher-Certificate.pdf");
}