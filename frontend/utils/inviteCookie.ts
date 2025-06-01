
export function cacheInviteFromUrl() {
    const p   = new URLSearchParams(location.search);
    const inv = (p.get('i') || '').toUpperCase().trim();
    if (!inv) return;
  
    
    document.cookie = [
      `inviteCode=${inv}`,
      'Path=/auth',
      'Max-Age=' + 7*24*3600,
      'HttpOnly',
      'SameSite=none',
      'Secure',
      'Priority=High',
    ].join(';');
  }
  