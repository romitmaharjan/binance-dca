const { Spot } = require("@binance/connector");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const CREDENTIALS_ARN = process.env.CREDENTIALS;
const REGION = process.env.REGION;

exports.handler = async (event) => {
  const secrets = await getSecret();
  const { apiKey, apiSecret, baseUrl } = secrets;
  const client = new Spot(apiKey, apiSecret, {
    baseURL: baseUrl,
  });

  try {
    const response = await client.newOrder("ETHBUSD", "BUY", "LIMIT", {
      price: "400",
      quantity: 1,
      timeInForce: "GTC",
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

const getSecret = async () => {
  const client = new SecretsManagerClient({
    region: REGION,
  });
  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: CREDENTIALS_ARN,
      })
    );
  } catch (error) {
    throw error;
  }

  return JSON.parse(response.SecretString);
};
