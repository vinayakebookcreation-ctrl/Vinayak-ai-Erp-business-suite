import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface InvoiceItem {
  product_name: string;
  quantity: number;
  rate: number;
  gst_percent: number;
}

export interface InvoiceData {
  invoice_number: string;
  invoice_date: string;

  customer_name: string;
  customer_phone?: string;
  customer_gst?: string;

  items: InvoiceItem[];

  subtotal: number;
  gst_amount: number;
  grand_total: number;
}

export function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text("VINAYAK ERP AI SUITE", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("Professional GST Invoice", 15, 25);

  console.log("PDF Started");


  // =========================================
// COMPANY HEADER
// =========================================

doc.setDrawColor(79, 70, 229);
doc.setLineWidth(0.6);
doc.line(15, 30, 195, 30);

doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.setTextColor(79, 70, 229);

doc.text("VINAYAK ERP AI SUITE", 15, 40);

doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(60, 60, 60);

doc.text("Vadodara, Gujarat - India", 15, 47);
doc.text("GSTIN : 24ABCDE1234F1Z5", 15, 53);
doc.text("Phone : +91 9876543210", 15, 59);
doc.text("Email : info@vinayakerp.com", 15, 65);

doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.setTextColor(0, 0, 0);

doc.text("TAX INVOICE", 150, 40);

doc.setFont("helvetica", "normal");
doc.setFontSize(10);

doc.text(`Invoice No : ${data.invoice_number}`, 135, 50);
doc.text(`Invoice Date : ${data.invoice_date}`, 135, 56);

doc.line(15, 72, 195, 72);
// =========================================
// CUSTOMER DETAILS
// =========================================

doc.setDrawColor(180);
doc.rect(15, 78, 180, 36);

doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.setTextColor(79, 70, 229);

doc.text("BILL TO", 20, 88);

doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);

doc.text(`Customer : ${data.customer_name}`, 20, 96);

if (data.customer_phone) {
  doc.text(`Phone : ${data.customer_phone}`, 20, 102);
}

if (data.customer_gst) {
  doc.text(`GSTIN : ${data.customer_gst}`, 20, 108);
}
// =========================================
// PRODUCT TABLE
// =========================================

autoTable(doc, {
  startY: 122,

  head: [[
    "No",
    "Product",
    "Qty",
    "Rate",
    "GST %",
    "Amount"
  ]],

  body: data.items.map((item, index) => [
    index + 1,
    item.product_name,
    item.quantity,
    `₹ ${item.rate.toFixed(2)}`,
    `${item.gst_percent}%`,
    `₹ ${(item.quantity * item.rate).toFixed(2)}`
  ]),

  theme: "grid",

  headStyles: {
    fillColor: [79, 70, 229],
    textColor: [255, 255, 255],
    fontStyle: "bold",
    halign: "center",
  },

  styles: {
    fontSize: 9,
    cellPadding: 3,
  },

  columnStyles: {
    0: {
      halign: "center",
      cellWidth: 12,
    },

    2: {
      halign: "center",
      cellWidth: 18,
    },

    3: {
      halign: "right",
      cellWidth: 28,
    },

    4: {
      halign: "center",
      cellWidth: 20,
    },

    5: {
      halign: "right",
      cellWidth: 30,
    },
  },
});
// =========================================
// TOTAL SECTION
// =========================================

const finalY =
  (doc as any).lastAutoTable.finalY + 10;

const rightX = 135;

doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);

doc.text("Subtotal :", rightX, finalY);
doc.text(
  `₹ ${data.subtotal.toFixed(2)}`,
  195,
  finalY,
  {
    align: "right",
  }
);

doc.text("CGST (9%) :", rightX, finalY + 8);
doc.text(
  `₹ ${(data.gst_amount / 2).toFixed(2)}`,
  195,
  finalY + 8,
  {
    align: "right",
  }
);

doc.text("SGST (9%) :", rightX, finalY + 16);
doc.text(
  `₹ ${(data.gst_amount / 2).toFixed(2)}`,
  195,
  finalY + 16,
  {
    align: "right",
  }
);

// Divider
doc.setDrawColor(120);
doc.line(rightX, finalY + 22, 195, finalY + 22);

// Grand Total
doc.setFont("helvetica", "bold");
doc.setFontSize(12);

doc.text("Grand Total :", rightX, finalY + 32);

doc.text(
  `₹ ${data.grand_total.toFixed(2)}`,
  195,
  finalY + 32,
  {
    align: "right",
  }
);
// =========================================
// FOOTER
// =========================================

doc.setFont("helvetica", "normal");
doc.setFontSize(9);
doc.setTextColor(80, 80, 80);

doc.text(
  "Thank you for your business!",
  15,
  finalY + 50
);

doc.text(
  "This is a computer generated GST Invoice.",
  15,
  finalY + 56
);

doc.text(
  "Goods once sold will not be taken back.",
  15,
  finalY + 62
);

// =========================================
// SIGNATURE
// =========================================

doc.setFont("helvetica", "bold");
doc.setFontSize(10);
doc.setTextColor(0, 0, 0);

doc.text(
  "Authorized Signatory",
  145,
  finalY + 62
);

doc.line(
  145,
  finalY + 54,
  192,
  finalY + 54
);

// =========================================
// DOWNLOAD PDF
// =========================================

doc.save(`${data.invoice_number}.pdf`);
}