import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from '@/types/product';
import creamyBubbleLogo from '@/assets/creamy-bubble-logo.png';

interface CustomerData {
  name: string;
  phone: string;
  address: string;
  vehicleNo: string;
  deliveryNote: string;
}

interface BillerInfo {
  name: string;
  email: string;
}

// Sanitize text to prevent injection attacks in PDF
const sanitizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  return String(text)
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 500); // Limit length
};

export const generateBillPDF = (cartItems: CartItem[], totalAmount: number, customerData: CustomerData, billerInfo: BillerInfo) => {
  const doc = new jsPDF();
  
  // Sanitize all customer inputs
  const safeName = sanitizeText(customerData.name);
  const safePhone = sanitizeText(customerData.phone);
  const safeAddress = sanitizeText(customerData.address);
  const safeVehicleNo = sanitizeText(customerData.vehicleNo);
  const safeDeliveryNote = sanitizeText(customerData.deliveryNote);
  const safeBillerName = sanitizeText(billerInfo.name);
  const safeBillerEmail = sanitizeText(billerInfo.email);
  
  // Add logo at top-left (with error handling)
  try {
    if (creamyBubbleLogo) {
      doc.addImage(creamyBubbleLogo, 'PNG', 15, 10, 30, 30);
      
      // Add watermark logo at center with low transparency
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const watermarkSize = 80;
      const watermarkX = (pageWidth - watermarkSize) / 2;
      const watermarkY = (pageHeight - watermarkSize) / 2;
      
      doc.saveGraphicsState();
      doc.setGState({ opacity: 0.1 });
      doc.addImage(creamyBubbleLogo, 'PNG', watermarkX, watermarkY, watermarkSize, watermarkSize);
      doc.restoreGraphicsState();
    }
  } catch (error) {
    console.warn('Could not load logo image:', error);
    // Continue without logo if image fails to load
  }
  
  // Company Header with Logo
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SRI KARTHIKEYA FROZEN FOODS', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Opp Bus Stand, 4-107/2, Beside DP Restaurant', 105, 30, { align: 'center' });
  doc.text('Attilli, West Godavari, Andhra Pradesh, 534134', 105, 36, { align: 'center' });
  doc.text('Legal Name: GOKARAKONDA CHAITANYA', 105, 42, { align: 'center' });
  doc.text('GSTIN: 37DZVPK8712C1ZY', 105, 48, { align: 'center' });
  
  // Bill Details - Right aligned
  const billDate = new Date().toLocaleDateString('en-IN');
  const billNo = `SKF${Date.now()}`;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone: +91 9133363104, +91 9848222534`, 190, 58, { align: 'right' });
  doc.text(`Bill No: ${billNo}`, 190, 65, { align: 'right' });
  doc.text(`Date: ${billDate}`, 190, 72, { align: 'right' });
  
  // Customer information section (using sanitized data)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let customerY = 83;
  doc.text(`To: ${safeName}`, 20, customerY);
  customerY += 7;
  doc.text(`Phone: ${safePhone}`, 20, customerY);
  
  if (safeAddress) {
    customerY += 7;
    doc.text(`Address: ${safeAddress}`, 20, customerY);
  }
  
  if (safeVehicleNo) {
    customerY += 7;
    doc.text(`Vehicle No: ${safeVehicleNo}`, 20, customerY);
  }
  
  if (safeDeliveryNote) {
    customerY += 7;
    doc.text(`Delivery Note: ${safeDeliveryNote}`, 20, customerY);
  }
  
  const tableStartY = customerY + 10;
  
  // Table data - calculate subtotal, GST, and final total
  const subtotal = totalAmount;
  const sgst = subtotal * 0.025; // 2.5%
  const cgst = subtotal * 0.025; // 2.5%
  const finalTotal = Math.round(subtotal + sgst + cgst);
  
  const tableData = cartItems.map((item, index) => [
    index + 1,
    item.name,
    item.quantity,
    `${item.price}`,
    `${item.price * item.quantity}`
  ]);
  
  // Add subtotal, GST rows
  const totalGst = sgst + cgst;
  tableData.push(['', 'SUBTOTAL', '', '', `${subtotal.toFixed(2)}`]);
  tableData.push(['', 'SGST @ 2.5% + CGST @ 2.5%', '', `${sgst.toFixed(2)} + ${cgst.toFixed(2)}`, `${totalGst.toFixed(2)}`]);
  tableData.push(['', 'GRAND TOTAL', '', '', `${finalTotal}`]);
  
  // AutoTable with proper column widths
  autoTable(doc, {
    startY: tableStartY,
    head: [['Sl.No', 'PARTICULARS', 'QTY', 'RATE', 'AMOUNT Rs. P']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      fontSize: 9
    },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    margin: { left: 20, right: 20 },
    tableWidth: 'wrap',
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { halign: 'left', cellWidth: 70 },
      2: { halign: 'center', cellWidth: 15 },
      3: { halign: 'right', cellWidth: 25 },
      4: { halign: 'right', cellWidth: 25 }
    },
    didParseCell: function(data) {
      // Make subtotal and total rows bold
      const subtotalStartIndex = cartItems.length;
      if (data.row.index >= subtotalStartIndex) {
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });
  
  // Total Amount Section
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT', 20, finalY);
  
  // Draw box around total amount
  doc.rect(120, finalY - 8, 50, 15);
  doc.setFontSize(12);
  const formattedTotal = finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  doc.text(`Rs. ${formattedTotal}`, 145, finalY + 2, { align: 'center' });
  
  // Biller Information (using sanitized data)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Billed By: ${safeBillerName}`, 20, finalY + 15);
  doc.text(`Email: ${safeBillerEmail}`, 20, finalY + 21);
  
  // Terms and Conditions
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Terms and Conditions', 20, finalY + 33);
  
  // Company signature section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('For Sri Karthikeya Frozen Foods', 130, finalY + 43);
  
  // Authorized Signatory
  doc.text('Authorised Signatory', 130, finalY + 63);
  doc.line(130, finalY + 66, 190, finalY + 66);
  
  // Download PDF
  try {
    doc.save(`Sri_Karthikeya_Bill_${billNo}.pdf`);
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};
