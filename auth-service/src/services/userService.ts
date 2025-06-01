import {
    ChangePasswordCommand,
    AssociateSoftwareTokenCommand,
    VerifySoftwareTokenCommand,
    SetUserMFAPreferenceCommand,
    CognitoIdentityProviderClient,
    GetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { updateUser, getUser } from './userDbService';


function createCognitoClient() {
    return new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION || 'eu-west-1',
    });
}


interface UpdateProfileInput {
    displayName?: string;
    riskProfile?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
    riskScore?: string;
}

export class UserService {
    static async getUserProfile(userId: string) {
        const user = await getUser(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const parseMfaState = (mfaField: any): boolean | 'PENDING' => {
            if (!mfaField) return false;
            if ('BOOL' in mfaField) return mfaField.BOOL;
            if ('S' in mfaField) {
                if (mfaField.S === 'PENDING') return 'PENDING';
                return mfaField.S === 'true';
            }
            return false;
        };

        return {
            userId: user.userId.S,
            email: user.email.S,
            displayName: user.displayName?.S || '',
            riskProfile: user.riskProfile?.S,
            onboardingDone: user.onboardingDone?.BOOL || false,
            mfaEnabled: parseMfaState(user.mfaEnabled),
        };
    }
    static async updateUserProfile(userId: string, data: UpdateProfileInput) {
        const updates: Record<string, any> = {};
        if (data.displayName) updates.displayName = data.displayName;
        if (data.riskProfile) updates.riskProfile = data.riskProfile;
        if (data.riskScore) updates.riskScore = data.riskScore;
        
        if (Object.keys(updates).length > 0) {
            await updateUser(userId, updates);
        }
        return this.getUserProfile(userId);
    }

    static async changePassword(accessToken: string, oldPassword: string, newPassword: string) {
        const client = createCognitoClient();
        const cmd = new ChangePasswordCommand({
            AccessToken: accessToken,
            PreviousPassword: oldPassword,
            ProposedPassword: newPassword
        });
        return client.send(cmd);
    }

    static async associateMfa(accessToken: string) {
        const client = createCognitoClient();
        const cmd = new AssociateSoftwareTokenCommand({
            AccessToken: accessToken
        });
        return client.send(cmd);
    }

    static async verifyMfa(accessToken: string, userCode: string) {
        const client = createCognitoClient();
        const cmd = new VerifySoftwareTokenCommand({
            AccessToken: accessToken,
            UserCode: userCode,
            FriendlyDeviceName: 'MyAuthenticatorApp'
        });
        return client.send(cmd);
    }

    static async setMfaPreference(accessToken: string) {
        const client = createCognitoClient();
        const cmd = new SetUserMFAPreferenceCommand({
            AccessToken: accessToken,
            SMSMfaSettings: {
                Enabled: false,
                PreferredMfa: false
            },
            SoftwareTokenMfaSettings: {
                Enabled: true,
                PreferredMfa: true
            }
        });
        return client.send(cmd);
    }

    static async getUserMfaStatus(accessToken: string): Promise<boolean> {
        const client = createCognitoClient();
        const cmd = new GetUserCommand({ AccessToken: accessToken });
        const resp = await client.send(cmd);

        const mfaSettings = resp.UserMFASettingList;
        const isMfaEnabled = mfaSettings?.includes('SOFTWARE_TOKEN_MFA') || false;
        return isMfaEnabled;
    }
    
    static async updateProfile(userId: string, { displayName }: {displayName?:string}) {
        if (displayName) await updateUser(userId, { displayName });
        return { userId, displayName };
      }

}