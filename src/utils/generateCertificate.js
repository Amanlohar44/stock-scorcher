import { jsPDF } from "jspdf";
import QRCode from "qrcode";

import logo from "../assets/logo.png";
import signature from "../assets/signature.png";
import seal from "../assets/seal.png";

async function generateCertificate(studentName, certificateId) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // =========================
  // Background
  // =========================
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, 297, 210, "F");

  // =========================
  // Double Border
  // =========================
  doc.setDrawColor(214, 158, 46);
  doc.setLineWidth(2);
  doc.rect(8, 8, 281, 194);

  doc.setDrawColor(245, 200, 66);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, 273, 186);

  // =========================
  // Logo
  // =========================
  doc.addImage(
    logo,
    "PNG",
    118,
    10,
    38,
    38
  );

  // =========================
  // Title
  // =========================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(210, 150, 0);

  doc.text(
    "CERTIFICATE OF COMPLETION",
    148.5,
    55,
    {
      align: "center",
    }
  );

  // =========================
  // Subtitle
  // =========================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(90);

  doc.text(
    "This certificate is proudly presented to",
    148.5,
    72,
    {
      align: "center",
    }
  );

  // =========================
  // Student Name
  // =========================
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0);

  doc.text(
    studentName || "Student",
    148.5,
    94,
    {
      align: "center",
    }
  );

  doc.setDrawColor(214, 158, 46);
  doc.setLineWidth(0.7);

  doc.line(
    95,
    99,
    202,
    99
  );

  // =========================
  // Description
  // =========================
  doc.setFont("helvetica", "normal");
  doc.setFontSize(15);
  doc.setTextColor(70);

  doc.text(
    "for successfully completing the",
    148.5,
    116,
    {
      align: "center",
    }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(210, 150, 0);

  doc.text(
    "Stock Market Mastery Course",
    148.5,
    131,
    {
      align: "center",
    }
  );
    // =========================
  // Completion Date
  // =========================
  const today = new Date().toLocaleDateString("en-GB");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(60);

  doc.text(
    `Completion Date : ${today}`,
    45,
    175
  );

  // =========================
  // Certificate ID
  // =========================
  certificateId =
    certificateId ||
    "SSC-" + Date.now().toString().slice(-8);

  doc.text(
    `Certificate ID : ${certificateId}`,
    45,
    184
  );

  // =========================
  // Gold Seal
  // =========================
  doc.addImage(
    seal,
    "PNG",
    12,
    116,
    48,
    48
  );

  // =========================
  // Signature
  // =========================
  doc.addImage(
    signature,
    "PNG",
    198,
    145,
    62,
    22
  );

  doc.setDrawColor(210, 150, 0);
  doc.setLineWidth(0.8);

  doc.line(196, 165, 276, 165);

  doc.text("Aman Lohar", 234, 173, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.text("Founder", 234, 180, {
    align: "center",
  });

  doc.text("Stock Scorcher", 234, 186, {
    align: "center",
  });

  // =========================
  // QR Code
  // =========================
  const verifyUrl =
    `${window.location.origin}/verify-certificate?id=${certificateId}`;

  const qrImage = await QRCode.toDataURL(verifyUrl);

  doc.addImage(
    qrImage,
    "PNG",
    245,
    118,
    28,
    28
  );

  doc.setFontSize(8);
  doc.setTextColor(80);

  doc.text(
    "Scan to Verify",
    259,
    149,
    {
      align: "center",
    }
  );
    return {
    doc,
    certificateId,
  };
}

export default generateCertificate;

export async function downloadCertificate(
  studentName,
  certificateId
) {
  const { doc } = await generateCertificate(
    studentName,
    certificateId
  );

  doc.save(
    `StockScorcher-${studentName}-${certificateId}.pdf`
  );
}

export async function previewCertificate(studentName) {
  const { doc } = await generateCertificate(studentName);

  const blobUrl = doc.output("bloburl");

  window.open(blobUrl, "_blank");
}