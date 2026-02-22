"use client";

import { Badge } from "@mantine/core";

type CategoryBadgeProps = {
    category: string | null;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
    if (category) {
        return (
            <Badge size="xs" variant="light" color="cyan">
                {category}
            </Badge>
        );
    }
    return <span style={{ color: "var(--mantine-color-dimmed)" }}>—</span>;
}
