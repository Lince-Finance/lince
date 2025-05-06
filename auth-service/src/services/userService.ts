import {
    ChangePasswordCommand,
    AssociateSoftwareTokenCommand,
    VerifySoftwareTokenCommand,
    SetUserMFAPreferenceCommand,
    CognitoIdentityProviderClient,
    GetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { updateUser } from './userDbService';


function createCognitoClient() {
    return new CognitoIdentityProviderClient({
        region: process.env.AWS_REGION || 'eu-west-1',
    });
}


interface UpdateProfileInput {
    displayName?: string;
}

export class UserService {
    static async getUserProfile(userId: string) {
        return {
            userId,
            email: `demo-${userId}@example.com`,
            displayName: 'Demo User from Service'
        };
    }
    static async updateUserProfile(userId: string, data: UpdateProfileInput) {
        return {
            userId,
            email: `demo-${userId}@example.com`,
            displayName: data.displayName || 'Default Name'
        };
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
