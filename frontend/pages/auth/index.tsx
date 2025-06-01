import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Input, Text } from '@chakra-ui/react';

import AuthLayout           from '@/components/AuthLayout';
import LoginFormHeading     from '@/components/login/login-form-heading';
import {
  emailInputStyles,
  emailLoginBtnStyles,
} from '@/styles/reusable-styles';
import { redirectIfLogged } from '@/lib/redirectIfLogged';

function EmailEntry() {
  const router = useRouter();
  const base   = process.env.NEXT_PUBLIC_AUTH_BASE_URL as string;

  const [email,   setEmail]   = useState('');
  const [welcome, setWelcome] = useState<string | null>(null);
  const [msg,     setMsg]     = useState('');

  const emailOk = /^[^\s@]+@[^\s@]+$/.test(email);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setWelcome(null);

    try {
      const r = await fetch(
        `${base}/auth/exists?email=${encodeURIComponent(email)}`,
        { credentials: 'include' },
      );

      if (r.ok) {
        const { name = '' } = await r.json();
        setWelcome(`Welcome back${name ? `, ${name}` : ''}!`);

        setTimeout(() => {
          router.push(
            `/auth/signIn?email=${encodeURIComponent(email)}${
              name ? `&name=${encodeURIComponent(name)}` : ''
            }`,
          );
        }, 800);
      } else if (r.status === 404) {
        router.push(`/auth/signUp?email=${encodeURIComponent(email)}`);
      } else {
        throw new Error(`exists → ${r.status}`);
      }
    } catch (err: any) {
      setMsg(err.message || 'Network error');
    }
  }

  return (
    <AuthLayout>
      <Box
        w="100%"
        maxW="500px"
        mx="auto"
        mt={['s', 'l']}
        px={['m', '2xl']}
        pb={['xl', '7xl']}
      >
        <LoginFormHeading
          title="Sign up or Log in"
          desc="Enter your email to continue"
        />

        <Box
          as="form"
          onSubmit={handleContinue}
          mt={['s', 'l']}
          display="flex"
          flexDir="column"
          gap={['4', '6']}
        >
          <Input
            {...emailInputStyles}
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button {...emailLoginBtnStyles} type="submit" disabled={!emailOk}>
            Continue
          </Button>
        </Box>

        {welcome && (
          <Text mt={['2', '4']} color="grayCliff.solid.400" textAlign="center">
            {welcome}
          </Text>
        )}

        {msg && (
          <Text mt={['2', '4']} color="redInx.solid.300" textAlign="center">
            {msg}
          </Text>
        )}
      </Box>
    </AuthLayout>
  );
}

export const getServerSideProps = redirectIfLogged();
export default EmailEntry;
