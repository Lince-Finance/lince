import { useState } from "react";
import { csrfFetch } from "../../utils/fetcher";
import { useRouter } from "next/router";
import AuthLayout from "../../components/AuthLayout";

export default function InvitePage() {
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    const [code,setCode] = useState('');
    const [msg ,setMsg ] = useState('');
    const router = useRouter();
    async function handle(e){ e.preventDefault();
      try{
        await csrfFetch(`${baseUrl}/auth/invite`, {
          method:'POST', body:JSON.stringify({ inviteCode:code.toUpperCase().trim() })
        });
        router.push('/auth/signIn');          
      }catch(err:any){ setMsg(err.message); }
    }
    return (<AuthLayout> …formulario… </AuthLayout>);
  }
  