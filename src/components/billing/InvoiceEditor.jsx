import { useMemo, useState } from "react";
import {
  LuArrowDown,
  LuArrowUp,
  LuDownload,
  LuEye,
  LuFileCheck2,
  LuPlus,
  LuTrash2,
} from "react-icons/lu";

import { generateInvoicePdfFile, invoiceTotals } from "@/lib/invoicePdf.js";
import InvoicePreview from "./InvoicePreview.jsx";
import {
  clientFromProject,
  draftFromInvoice,
  formatMoney,
  invoiceDraft,
  invoicePayload,
  invoiceStatuses,
  statusLabel,
} from "./invoiceShared.js";

function Field({ label, children, className = "" }) {
  return (
    <label className={`form-field ${className}`.trim()}>
      <span className="form-label">{label}</span>
      {children}
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
        <Field label="Business / company">
          <input value={value.businessName || ""} onChange={(event) => field("businessName", event.target.value)} />
        </Field>
        <Field label="Contact name">
          <input value={value.contactName || ""} onChange={(event) => field("contactName", event.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" value={value.email || ""} onChange={(event) => field("email", event.target.value)} />
        </Field>
        <Field label="Phone">
          <input type="tel" value={value.phone || ""} onChange={(event) => field("phone", event.target.value)} />
        </Field>
        <Field label="Address" className="is-wide">
          <textarea rows="2" value={value.address || ""} onChange={(event) => field("address", event.target.value)} />
        </Field>
        {includeLogo ? (
          <>
            <Field label="Website">
              <input type="url" value={value.website || ""} onChange={(event) => field("website", event.target.value)} />
            </Field>
            <Field label="Public logo URL">
              <input type="text" inputMode="url" value={value.logoUrl || ""} onChange={(event) => field("logoUrl", event.target.value)} />
            </Field>
          </>
        ) : null}
      </div>
    </details>
  );
}

export default function InvoiceEditor({
  projects,
  settings,
  invoiceNumber,
  invoice,
  busy,
  onSubmit,
}) {
  const initialProject = projects.find((project) => String(project._id) === String(invoice?.project?._id || invoice?.project || ""));
  const [draft, setDraft] = useState(() => invoice
    ? draftFromInvoice(invoice, initialProject)
    : invoiceDraft({ settings, invoiceNumber, project: initialProject }));
  const [pane, setPane] = useState("editor");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const totals = useMemo(() => invoiceTotals(draft), [draft]);
  const isExternal = Boolean(invoice) && invoice?.sourceType !== "generated";

  function setField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function selectProject(projectId) {
    const project = projects.find((item) => String(item._id) === String(projectId));
    setDraft((current) => ({
      ...current,
      projectId,
      projectTitle: project?.title || "",
      title: current.projectId
        ? current.title
        : (project?.title ? `${project.title} services` : "Professional website services"),
      clientDetails: clientFromProject(project),
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

  function moveLineItem(index, direction) {
    setDraft((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.lineItems.length) return current;
      const next = [...current.lineItems];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, lineItems: next };
    });
  }

  function removeLineItem(index) {
    setDraft((current) => ({
      ...current,
      lineItems: current.lineItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function validate() {
    if (!draft.projectId) return "Choose a client project.";
    if (!draft.invoiceNumber.trim()) return "Invoice number is required.";
    if (!draft.clientDetails?.contactName && !draft.clientDetails?.businessName) return "Client name or company is required.";
    if (!draft.lineItems.length || draft.lineItems.some((item) => !item.description.trim())) return "Every line item needs a description.";
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
    if (message) {
      setError(message);
      return;
    }

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
          <section className="invoice-form-section">
            <div className="invoice-form-grid">
              <Field label="Client project" className="is-wide">
                <select value={draft.projectId} onChange={(event) => selectProject(event.target.value)} required>
                  <option value="">Choose a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title} - {project.client?.name || project.clientName || "Unassigned client"}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Invoice number">
                <input value={draft.invoiceNumber} onChange={(event) => setField("invoiceNumber", event.target.value)} required />
              </Field>
              <Field label="Status">
                <select value={draft.status} onChange={(event) => setField("status", event.target.value)}>
                  {invoiceStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                </select>
              </Field>
              <Field label="Issue date">
                <input type="date" value={draft.issueDate} onChange={(event) => setField("issueDate", event.target.value)} required />
              </Field>
              <Field label="Due date">
                <input type="date" value={draft.dueDate} onChange={(event) => setField("dueDate", event.target.value)} required />
              </Field>
              <Field label="Currency">
                <input value={draft.currency} maxLength="3" onChange={(event) => setField("currency", event.target.value.toUpperCase())} />
              </Field>
              <Field label="Paper size">
                <select value={draft.pageSize} onChange={(event) => setField("pageSize", event.target.value)}>
                  <option value="LETTER">Letter</option>
                  <option value="A4">A4</option>
                </select>
              </Field>
            </div>
          </section>

          <PartyFields title="Sender details" value={draft.sender} onChange={(value) => setField("sender", value)} includeLogo />
          <PartyFields title="Client details" value={draft.clientDetails} onChange={(value) => setField("clientDetails", value)} />

          <section className="invoice-form-section">
            <div className="invoice-form-section-head"><div><h3>Line items</h3><p>Add, remove, or reorder services.</p></div></div>
            <div className="invoice-line-items">
              {draft.lineItems.map((item, index) => (
                <div className="invoice-line-item" key={`line-${index}`}>
                  <Field label={`Description ${index + 1}`} className="invoice-line-description">
                    <input value={item.description} onChange={(event) => updateLineItem(index, "description", event.target.value)} />
                  </Field>
                  <Field label="Quantity">
                    <input type="number" min="0" step="0.01" inputMode="decimal" value={item.quantity} onChange={(event) => updateLineItem(index, "quantity", event.target.value)} />
                  </Field>
                  <Field label="Rate">
                    <input type="number" min="0" step="0.01" inputMode="decimal" value={item.unitPrice} onChange={(event) => updateLineItem(index, "unitPrice", event.target.value)} />
                  </Field>
                  <div className="invoice-line-total"><span>Amount</span><strong>{formatMoney(Number(item.quantity || 0) * Number(item.unitPrice || 0), draft.currency)}</strong></div>
                  <div className="invoice-line-actions">
                    <button type="button" className="portal-icon-button" onClick={() => moveLineItem(index, -1)} disabled={index === 0} aria-label={`Move ${item.description || `line ${index + 1}`} up`}><LuArrowUp aria-hidden="true" /></button>
                    <button type="button" className="portal-icon-button" onClick={() => moveLineItem(index, 1)} disabled={index === draft.lineItems.length - 1} aria-label={`Move ${item.description || `line ${index + 1}`} down`}><LuArrowDown aria-hidden="true" /></button>
                    <button type="button" className="portal-icon-button danger" onClick={() => removeLineItem(index)} disabled={draft.lineItems.length === 1} aria-label={`Remove ${item.description || `line ${index + 1}`} `}><LuTrash2 aria-hidden="true" /></button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-outline" onClick={() => setField("lineItems", [...draft.lineItems, { description: "", quantity: 1, unitPrice: 0 }])}>
              <LuPlus aria-hidden="true" /> Add line item
            </button>
          </section>

          <section className="invoice-form-section">
            <div className="invoice-form-grid">
              <Field label="Discount amount">
                <input type="number" min="0" step="0.01" value={draft.discountAmount} onChange={(event) => setField("discountAmount", Number(event.target.value || 0))} />
              </Field>
              <label className="portal-toggle-row invoice-tax-toggle">
                <input type="checkbox" checked={draft.chargeTax} onChange={(event) => setField("chargeTax", event.target.checked)} />
                <span>Charge tax</span>
              </label>
              {draft.chargeTax ? (
                <>
                  <Field label="Tax label"><input value={draft.taxLabel} onChange={(event) => setField("taxLabel", event.target.value)} /></Field>
                  <Field label="Tax percentage"><input type="number" min="0" max="100" step="0.001" value={draft.taxRate} onChange={(event) => setField("taxRate", Number(event.target.value || 0))} /></Field>
                  <Field label="Registration / business number"><input value={draft.taxRegistrationNumber} onChange={(event) => setField("taxRegistrationNumber", event.target.value)} /></Field>
                  <Field label="Custom tax note"><input value={draft.taxNote} onChange={(event) => setField("taxNote", event.target.value)} /></Field>
                </>
              ) : null}
              <Field label="Payment terms" className="is-wide"><textarea rows="2" value={draft.paymentTerms} onChange={(event) => setField("paymentTerms", event.target.value)} /></Field>
              <Field label="Client notes" className="is-wide"><textarea rows="3" value={draft.notes} onChange={(event) => setField("notes", event.target.value)} /></Field>
              <Field label="Internal notes (Admin only)" className="is-wide"><textarea rows="2" value={draft.internalNotes} onChange={(event) => setField("internalNotes", event.target.value)} /></Field>
            </div>
          </section>

          <dl className="invoice-editor-totals">
            <div><dt>Subtotal</dt><dd>{formatMoney(totals.subtotal, draft.currency)}</dd></div>
            <div><dt>Tax</dt><dd>{formatMoney(totals.taxAmount, draft.currency)}</dd></div>
            <div><dt>Total</dt><dd>{formatMoney(totals.total, draft.currency)}</dd></div>
            <div><dt>Balance</dt><dd>{formatMoney(totals.balanceDue, draft.currency)}</dd></div>
          </dl>
        </div>

        <div className={`invoice-preview-column ${pane === "editor" ? "is-mobile-hidden" : ""}`}>
          <InvoicePreview invoice={{ ...draft, ...totals }} />
        </div>
      </div>

      {error ? <div className="text-error" role="alert">{error}</div> : null}
      {isExternal ? <p className="invoice-form-note">This is an uploaded external file. Saving updates its billing metadata without replacing the original document.</p> : null}
      <div className="invoice-sticky-actions">
        {!isExternal ? (
          <button type="button" className="btn btn-outline" onClick={downloadPreview} disabled={busy || generating}>
            <LuDownload aria-hidden="true" /> Download preview PDF
          </button>
        ) : null}
        <button className="btn btn-primary" disabled={busy || generating}>
          <LuFileCheck2 aria-hidden="true" />
          {generating ? "Preparing invoice…" : invoice ? (isExternal ? "Save metadata" : "Save & replace PDF") : "Create & upload"}
        </button>
      </div>
    </form>
  );
}
