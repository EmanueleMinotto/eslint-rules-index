"use client";

import { TableColumnFilter } from "@/components/TableColumnFilter";
import { RuleCell } from "@/components/RuleCell";
import { TypeBadge } from "@/components/TypeBadge";
import { FixableCell } from "@/components/FixableCell";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { EslintRule } from "@/lib/rules-data";
import {
    TYPE_OPTIONS,
    FIXABLE_OPTIONS,
    categoryOptions,
    packageOptions,
} from "@/lib/rules-data";
import type { DataTableColumn } from "mantine-datatable";

type FilterProps = {
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

export function getRuleColumn(): DataTableColumn<EslintRule> {
    return {
        accessor: "id",
        title: "Rule",
        sortable: true,
        render: ({ id, url, deprecated }) => (
            <RuleCell id={id} url={url} deprecated={deprecated} />
        ),
    };
}

export function getDescriptionColumn(): DataTableColumn<EslintRule> {
    return {
        accessor: "description",
        title: "Description",
        ellipsis: true,
        render: ({ description }) =>
            description ?? (
                <span style={{ color: "var(--mantine-color-dimmed)" }}>
                    —
                </span>
            ),
    };
}

export function getFilterColumns(props: FilterProps): DataTableColumn<EslintRule>[] {
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

    return [
        {
            accessor: "type",
            title: "Type",
            sortable: true,
            width: 110,
            filtering: !!typeFilter,
            filter: ({ close: c }) => (
                <TableColumnFilter
                    options={TYPE_OPTIONS}
                    value={typeFilter ?? ""}
                    onSelect={(v) => { setTypeFilter(v); setPage(1); }}
                    onClear={() => { setTypeFilter(null); setPage(1); }}
                    close={c}
                    placeholder="Type"
                />
            ),
            render: ({ type }) => <TypeBadge type={type ?? null} />,
        },
        {
            accessor: "fixable",
            title: "Fixable",
            sortable: true,
            width: 100,
            filtering: !!fixableFilter,
            filter: ({ close: c }) => (
                <TableColumnFilter
                    options={FIXABLE_OPTIONS}
                    value={fixableFilter ?? ""}
                    onSelect={(v) => { setFixableFilter(v); setPage(1); }}
                    onClear={() => { setFixableFilter(null); setPage(1); }}
                    close={c}
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
            filter: ({ close: c }) => (
                <TableColumnFilter
                    options={categoryOptions}
                    value={categoryFilter ?? ""}
                    onSelect={(v) => { setCategoryFilter(v); setPage(1); }}
                    onClear={() => { setCategoryFilter(null); setPage(1); }}
                    close={c}
                    placeholder="Category"
                    searchable
                />
            ),
            render: ({ category }) => <CategoryBadge category={category ?? null} />,
        },
        {
            accessor: "package",
            title: "Package",
            sortable: true,
            width: 180,
            filtering: !!packageFilter,
            filter: ({ close: c }) => (
                <TableColumnFilter
                    options={packageOptions}
                    value={packageFilter ?? ""}
                    onSelect={(v) => { setPackageFilter(v); setPage(1); }}
                    onClear={() => { setPackageFilter(null); setPage(1); }}
                    close={c}
                    placeholder="Package"
                    searchable
                />
            ),
        },
    ];
}
