"use client";

import { Box, Container, Stack, Text, Anchor } from "@mantine/core";

export function PageFooter() {
    return (
        <Box
            component="footer"
            py="xl"
            mt="xl"
            style={{
                borderTop: "1px solid var(--mantine-color-default-border)",
            }}
        >
            <Container size="xl">
                <Stack gap="xs" align="center" ta="center">
                    <Text size="sm" c="dimmed">
                        Made with ❤️{" "}
                        <Anchor
                            href="https://github.com/EmanueleMinotto/eslint-rules-index"
                            target="_blank"
                            rel="noopener noreferrer"
                            inherit
                        >
                            on GitHub
                        </Anchor>
                        {" by "}
                        <Anchor
                            href="https://emanueleminotto.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                            inherit
                        >
                            Emanuele Minotto
                        </Anchor>
                    </Text>
                </Stack>
            </Container>
        </Box>
    );
}
