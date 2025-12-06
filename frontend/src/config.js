// OIDC config for react-oidc-context
export const OIDC_CONFIG = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_mils02Olw", // https://cognito-idp.<region>.amazonaws.com/<userPoolId>
  client_id: "2muovodbsd8s4q46nf9udaq875", // your app client id
  redirect_uri: "http://localhost:3000",  // must match callback URL in Cognito
  response_type: "code",
  scope: "openid email profile",        
};

// Your Cognito domain (for logout)
export const COGNITO_DOMAIN = "https://eu-central-1mils02olw.auth.eu-central-1.amazoncognito.com"; 
// e.g. https://my-domain.auth.eu-central-1.amazoncognito.com 
// You can find it in the Cognito User Pool console under "Managed Login" > "Domain".

// Logout redirect (must be in allowed logout URLs)
export const LOGOUT_URI = "http://localhost:3000";

// Express backend
export const API_BASE = "http://localhost:3001";
