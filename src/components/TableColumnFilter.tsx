"use client";

import { Button, Select, Stack } from "@mantine/core";

type Option = { value: string; label: string };

type TableColumnFilterProps = {
    options: Option[];
    value: string;
    onSelect: (value: string | null) => void;
    onClear: () => void;
    close: () => void;
    placeholder: string;
    searchable?: boolean;
};

export function TableColumnFilter({
    options,
    value,
    onSelect,
    onClear,
    close,
    placeholder,
    searchable,
}: TableColumnFilterProps) {
    return (
        <Stack gap="xs" p="xs">
            <Select
                size="xs"
                data={options}
                value={value}
                onChange={(v) => {
                    onSelect(v || null);
                    close();
                }}
                placeholder={placeholder}
                clearable
                searchable={searchable}
            />
            <Button
                size="xs"
                variant="subtle"
                onClick={() => {
                    onClear();
                    close();
                }}
            >
                Clear
            </Button>
        </Stack>
    );
}
