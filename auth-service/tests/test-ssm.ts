import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

async function testSSM() {
    try {
        const client = new SSMClient({ region: 'eu-west-1' });
        const command = new GetParametersCommand({
            Names: ["/ruta/de/ejemplo"],
            WithDecryption: true,
        });
        const response = await client.send(command);
        console.log("Respuesta de SSM:", response);
    } catch (error) {
        console.error("Error al conectar con SSM:", error);
    }
}

testSSM();
