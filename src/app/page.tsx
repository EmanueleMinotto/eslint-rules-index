"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Box, Container } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { RulesIndexHeader } from "@/components/RulesIndexHeader";
import { RulesTableEmptyState } from "@/components/RulesTableEmptyState";
import { PageFooter } from "@/components/PageFooter";
import { useRulesTableColumns } from "@/app/page/useRulesTableColumns";
import { HomeFallback } from "@/app/page/HomeFallback";
import {
    rules,
    pluginCount,
    PAGE_SIZE,
    sortRules,
    filterBySearch,
} from "@/lib/rules-data";

function HomePage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const qFromUrl = searchParams.get("q") ?? "";

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const [fixableFilter, setFixableFilter] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [packageFilter, setPackageFilter] = useState<string | null>(null);
    const [sortStatus, setSortStatus] = useState({
        columnAccessor: "id",
        direction: "asc" as "asc" | "desc",
    });

    useEffect(() => {
        setSearch(qFromUrl);
    }, [qFromUrl]);

    const columns = useRulesTableColumns({
        typeFilter,
        setTypeFilter,
        fixableFilter,
        setFixableFilter,
        categoryFilter,
        setCategoryFilter,
        packageFilter,
        setPackageFilter,
        setPage,
    });

    const filteredRules = useMemo(() => {
        let list = filterBySearch(rules, search);
        if (typeFilter) list = list.filter((r) => (r.type ?? null) === typeFilter);
        if (fixableFilter) {
            if (fixableFilter === "none") list = list.filter((r) => !(r.fixable ?? null));
            else list = list.filter((r) => (r.fixable ?? null) === fixableFilter);
        }
        if (categoryFilter) list = list.filter((r) => (r.category ?? null) === categoryFilter);
        if (packageFilter) list = list.filter((r) => (r.package ?? null) === packageFilter);
        return list;
    }, [search, typeFilter, fixableFilter, categoryFilter, packageFilter]);

    const sortedRules = useMemo(
        () => sortRules(filteredRules, sortStatus.columnAccessor, sortStatus.direction),
        [filteredRules, sortStatus.columnAccessor, sortStatus.direction],
    );

    const paginatedRecords = useMemo(
        () => sortedRules.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize),
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
                    columns={columns}
                    idAccessor="uniqueId"
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
                        totalRecords > 0 ? `${from}–${to} of ${totalRecords} rules` : null
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
            <PageFooter />
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
