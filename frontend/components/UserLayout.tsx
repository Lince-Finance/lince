"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/contexts/AuthContext";
import { csrfFetch } from "@/utils/fetcher";
import { invalidateCsrfToken } from "@/utils/csrf";
import {
  Box,
  Button,
  Flex,
  Menu,
  SkeletonCircle,
  Portal,
} from "@chakra-ui/react";
import Head from "next/head";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null && pathname?.startsWith("/user")) {
      router.replace("/auth");
    }
  }, [user, pathname, router]);

  if (user === null) return null;

  async function handleLogout() {
    try {
      await csrfFetch(`${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/auth/logout`, {
        method: "POST",
      });
    } catch {}
    invalidateCsrfToken();
    router.push("/auth");
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <Box>
        <Flex
          as="header"
          align="center"
          justify="space-between"
          position="relative"
          px={4}
          py={3}
          color="white"
        >
          <Button
            variant="ghost"
            colorScheme="orange"
            onClick={() => router.push("/user/dashboard")}
          >
            Dashboard
          </Button>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Box as={"button"}>
                <SkeletonCircle w={10} h={10} rounded={"100%"} />
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="new-txt-a"
                    onClick={() => router.push("/user/profile")}
                  >
                    Profile <Menu.ItemCommand>⌘P</Menu.ItemCommand>
                  </Menu.Item>
                  <Menu.Item
                    as={"button"}
                    value="new-file-b"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout <Menu.ItemCommand>⌘L</Menu.ItemCommand>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Flex>

        <Box as="main">{children}</Box>
      </Box>
    </>
  );
}
