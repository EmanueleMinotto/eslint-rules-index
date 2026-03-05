import rulesData from "@/data/eslint-rules.json";

type RawEslintRule = {
    id: string;
    package: string;
    url: string;
    description: string | null;
    deprecated: boolean;
    type?: string | null;
    fixable?: string | null;
    hasSuggestions?: boolean;
    category?: string | null;
};

export type EslintRule = RawEslintRule & {
    /**
     * Internal unique identifier used for React table row keys.
     * Some rule IDs can appear in multiple packages, so this
     * guarantees a stable, unique key per record.
     */
    uniqueId: string;
};

type RulesPayload = { rules: RawEslintRule[]; pluginCount?: number };
const payload = rulesData as unknown as RawEslintRule[] | RulesPayload;
const isLegacyFormat = Array.isArray(payload);
const rawRules: RawEslintRule[] = isLegacyFormat ? payload : payload.rules;

export const rules: EslintRule[] = rawRules.map((rule, index) => ({
    ...rule,
    uniqueId: `${rule.id}__${rule.package}__${index}`,
}));
export const pluginCount: number | undefined = isLegacyFormat
    ? undefined
    : payload.pluginCount;

export const PAGE_SIZE = 25;

export type SortDirection = "asc" | "desc";

export function sortRules(
    list: EslintRule[],
    column: keyof EslintRule | string,
    direction: SortDirection,
): EslintRule[] {
    return [...list].sort((a, b) => {
        const aVal = a[column as keyof EslintRule];
        const bVal = b[column as keyof EslintRule];
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        return direction === "asc"
            ? aStr.localeCompare(bStr, undefined, { sensitivity: "base" })
            : bStr.localeCompare(aStr, undefined, { sensitivity: "base" });
    });
}

export function filterBySearch(
    rulesList: EslintRule[],
    query: string,
): EslintRule[] {
    if (!query.trim()) return rulesList;
    const q = query.trim().toLowerCase();
    return rulesList.filter(
        (r) =>
            r.id.toLowerCase().includes(q) ||
            r.package.toLowerCase().includes(q) ||
            (r.description ?? "").toLowerCase().includes(q) ||
            (r.category ?? "").toLowerCase().includes(q),
    );
}

export const TYPE_OPTIONS = [
    { value: "", label: "Any" },
    { value: "problem", label: "problem" },
    { value: "suggestion", label: "suggestion" },
    { value: "layout", label: "layout" },
];

export const FIXABLE_OPTIONS = [
    { value: "", label: "Any" },
    { value: "code", label: "code" },
    { value: "whitespace", label: "whitespace" },
    { value: "none", label: "not fixable" },
];

function uniqueSorted(values: Iterable<string>) {
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export const categoryOptions = [
    { value: "", label: "Any" },
    ...uniqueSorted(
        rules.filter((r) => r.category?.trim()).map((r) => r.category!.trim()),
    ).map((c) => ({ value: c, label: c })),
];

export const packageOptions = [
    { value: "", label: "Any" },
    ...uniqueSorted(
        rules.filter((r) => r.package?.trim()).map((r) => r.package!.trim()),
    ).map((p) => ({ value: p, label: p })),
];
