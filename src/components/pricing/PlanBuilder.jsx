import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuClipboardCheck,
  LuCodeXml,
  LuGraduationCap,
  LuLayoutTemplate,
  LuPencilRuler,
  LuSettings2,
  LuShoppingBag,
  LuWrench,
} from "react-icons/lu";
import {
  maintenanceOptions,
  pageSizeOptions,
  planAddons,
  planBuilderServices,
  pricingModes,
} from "@/data/plans.js";
import {
  buildPlanSearchParams,
  buildPlanSummary,
  calculatePlanEstimate,
  loadPlanDraft,
  savePlanDraft,
  sanitizeBuilderSelection,
} from "@/lib/planBuilder.js";
import { trackEvent } from "@/lib/analytics.js";
import Button from "@/components/ui/Button.jsx";

const serviceIcons = {
  "new-website": LuLayoutTemplate,
  redesign: LuPencilRuler,
  ecommerce: LuShoppingBag,
  wordpress: LuWrench,
  moodle: LuGraduationCap,
  maintenance: LuSettings2,
  "custom-development": LuCodeXml,
};

const stepLabels = ["Service", "Page size", "Add-ons", "Estimate"];

export default function PlanBuilder({ preset, startSignal }) {
  const navigate = useNavigate();
  const initialDraftRef = useRef(null);
  const stageRef = useRef(null);
  const initialStepRenderRef = useRef(true);
  if (!initialDraftRef.current) initialDraftRef.current = loadPlanDraft();
  const [step, setStep] = useState(() => initialDraftRef.current.step || 1);
  const [selection, setSelection] = useState(() => sanitizeBuilderSelection(initialDraftRef.current));
  const startedRef = useRef(false);
  const estimateViewedRef = useRef("");
  const estimate = useMemo(() => calculatePlanEstimate(selection), [selection]);
  const summary = useMemo(() => buildPlanSummary(selection), [selection]);

  useEffect(() => {
    if (initialStepRenderRef.current) {
      initialStepRenderRef.current = false;
      return undefined;
    }
    const frame = window.requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  useEffect(() => {
    if (!startSignal?.requestId) return undefined;
    markStarted(startSignal.source);
    const frame = window.requestAnimationFrame(() => stageRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [startSignal]);

  useEffect(() => {
    if (!preset?.serviceId) return;
    const presetService = planBuilderServices.find((service) => service.id === preset.serviceId);
    setSelection((current) => {
      const next = sanitizeBuilderSelection({
        ...current,
        serviceId: preset.serviceId,
        pageSizeId: preset.pageSizeId || current.pageSizeId,
        addonIds: presetService?.mode === pricingModes.HOURLY ? [] : current.addonIds,
        maintenanceId: presetService?.mode === pricingModes.HOURLY ? "none" : current.maintenanceId,
      });
      savePlanDraft(next, preset.pageSizeId ? 3 : 2);
      return next;
    });
    setStep(preset.pageSizeId ? 3 : 2);
    markStarted("pricing_card");
    trackEvent("pricing_service_selected", {
      service_type: preset.serviceId,
      selection_source: "pricing_card",
    });
  }, [preset]);

  useEffect(() => {
    savePlanDraft(selection, step);
  }, [selection, step]);

  function markStarted(source = "builder") {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("pricing_builder_start", { builder_source: source });
  }

  function selectService(serviceId) {
    markStarted();
    const service = planBuilderServices.find((item) => item.id === serviceId);
    setSelection((current) => sanitizeBuilderSelection({
      ...current,
      serviceId,
      addonIds: service?.mode === pricingModes.HOURLY ? [] : current.addonIds,
      maintenanceId: service?.mode === pricingModes.HOURLY ? "none" : current.maintenanceId,
    }));
    trackEvent("pricing_service_selected", { service_type: serviceId });
  }

  function toggleAddon(addonId) {
    markStarted();
    const selected = selection.addonIds.includes(addonId);
    setSelection((current) => ({
      ...current,
      addonIds: selected
        ? current.addonIds.filter((id) => id !== addonId)
        : [...current.addonIds, addonId],
    }));
    trackEvent("pricing_addon_selected", {
      addon_type: addonId,
      selection_state: selected ? "removed" : "added",
    });
  }

  function goToStep(nextStep) {
    markStarted();
    setStep(nextStep);
    if (nextStep === 4 && estimate.service) {
      const signature = `${estimate.service.id}:${selection.pageSizeId}:${selection.addonIds.join(",")}:${selection.maintenanceId}`;
      if (estimateViewedRef.current !== signature) {
        estimateViewedRef.current = signature;
        trackEvent("pricing_estimate_view", {
          service_type: estimate.service.id,
          pricing_mode: estimate.kind,
          addon_count: estimate.addons.length,
        });
      }
    }
  }

  function requestQuote() {
    if (!summary) return;
    savePlanDraft(selection, 4);
    trackEvent("pricing_quote_request", {
      service_type: summary.service.id,
      pricing_mode: summary.kind,
      addon_count: summary.addons.length,
      maintenance_choice: summary.maintenance.id,
    });
    navigate(`/contact?${buildPlanSearchParams(selection).toString()}`);
  }

  const canContinue = step === 1 ? Boolean(selection.serviceId) : step === 2 ? Boolean(selection.pageSizeId) : true;
  const hourlyService = estimate.kind === pricingModes.HOURLY;
  const customService = estimate.kind === pricingModes.CUSTOM;

  return (
    <section id="plan-builder" className="plan-builder" aria-labelledby="plan-builder-title">
      <header className="plan-builder-header">
        <div>
          <p className="demo-eyebrow">Custom plan builder</p>
          <h2 id="plan-builder-title">Build a practical website plan</h2>
          <p>Choose what you need and carry the complete summary into the inquiry form.</p>
        </div>
        <span className="plan-builder-time">About 2 minutes</span>
      </header>

      <ol className="plan-builder-progress" aria-label="Plan builder progress">
        {stepLabels.map((label, index) => {
          const number = index + 1;
          const complete = number < step;
          return (
            <li key={label} className={number === step ? "is-current" : complete ? "is-complete" : ""} aria-current={number === step ? "step" : undefined}>
              <span>{complete ? <LuCheck aria-hidden="true" /> : number}</span>
              <small>{label}</small>
            </li>
          );
        })}
      </ol>

      <div
        ref={stageRef}
        className="plan-builder-stage"
        key={step}
        role="region"
        aria-label={`Step ${step} of 4: ${stepLabels[step - 1]}`}
        tabIndex="-1"
      >
        {step === 1 && (
          <fieldset className="builder-fieldset">
            <legend>What kind of help do you need?</legend>
            <p className="builder-hint">Choose the closest option. The final scope can be refined together.</p>
            <div className="builder-choice-grid builder-service-grid">
              {planBuilderServices.map((service) => {
                const Icon = serviceIcons[service.id];
                return (
                  <label key={service.id} className={selection.serviceId === service.id ? "builder-choice is-selected" : "builder-choice"}>
                    <input type="radio" name="builder-service" value={service.id} checked={selection.serviceId === service.id} onChange={() => selectService(service.id)} />
                    <Icon aria-hidden="true" />
                    <span><strong>{service.label}</strong><small>{service.description}</small></span>
                    <LuCheck className="builder-choice-check" aria-hidden="true" />
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="builder-fieldset">
            <legend>How many pages are involved?</legend>
            <p className="builder-hint">For maintenance or redesigns, count the pages you expect us to review or change.</p>
            <div className="builder-choice-grid builder-scope-grid">
              {pageSizeOptions.map((option) => (
                <label key={option.id} className={selection.pageSizeId === option.id ? "builder-choice is-selected" : "builder-choice"}>
                  <input type="radio" name="builder-page-size" value={option.id} checked={selection.pageSizeId === option.id} onChange={() => setSelection((current) => ({ ...current, pageSizeId: option.id }))} />
                  <span><strong>{option.label}</strong><small>{option.description}</small></span>
                  <LuCheck className="builder-choice-check" aria-hidden="true" />
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <div className="builder-step-stack">
            <fieldset className="builder-fieldset">
              <legend>Would any of these help?</legend>
              <p className="builder-hint">Optional add-ons are transparent planning allowances. Third-party fees are separate.</p>
              {hourlyService ? (
                <div className="builder-scope-notice" role="note">
                  <strong>Routine maintenance stays hourly.</strong>
                  <p>Approved small updates are billed at $25 CAD per hour. New features, integrations, large content work, and other development are quoted separately—describe those needs in the final notes step.</p>
                </div>
              ) : (
                <div className="builder-choice-grid builder-addon-grid">
                  {planAddons.map((addon) => (
                    <label key={addon.id} className={selection.addonIds.includes(addon.id) ? "builder-choice is-selected" : "builder-choice"}>
                      <input type="checkbox" checked={selection.addonIds.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
                      <span>
                        <strong>{addon.label}</strong>
                        <small>{addon.description}</small>
                        <em>{customService ? "Scoped in written quote" : `+$${addon.price.toLocaleString("en-CA")} CAD`}</em>
                      </span>
                      <LuCheck className="builder-choice-check" aria-hidden="true" />
                    </label>
                  ))}
                </div>
              )}
            </fieldset>

            {!hourlyService && <fieldset className="builder-fieldset builder-maintenance-fieldset">
              <legend>Post-launch maintenance</legend>
              <div className="builder-maintenance-options">
                {maintenanceOptions.map((option) => (
                  <label key={option.id} className={selection.maintenanceId === option.id ? "builder-maintenance-option is-selected" : "builder-maintenance-option"}>
                    <input type="radio" name="builder-maintenance" value={option.id} checked={selection.maintenanceId === option.id} onChange={() => setSelection((current) => ({ ...current, maintenanceId: option.id }))} />
                    <span><strong>{option.label}</strong><small>{option.description}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>}
          </div>
        )}

        {step === 4 && summary && (
          <div className="builder-summary-layout">
            <section className="builder-summary-card" aria-labelledby="builder-summary-title">
              <div className="builder-summary-icon" aria-hidden="true"><LuClipboardCheck /></div>
              <p className="demo-eyebrow">Your planning estimate</p>
              <h3 id="builder-summary-title">{summary.label}</h3>
              <p className="builder-estimate-note">
                {summary.kind === pricingModes.CUSTOM
                  ? "Custom development needs discovery before a precise total can be responsible."
                  : summary.kind === pricingModes.HOURLY
                    ? "Maintenance is billed for actual approved work. No project total is implied."
                    : "This is a planning estimate, not a final quote or contract."}
              </p>
              <h4>Estimate breakdown</h4>
              <dl className="builder-estimate-breakdown">
                {summary.lineItems.map((item) => (
                  <div key={`${item.label}-${item.value}`}><dt>{item.label}</dt><dd>{item.value}</dd></div>
                ))}
              </dl>
              <dl>
                <div><dt>Project</dt><dd>{summary.service.label}</dd></div>
                <div><dt>Page size</dt><dd>{summary.pageSize?.label || "Not sure yet"}</dd></div>
                <div><dt>Add-ons</dt><dd>{summary.addons.length ? summary.addons.map((addon) => addon.label).join(", ") : "None selected"}</dd></div>
                <div><dt>Maintenance</dt><dd>{summary.maintenance.label}</dd></div>
              </dl>
            </section>

            <div className="builder-notes-card">
              <label htmlFor="builder-notes">Anything we should know? <small>(optional)</small></label>
              <textarea id="builder-notes" rows="6" maxLength="500" placeholder="For example: existing website, course migration, booking needs, or a preferred launch window." value={selection.notes} onChange={(event) => setSelection((current) => ({ ...current, notes: event.target.value }))} />
              <small>{selection.notes.length}/500</small>
              <Button type="button" size="lg" onClick={requestQuote}>
                Request My Quote <LuArrowRight aria-hidden="true" />
              </Button>
              <p>Your choices and notes will be attached to the contact form, so you will not need to enter them again.</p>
            </div>
          </div>
        )}
      </div>

      <footer className="plan-builder-actions">
        {step > 1 ? (
          <button type="button" className="builder-back" onClick={() => goToStep(step - 1)}>
            <LuArrowLeft aria-hidden="true" /> Back
          </button>
        ) : <span />}
        {step < 4 && (
          <Button type="button" disabled={!canContinue} onClick={() => goToStep(step + 1)}>
            Continue <LuArrowRight aria-hidden="true" />
          </Button>
        )}
      </footer>
    </section>
  );
}
