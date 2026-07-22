export function printInvoice(invoiceNumber: string) {
  const printWindow = window.open('', '_blank');

  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }

          h1 {
            color: #4f46e5;
          }

          .invoice {
            border: 1px solid #ddd;
            padding: 20px;
          }
        </style>
      </head>

      <body>
        <div class="invoice">
          <h1>VINAYAK ERP AI SUITE</h1>
          <p>Invoice Number: ${invoiceNumber}</p>
          <p>Generated from ERP System</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}