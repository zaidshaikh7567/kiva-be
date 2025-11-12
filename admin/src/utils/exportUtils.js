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

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const formatCurrency = (value = 0) => currencyFormatter.format(Number(value) || 0);

const parseCurrency = (value = '') => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeOrder = (order = {}) => {
  if (!order || typeof order !== 'object') {
    return {
      OrderID: '',
      Customer: '',
      Email: '',
      Phone: '',
      Date: '',
      Status: '',
      Total: formatCurrency(0),
      PaymentMethod: '',
      PaymentStatus: '',
      ShippingAddress: '',
      Items: '',
      Notes: '',
      ItemCount: 0,
      TotalAmount: 0,
    };
  }

  // If already in normalized shape (OrderID etc.)
  if (order.OrderID || order.Customer || order.Total) {
    const totalAmount =
      order.TotalAmount !== undefined
        ? order.TotalAmount
        : parseCurrency(order.Total || order.total);

    return {
      OrderID: order.OrderID || order.id || '',
      Customer: order.Customer || order.customer || '',
      Email: order.Email || order.email || '',
      Phone: order.Phone || order.phone || '',
      Date: order.Date || order.date || '',
      Status: order.Status || order.status || '',
      Total: order.Total || formatCurrency(totalAmount),
      PaymentMethod: order.PaymentMethod || order.paymentMethod || '',
      PaymentStatus: order.PaymentStatus || order.paymentStatus || '',
      ShippingAddress: order.ShippingAddress || order.shippingAddress || '',
      Items: order.Items || order.items || '',
      Notes: order.Notes || order.notes || '',
      ItemCount: order.ItemCount || order.itemCount || 0,
      TotalAmount: totalAmount,
    };
  }

  // Raw order object from API
  const shipping = order.shippingAddress || order.shipping || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const customerName =
    order.user?.name ||
    [shipping.firstName, shipping.lastName].filter(Boolean).join(' ') ||
    'Customer';
  const customerEmail = order.user?.email || shipping.email || '';
  const customerPhone = order.user?.phone || shipping.phone || '';
  const orderDate = order.createdAt || order.date || '';
  const status = order.status || 'pending';
  const paymentMethod = order.payment?.method || order.paymentMethod || '';
  const paymentStatus = order.payment?.status || order.paymentStatus || '';
  const totalAmount =
    order.totals?.total ||
    order.finalTotal ||
    order.total ||
    parseCurrency(order.Total);

  const shippingAddress = [
    shipping.street,
    shipping.city,
    shipping.state,
    shipping.zipCode,
    shipping.country,
  ]
    .filter(Boolean)
    .join(', ');

  const itemsSummary = items
    .map((item) => {
      const product = item.product || {};
      const name = item.productName || product.title || product.name || 'Product';
      const quantity = item.quantity || 1;
      const unitPrice = item.unitPrice || item.price || product.price || 0;
      const totalPrice =
        item.totalPrice || item.calculatedPrice || unitPrice * quantity;
      return `${name} (Qty: ${quantity}, Total: ${formatCurrency(totalPrice)})`;
    })
    .join('; ');

  return {
    OrderID: order.orderNumber || order._id || order.id || '',
    Customer: customerName,
    Email: customerEmail,
    Phone: customerPhone,
    Date: orderDate ? new Date(orderDate).toLocaleDateString() : '',
    Status: status,
    Total: formatCurrency(totalAmount),
    PaymentMethod: paymentMethod,
    PaymentStatus: paymentStatus,
    ShippingAddress: shippingAddress,
    Items: itemsSummary,
    Notes: order.notes || '',
    ItemCount: items.length,
    TotalAmount: totalAmount,
  };
};

const normalizeOrders = (orders = []) =>
  orders.map((order) => normalizeOrder(order));

/**
 * Export orders data to CSV format
 * @param {Array} orders - Array of order objects (raw or normalized)
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (orders, filename = 'orders') => {
  if (!Array.isArray(orders) || orders.length === 0) {
    alert('No orders to export');
    return;
  }

  const normalizedOrders = normalizeOrders(orders);
  const headers = Object.keys(normalizedOrders[0]).filter(
    (key) => key !== 'TotalAmount'
  );

  const rows = normalizedOrders.map((order) =>
    headers.map((header) => order[header] ?? '')
  );

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
  if (!Array.isArray(orders) || orders.length === 0) {
    alert('No orders to export');
    return;
  }

  const normalizedOrders = normalizeOrders(orders);

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
  const tableData = normalizedOrders.map((order) => [
    order.OrderID,
    order.Customer,
    order.Email,
    order.Date,
    order.Status,
    order.Total,
    order.PaymentStatus,
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
  const totalAmount = normalizedOrders.reduce(
    (sum, order) => sum + (order.TotalAmount || 0),
    0
  );
  const statusCounts = normalizedOrders.reduce((acc, order) => {
    const status = order.Status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
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

