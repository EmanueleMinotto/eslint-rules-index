"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell, SimpleGrid, Pagination, Stack, Text, SegmentedControl, Group, Title, Box } from "@mantine/core";
import { Header } from "@/components/Header";
import { RuleCard } from "@/components/RuleCard";
import { PageFooter } from "@/components/PageFooter";
import { HomeFallback } from "@/app/page/HomeFallback";
import { rules, pluginCount, PAGE_SIZE, sortRules, filterBySearch } from "@/lib/rules-data";

function HomePage() {
    const searchParams = useSearchParams();
    const qFromUrl = searchParams.get("q") ?? "";

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("All");
    const [pageSize] = useState(PAGE_SIZE);

    useEffect(() => {
        setSearch(qFromUrl);
        setPage(1);
    }, [qFromUrl]);

    const filteredRules = useMemo(() => {
        let list = filterBySearch(rules, search);
        
        if (filterCategory === "Fixable") {
            list = list.filter((r) => !!r.fixable);
        } else if (filterCategory === "Deprecated") {
            list = list.filter((r) => r.deprecated);
        }

        return list;
    }, [search, filterCategory]);

    const sortedRules = useMemo(() => {
        return sortRules(filteredRules, "id", "asc");
    }, [filteredRules]);

    const paginatedRules = useMemo(() => {
        return sortedRules.slice((page - 1) * pageSize, page * pageSize);
    }, [sortedRules, page, pageSize]);

    const totalPages = Math.ceil(sortedRules.length / pageSize);

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Header pluginCount={pluginCount} rulesLength={rules.length} />
            </AppShell.Header>

            <AppShell.Main>
                <Stack gap="lg" maw={1200} mx="auto" w="100%" mih="80vh">
                    <Group justify="space-between" align="center" mt="md">
                        <div>
                            <Title order={2} size="h3">Rules Directory</Title>
                            <Text c="dimmed" size="sm">
                                {sortedRules.length} {sortedRules.length === 1 ? 'rule' : 'rules'} found
                            </Text>
                        </div>
                        
                        <SegmentedControl
                            value={filterCategory}
                            onChange={(val) => {
                                setFilterCategory(val);
                                setPage(1);
                            }}
                            data={[
                                { label: 'All', value: 'All' },
                                { label: 'Fixable', value: 'Fixable' },
                                { label: 'Deprecated', value: 'Deprecated' },
                            ]}
                        />
                    </Group>

                    {sortedRules.length === 0 ? (
                        <Stack align="center" mt="xl" py="xl" gap="md" style={{ flexGrow: 1 }}>
                            <Text size="lg" fw={500}>No rules found</Text>
                            <Text c="dimmed">Try adjusting your search query or filters.</Text>
                        </Stack>
                    ) : (
                        <Box style={{ flexGrow: 1 }}>
                            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                                {paginatedRules.map((rule) => (
                                    <RuleCard key={rule.uniqueId} rule={rule} />
                                ))}
                            </SimpleGrid>

                            {totalPages > 1 && (
                                <Group justify="center" mt="xl" py="md">
                                    <Pagination
                                        total={totalPages}
                                        value={page}
                                        onChange={setPage}
                                        color="indigo"
                                        withEdges
                                        siblings={1}
                                    />
                                </Group>
                            )}
                        </Box>
                    )}
                </Stack>
                <Box maw={1200} mx="auto" pt="xl">
                    <PageFooter />
                </Box>
            </AppShell.Main>
        </AppShell>
    );
}

export default function Home() {
    return (
        <Suspense fallback={<HomeFallback />}>
            <HomePage />
        </Suspense>
    );
}
