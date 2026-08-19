import { useState } from "react";
import { LuSave, LuUpload } from "react-icons/lu";
import { paymentTermsOptions } from "@/lib/invoiceCalculations.js";

import {
  clientFromProject,
  dateInput,
  invoiceStatuses,
  paymentMethods,
  projectIdOf,
  statusLabel,
} from "./invoiceShared.js";

function Field({ label, children, className = "" }) {
  return <label className={`form-field ${className}`.trim()}><span className="form-label">{label}</span>{children}</label>;
}

export function UploadInvoiceForm({ projects, invoiceNumber, invoice, busy, onSubmit }) {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(() => ({
    projectId: projectIdOf(invoice),
    invoiceNumber: invoice?.invoiceNumber || invoiceNumber || "",
    title: invoice?.title || "",
    status: invoice?.status || "sent",
    issueDate: dateInput(invoice?.issueDate) || new Date().toISOString().slice(0, 10),
    dueDate: dateInput(invoice?.dueDate),
    total: Number(invoice?.total || 0) || "",
    currency: invoice?.currency || "CAD",
    sourceType: "uploaded",
  }));
  const [error, setError] = useState("");

  function field(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!form.projectId) return setError("Choose a client project.");
    if (!file) return setError("Choose a PDF, JPG, JPEG, PNG, or WebP invoice file.");

    const project = projects.find((item) => String(item._id) === String(form.projectId));
    try {
      await onSubmit({
        file,
        projectId: form.projectId,
        invoiceId: invoice?._id || "",
        payload: {
          ...form,
          total: Number(form.total || 0),
          clientDetails: clientFromProject(project),
        },
      });
    } catch (requestError) {
      setError(requestError?.message || "Invoice upload failed.");
    }
  }

  return (
    <form className="invoice-compact-form" onSubmit={submit}>
      <div className="invoice-form-grid">
        <Field label="Client project" className="is-wide">
          <select value={form.projectId} onChange={(event) => field("projectId", event.target.value)} required>
            <option value="">Choose a project</option>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.title} - {project.client?.name || project.clientName || "Unassigned"}</option>)}
          </select>
        </Field>
        <Field label="Invoice file" className="is-wide">
          <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} required />
          <small>PDF, JPG, JPEG, PNG, or WebP · up to 15 MB · securely relayed through MSPixelPulse</small>
        </Field>
        <Field label="Invoice number"><input value={form.invoiceNumber} onChange={(event) => field("invoiceNumber", event.target.value)} /></Field>
        <Field label="Status">
          <select value={form.status} onChange={(event) => field("status", event.target.value)}>
            {invoiceStatuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
          </select>
        </Field>
        <Field label="Title"><input value={form.title} onChange={(event) => field("title", event.target.value)} placeholder="Website project invoice" /></Field>
        <Field label="Total"><input type="number" min="0" step="0.01" inputMode="decimal" value={form.total} onChange={(event) => field("total", event.target.value)} /></Field>
        <Field label="Currency"><input maxLength="3" value={form.currency} onChange={(event) => field("currency", event.target.value.toUpperCase())} /></Field>
        <Field label="Issue date"><input type="date" value={form.issueDate} onChange={(event) => field("issueDate", event.target.value)} /></Field>
        <Field label="Due date"><input type="date" value={form.dueDate} onChange={(event) => field("dueDate", event.target.value)} /></Field>
      </div>
      {error ? <div className="text-error" role="alert">{error}</div> : null}
      <div className="invoice-sticky-actions">
        <button className="btn btn-primary" disabled={busy || !file}><LuUpload aria-hidden="true" />{busy ? "Uploading…" : invoice ? "Replace invoice file" : "Upload invoice"}</button>
      </div>
    </form>
  );
}

export function PaymentForm({ invoice, busy, onSubmit }) {
  const [form, setForm] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    method: paymentMethods[0],
    reference: "",
    note: "",
  });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (Number(form.amount || 0) <= 0) return setError("Enter a payment amount greater than zero.");
    try {
      await onSubmit({
        payments: [...(invoice.payments || []), { ...form, amount: Number(form.amount) }],
      });
    } catch (requestError) {
      setError(requestError?.message || "Payment could not be recorded.");
    }
  }

  return (
    <form className="invoice-compact-form" onSubmit={submit}>
      <div className="invoice-form-grid">
        <Field label="Amount"><input type="number" min="0.01" step="0.01" inputMode="decimal" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} required /></Field>
        <Field label="Payment date"><input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} required /></Field>
        <Field label="Method"><select value={form.method} onChange={(event) => setForm((current) => ({ ...current, method: event.target.value }))}>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></Field>
        <Field label="Reference"><input value={form.reference} onChange={(event) => setForm((current) => ({ ...current, reference: event.target.value }))} /></Field>
        <Field label="Note" className="is-wide"><textarea rows="3" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} /></Field>
      </div>
      {error ? <div className="text-error" role="alert">{error}</div> : null}
      <div className="invoice-sticky-actions"><button className="btn btn-primary" disabled={busy}><LuSave aria-hidden="true" />{busy ? "Saving…" : "Record payment"}</button></div>
    </form>
  );
}

export function InvoiceSettingsForm({ settings, busy, onSubmit }) {
  const [form, setForm] = useState(() => ({
    ...settings,
    sender: { ...(settings.sender || {}) },
    paymentMethods: [
      ["interac", "Interac e-Transfer"],
      ["bank", "Bank transfer"],
      ["remitly", "Remitly"],
      ["cheque", "Cheque"],
      ["other", "Other"],
    ].map(([key, label]) => ({
      key,
      label,
      enabled: Boolean(settings.paymentMethods?.find((method) => method.key === key)?.enabled),
      instructions: settings.paymentMethods?.find((method) => method.key === key)?.instructions || "",
    })),
  }));
  const [error, setError] = useState("");

  function field(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  function sender(key, value) { setForm((current) => ({ ...current, sender: { ...current.sender, [key]: value } })); }
  function paymentMethod(key, patch) {
    setForm((current) => ({
      ...current,
      paymentMethods: current.paymentMethods.map((method) => method.key === key ? { ...method, ...patch } : method),
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try { await onSubmit(form); } catch (requestError) { setError(requestError?.message || "Invoice defaults could not be saved."); }
  }

  return (
    <form className="invoice-compact-form" onSubmit={submit}>
      <div className="invoice-form-grid">
        <Field label="Business name"><input value={form.sender.businessName || ""} onChange={(event) => sender("businessName", event.target.value)} /></Field>
        <Field label="Contact name"><input value={form.sender.contactName || ""} onChange={(event) => sender("contactName", event.target.value)} /></Field>
        <Field label="Email"><input type="email" value={form.sender.email || ""} onChange={(event) => sender("email", event.target.value)} /></Field>
        <Field label="Phone"><input type="tel" value={form.sender.phone || ""} onChange={(event) => sender("phone", event.target.value)} /></Field>
        <Field label="Website"><input type="url" value={form.sender.website || ""} onChange={(event) => sender("website", event.target.value)} /></Field>
        <Field label="Public logo URL"><input type="text" inputMode="url" value={form.sender.logoUrl || ""} onChange={(event) => sender("logoUrl", event.target.value)} /></Field>
        <Field label="Business address" className="is-wide"><textarea rows="2" value={form.sender.address || ""} onChange={(event) => sender("address", event.target.value)} /></Field>
        <Field label="Default currency"><input maxLength="3" value={form.currency || "CAD"} onChange={(event) => field("currency", event.target.value.toUpperCase())} /></Field>
        <Field label="Default paper size"><select value={form.pageSize || "LETTER"} onChange={(event) => field("pageSize", event.target.value)}><option value="LETTER">Letter</option><option value="A4">A4</option></select></Field>
        <label className="portal-toggle-row invoice-tax-toggle"><input type="checkbox" checked={Boolean(form.chargeTax)} onChange={(event) => field("chargeTax", event.target.checked)} /><span>Charge tax by default</span></label>
        <Field label="Tax label"><input value={form.taxLabel || ""} onChange={(event) => field("taxLabel", event.target.value)} /></Field>
        <Field label="Tax percentage"><input type="number" min="0" max="100" step="0.001" value={form.taxRate || 0} onChange={(event) => field("taxRate", Number(event.target.value || 0))} /></Field>
        <Field label="Registration / business number"><input value={form.taxRegistrationNumber || ""} onChange={(event) => field("taxRegistrationNumber", event.target.value)} /></Field>
        <Field label="Custom tax note" className="is-wide"><textarea rows="2" value={form.taxNote || ""} onChange={(event) => field("taxNote", event.target.value)} /></Field>
        <Field label="Default due terms"><select value={form.defaultPaymentTermsPreset || "net_14"} onChange={(event) => field("defaultPaymentTermsPreset", event.target.value)}>{paymentTermsOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="Default payment terms" className="is-wide"><textarea rows="2" value={form.paymentTerms || ""} onChange={(event) => field("paymentTerms", event.target.value)} /></Field>
        <Field label="Default client notes" className="is-wide"><textarea rows="3" value={form.defaultNotes || ""} onChange={(event) => field("defaultNotes", event.target.value)} /></Field>
      </div>

      <section className="invoice-settings-section">
        <div className="invoice-form-section-head"><div><h3>Payment methods</h3><p>Enable only the methods you accept. Enter instructions here; no banking details are stored in source code.</p></div></div>
        <div className="invoice-payment-method-settings">
          {form.paymentMethods.map((method) => (
            <div className="invoice-payment-method-row" key={method.key}>
              <label className="portal-toggle-row">
                <input type="checkbox" checked={method.enabled} onChange={(event) => paymentMethod(method.key, { enabled: event.target.checked })} />
                <span>{method.label}</span>
              </label>
              <Field label={`${method.label} instructions`}>
                <textarea rows="2" value={method.instructions} onChange={(event) => paymentMethod(method.key, { instructions: event.target.value })} disabled={!method.enabled} placeholder="Add the secure payment instructions shown on invoices" />
              </Field>
            </div>
          ))}
        </div>
      </section>

      <section className="invoice-settings-section">
        <div className="invoice-form-section-head"><div><h3>PDF payment footer</h3><p>Professional copy included in generated invoices.</p></div></div>
        <div className="invoice-form-grid">
          <Field label="Payment notice" className="is-wide"><textarea rows="2" value={form.paymentNotice || ""} onChange={(event) => field("paymentNotice", event.target.value)} /></Field>
          <Field label="Default payment reference" className="is-wide"><input value={form.paymentReference || ""} onChange={(event) => field("paymentReference", event.target.value)} placeholder="Optional reference applied to new invoices" /></Field>
          <Field label="Scope terms" className="is-wide"><textarea rows="3" value={form.scopeTerms || ""} onChange={(event) => field("scopeTerms", event.target.value)} /></Field>
          <Field label="Refund terms" className="is-wide"><textarea rows="3" value={form.refundTerms || ""} onChange={(event) => field("refundTerms", event.target.value)} /></Field>
          <Field label="Closing message" className="is-wide"><textarea rows="2" value={form.closingMessage || ""} onChange={(event) => field("closingMessage", event.target.value)} /></Field>
          <Field label="Footer text" className="is-wide"><input value={form.footerText || ""} onChange={(event) => field("footerText", event.target.value)} /></Field>
          <label className="portal-toggle-row invoice-tax-toggle"><input type="checkbox" checked={form.showPageNumbers !== false} onChange={(event) => field("showPageNumbers", event.target.checked)} /><span>Show PDF page numbers</span></label>
        </div>
      </section>
      <p className="invoice-form-note">Tax is optional. No sample GST/HST or small-supplier statement is applied unless you enter it here.</p>
      {error ? <div className="text-error" role="alert">{error}</div> : null}
      <div className="invoice-sticky-actions"><button className="btn btn-primary" disabled={busy}><LuSave aria-hidden="true" />{busy ? "Saving…" : "Save invoice defaults"}</button></div>
    </form>
  );
}
