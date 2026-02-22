"use client";

import { Badge, Stack } from "@mantine/core";

type FixableCellProps = {
    fixable: string | null;
    hasSuggestions?: boolean;
};

export function FixableCell({
    fixable,
    hasSuggestions = false,
}: FixableCellProps) {
    return (
        <Stack gap={4}>
            {fixable ? (
                <Badge size="xs" variant="dot" color="green">
                    {fixable}
                </Badge>
            ) : (
                <span style={{ color: "var(--mantine-color-dimmed)" }}>
                    —
                </span>
            )}
            {hasSuggestions && (
                <Badge size="xs" variant="outline" color="violet">
                    suggestions
                </Badge>
            )}
        </Stack>
    );
}
