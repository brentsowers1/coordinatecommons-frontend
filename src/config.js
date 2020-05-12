// Configuration data needed by the front end application. None of this data is secret, it's all needed in front end code.
const config = {
  googleMapsApiKey: 'AIzaSyDRY1U5VsSThTsCbLZm0AeH-j5xCfuAewc',
  cognito: {
    userPoolId: 'us-east-1_67Tq0YnGG',
    userPoolClientId: '7ibqfgt5tq9u3o82ivc9kablpj',
    region: 'us-east-1'
  },
  lambdaBaseUrl: 'https://c5z7agn2o8.execute-api.us-east-1.amazonaws.com/prod'
};

export default config;