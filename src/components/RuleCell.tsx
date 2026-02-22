"use client";

import { Anchor, Badge, Stack } from "@mantine/core";

type RuleCellProps = {
    id: string;
    url: string;
    deprecated: boolean;
};

export function RuleCell({ id, url, deprecated }: RuleCellProps) {
    return (
        <Stack gap={2}>
            <Anchor
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                fw={500}
            >
                {id}
            </Anchor>
            {deprecated && (
                <Badge size="xs" variant="light" color="orange">
                    Deprecated
                </Badge>
            )}
        </Stack>
    );
}
