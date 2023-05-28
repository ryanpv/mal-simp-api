module.exports = {
  type: process.env.FB_SERVICE_ACCOUNT_TYPE,
  // project_id: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_PROJECT_ID : process.env.FB_SERVICE_ACCOUNT_PROJECT_ID,
  project_id: process.env.NODE_ENV === 'test' ? 'test-mal-simplified' : 'mal-simplified',
  private_key_id: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_PRIVATE_KEY_ID : process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.NODE_ENV === 'test' && process.env.TEST_FB_SERVICE_ACCOUNT_PRIVATE_KEY ? process.env.TEST_FB_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')
    : process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY ? process.env.FB_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined,
  client_email: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_CLIENT_EMAIL : process.env.FB_SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_CLIENT_ID : process.env.FB_SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_AUTH_URI : process.env.FB_SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_TOKEN_URI : process.env.FB_SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL : process.env.FB_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.NODE_ENV === 'test' ? process.env.TEST_FB_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL : process.env.FB_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
}