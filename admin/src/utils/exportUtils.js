import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate a unique filename with date and time
 * @param {string} filename - Base name of the file
 * @param {string} extension - File extension (without dot)
 * @returns {string} Formatted filename: filename_YYYY-MM-DD_HH-MM-SS.ext
 */
const generateUniqueFilename = (filename = 'orders', extension = 'csv') => {
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  return `${filename}_${date}_${time}.${extension}`;
};

/**
 * Export orders data to CSV format
 * @param {Array} orders - Array of order objects
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (orders, filename = 'orders') => {
  if (!orders || orders.length === 0) {
    alert('No orders to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Order ID',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Date',
    'Status',
    'Total',
    'Payment Method',
    'Payment Status',
    'Shipping Address',
    'Shipping Method',
    'Items'
  ];

  // Convert orders to CSV rows
  const rows = orders.map(order => {
    const items = order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join('; ');
    return [
      order.id || '',
      order.customer?.name || '',
      order.customer?.email || '',
      order.customer?.phone || '',
      order.date || '',
      order.status || '',
      `$${order.total?.toFixed(2) || '0.00'}`,
      order.payment?.method || '',
      order.payment?.status || '',
      order.shipping?.address || '',
      order.shipping?.method || '',
      items
    ];
  });

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Escape commas and quotes in cell values
        const cellValue = String(cell || '').replace(/"/g, '""');
        return `"${cellValue}"`;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', generateUniqueFilename(filename, 'csv'));
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export orders data to PDF format
 * @param {Array} orders - Array of order objects
 * @param {string} filename - Name of the file to download
 */
export const exportToPDF = (orders, filename = 'orders') => {
  if (!orders || orders.length === 0) {
    alert('No orders to export');
    return;
  }

  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Orders Report', 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Prepare table data
  const tableData = orders.map(order => [
    order.id || '',
    order.customer?.name || '',
    order.customer?.email || '',
    new Date(order.date).toLocaleDateString() || '',
    order.status || '',
    `$${order.total?.toFixed(2) || '0.00'}`,
    order.payment?.status || ''
  ]);

  // Calculate available width for table (page width - margins)
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 14;
  const marginRight = 14;
  const tableWidth = pageWidth - marginLeft - marginRight;

  // Add table with proper width settings
  autoTable(doc, {
    startY: 35,
    head: [['Order ID', 'Customer', 'Email', 'Date', 'Status', 'Total', 'Payment']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor:[224,192,176], // Primary color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: tableWidth * 0.12, overflow: 'linebreak' }, // Order ID
      1: { cellWidth: tableWidth * 0.18, overflow: 'linebreak' }, // Customer Name
      2: { cellWidth: tableWidth * 0.25, overflow: 'linebreak' }, // Email
      3: { cellWidth: tableWidth * 0.12, overflow: 'linebreak' }, // Date
      4: { cellWidth: tableWidth * 0.12, overflow: 'linebreak' }, // Status
      5: { cellWidth: tableWidth * 0.11, overflow: 'linebreak', halign: 'right' }, // Total
      6: { cellWidth: tableWidth * 0.10, overflow: 'linebreak' }  // Payment
    },
    margin: { top: 35, left: marginLeft, right: marginRight },
    tableWidth: tableWidth,
    showHead: 'everyPage',
    pageBreak: 'auto',
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  });

  // Add summary statistics
  const totalAmount = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  let finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary', 16, finalY);
  
  finalY += 8;
  doc.setFontSize(10);
  doc.text(`Total Orders: ${orders.length}`, 14, finalY);
  finalY += 6;
  doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, finalY);
  
  finalY += 8;
  doc.text('Status Breakdown:', 16, finalY);
  finalY += 6;
  
  Object.entries(statusCounts).forEach(([status, count]) => {
    doc.text(`  ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`, 14, finalY);
    finalY += 6;
  });

  // Save PDF
  doc.save(generateUniqueFilename(filename, 'pdf'));
};

