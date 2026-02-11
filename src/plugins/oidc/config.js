const {
  VITE_AUTH_HOST: authHost,
  VITE_APP_HOST: appHost,
  VITE_BASE_URL: baseUrl,
  VITE_CLIENT_ID: clientId,
} = import.meta.env;

export default {
  authority: authHost,
  client_id: clientId,
  response_type: 'code',
  scope: 'openid nickname',
  redirect_uri: `${appHost}${baseUrl}/login`,
  post_logout_redirect_uri: `${appHost}${baseUrl}/logout`,
  silent_redirect_uri: `${appHost}${baseUrl}/renew`,
  accessTokenExpiringNotificationTime: 10,
  automaticSilentRenew: true,
  filterProtocolClaims: false,
  loadUserInfo: false,
  monitorSession: true,
  metadata: {
    issuer: 'https://www.cmoney.tw',
    authorization_endpoint: `${authHost}/identity/authorize`,
    token_endpoint: `${authHost}/identity/token`,
    end_session_endpoint: `${authHost}/identity/endsession`,
    jwks_uri: `${authHost}/identity/keys/jwks`,
    check_session_iframe: `${authHost}/identity/checksession`,
  },
};
