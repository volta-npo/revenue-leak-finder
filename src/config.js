export const config = {
    "number": 17,
    "slug": "revenue-leak-finder",
    "title": "Revenue Leak Finder",
    "category": "Finance & Grants",
    "tagline": "A guided analysis workbook for spotting where a small business is losing sales online.",
    "persona": "Finance and strategy pods doing business audits.",
    "gap": "Owners may know sales are weak but not whether the issue is discovery, conversion, pricing, retention, or operations.",
    "niche": "Local business revenue diagnostics for student consultants.",
    "metric": "revenue hypotheses converted into experiments",
    "modules": [
        "Funnel hypothesis map",
        "Simple sales input sheet",
        "Leak prioritization rubric",
        "Experiment plan"
    ],
    "theme": {
        "accent": "#16a34a",
        "accent2": "#86efac",
        "emoji": "\ud83d\udcb8",
        "metricLabel": "Funding readiness",
        "workflow": [
            "Collect verified facts",
            "Map requirements to evidence",
            "Score readiness",
            "Export funder-ready packet"
        ],
        "privacy": "Financial and grant materials can be sensitive. Keep exports local and label confidential notes."
    },
    "statuses": [
        "not-started",
        "blocked",
        "in-progress",
        "ready",
        "approved"
    ],
    "criteria": [
        {
            "id": "funnel-hypothesis-map",
            "label": "Funnel hypothesis map",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify funnel hypothesis map with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "simple-sales-input-sheet",
            "label": "Simple sales input sheet",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify simple sales input sheet with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "leak-prioritization-rubric",
            "label": "Leak prioritization rubric",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify leak prioritization rubric with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "experiment-plan",
            "label": "Experiment plan",
            "weight": 15,
            "defaultStatus": "not-started",
            "prompt": "Implement and verify experiment plan with evidence that a Volta student pod, mentor, and owner can understand."
        },
        {
            "id": "evidence-quality",
            "label": "Evidence quality",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Attach proof, source notes, screenshots, owner confirmation, or reviewer rationale."
        },
        {
            "id": "owner-handoff",
            "label": "Owner handoff",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Make the output understandable and maintainable by a nontechnical owner."
        },
        {
            "id": "mission-alignment",
            "label": "Mission alignment",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Show how this advances digital equity, student growth, or pro bono delivery."
        },
        {
            "id": "qa-safety",
            "label": "QA and safety",
            "weight": 10,
            "defaultStatus": "not-started",
            "prompt": "Resolve privacy, accessibility, accuracy, and operational risks before handoff."
        }
    ],
    "templates": {
        "actions": [
            "Run a real Volta scenario for Revenue Leak Finder and capture baseline evidence.",
            "Complete the funnel hypothesis map workflow with owner-safe notes.",
            "Resolve all blocked rubric items and add evidence for every ready item.",
            "Export the handoff packet and review it with a mentor before client use."
        ]
    },
    "sample": {
        "clientName": "Eastside Youth Arts Collective",
        "chapter": "NYC",
        "studentLead": "Volta Student Lead",
        "notes": "Grant and finance readiness project for a small community nonprofit. Revenue Leak Finder sample.",
        "evidencePrefix": "Revenue Leak Finder",
        "evidence": [
            "Discovery call notes captured with owner confirmation.",
            "Public digital footprint reviewed and summarized.",
            "Mentor QA comments attached before handoff."
        ]
    }
};
//# sourceMappingURL=config.js.map