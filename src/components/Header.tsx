"use client";

import { Group, Title, ActionIcon, useMantineColorScheme, TextInput } from "@mantine/core";
import { IconSun, IconMoon, IconSearch } from "@tabler/icons-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function HeaderSearch({ rulesLength }: { rulesLength: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const qFromUrl = searchParams.get("q") ?? "";

    const [searchValue, setSearchValue] = useState(qFromUrl);

    useEffect(() => {
        setSearchValue(qFromUrl);
    }, [qFromUrl]);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        const url = value.trim()
            ? `${pathname}?q=${encodeURIComponent(value)}`
            : pathname;
        router.replace(url, { scroll: false });
    };

    return (
        <TextInput
            placeholder={`Search among ${rulesLength} rules...`}
            value={searchValue}
            onChange={(event) => handleSearchChange(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            w="100%"
        />
    );
}

export function Header({ pluginCount, rulesLength }: { pluginCount?: number; rulesLength: number }) {
    const { toggleColorScheme } = useMantineColorScheme();

    return (
        <Group h="100%" px="md" justify="space-between">
            <Group>
                <Title order={3}>ESLint Rules Index</Title>
            </Group>

            <Group flex={1} justify="center" maw={500} ml="xl" mr="xl">
                <Suspense fallback={<TextInput placeholder={`Search among ${rulesLength} rules...`} leftSection={<IconSearch size={16} />} w="100%" />}>
                    <HeaderSearch rulesLength={rulesLength} />
                </Suspense>
            </Group>

            <Group>
                <ActionIcon
                    variant="default"
                    onClick={() => toggleColorScheme()}
                    size="lg"
                    aria-label="Toggle color scheme"
                >
                    <IconSun className="light-hidden" size={22} stroke={1.5} />
                    <IconMoon className="dark-hidden" size={22} stroke={1.5} />
                </ActionIcon>
            </Group>
        </Group>
    );
}
