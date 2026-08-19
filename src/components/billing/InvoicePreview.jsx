import { invoiceTotals } from "@/lib/invoicePdf.js";
import { paymentStageLabel, paymentTermsLabel } from "@/lib/invoiceCalculations.js";
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
        <div><dt>Payment stage</dt><dd>{paymentStageLabel(invoice.paymentStage, invoice.kind)}</dd></div>
        <div><dt>Project value</dt><dd>{formatMoney(invoice.projectValue || totals.subtotal, currency)}</dd></div>
        <div><dt>Due terms</dt><dd>{paymentTermsLabel(invoice.paymentTermsPreset)}</dd></div>
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

      <div className="invoice-paper-status-row">
        <div className="invoice-paper-status">Status: {statusLabel(invoice.status)}</div>
        <div className="invoice-paper-status">{paymentStageLabel(invoice.paymentStage, invoice.kind)} invoice</div>
      </div>
      {invoice.paymentTerms || invoice.notes || invoice.taxNote ? (
        <div className="invoice-paper-notes">
          <strong>Notes</strong>
          {invoice.paymentTerms ? <p>{invoice.paymentTerms}</p> : null}
          {invoice.taxNote ? <p>{invoice.taxNote}</p> : null}
          {invoice.notes ? <p>{invoice.notes}</p> : null}
        </div>
      ) : null}
      {invoice.paymentNotice || invoice.paymentReference || invoice.paymentMethods?.some((method) => method.enabled) ? (
        <section className="invoice-paper-payment">
          <strong>Payment information</strong>
          {invoice.paymentNotice ? <p>{invoice.paymentNotice}</p> : null}
          {invoice.paymentReference ? <p><b>Reference:</b> {invoice.paymentReference}</p> : null}
          {invoice.paymentMethods?.filter((method) => method.enabled).map((method) => (
            <p key={method.key}><b>{method.label}:</b> {method.instructions || "Contact MSPixelPulse for secure payment instructions."}</p>
          ))}
        </section>
      ) : null}
      {invoice.scopeTerms || invoice.refundTerms ? (
        <section className="invoice-paper-terms">
          <strong>Terms</strong>
          {invoice.scopeTerms ? <p>{invoice.scopeTerms}</p> : null}
          {invoice.refundTerms ? <p>{invoice.refundTerms}</p> : null}
        </section>
      ) : null}
      {invoice.closingMessage ? <p className="invoice-paper-closing">{invoice.closingMessage}</p> : null}
      <footer>{invoice.footerText || "MSPixelPulse · Toronto, Ontario, Canada"}{invoice.showPageNumbers !== false ? " · Page 1" : ""}</footer>
    </article>
  );
}
