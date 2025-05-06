import {
    DynamoDBClient,
    QueryCommand,
    PutItemCommand,
    UpdateItemCommand,
    TransactWriteItemsCommand,
    TransactWriteItem
} from '@aws-sdk/client-dynamodb';

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
const TableName = 'Invitations';

function globalKey(code:string){
  return { creatorUserId:{S:'GLOBAL'}, inviteCode:{S:code} };
}

export async function createInvitation(item: {
    creatorUserId: string;
    inviteCode: string;
    used: boolean;
    createdAt: string;
}) {
    const cmd = new PutItemCommand({
        TableName,
        Item: {
            creatorUserId: { S: item.creatorUserId },
            inviteCode: { S: item.inviteCode },
            used: { BOOL: item.used },
            createdAt: { S: item.createdAt }
        },
        ConditionExpression: 'attribute_not_exists(inviteCode)',
    });
    await ddb.send(cmd);
}

export async function countInvitationsForUser(userId: string): Promise<number> {
    const cmd = new QueryCommand({
        TableName,
        KeyConditionExpression: 'creatorUserId = :u',
        ExpressionAttributeValues: {
            ':u': { S: userId }
        },
        ConsistentRead: true,
        Select: 'COUNT'
    });
    const resp = await ddb.send(cmd);
    return resp.Count ?? 0;
}

export async function getInvitationByCode(inviteCode: string) {
    const cmd = new QueryCommand({
        TableName,
        IndexName: 'ByInviteCodeIndex',
        KeyConditionExpression: 'inviteCode = :code',
        ExpressionAttributeValues: {
            ':code': { S: inviteCode }
        },
        ConsistentRead: true,
    });
    const resp = await ddb.send(cmd);

    console.log("DEBUG => resp.Items =>", JSON.stringify(resp.Items, null, 2));

    if (!resp.Items || resp.Items.length === 0) {
        return null;
    }
    const item = resp.Items[0];

    if (!item.creatorUserId?.S || !item.inviteCode?.S) {
        console.log("DEBUG => found no item for that code");
        return null;
    }

    console.log("DEBUG => Searching code =>", inviteCode);


    return {
        creatorUserId: item.creatorUserId.S,
        inviteCode: item.inviteCode.S,
        used: item.used?.BOOL ?? false,
        createdAt: item.createdAt?.S
    };
}

export async function markInvitationUsed(
    creatorUserId: string,
    inviteCode: string,
  ): Promise<boolean> {
    try {
      const cmd = new UpdateItemCommand({
        TableName,
        Key: {
          creatorUserId: { S: creatorUserId },
          inviteCode:    { S: inviteCode },
        },
  
        
        ConditionExpression: 'attribute_not_exists(#used) OR #used = :falseVal',
  
        UpdateExpression: 'SET #used = :trueVal',
  
        ExpressionAttributeNames: {
          '#used': 'used',
        },
        ExpressionAttributeValues: {
          ':trueVal':  { BOOL: true },
          ':falseVal': { BOOL: false },
        },
      });
  
      await ddb.send(cmd);
      return true;             
  
    } catch (err: any) {
      if (err.name === 'ConditionalCheckFailedException') {
        
        return false;
      }
      throw err;               
    }
  }
  

export async function getAllInvitationsForUser(userId: string) {
    const cmd = new QueryCommand({
        TableName,
        KeyConditionExpression: 'creatorUserId = :u',
        ExpressionAttributeValues: {
            ':u': { S: userId }
        },
        ConsistentRead: true,
    });
    const resp = await ddb.send(cmd);
    if (!resp.Items) return [];

    return resp.Items.map(item => ({
        creatorUserId: item.creatorUserId.S,
        inviteCode: item.inviteCode.S,
        used: item.used?.BOOL ?? false,
        createdAt: item.createdAt?.S
    }));
}


export async function batchCreateInvites(
  userId: string,
  codes : string[],
): Promise<void> {
  if (!codes.length) return;

  const now      = new Date().toISOString();
  const txItems: TransactWriteItem[] = [];

  for (const code of codes) {

    
    txItems.push({
      Put: {
        TableName,
        Item: {
          ...globalKey(code),
          lock: { BOOL: true },        
        },
        ConditionExpression: 'attribute_not_exists(inviteCode)',
      },
    });

    
    txItems.push({
      Put: {
        TableName,
        Item: {
          creatorUserId: { S: userId },
          inviteCode:    { S: code },
          used:          { BOOL: false },
          createdAt:     { S: now },
        },
        ConditionExpression: 'attribute_not_exists(inviteCode)',
      },
    });
  }

    
  if (txItems.length > 25) {
    throw new Error('Too many codes; split into several batches');
  }

  await ddb.send(new TransactWriteItemsCommand({ TransactItems: txItems }));
}


  
export async function transactionAcceptInvite(
  userId: string,
  email: string,
  displayName: string,
  invite: { creatorUserId: string; inviteCode: string }
) {
  const now = new Date().toISOString();

  const tx = new TransactWriteItemsCommand({
    TransactItems: [
      
      {
        Update: {
          TableName: 'Users',
          Key: { userId: { S: userId } },
          ConditionExpression:
            'attribute_not_exists(inviteCode) OR inviteCode = :empty',
          UpdateExpression: 'SET inviteCode = :code',
          ExpressionAttributeValues: {
            ':code' : { S: invite.inviteCode },
            ':empty': { S: '' },
          },
        },
      },
      
      {
        Update: {
          TableName: 'Invitations',
          Key: {
            creatorUserId: { S: invite.creatorUserId },
            inviteCode   : { S: invite.inviteCode },
          },
          ConditionExpression:
            'attribute_not_exists(#used) OR #used = :falseVal',
          UpdateExpression: 'SET #used = :trueVal',
          ExpressionAttributeNames: { '#used': 'used' },
          ExpressionAttributeValues: {
            ':trueVal': { BOOL: true },
            ':falseVal': { BOOL: false },
          },
        },
      },
    ],
  });

  await ddb.send(tx);
}