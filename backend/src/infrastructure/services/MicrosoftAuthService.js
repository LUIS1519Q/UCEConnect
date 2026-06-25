const msal = require('@azure/msal-node');
const axios = require('axios');

class MicrosoftAuthService {
  constructor() {
    this.msalClient = new msal.ConfidentialClientApplication({
      auth: {
        clientId: process.env.MICROSOFT_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      },
    });
  }

  getAuthUrl() {
    return this.msalClient.getAuthCodeUrl({
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri: process.env.MICROSOFT_REDIRECT_URI,
    });
  }

  async getTokenFromCode(code) {
    const result = await this.msalClient.acquireTokenByCode({
      code,
      scopes: ['openid', 'profile', 'email', 'User.Read'],
      redirectUri: process.env.MICROSOFT_REDIRECT_URI,
    });
    return result;
  }

  async getUserProfile(accessToken) {
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  }
}

module.exports = MicrosoftAuthService;
