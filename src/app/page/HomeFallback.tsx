"use client";

import { AppShell, Stack, Skeleton, Group, SimpleGrid } from "@mantine/core";
import { Header } from "@/components/Header";
import { rules, pluginCount } from "@/lib/rules-data";

export function HomeFallback() {
    return (
        <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
                <Header pluginCount={pluginCount} rulesLength={rules.length} />
            </AppShell.Header>
            <AppShell.Main>
                <Stack gap="lg" maw={1200} mx="auto" w="100%" mih="80vh">
                    <Group justify="space-between" align="center" mt="md">
                        <div>
                            <Skeleton height={32} width={200} mb={8} />
                            <Skeleton height={18} width={100} />
                        </div>
                        <Skeleton height={36} width={250} />
                    </Group>
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} height={160} radius="md" />
                        ))}
                    </SimpleGrid>
                </Stack>
            </AppShell.Main>
        </AppShell>
    );
}
