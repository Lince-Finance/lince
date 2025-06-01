import {
    DynamoDBClient, UpdateItemCommand, GetItemCommand,
    PutItemCommand,
  } from '@aws-sdk/client-dynamodb';
  
const ddb = new DynamoDBClient({});
const TableName = 'Users';

export async function updateUser(
userId: string,
changes: Record<string, any>,
) {
const sets:string[] = [];
const names:Record<string,string>  = {};
const values:Record<string, any>   = {};

for (const [k, v] of Object.entries(changes)) {
    sets.push(`#${k} = :${k}`);
    names[`#${k}`]  = k;
    values[`:${k}`] = typeof v === 'boolean' ? { BOOL: v } : { S: String(v) };
}

await ddb.send(new UpdateItemCommand({
    TableName,
    Key: { userId: { S: userId } },
    UpdateExpression: 'SET ' + sets.join(', '),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
}));
}


export async function getUser(userId: string) {
const { Item } = await ddb.send(new GetItemCommand({
    TableName,
    Key: { userId: { S: userId } },
}));
return Item;
}

export async function putUserIfMissing(item:{
    userId:string; email:string; displayName?:string; inviteCode:string;
  }) {
    const now = new Date().toISOString();
    await ddb.send(new PutItemCommand({
      TableName,
      Item: {
        userId      : { S: item.userId },
        email       : { S: item.email },
        displayName : { S: item.displayName || '' },
        inviteCode  : { S: item.inviteCode },
        createdAt   : { S: now },
        confirmedAt : { S: now },
        mfaEnabled  : { BOOL: false },
      },
      ConditionExpression: 'attribute_not_exists(userId)',   
    }));
  }
  
export async function attachInviteCode(userId: string, inviteCode: string) {
  await ddb.send(new UpdateItemCommand({
    TableName,
    Key: { userId: { S: userId } },
    
    ConditionExpression: 'attribute_not_exists(inviteCode) OR inviteCode = :empty',
    UpdateExpression:    'SET inviteCode = :code',
    ExpressionAttributeValues: {
      ':code'  : { S: inviteCode },
      ':empty' : { S: '' },
    },
  }));
}