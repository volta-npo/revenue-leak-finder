export const domain = {
    "kind": "funnel-calculator",
    "title": "Revenue Leak Finder Funnel Calculator",
    "purpose": "A purpose-built funnel calculator interface for a guided analysis workbook for spotting where a small business is losing sales online.",
    "inputTitle": "Product-specific inputs",
    "previewTitle": "Generated working outputs",
    "tableTitle": "Funnel hypotheses",
    "metricLabels": [
        "Leak Priority",
        "Revenue Impact",
        "Experiment Readiness"
    ],
    "fields": [
        {
            "id": "organization-client",
            "label": "Organization / client",
            "type": "text",
            "sample": "Eastside Youth Arts Collective",
            "placeholder": "Enter organization / client"
        },
        {
            "id": "primary-goal",
            "label": "Primary goal",
            "type": "text",
            "sample": "revenue hypotheses converted into experiments",
            "placeholder": "Enter primary goal"
        },
        {
            "id": "owner-reviewer",
            "label": "Owner / reviewer",
            "type": "text",
            "sample": "Volta project lead",
            "placeholder": "Enter owner / reviewer"
        },
        {
            "id": "evidence-source",
            "label": "Evidence source",
            "type": "text",
            "sample": "Owner interview + public audit",
            "placeholder": "Enter evidence source"
        },
        {
            "id": "monthly-volume",
            "label": "Monthly volume",
            "type": "number",
            "sample": 120,
            "placeholder": "Enter monthly volume"
        },
        {
            "id": "minutes-per-item",
            "label": "Minutes per item",
            "type": "number",
            "sample": 15,
            "placeholder": "Enter minutes per item"
        },
        {
            "id": "dollar-value-cost",
            "label": "Dollar value / cost",
            "type": "number",
            "sample": 45,
            "placeholder": "Enter dollar value / cost"
        },
        {
            "id": "confidence-percent",
            "label": "Confidence percent",
            "type": "number",
            "sample": 80,
            "placeholder": "Enter confidence percent"
        }
    ],
    "rows": [
        "Funnel stages mapped",
        "Traffic/leads/sales entered",
        "Observed leaks logged",
        "Revenue assumptions noted",
        "Hypotheses written",
        "Experiment owner assigned",
        "Success threshold set",
        "Owner action plan exported"
    ],
    "artifacts": [
        "Leak map",
        "Experiment backlog CSV",
        "Owner action plan"
    ],
    "checks": [
        "Conversion rates 0-100",
        "Revenue assumptions required",
        "Experiments need metric/duration/threshold"
    ],
    "sampleClient": "Eastside Youth Arts Collective"
};
//# sourceMappingURL=domain.js.map