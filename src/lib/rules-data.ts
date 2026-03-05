import rulesData from "@/data/eslint-rules.json";

export type EslintRule = {
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

type RulesPayload = { rules: EslintRule[]; pluginCount?: number };
const payload = rulesData as unknown as EslintRule[] | RulesPayload;
const isLegacyFormat = Array.isArray(payload);

export const rules: EslintRule[] = isLegacyFormat ? payload : payload.rules;
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
