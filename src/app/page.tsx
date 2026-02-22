"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Box, Container } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { RulesIndexHeader } from "@/components/RulesIndexHeader";
import { RulesTableEmptyState } from "@/components/RulesTableEmptyState";
import { RuleCell } from "@/components/RuleCell";
import { TypeBadge } from "@/components/TypeBadge";
import { FixableCell } from "@/components/FixableCell";
import { CategoryBadge } from "@/components/CategoryBadge";
import { TableColumnFilter } from "@/components/TableColumnFilter";
import rulesData from "@/data/eslint-rules.json";

type EslintRule = {
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
const rules: EslintRule[] = isLegacyFormat ? payload : payload.rules;
const pluginCount: number | undefined = isLegacyFormat
    ? undefined
    : payload.pluginCount;

const PAGE_SIZE = 25;

type SortDirection = "asc" | "desc";

function sortRules(
    list: EslintRule[],
    column: keyof EslintRule | string,
    direction: SortDirection,
): EslintRule[] {
    const sorted = [...list].sort((a, b) => {
        const aVal = a[column as keyof EslintRule];
        const bVal = b[column as keyof EslintRule];
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        return direction === "asc"
            ? aStr.localeCompare(bStr, undefined, { sensitivity: "base" })
            : bStr.localeCompare(aStr, undefined, { sensitivity: "base" });
    });
    return sorted;
}

function filterBySearch(rulesList: EslintRule[], query: string): EslintRule[] {
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

const TYPE_OPTIONS = [
    { value: "", label: "Any" },
    { value: "problem", label: "problem" },
    { value: "suggestion", label: "suggestion" },
    { value: "layout", label: "layout" },
];

const FIXABLE_OPTIONS = [
    { value: "", label: "Any" },
    { value: "code", label: "code" },
    { value: "whitespace", label: "whitespace" },
    { value: "none", label: "not fixable" },
];

function HomePage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const qFromUrl = searchParams.get("q") ?? "";

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string | null>(null);

    // Sync search with URL: init from URL on mount, then keep in sync (e.g. back/forward)
    useEffect(() => {
        setSearch(qFromUrl);
    }, [qFromUrl]);
    const [fixableFilter, setFixableFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [sortStatus, setSortStatus] = useState<{
        columnAccessor: keyof EslintRule | string;
        direction: SortDirection;
    }>({ columnAccessor: "id", direction: "asc" });

    const categoryOptions = useMemo(() => {
        const set = new Set<string>();
        rules.forEach((r) => {
            if (r.category?.trim()) set.add(r.category.trim());
        });
        return [
            { value: "", label: "Any" },
            ...Array.from(set)
                .sort((a, b) => a.localeCompare(b))
                .map((c) => ({ value: c, label: c })),
        ];
    }, []);

    const filteredRules = useMemo(() => {
        let list = filterBySearch(rules, search);
        if (typeFilter && typeFilter !== "") {
            list = list.filter((r) => (r.type ?? null) === typeFilter);
        }
        if (fixableFilter && fixableFilter !== "") {
            if (fixableFilter === "none") {
                list = list.filter((r) => !(r.fixable ?? null));
            } else {
                list = list.filter(
                    (r) => (r.fixable ?? null) === fixableFilter,
                );
            }
        }
        if (categoryFilter && categoryFilter !== "") {
            list = list.filter((r) => (r.category ?? null) === categoryFilter);
        }
        return list;
    }, [search, typeFilter, fixableFilter, categoryFilter]);
    const sortedRules = useMemo(
        () =>
            sortRules(
                filteredRules,
                sortStatus.columnAccessor,
                sortStatus.direction,
            ),
        [filteredRules, sortStatus.columnAccessor, sortStatus.direction],
    );
    const paginatedRecords = useMemo(
        () =>
            sortedRules.slice(
                (page - 1) * pageSize,
                (page - 1) * pageSize + pageSize,
            ),
        [sortedRules, page, pageSize],
    );

    return (
        <Box component="main" py="xl">
            <Container size="xl">
                <RulesIndexHeader
                    rulesLength={rules.length}
                    pluginCount={pluginCount}
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPage(1);
                        const url = value.trim()
                            ? `${pathname}?q=${encodeURIComponent(value)}`
                            : pathname;
                        router.replace(url, { scroll: false });
                    }}
                />
                <DataTable
                    withTableBorder
                    borderRadius="sm"
                    striped
                    highlightOnHover
                    records={paginatedRecords}
                    columns={[
                        {
                            accessor: "id",
                            title: "Rule",
                            sortable: true,
                            render: ({ id, url, deprecated }) => (
                                <RuleCell
                                    id={id}
                                    url={url}
                                    deprecated={deprecated}
                                />
                            ),
                        },
                        {
                            accessor: "type",
                            title: "Type",
                            sortable: true,
                            width: 110,
                            filtering: !!typeFilter,
                            filter: ({ close }) => (
                                <TableColumnFilter
                                    options={TYPE_OPTIONS}
                                    value={typeFilter ?? ""}
                                    onSelect={(v) => {
                                        setTypeFilter(v);
                                        setPage(1);
                                    }}
                                    onClear={() => {
                                        setTypeFilter(null);
                                        setPage(1);
                                    }}
                                    close={close}
                                    placeholder="Type"
                                />
                            ),
                            render: ({ type }) => (
                                <TypeBadge type={type ?? null} />
                            ),
                        },
                        {
                            accessor: "fixable",
                            title: "Fixable",
                            sortable: true,
                            width: 100,
                            filtering: !!fixableFilter,
                            filter: ({ close }) => (
                                <TableColumnFilter
                                    options={FIXABLE_OPTIONS}
                                    value={fixableFilter ?? ""}
                                    onSelect={(v) => {
                                        setFixableFilter(v);
                                        setPage(1);
                                    }}
                                    onClear={() => {
                                        setFixableFilter(null);
                                        setPage(1);
                                    }}
                                    close={close}
                                    placeholder="Fixable"
                                />
                            ),
                            render: ({ fixable, hasSuggestions }) => (
                                <FixableCell
                                    fixable={fixable ?? null}
                                    hasSuggestions={hasSuggestions ?? false}
                                />
                            ),
                        },
                        {
                            accessor: "category",
                            title: "Category",
                            sortable: true,
                            width: 130,
                            filtering: !!categoryFilter,
                            filter: ({ close }) => (
                                <TableColumnFilter
                                    options={categoryOptions}
                                    value={categoryFilter ?? ""}
                                    onSelect={(v) => {
                                        setCategoryFilter(v);
                                        setPage(1);
                                    }}
                                    onClear={() => {
                                        setCategoryFilter(null);
                                        setPage(1);
                                    }}
                                    close={close}
                                    placeholder="Category"
                                    searchable
                                />
                            ),
                            render: ({ category }) => (
                                <CategoryBadge category={category ?? null} />
                            ),
                        },
                        {
                            accessor: "package",
                            title: "Package",
                            sortable: true,
                            width: 180,
                        },
                        {
                            accessor: "description",
                            title: "Description",
                            ellipsis: true,
                            render: ({ description }) =>
                                description ?? (
                                    <span
                                        style={{
                                            color: "var(--mantine-color-dimmed)",
                                        }}
                                    >
                                        —
                                    </span>
                                ),
                        },
                    ]}
                    idAccessor="id"
                    minHeight={400}
                    page={page}
                    onPageChange={setPage}
                    totalRecords={sortedRules.length}
                    sortStatus={sortStatus}
                    onSortStatusChange={(status) => {
                        setSortStatus(status);
                        setPage(1);
                    }}
                    recordsPerPage={pageSize}
                    onRecordsPerPageChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    recordsPerPageOptions={[10, 25, 50, 100]}
                    recordsPerPageLabel="Rows per page:"
                    paginationWithEdges
                    paginationWithControls
                    paginationActiveBackgroundColor="var(--mantine-primary-color-filled)"
                    paginationSize="sm"
                    paginationText={({ from, to, totalRecords }) =>
                        totalRecords > 0
                            ? `${from}–${to} of ${totalRecords} rules`
                            : null
                    }
                    noRecordsText={
                        sortedRules.length === 0 && search.trim()
                            ? "No rules match your search. Try a different query."
                            : sortedRules.length === 0
                              ? "No rules loaded."
                              : undefined
                    }
                    emptyState={
                        sortedRules.length === 0 ? (
                            <RulesTableEmptyState
                                hasActiveSearch={search.trim().length > 0}
                            />
                        ) : undefined
                    }
                    className="rules-table-wrapper"
                />
            </Container>
        </Box>
    );
}

function HomeFallback() {
    return (
        <Box component="main" py="xl">
            <Container size="xl">
                <RulesIndexHeader
                    rulesLength={rules.length}
                    pluginCount={pluginCount}
                    search=""
                    onSearchChange={() => {}}
                />
                <Box py="xl" ta="center" c="dimmed">
                    Loading…
                </Box>
            </Container>
        </Box>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<HomeFallback />}>
            <HomePage />
        </Suspense>
    );
}
