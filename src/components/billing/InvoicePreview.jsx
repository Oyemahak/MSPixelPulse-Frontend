import { invoiceTotals } from "@/lib/invoicePdf.js";
import { formatDate, formatMoney, statusLabel } from "./invoiceShared.js";

function Party({ label, party = {} }) {
  const lines = [
    party.contactName,
    party.businessName,
    party.address,
    party.phone,
    party.email,
    party.website,
  ].filter(Boolean);

  return (
    <div className="invoice-preview-party">
      <span>{label}</span>
      {lines.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}
    </div>
  );
}

export default function InvoicePreview({ invoice }) {
  const totals = invoiceTotals(invoice);
  const currency = invoice.currency || "CAD";

  return (
    <article className="invoice-paper" aria-label="Invoice preview">
      <header className="invoice-paper-head">
        <div className="invoice-paper-brand">
          {invoice.sender?.logoUrl ? <img src={invoice.sender.logoUrl} alt="" /> : <span>MS</span>}
          <div><strong>{invoice.sender?.businessName || "MSPixelPulse"}</strong><small>Web design &amp; development</small></div>
        </div>
        <div className="invoice-paper-title"><strong>INVOICE</strong><span>{invoice.invoiceNumber || "Draft"}</span></div>
      </header>

      <div className="invoice-paper-parties">
        <Party label="From" party={invoice.sender} />
        <Party label="Bill to" party={invoice.clientDetails} />
      </div>

      <dl className="invoice-paper-meta">
        <div><dt>Issue date</dt><dd>{formatDate(invoice.issueDate)}</dd></div>
        <div><dt>Due date</dt><dd>{formatDate(invoice.dueDate)}</dd></div>
        <div><dt>Project</dt><dd>{invoice.projectTitle || invoice.title || "Professional services"}</dd></div>
        <div><dt>Currency</dt><dd>{currency}</dd></div>
      </dl>

      <table className="invoice-paper-table">
        <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>
          {(invoice.lineItems || []).map((item, index) => (
            <tr key={`${item.description}-${index}`}>
              <td>{item.description || "Service"}</td>
              <td>{Number(item.quantity || 0)}</td>
              <td>{formatMoney(item.unitPrice, currency)}</td>
              <td>{formatMoney(Number(item.quantity || 0) * Number(item.unitPrice || 0), currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-paper-totals">
        <div><span>Subtotal</span><strong>{formatMoney(totals.subtotal, currency)}</strong></div>
        {totals.discountAmount ? <div><span>Discount</span><strong>- {formatMoney(totals.discountAmount, currency)}</strong></div> : null}
        {invoice.chargeTax ? <div><span>{invoice.taxLabel || "Tax"} ({Number(invoice.taxRate || 0)}%)</span><strong>{formatMoney(totals.taxAmount, currency)}</strong></div> : null}
        <div><span>Total</span><strong>{formatMoney(totals.total, currency)}</strong></div>
        {totals.amountPaid ? <div><span>Paid</span><strong>- {formatMoney(totals.amountPaid, currency)}</strong></div> : null}
        <div className="invoice-paper-balance"><span>Balance due</span><strong>{formatMoney(totals.balanceDue, currency)}</strong></div>
      </div>

      <div className="invoice-paper-status">Status: {statusLabel(invoice.status)}</div>
      {invoice.paymentTerms || invoice.notes || invoice.taxNote ? (
        <div className="invoice-paper-notes">
          <strong>Notes</strong>
          {invoice.paymentTerms ? <p>{invoice.paymentTerms}</p> : null}
          {invoice.taxNote ? <p>{invoice.taxNote}</p> : null}
          {invoice.notes ? <p>{invoice.notes}</p> : null}
        </div>
      ) : null}
      <footer>mspixelpulse.com · info@mspixelpulse.com</footer>
    </article>
  );
}

