export function validateDomainDefinition(domain) {
    for (const key of ['kind', 'title', 'purpose', 'fields', 'artifacts', 'checks']) {
        if (!domain[key] || (Array.isArray(domain[key]) && domain[key].length === 0))
            throw new Error(`missing domain.${key}`);
    }
    if (domain.fields.length < 4)
        throw new Error('domain tool needs at least 4 fields');
    if (domain.artifacts.length < 3)
        throw new Error('domain tool needs at least 3 artifacts');
    return true;
}
export function createDomainState(domain) {
    validateDomainDefinition(domain);
    const values = {};
    domain.fields.forEach((field, index) => { values[field.id] = field.default ?? (field.type === 'number' ? (index + 1) * 10 : field.type === 'color' ? '#2563eb' : field.type === 'date' ? '2026-03-10' : ''); });
    return {
        version: '3-domain',
        values,
        rows: domain.rows.map((row, index) => ({ id: `domain-row-${index + 1}`, label: row, value: index < 3 ? 'Complete draft' : '', score: index < 3 ? 8 : 0, approved: index < 2 })),
        generated: [],
        updatedAt: new Date().toISOString()
    };
}
export function calculateDomain(domain, state) {
    const nums = domain.fields.filter(f => f.type === 'number').map(f => Number(state.values[f.id] || 0));
    const sum = nums.reduce((a, b) => a + b, 0);
    const average = nums.length ? Math.round(sum / nums.length) : 0;
    const rows = state.rows || [];
    const rowScore = rows.length ? Math.round(rows.reduce((a, r) => a + Number(r.score || 0), 0) / (rows.length * 10) * 100) : 0;
    const approved = rows.filter(r => r.approved).length;
    const completeness = Math.round((Object.values(state.values || {}).filter(v => String(v).trim()).length / domain.fields.length) * 100);
    const kind = domain.kind;
    let primary = rowScore;
    let secondary = completeness;
    let insight = `${approved}/${rows.length} domain rows approved`;
    if (kind.includes('calculator') || kind === 'budget' || kind === 'cashflow' || kind === 'funnel-calculator') {
        primary = Math.max(0, Math.min(999, sum));
        secondary = average;
        insight = `Calculated from ${nums.length} numeric inputs`;
    }
    else if (kind.includes('calendar')) {
        primary = rows.filter(r => String(r.value).trim()).length;
        secondary = rowScore;
        insight = `${primary} dated milestones or deadlines populated`;
    }
    else if (kind.includes('matrix') || kind.includes('grader') || kind.includes('scorecard')) {
        primary = rowScore;
        secondary = approved;
        insight = `${approved} approved scoring rows`;
    }
    else if (kind.includes('builder') || kind.includes('lab') || kind.includes('pack') || kind.includes('editor')) {
        primary = completeness;
        secondary = rowScore;
        insight = `${domain.artifacts.length} generated artifacts available`;
    }
    return { primary, secondary, completeness, rowScore, approved, insight, releaseReady: completeness >= 80 && rowScore >= 75 };
}
export function buildAdvancedDomainModel(domain, state) {
    const calc = calculateDomain(domain, state);
    const values = state.values || {};
    const rows = state.rows || [];
    const approvedRows = rows.filter((row) => row.approved).length;
    const getNumber = (id, fallback = 0) => Number(values[id] || fallback);
    const getText = (id, fallback = '') => String(values[id] || fallback);
    const baseRecords = rows.map((row, index) => ({
        id: row.id || `record-${index + 1}`,
        label: row.label,
        status: row.approved ? 'approved' : row.value ? 'draft' : 'missing',
        score: Number(row.score || 0),
        owner: getText('owner-reviewer', 'Volta reviewer'),
        evidence: row.value || 'Evidence required before client handoff'
    }));
    if (domain.kind === 'funnel-calculator') {
        const monthlyVolume = getNumber('monthly-volume');
        const value = getNumber('dollar-value-cost');
        const confidence = Math.min(1, getNumber('confidence-percent') / 100);
        const records = baseRecords.map((record, index) => ({
            ...record,
            estimatedMonthlyLeak: Math.round(monthlyVolume * value * confidence * Math.max(0.05, (10 - record.score) / 10) / (index + 1)),
            experiment: `Run ${record.label.toLowerCase()} test with success metric, owner, duration, and rollback rule`
        }));
        return {
            model: 'Revenue intelligence pipeline',
            primaryOutput: 'prioritized leak backlog with estimated recovery value',
            dashboards: ['Leak value by funnel stage', 'Experiment readiness', 'Owner approval queue'],
            workflows: ['Discovery intake', 'Funnel diagnosis', 'Experiment planning', 'ROI review'],
            records,
            automationRules: ['Flag any leak above $500/month', 'Require metric/duration/threshold before certification'],
            enterpriseReadiness: calc.releaseReady && approvedRows >= Math.ceil(rows.length * 0.75)
        };
    }
    if (domain.kind === 'cashflow') {
        const startingCash = getNumber('dollar-value-cost', 1000);
        const weeklyInflow = getNumber('monthly-volume') / 4;
        const weeklyCost = getNumber('minutes-per-item') * 10;
        const forecast = Array.from({ length: 13 }, (_, index) => {
            const week = index + 1;
            const base = Math.round(startingCash + (weeklyInflow - weeklyCost) * week);
            return { week, conservative: Math.round(base * 0.85), base, optimistic: Math.round(base * 1.12), risk: base < startingCash * 0.25 ? 'cash-floor' : 'normal' };
        });
        return {
            model: 'Scenario cashflow operating system',
            primaryOutput: '13-week cash runway forecast with scenario spread',
            dashboards: ['Runway weeks', 'Cash floor alerts', 'Scenario comparison'],
            workflows: ['Assumption intake', 'Recurring schedule', 'Scenario review', 'Owner summary'],
            records: forecast,
            automationRules: ['Escalate weeks below safety floor', 'Require labeled assumptions for every recurring item'],
            enterpriseReadiness: forecast.every((week) => week.base >= 0) && calc.releaseReady
        };
    }
    if (domain.kind === 'deck-builder') {
        const threshold = getNumber('review-threshold', 85);
        const packages = ['Community', 'Growth', 'Anchor'].map((tier, index) => ({
            tier,
            askAmount: (index + 1) * 2500,
            benefits: [`${tier} recognition`, 'Impact report', 'Volunteer/storytelling asset'],
            proofScore: Math.min(100, threshold + index * 5),
            nextStep: 'Attach proof, audience reach, use of funds, and objection responses'
        }));
        return {
            model: 'Sponsor revenue workspace',
            primaryOutput: 'tiered sponsor packages with proof-backed asks',
            dashboards: ['Pipeline value', 'Proof strength', 'Ask clarity'],
            workflows: ['Persona fit', 'Impact proofing', 'Package pricing', 'Outreach handoff'],
            records: packages,
            automationRules: ['Block packages without use-of-funds mapping', 'Require proof for every public claim'],
            enterpriseReadiness: calc.releaseReady && threshold >= 80
        };
    }
    if (domain.kind === 'calendar' || domain.kind === 'content-calendar') {
        const cadence = Math.max(1, getNumber('cadence-days', 7));
        const start = new Date(getText('start-date', '2026-03-10'));
        const records = Array.from({ length: domain.kind === 'content-calendar' ? 30 : 12 }, (_, index) => {
            const due = new Date(start);
            due.setDate(start.getDate() + index * cadence);
            return {
                date: due.toISOString().slice(0, 10),
                label: rows[index % rows.length]?.label || 'Scheduled work item',
                owner: getText('owner-reviewer', 'Volta reviewer'),
                channel: domain.kind === 'content-calendar' ? ['Instagram', 'Email', 'Web', 'In-store'][index % 4] : 'Compliance',
                approval: index < approvedRows ? 'approved' : 'needs-review'
            };
        });
        return {
            model: domain.kind === 'content-calendar' ? 'Content operations calendar' : 'Compliance operations calendar',
            primaryOutput: domain.kind === 'content-calendar' ? '30-day publishable content plan' : 'recurring deadline calendar with evidence owners',
            dashboards: ['Coverage calendar', 'Approval queue', 'Risk and evidence status'],
            workflows: ['Template intake', 'Schedule generation', 'Evidence review', 'Owner handoff'],
            records,
            automationRules: ['Require owner approval before publish/filing', 'Escalate missing evidence before due date'],
            enterpriseReadiness: calc.releaseReady && approvedRows >= Math.ceil(rows.length / 2)
        };
    }
    if (domain.kind === 'interview') {
        return {
            model: 'Founder story CRM',
            primaryOutput: 'consented quote bank and multi-channel story package',
            dashboards: ['Consent coverage', 'Quote quality', 'Story arc completion'],
            workflows: ['Interview guide', 'Consent capture', 'Quote tagging', 'Channel export'],
            records: baseRecords.map((record) => ({ ...record, consentRequired: true, channels: ['Website', 'Social', 'Video script'] })),
            automationRules: ['Block export when consent is missing', 'Flag sensitive topics for mentor review'],
            enterpriseReadiness: calc.releaseReady && approvedRows === rows.length
        };
    }
    if (domain.kind === 'caption-lab') {
        return {
            model: 'Localized caption production suite',
            primaryOutput: 'platform-specific captions with locale and approval QA',
            dashboards: ['Voice fit', 'CTA coverage', 'Translation review'],
            workflows: ['Tone setup', 'Local reference capture', 'Variant generation', 'Owner approval'],
            records: baseRecords.map((record) => ({ ...record, platforms: ['Instagram', 'Facebook', 'Google Business Profile'], translationReview: record.label.toLowerCase().includes('bilingual') })),
            automationRules: ['Flag generic phrasing', 'Require translation reviewer for bilingual copy'],
            enterpriseReadiness: calc.releaseReady && approvedRows >= Math.ceil(rows.length * 0.75)
        };
    }
    if (domain.kind === 'channel-pack') {
        return {
            model: 'Omnichannel asset repurposing studio',
            primaryOutput: 'confirmed flyer facts converted into accessible channel assets',
            dashboards: ['Fact confirmation', 'Channel readiness', 'Accessibility coverage'],
            workflows: ['Source intake', 'Fact confirmation', 'Channel adaptation', 'Accessibility QA'],
            records: baseRecords.map((record) => ({ ...record, channels: ['Instagram', 'Email', 'Web snippet'], accessibilityRequired: record.label.toLowerCase().includes('alt text') })),
            automationRules: ['Block event posts without date/time/location', 'Require alt text for image-based posts'],
            enterpriseReadiness: calc.releaseReady && approvedRows >= Math.ceil(rows.length * 0.75)
        };
    }
    return {
        model: 'SaaS-grade operating workspace',
        primaryOutput: 'client-ready evidence system',
        dashboards: ['Readiness', 'Evidence', 'Approvals'],
        workflows: ['Intake', 'Review', 'Export'],
        records: baseRecords,
        automationRules: ['Require evidence before handoff'],
        enterpriseReadiness: calc.releaseReady
    };
}
export function generateDomainSaasPlan(config, domain, state) {
    const calc = calculateDomain(domain, state);
    const model = buildAdvancedDomainModel(domain, state);
    const activation = Math.round((calc.completeness + calc.rowScore) / 2);
    return {
        product: config.title,
        category: config.category,
        idealCustomer: config.persona || domain.sampleClient,
        planTiers: [
            { name: 'Starter', price: 19, audience: 'single owner/operator', limits: '1 active workspace, local exports' },
            { name: 'Team', price: 79, audience: 'student pod or small agency', limits: '10 clients, shared review queue, CSV/Markdown packs' },
            { name: 'Chapter', price: 249, audience: 'Volta chapter or nonprofit cohort', limits: 'unlimited local workspaces, mentor dashboards, sponsor reporting' }
        ],
        clientPortal: ['Client intake', 'Evidence locker', 'Approval center', 'Export archive'],
        analytics: model.dashboards,
        automations: model.automationRules,
        roadmap: [
            'Multi-client workspace switcher',
            'Role-based mentor/owner review',
            'Template library and reusable snippets',
            'Scheduled reminders and status digests',
            'Optional backend sync without weakening local-first privacy'
        ],
        readinessScore: Math.min(100, Math.round((activation + (model.enterpriseReadiness ? 100 : 70)) / 2))
    };
}
export function generateDomainArtifacts(config, domain, state) {
    const calc = calculateDomain(domain, state);
    const model = buildAdvancedDomainModel(domain, state);
    const values = Object.fromEntries(domain.fields.map(f => [f.label, state.values[f.id] || '']));
    return domain.artifacts.map((artifact, index) => ({
        id: `artifact-${index + 1}`,
        title: artifact,
        body: `${artifact} for ${config.title}: ${calc.insight}. SaaS-grade output: ${model.primaryOutput}. Key inputs: ${Object.entries(values).slice(0, 4).map(([k, v]) => `${k}: ${v || 'not set'}`).join('; ')}.`
    }));
}
export function buildDomainMarkdown(config, domain, state) {
    const calc = calculateDomain(domain, state);
    const model = buildAdvancedDomainModel(domain, state);
    const saas = generateDomainSaasPlan(config, domain, state);
    const lines = [`# ${config.title} Domain Tool Export`, '', `**Tool:** ${domain.title}`, `**Purpose:** ${domain.purpose}`, `**Readiness:** ${calc.releaseReady ? 'Ready' : 'Needs work'}`, `**Insight:** ${calc.insight}`, `**Advanced model:** ${model.model}`, `**SaaS readiness:** ${saas.readinessScore}/100`, '', '## Inputs'];
    domain.fields.forEach(f => lines.push(`- **${f.label}:** ${state.values[f.id] || 'Not set'}`));
    lines.push('', '## Work Items');
    state.rows.forEach(r => lines.push(`- ${r.approved ? '[x]' : '[ ]'} **${r.label}** — ${r.value || 'No value'} (${r.score}/10)`));
    lines.push('', '## Generated Artifacts');
    generateDomainArtifacts(config, domain, state).forEach(a => lines.push(`- **${a.title}:** ${a.body}`));
    lines.push('', '## SaaS Expansion Plan');
    saas.planTiers.forEach(tier => lines.push(`- **${tier.name} ($${tier.price}/mo):** ${tier.audience}; ${tier.limits}`));
    lines.push('', '## Automation Rules');
    model.automationRules.forEach(rule => lines.push(`- ${rule}`));
    lines.push('', '## Validation Checks');
    domain.checks.forEach(c => lines.push(`- ${c}`));
    return lines.join('\n');
}
export function applyDomainSample(domain) {
    const state = createDomainState(domain);
    domain.fields.forEach((field, index) => {
        if (field.type === 'number')
            state.values[field.id] = field.sample ?? (index + 2) * 15;
        else if (field.type === 'date')
            state.values[field.id] = field.sample ?? `2026-03-${String(index + 10).padStart(2, '0')}`;
        else
            state.values[field.id] = field.sample ?? `${field.label} sample`;
    });
    state.rows = state.rows.map((row, index) => ({ ...row, value: `${row.label} completed with sample evidence`, score: index < 6 ? 9 : 8, approved: true }));
    return state;
}
//# sourceMappingURL=domain-core.js.map