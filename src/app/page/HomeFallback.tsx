"use client";

import { Box, Container } from "@mantine/core";
import { RulesIndexHeader } from "@/components/RulesIndexHeader";
import { rules, pluginCount } from "@/lib/rules-data";

export function HomeFallback() {
    return (
        <Box component="main" py="xl">
            <Container size="xl">
                <RulesIndexHeader
                    rulesLength={rules.length}
                    pluginCount={pluginCount}
                    search=""
                    onSearchChange={() => {}}
                />
                <Box py="xl" ta="center" c="dimmed">
                    Loading…
                </Box>
            </Container>
        </Box>
    );
}
