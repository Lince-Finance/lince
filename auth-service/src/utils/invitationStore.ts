interface InvitationData {
  used: boolean;      
  maxUses?: number;    
  expiresAt?: number;  
}


const invitationMap = new Map<string, InvitationData>();


export function validateInviteCode(inviteCode: string): boolean {
  const data = invitationMap.get(inviteCode);
  if (!data) return false;

  if (data.expiresAt && Date.now() > data.expiresAt) {
    return false;
  }

  if (data.used && !data.maxUses) {
    return false;
  }

  if (data.maxUses && data.maxUses <= 0) {
    return false;
  }

  return true;
}

export function consumeInviteCode(inviteCode: string): void {
  const data = invitationMap.get(inviteCode);
  if (!data) return;

  if (data.maxUses && data.maxUses > 1) {
    data.maxUses -= 1;
  } else {
    data.used = true;
  }

  invitationMap.set(inviteCode, data);
}
