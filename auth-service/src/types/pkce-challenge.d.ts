
declare module 'pkce-challenge' {
  
  const fn: () => {
    code_verifier:  string;
    code_challenge: string;
  };

  export = fn;               
}
