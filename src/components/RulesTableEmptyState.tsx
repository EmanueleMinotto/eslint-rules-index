"use client";

import { Box, Stack, Text } from "@mantine/core";
import { IconSearchOff } from "@tabler/icons-react";

type RulesTableEmptyStateProps = {
    hasActiveSearch: boolean;
};

export function RulesTableEmptyState({
    hasActiveSearch,
}: RulesTableEmptyStateProps) {
    return (
        <Stack
            align="center"
            gap="xs"
            py="xl"
            mih={200}
            justify="center"
        >
            <Box
                style={{
                    color: "var(--mantine-color-dimmed)",
                }}
            >
                <IconSearchOff size={48} stroke={1.2} />
            </Box>
            <Text size="sm" c="dimmed" ta="center" maw={320}>
                {hasActiveSearch
                    ? "No rules match your search. Try a different query or clear the filter."
                    : "No rules to display."}
            </Text>
        </Stack>
    );
}
