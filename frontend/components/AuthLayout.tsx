import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { csrfFetch } from "../utils/fetcher";
import Head from "next/head";
import { invalidateCsrfToken } from "../utils/csrf";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await csrfFetch(`${baseUrl}/user/profile`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error checking user profile =>", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [baseUrl]);

  async function handleSignOut() {
    try {
      await csrfFetch(`${baseUrl}/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      invalidateCsrfToken();
      setIsLogged(false);
      router.push("/auth/signIn");
    }
  }

  if (isLoading) {
    return null;
  }

  if (isLogged) {
    return (
      <>
        <Head key="robots">
          <meta name="robots" content="noindex" />
        </Head>

        <div style={{ margin: 20 }}>
          <h1>You are already logged in!</h1>
          <p>Do you want to sign out, or go to your dashboard?</p>
          <button onClick={() => router.push("/user/dashboard")}>
            Go to Dashboard
          </button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head key="robots">
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ margin: 20 }}>{children}</div>
    </>
  );
}
