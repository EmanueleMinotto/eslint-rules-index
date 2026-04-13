"use client";

import { Card, Group, Badge, Text, ActionIcon, CopyButton, Tooltip, Stack, Code, Anchor } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import type { EslintRule } from "@/lib/rules-data";

export function RuleCard({ rule }: { rule: EslintRule }) {
    return (
        <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder
            style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <Stack gap="xs" flex={1}>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Anchor href={rule.url} target="_blank" fw={600} ff="monospace" size="sm" style={{ wordBreak: "break-all", color: "inherit" }} underline="hover">
                        {rule.id}
                    </Anchor>
                    <CopyButton value={rule.id} timeout={2000}>
                        {({ copied, copy }) => (
                            <Tooltip label={copied ? 'Copied' : 'Copy rule ID'} withArrow position="left">
                                <ActionIcon 
                                    color={copied ? 'teal' : 'gray'} 
                                    variant="subtle" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        copy();
                                    }}
                                >
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </Group>

                <Group gap="xs">
                    {rule.type && (
                        <Badge color="blue" variant="light" size="sm" style={{ textTransform: 'capitalize' }}>
                            {rule.type}
                        </Badge>
                    )}
                    {rule.fixable && (
                        <Badge color="green" variant="light" size="sm">
                            Fixable
                        </Badge>
                    )}
                    {rule.deprecated && (
                        <Badge color="red" variant="light" size="sm">
                            Deprecated
                        </Badge>
                    )}
                </Group>

                <Text component="div" size="sm" c="dimmed" lineClamp={10} style={{ flexGrow: 1 }} mt="sm">
                    {rule.description ? (
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <span {...props} />,
                                code: ({ node, ...props }) => <Code {...props} />
                            }}
                        >
                            {rule.description}
                        </ReactMarkdown>
                    ) : (
                        "No description provided."
                    )}
                </Text>
            </Stack>
        </Card>
    );
}
