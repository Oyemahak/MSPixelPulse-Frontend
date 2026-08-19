import { useMemo, useState } from "react";
import { LuDownload, LuEye, LuFileCheck2, LuPlus, LuTrash2 } from "react-icons/lu";

import {
  defaultPaymentPercent,
  dueDateForTerms,
  invoiceAmountForStage,
  paymentStageOptions,
  paymentTermsLabel,
  paymentTermsOptions,
} from "@/lib/invoiceCalculations.js";
import { generateInvoicePdfFile, invoiceTotals } from "@/lib/invoicePdf.js";
import InvoicePreview from "./InvoicePreview.jsx";
import {
  clientFromProject,
  draftFromInvoice,
  formatDate,
  formatMoney,
  invoiceDraft,
  invoicePayload,
  invoiceStatuses,
  statusLabel,
} from "./invoiceShared.js";

function Field({ label, children, className = "", hint = "" }) {
  return (
    <label className={`form-field ${className}`.trim()}>
      <span className="form-label">{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

function PartyFields({ title, value, onChange, includeLogo = false }) {
  function field(key, next) {
    onChange({ ...value, [key]: next });
  }

  return (
    <details className="invoice-form-details">
      <summary>{title}</summary>
      <div className="invoice-form-grid">
        <Field label="Business / company"><input value={value.businessName || ""} onChange={(event) => field("businessName", event.target.value)} /></Field>
        <Field label="Contact name"><input value={value.contactName || ""} onChange={(event) => field("contactName", event.target.value)} /></Field>
        <Field label="Email"><input type="email" value={value.email || ""} onChange={(event) => field("email", event.target.value)} /></Field>
        <Field label="Phone"><input type="tel" value={value.phone || ""} onChange={(event) => field("phone", event.target.value)} /></Field>
        <Field label="Address" className="is-wide"><textarea rows="2" value={value.address || ""} onChange={(event) => field("address", event.target.value)} /></Field>
        {includeLogo ? (
          <>
            <Field label="Website"><input type="url" value={value.website || ""} onChange={(event) => field("website", event.target.value)} /></Field>
            <Field label="Public logo URL"><input type="text" inputMode="url" value={value.logoUrl || ""} onChange={(event) => field("logoUrl", event.target.value)} /></Field>
          </>
        ) : null}
      </div>
    </details>
  );
}

export default function InvoiceEditor({ projects, settings, invoiceNumber, invoice, busy, onSubmit }) {
  const initialProject = projects.find((project) => String(project._id) === String(invoice?.project?._id || invoice?.project || ""));
  const [draft, setDraft] = useState(() => invoice
    ? draftFromInvoice(invoice, initialProject)
    : invoiceDraft({ settings, invoiceNumber, project: initialProject }));
  const [pane, setPane] = useState("editor");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const totals = useMemo(() => invoiceTotals(draft), [draft]);
  const isExternal = Boolean(invoice) && invoice?.sourceType !== "generated";
  const primaryItem = draft.lineItems[0] || { description: "Professional website services", quantity: 1, unitPrice: 0 };

  function workflowAmount(value) {
    return invoiceAmountForStage({
      projectValue: value.projectValue,
      paymentStage: value.paymentStage,
      paymentPercent: value.paymentPercent,
      customAmount: value.paymentStage === "other" || value.customPaymentMode === "amount" ? value.customAmount : 0,
    });
  }

  function updateWorkflow(patch) {
    setDraft((current) => {
      const next = { ...current, ...patch };
      const amount = workflowAmount(next);
      const currentPrimary = current.lineItems[0] || primaryItem;
      return {
        ...next,
        lineItems: [{ ...currentPrimary, quantity: 1, unitPrice: amount }, ...current.lineItems.slice(1)],
      };
    });
  }

  function setField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function selectProject(projectId) {
    const project = projects.find((item) => String(item._id) === String(projectId));
    setDraft((current) => ({
      ...current,
      projectId,
      projectTitle: project?.title || "",
      title: current.projectId ? current.title : (project?.title ? `${project.title} services` : "Professional website services"),
      clientDetails: clientFromProject(project),
    }));
  }

  function updatePrimaryDescription(value) {
    setDraft((current) => ({
      ...current,
      lineItems: [{ ...(current.lineItems[0] || primaryItem), description: value }, ...current.lineItems.slice(1)],
    }));
  }

  function updateLineItem(index, key, value) {
    setDraft((current) => ({
      ...current,
      lineItems: current.lineItems.map((item, itemIndex) => itemIndex === index
        ? { ...item, [key]: key === "description" ? value : Number(value || 0) }
        : item),
    }));
  }

  function removeLineItem(index) {
    setDraft((current) => ({ ...current, lineItems: current.lineItems.filter((_, itemIndex) => itemIndex !== index) }));
  }

  function setPaymentStage(paymentStage) {
    updateWorkflow({
      paymentStage,
      paymentPercent: defaultPaymentPercent(paymentStage),
      customAmount: paymentStage === "other" ? draft.customAmount : 0,
      customPaymentMode: paymentStage === "custom" ? "percentage" : draft.customPaymentMode,
    });
  }

  function setIssueDate(issueDate) {
    setDraft((current) => ({
      ...current,
      issueDate,
      dueDate: current.paymentTermsPreset === "custom" ? current.dueDate : dueDateForTerms(issueDate, current.paymentTermsPreset),
    }));
  }

  function setTermsPreset(paymentTermsPreset) {
    setDraft((current) => ({
      ...current,
      paymentTermsPreset,
      dueDate: paymentTermsPreset === "custom" ? current.dueDate : dueDateForTerms(current.issueDate, paymentTermsPreset),
    }));
  }

  function validate() {
    if (!draft.projectId) return "Choose a client project.";
    if (!draft.invoiceNumber.trim()) return "Invoice number is required.";
    if (!draft.clientDetails?.contactName && !draft.clientDetails?.businessName) return "Client name or company is required.";
    if (!draft.lineItems.length || draft.lineItems.some((item) => !item.description.trim())) return "Every line item needs a description.";
    if (Number(draft.projectValue || 0) <= 0) return "Project value must be greater than zero.";
    if (totals.total <= 0) return "Invoice total must be greater than zero.";
    return "";
  }

  async function createPdf() {
    const message = validate();
    if (message) throw new Error(message);
    return generateInvoicePdfFile({ ...draft, ...totals });
  }

  async function downloadPreview() {
    setError("");
    setGenerating(true);
    try {
      const file = await createPdf();
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (requestError) {
      setError(requestError?.message || "PDF preview could not be generated.");
    } finally {
      setGenerating(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    const message = validate();
    if (message) return setError(message);

    setGenerating(true);
    try {
      const payload = invoicePayload(draft);
      const file = isExternal ? null : await generateInvoicePdfFile({ ...draft, ...payload });
      await onSubmit({ draft, payload, file, invoice });
    } catch (requestError) {
      setError(requestError?.message || "Invoice could not be saved.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <form className="invoice-workspace" onSubmit={submit}>
      <div className="invoice-workspace-tabs" role="group" aria-label="Invoice workspace view">
        <button type="button" aria-pressed={pane === "editor"} onClick={() => setPane("editor")}>Editor</button>
        <button type="button" aria-pressed={pane === "preview"} onClick={() => setPane("preview")}><LuEye aria-hidden="true" /> Preview</button>
      </div>

      <div className="invoice-workspace-grid">
        <div className={`invoice-form-column ${pane === "preview" ? "is-mobile-hidden" : ""}`}>
          <section className="invoice-form-section invoice-quick-create">
            <div className="invoice-form-section-head">
              <div><h3>Quick invoice</h3><p>Choose the project and payment stage. The invoice amount and due date calculate automatically.</p></div>
            </div>
            <div className="invoice-form-grid">
              <Field label="Client project" className="is-wide">
                <select value={draft.projectId} onChange={(event) => selectProject(event.target.value)} required>
                  <option value="">Choose a project</option>
                  {projects.map((project) => <option key={project._id} value={project._id}>{project.title} - {project.client?.name || project.clientName || "Unassigned client"}</option>)}
                </select>
              </Field>
              <Field label="Payment stage">
                <select value={draft.paymentStage} onChange={(event) => setPaymentStage(event.target.value)}>
                  {paymentStageOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label="Total project value" hint={`All values in ${draft.currency || "CAD"}.`}>
                <input type="number" min="0" step="0.01" inputMode="decimal" value={draft.projectValue || ""} onChange={(event) => updateWorkflow({ projectValue: Number(event.target.value || 0) })} required />
              </Field>
              {draft.paymentStage === "custom" ? (
                <>
                  <Field label="Custom calculation">
                    <select value={draft.customPaymentMode} onChange={(event) => updateWorkflow({ customPaymentMode: event.target.value, customAmount: 0 })}>
                      <option value="percentage">Percentage</option>
                      <option value="amount">Exact amount</option>
                    </select>
                  </Field>
                  {draft.customPaymentMode === "percentage" ? (
                    <Field label="Payment percentage"><input type="number" min="0.001" max="100" step="0.001" inputMode="decimal" value={draft.paymentPercent || ""} onChange={(event) => updateWorkflow({ paymentPercent: Number(event.target.value || 0) })} /></Field>
                  ) : (
                    <Field label="Custom invoice amount"><input type="number" min="0.01" step="0.01" inputMode="decimal" value={draft.customAmount || ""} onChange={(event) => updateWorkflow({ customAmount: Number(event.target.value || 0), paymentPercent: 0 })} /></Field>
                  )}
                </>
              ) : null}
              {draft.paymentStage === "other" ? (
                <Field label="Invoice amount"><input type="number" min="0.01" step="0.01" inputMode="decimal" value={draft.customAmount || ""} onChange={(event) => updateWorkflow({ customAmount: Number(event.target.value || 0), paymentPercent: 0 })} /></Field>
              ) : (
                <Field label="Calculated invoice amount"><output className="invoice-calculated-amount">{formatMoney(workflowAmount(draft), draft.currency)}</output></Field>
              )}
              <Field label="Description" className="is-wide"><input value={primaryItem.description} onChange={(event) => updatePrimaryDescription(event.target.value)} placeholder="Website design and development" /></Field>
              <Field label="Discount amount"><input type="number" min="0" step="0.01" inputMode="decimal" value={draft.discountAmount || ""} onChange={(event) => setField("discountAmount", Number(event.target.value || 0))} /></Field>
              <Field label="Payment terms">
                <select value={draft.paymentTermsPreset} onChange={(event) => setTermsPreset(event.target.value)}>
                  {paymentTermsOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label="Due date" hint={draft.paymentTermsPreset === "custom" ? "Choose the agreed date." : "Calculated from the issue date."}>
                <input type="date" value={draft.dueDate} onChange={(event) => setField("dueDate", event.target.value)} readOnly={draft.paymentTermsPreset !== "custom"} required />
              </Field>
              {draft.dueDate ? (
                <output className="invoice-due-summary is-wide">
                  {paymentTermsLabel(draft.paymentTermsPreset)} · Due {formatDate(draft.dueDate)}
                </output>
              ) : null}
            </div>
          </section>

          <details className="invoice-advanced" open={Boolean(invoice)}>
            <summary>Advanced invoice details</summary>
            <div className="invoice-advanced-content">
              <section className="invoice-form-section">
                <div className="invoice-form-grid">
                  <Field label="Invoice number"><input value={draft.invoiceNumber} onChange={(event) => setField("invoiceNumber", event.target.value)} required /></Field>
                  <Field label="Status"><select value={draft.status} onChange={(event) => setField("status", event.target.value)}>{invoiceStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select></Field>
                  <Field label="Issue date"><input type="date" value={draft.issueDate} onChange={(event) => setIssueDate(event.target.value)} required /></Field>
                  <Field label="Currency"><input value={draft.currency} maxLength="3" onChange={(event) => setField("currency", event.target.value.toUpperCase())} /></Field>
                  <Field label="Paper size"><select value={draft.pageSize} onChange={(event) => setField("pageSize", event.target.value)}><option value="LETTER">Letter</option><option value="A4">A4</option></select></Field>
                </div>
              </section>

              <PartyFields title="Sender details" value={draft.sender} onChange={(value) => setField("sender", value)} includeLogo />
              <PartyFields title="Client details" value={draft.clientDetails} onChange={(value) => setField("clientDetails", value)} />

              <section className="invoice-form-section">
                <div className="invoice-form-section-head"><div><h3>Additional items</h3><p>Add optional services beyond the primary payment-stage amount.</p></div></div>
                <div className="invoice-line-items">
                  {draft.lineItems.slice(1).map((item, offset) => {
                    const index = offset + 1;
                    return (
                      <div className="invoice-line-item" key={`line-${index}`}>
                        <Field label={`Description ${index + 1}`} className="invoice-line-description"><input value={item.description} onChange={(event) => updateLineItem(index, "description", event.target.value)} /></Field>
                        <Field label="Quantity"><input type="number" min="0" step="0.01" inputMode="decimal" value={item.quantity} onChange={(event) => updateLineItem(index, "quantity", event.target.value)} /></Field>
                        <Field label="Rate"><input type="number" min="0" step="0.01" inputMode="decimal" value={item.unitPrice} onChange={(event) => updateLineItem(index, "unitPrice", event.target.value)} /></Field>
                        <div className="invoice-line-total"><span>Amount</span><strong>{formatMoney(Number(item.quantity || 0) * Number(item.unitPrice || 0), draft.currency)}</strong></div>
                        <div className="invoice-line-actions"><button type="button" className="portal-icon-button danger" onClick={() => removeLineItem(index)} aria-label={`Remove ${item.description || `line ${index + 1}`}`}><LuTrash2 aria-hidden="true" /></button></div>
                      </div>
                    );
                  })}
                </div>
                <button type="button" className="btn btn-outline" onClick={() => setField("lineItems", [...draft.lineItems, { description: "", quantity: 1, unitPrice: 0 }])}><LuPlus aria-hidden="true" /> Add item</button>
              </section>

              <section className="invoice-form-section">
                <div className="invoice-form-grid">
                  <label className="portal-toggle-row invoice-tax-toggle"><input type="checkbox" checked={draft.chargeTax} onChange={(event) => setField("chargeTax", event.target.checked)} /><span>Charge tax</span></label>
                  {draft.chargeTax ? (
                    <>
                      <Field label="Tax label"><input value={draft.taxLabel} onChange={(event) => setField("taxLabel", event.target.value)} /></Field>
                      <Field label="Tax percentage"><input type="number" min="0" max="100" step="0.001" value={draft.taxRate} onChange={(event) => setField("taxRate", Number(event.target.value || 0))} /></Field>
                      <Field label="Registration / business number"><input value={draft.taxRegistrationNumber} onChange={(event) => setField("taxRegistrationNumber", event.target.value)} /></Field>
                      <Field label="Custom tax note"><input value={draft.taxNote} onChange={(event) => setField("taxNote", event.target.value)} /></Field>
                    </>
                  ) : null}
                  <Field label="Payment terms copy" className="is-wide"><textarea rows="2" value={draft.paymentTerms} onChange={(event) => setField("paymentTerms", event.target.value)} /></Field>
                  <Field label="Payment notice" className="is-wide"><textarea rows="2" value={draft.paymentNotice} onChange={(event) => setField("paymentNotice", event.target.value)} /></Field>
                  <Field label="Payment reference" className="is-wide"><input value={draft.paymentReference} onChange={(event) => setField("paymentReference", event.target.value)} placeholder="Optional invoice-specific reference" /></Field>
                  <Field label="Scope terms" className="is-wide"><textarea rows="2" value={draft.scopeTerms} onChange={(event) => setField("scopeTerms", event.target.value)} /></Field>
                  <Field label="Refund terms" className="is-wide"><textarea rows="2" value={draft.refundTerms} onChange={(event) => setField("refundTerms", event.target.value)} /></Field>
                  <Field label="Closing message" className="is-wide"><textarea rows="2" value={draft.closingMessage} onChange={(event) => setField("closingMessage", event.target.value)} /></Field>
                  <Field label="Client notes" className="is-wide"><textarea rows="3" value={draft.notes} onChange={(event) => setField("notes", event.target.value)} /></Field>
                  <Field label="Internal notes (Admin only)" className="is-wide"><textarea rows="2" value={draft.internalNotes} onChange={(event) => setField("internalNotes", event.target.value)} /></Field>
                </div>
              </section>
            </div>
          </details>

          <dl className="invoice-editor-totals">
            <div><dt>Project value</dt><dd>{formatMoney(draft.projectValue, draft.currency)}</dd></div>
            <div><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal, draft.currency)}</dd></div>
            {totals.discountAmount ? <div><dt>Discount</dt><dd>- {formatMoney(totals.discountAmount, draft.currency)}</dd></div> : null}
            <div><dt>Tax</dt><dd>{formatMoney(totals.taxAmount, draft.currency)}</dd></div>
            <div><dt>Total</dt><dd>{formatMoney(totals.total, draft.currency)}</dd></div>
            <div><dt>Balance</dt><dd>{formatMoney(totals.balanceDue, draft.currency)}</dd></div>
          </dl>
        </div>

        <div className={`invoice-preview-column ${pane === "editor" ? "is-mobile-hidden" : ""}`}><InvoicePreview invoice={{ ...draft, ...totals }} /></div>
      </div>

      {error ? <div className="text-error" role="alert">{error}</div> : null}
      {isExternal ? <p className="invoice-form-note">This is an uploaded external file. Saving updates its billing metadata without replacing the original document.</p> : null}
      <div className="invoice-sticky-actions">
        {!isExternal ? <button type="button" className="btn btn-outline" onClick={downloadPreview} disabled={busy || generating}><LuDownload aria-hidden="true" /> Download preview PDF</button> : null}
        <button className="btn btn-primary" disabled={busy || generating}><LuFileCheck2 aria-hidden="true" />{generating ? "Preparing invoice…" : invoice ? (isExternal ? "Save metadata" : "Save & replace PDF") : "Create & upload"}</button>
      </div>
    </form>
  );
}
