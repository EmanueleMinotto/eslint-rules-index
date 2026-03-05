"use client";

import { useMemo } from "react";
import type { DataTableColumn } from "mantine-datatable";
import type { EslintRule } from "@/lib/rules-data";
import {
    getRuleColumn,
    getDescriptionColumn,
    getFilterColumns,
} from "@/app/page/rules-table-columns";

type FilterState = {
    typeFilter: string | null;
    setTypeFilter: (v: string | null) => void;
    fixableFilter: string | null;
    setFixableFilter: (v: string | null) => void;
    categoryFilter: string | null;
    setCategoryFilter: (v: string | null) => void;
    packageFilter: string | null;
    setPackageFilter: (v: string | null) => void;
    setPage: (p: number) => void;
};

export function useRulesTableColumns(props: FilterState): DataTableColumn<EslintRule>[] {
    const {
        typeFilter,
        setTypeFilter,
        fixableFilter,
        setFixableFilter,
        categoryFilter,
        setCategoryFilter,
        packageFilter,
        setPackageFilter,
        setPage,
    } = props;
    return useMemo(
        () => [
            getRuleColumn(),
            ...getFilterColumns({
                typeFilter,
                setTypeFilter,
                fixableFilter,
                setFixableFilter,
                categoryFilter,
                setCategoryFilter,
                packageFilter,
                setPackageFilter,
                setPage,
            }),
            getDescriptionColumn(),
        ],
        [
            typeFilter,
            setTypeFilter,
            fixableFilter,
            setFixableFilter,
            categoryFilter,
            setCategoryFilter,
            packageFilter,
            setPackageFilter,
            setPage,
        ],
    );
}
