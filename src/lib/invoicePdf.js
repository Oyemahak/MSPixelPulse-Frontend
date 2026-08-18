const PAGE_SIZES = {
  LETTER: [612, 792],
  A4: [595.28, 841.89],
};

function ascii(value) {
  const normalized = String(value ?? "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...");

  return Array.from(normalized, (character) => {
    const code = character.charCodeAt(0);
    return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126)
      ? character
      : " ";
  }).join("")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function money(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
}

function currency(value, code = "CAD") {
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: String(code || "CAD").toUpperCase(),
    }).format(money(value));
  } catch {
    return `${money(value).toFixed(2)} ${ascii(code || "CAD")}`;
  }
}

function dateLabel(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function wrapText(text, font, size, maxWidth) {
  const paragraphs = ascii(text).split(/\n+/);
  const lines = [];

  paragraphs.forEach((paragraph, paragraphIndex) => {
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";

    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
        return;
      }

      if (line) lines.push(line);
      line = word;
    });

    if (line) lines.push(line);
    if (paragraphIndex < paragraphs.length - 1) lines.push("");
  });

  return lines.length ? lines : [""];
}

async function logoImage(pdfDoc, logoUrl) {
  if (!logoUrl || typeof document === "undefined") return null;

  try {
    const response = await fetch(logoUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    const bytes = await blob.arrayBuffer();

    if (blob.type === "image/png") return pdfDoc.embedPng(bytes);
    if (blob.type === "image/jpeg") return pdfDoc.embedJpg(bytes);

    const sourceUrl = URL.createObjectURL(blob);
    try {
      const image = new Image();
      image.decoding = "async";
      image.src = sourceUrl;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 320;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const png = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (output) => output ? resolve(output) : reject(new Error("Logo conversion failed")),
          "image/png",
        );
      });
      return pdfDoc.embedPng(await png.arrayBuffer());
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  } catch {
    return null;
  }
}

export function invoiceTotals(invoice = {}) {
  const lineItems = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
  const subtotal = lineItems.length
    ? lineItems.reduce(
        (sum, item) => sum + money(item.quantity || 0) * money(item.unitPrice ?? item.rate),
        0,
      )
    : money(invoice.subtotal || invoice.total);
  const discountAmount = Math.min(money(invoice.discountAmount), subtotal);
  const chargeTax = Boolean(invoice.chargeTax);
  const taxRate = chargeTax ? Math.min(money(invoice.taxRate), 100) : 0;
  const taxAmount = chargeTax ? (subtotal - discountAmount) * taxRate / 100 : 0;
  const total = subtotal - discountAmount + taxAmount;
  const paymentTotal = Array.isArray(invoice.payments) && invoice.payments.length
    ? invoice.payments.reduce((sum, payment) => sum + money(payment.amount), 0)
    : money(invoice.amountPaid);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    amountPaid: Math.round(paymentTotal * 100) / 100,
    balanceDue: Math.round(Math.max(total - paymentTotal, 0) * 100) / 100,
  };
}

export async function generateInvoicePdfBytes(invoice = {}) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pageSize = PAGE_SIZES[String(invoice.pageSize || "LETTER").toUpperCase()] || PAGE_SIZES.LETTER;
  const margin = 42;
  const blue = rgb(0.145, 0.388, 1);
  const navy = rgb(0.035, 0.071, 0.13);
  const slate = rgb(0.28, 0.34, 0.43);
  const muted = rgb(0.52, 0.58, 0.67);
  const line = rgb(0.86, 0.89, 0.94);
  const soft = rgb(0.955, 0.97, 0.99);
  const white = rgb(1, 1, 1);
  const totals = invoiceTotals(invoice);
  const logo = await logoImage(pdfDoc, invoice.sender?.logoUrl);
  let page;
  let y;

  pdfDoc.setTitle(ascii(`${invoice.invoiceNumber || "Invoice"} - MSPixelPulse`));
  pdfDoc.setAuthor(ascii(invoice.sender?.businessName || "MSPixelPulse"));
  pdfDoc.setSubject(ascii(invoice.title || "Professional services invoice"));
  pdfDoc.setCreator("MSPixelPulse Billing");
  pdfDoc.setProducer("MSPixelPulse Billing");
  pdfDoc.setCreationDate(new Date());
  pdfDoc.setModificationDate(new Date());

  function addPage(continued = false) {
    page = pdfDoc.addPage(pageSize);
    const width = page.getWidth();
    const height = page.getHeight();
    page.drawRectangle({ x: 0, y: height - 9, width, height: 9, color: blue });
    y = height - margin;

    if (continued) {
      page.drawText(ascii(invoice.sender?.businessName || "MSPixelPulse"), {
        x: margin,
        y,
        size: 13,
        font: bold,
        color: navy,
      });
      page.drawText(`${ascii(invoice.invoiceNumber || "Invoice")} - continued`, {
        x: width - margin - 150,
        y,
        size: 9,
        font: regular,
        color: slate,
      });
      y -= 30;
    }
  }

  function ensureSpace(required) {
    if (y - required < 62) addPage(true);
  }

  function drawLines(text, options = {}) {
    const size = options.size || 9;
    const leading = options.leading || size * 1.45;
    const maxWidth = options.maxWidth || page.getWidth() - margin * 2;
    const lines = wrapText(text, options.font || regular, size, maxWidth);
    ensureSpace(lines.length * leading + 2);
    lines.forEach((value) => {
      page.drawText(value || " ", {
        x: options.x ?? margin,
        y,
        size,
        font: options.font || regular,
        color: options.color || slate,
      });
      y -= leading;
    });
    return lines.length;
  }

  function drawRight(text, right, baseline, options = {}) {
    const size = options.size || 8.5;
    const font = options.font || regular;
    const value = ascii(text);
    page.drawText(value, {
      x: right - font.widthOfTextAtSize(value, size),
      y: baseline,
      size,
      font,
      color: options.color || slate,
    });
  }

  addPage(false);
  const width = page.getWidth();
  const height = page.getHeight();

  if (logo) {
    page.drawImage(logo, { x: margin, y: height - 92, width: 42, height: 42 });
  } else {
    page.drawRectangle({ x: margin, y: height - 90, width: 38, height: 38, color: blue });
    page.drawText("MS", { x: margin + 8, y: height - 77, size: 13, font: bold, color: white });
  }

  page.drawText(ascii(invoice.sender?.businessName || "MSPixelPulse"), {
    x: margin + 52,
    y: height - 64,
    size: 16,
    font: bold,
    color: navy,
  });
  page.drawText("WEB DESIGN & DEVELOPMENT", {
    x: margin + 52,
    y: height - 79,
    size: 7.5,
    font: bold,
    color: blue,
  });
  page.drawText("INVOICE", {
    x: width - margin - 120,
    y: height - 68,
    size: 24,
    font: bold,
    color: navy,
  });
  page.drawText(ascii(invoice.invoiceNumber || "Draft"), {
    x: width - margin - 120,
    y: height - 86,
    size: 9,
    font: regular,
    color: slate,
  });
  y = height - 116;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: line });
  y -= 24;

  const columnGap = 26;
  const columnWidth = (width - margin * 2 - columnGap) / 2;
  const senderLines = [
    invoice.sender?.contactName,
    invoice.sender?.address,
    invoice.sender?.phone,
    invoice.sender?.email,
    invoice.sender?.website,
  ].filter(Boolean).join("\n");
  const clientLines = [
    invoice.clientDetails?.contactName,
    invoice.clientDetails?.businessName,
    invoice.clientDetails?.address,
    invoice.clientDetails?.phone,
    invoice.clientDetails?.email,
  ].filter(Boolean).join("\n");
  page.drawText("FROM", { x: margin, y, size: 7.5, font: bold, color: blue });
  page.drawText("BILL TO", { x: margin + columnWidth + columnGap, y, size: 7.5, font: bold, color: blue });
  y -= 15;
  const fromLines = wrapText(senderLines, regular, 8.5, columnWidth);
  const billLines = wrapText(clientLines, regular, 8.5, columnWidth);
  const partyStartY = y;
  fromLines.forEach((value, index) => page.drawText(value || " ", {
    x: margin,
    y: partyStartY - index * 13,
    size: 8.5,
    font: regular,
    color: slate,
  }));
  billLines.forEach((value, index) => page.drawText(value || " ", {
    x: margin + columnWidth + columnGap,
    y: partyStartY - index * 13,
    size: 8.5,
    font: regular,
    color: slate,
  }));
  y -= Math.max(fromLines.length, billLines.length, 2) * 13 + 18;

  page.drawRectangle({ x: margin, y: y - 42, width: width - margin * 2, height: 50, color: soft });
  const meta = [
    ["ISSUE DATE", dateLabel(invoice.issueDate)],
    ["DUE DATE", dateLabel(invoice.dueDate)],
    ["PROJECT", ascii(invoice.projectTitle || invoice.title || "Professional services")],
    ["CURRENCY", ascii(invoice.currency || "CAD")],
  ];
  const metaWidth = (width - margin * 2) / meta.length;
  meta.forEach(([label, value], index) => {
    const x = margin + index * metaWidth + 10;
    page.drawText(label, { x, y: y - 8, size: 6.5, font: bold, color: muted });
    const clipped = value.length > 26 ? `${value.slice(0, 25)}...` : value;
    page.drawText(clipped, { x, y: y - 25, size: 8.5, font: bold, color: navy });
  });
  y -= 64;

  function drawTableHeader() {
    page.drawRectangle({ x: margin, y: y - 22, width: width - margin * 2, height: 26, color: navy });
    page.drawText("DESCRIPTION", { x: margin + 10, y: y - 12, size: 7, font: bold, color: white });
    drawRight("QTY", width - margin - 156, y - 12, { size: 7, font: bold, color: white });
    drawRight("RATE", width - margin - 76, y - 12, { size: 7, font: bold, color: white });
    drawRight("AMOUNT", width - margin - 8, y - 12, { size: 7, font: bold, color: white });
    y -= 31;
  }

  drawTableHeader();
  const items = Array.isArray(invoice.lineItems) && invoice.lineItems.length
    ? invoice.lineItems
    : [{ description: invoice.title || "Professional services", quantity: 1, unitPrice: totals.total }];

  items.forEach((item, index) => {
    const descriptionLines = wrapText(item.description || "Service", regular, 8.5, width - margin * 2 - 190);
    const rowHeight = Math.max(28, descriptionLines.length * 12 + 12);
    if (y - rowHeight < 72) {
      addPage(true);
      drawTableHeader();
    }
    if (index % 2 === 1) {
      page.drawRectangle({ x: margin, y: y - rowHeight + 4, width: width - margin * 2, height: rowHeight, color: soft });
    }
    descriptionLines.forEach((value, lineIndex) => page.drawText(value, {
      x: margin + 10,
      y: y - 10 - lineIndex * 12,
      size: 8.5,
      font: regular,
      color: slate,
    }));
    const qty = money(item.quantity || 0).toFixed(2).replace(/\.00$/, "");
    const rate = currency(item.unitPrice ?? item.rate, invoice.currency);
    const amount = currency(money(item.quantity || 0) * money(item.unitPrice ?? item.rate), invoice.currency);
    drawRight(qty, width - margin - 156, y - 10, { size: 8.5, font: regular, color: slate });
    drawRight(rate, width - margin - 76, y - 10, { size: 8.5, font: regular, color: slate });
    drawRight(amount, width - margin - 8, y - 10, { size: 8.5, font: bold, color: navy });
    y -= rowHeight;
    page.drawLine({ start: { x: margin, y: y + 3 }, end: { x: width - margin, y: y + 3 }, thickness: 0.5, color: line });
  });

  ensureSpace(170);
  y -= 12;
  const totalsX = width - margin - 205;
  const totalRows = [
    ["Subtotal", currency(totals.subtotal, invoice.currency)],
    ...(totals.discountAmount ? [["Discount", `- ${currency(totals.discountAmount, invoice.currency)}`]] : []),
    ...(invoice.chargeTax ? [[`${ascii(invoice.taxLabel || "Tax")} (${money(invoice.taxRate)}%)`, currency(totals.taxAmount, invoice.currency)]] : []),
    ["Total", currency(totals.total, invoice.currency)],
    ...(totals.amountPaid ? [["Amount paid", `- ${currency(totals.amountPaid, invoice.currency)}`]] : []),
  ];
  totalRows.forEach(([label, value]) => {
    page.drawText(label, { x: totalsX, y, size: label === "Total" ? 9 : 8.5, font: label === "Total" ? bold : regular, color: slate });
    drawRight(value, width - margin, y, { size: label === "Total" ? 9 : 8.5, font: label === "Total" ? bold : regular, color: navy });
    y -= 17;
  });
  page.drawRectangle({ x: totalsX - 10, y: y - 25, width: width - margin - totalsX + 10, height: 38, color: blue });
  page.drawText("BALANCE DUE", { x: totalsX, y: y - 9, size: 8, font: bold, color: white });
  drawRight(currency(totals.balanceDue, invoice.currency), width - margin - 10, y - 9, { size: 10, font: bold, color: white });
  y -= 54;

  const status = ascii(String(invoice.status || "draft").replaceAll("_", " ").toUpperCase());
  page.drawText(`STATUS: ${status}`, { x: margin, y, size: 8, font: bold, color: blue });
  y -= 20;

  const notes = [
    invoice.paymentTerms ? `Payment terms: ${invoice.paymentTerms}` : "",
    invoice.taxRegistrationNumber ? `${invoice.taxLabel || "Tax"} registration: ${invoice.taxRegistrationNumber}` : "",
    invoice.taxNote,
    invoice.notes,
  ].filter(Boolean);
  if (notes.length) {
    page.drawText("NOTES", { x: margin, y, size: 7.5, font: bold, color: blue });
    y -= 15;
    notes.forEach((note) => {
      drawLines(note, { size: 8, leading: 11.5, maxWidth: width - margin * 2 - 18 });
      y -= 5;
    });
  }

  const pages = pdfDoc.getPages();
  pages.forEach((currentPage, index) => {
    const currentWidth = currentPage.getWidth();
    currentPage.drawLine({
      start: { x: margin, y: 42 },
      end: { x: currentWidth - margin, y: 42 },
      thickness: 0.5,
      color: line,
    });
    currentPage.drawText("mspixelpulse.com | info@mspixelpulse.com", {
      x: margin,
      y: 27,
      size: 7,
      font: regular,
      color: muted,
    });
    currentPage.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: currentWidth - margin - 52,
      y: 27,
      size: 7,
      font: regular,
      color: muted,
    });
  });

  return pdfDoc.save({ useObjectStreams: false });
}

export async function generateInvoicePdfFile(invoice = {}) {
  const bytes = await generateInvoicePdfBytes(invoice);
  const name = ascii(invoice.invoiceNumber || "MSPixelPulse-Invoice").replace(/[^A-Za-z0-9._-]+/g, "-");
  return new File([bytes], `${name}.pdf`, { type: "application/pdf" });
}
