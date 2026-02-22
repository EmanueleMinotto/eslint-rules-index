"use client";

import { Title, Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

type RulesIndexHeaderProps = {
    rulesLength: number;
    pluginCount?: number;
    search: string;
    onSearchChange: (value: string) => void;
};

export function RulesIndexHeader({
    rulesLength,
    pluginCount,
    search,
    onSearchChange,
}: RulesIndexHeaderProps) {
    return (
        <Stack gap="md" mb="lg">
            <Title order={1}>ESLint Rules Index</Title>
            <Title order={5} c="dimmed" fw={400}>
                {rulesLength} rules
                {pluginCount != null
                    ? ` from ${pluginCount} plugin${pluginCount === 1 ? "" : "s"} (ESLint core + installed)`
                    : " from ESLint core and installed plugins"}
                , with links to documentation
            </Title>
            <TextInput
                placeholder="Search by rule name, package, category or description…"
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => onSearchChange(e.currentTarget.value)}
                size="md"
                w="100%"
                type="search"
            />
        </Stack>
    );
}
