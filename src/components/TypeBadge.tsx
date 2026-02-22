"use client";

import { Badge } from "@mantine/core";

type TypeBadgeProps = {
    type: string | null;
};

export function TypeBadge({ type }: TypeBadgeProps) {
    if (type) {
        return (
            <Badge
                size="xs"
                variant="light"
                color={
                    type === "problem"
                        ? "red"
                        : type === "suggestion"
                          ? "blue"
                          : "gray"
                }
            >
                {type}
            </Badge>
        );
    }
    return (
        <span style={{ color: "var(--mantine-color-dimmed)" }}>—</span>
    );
}
