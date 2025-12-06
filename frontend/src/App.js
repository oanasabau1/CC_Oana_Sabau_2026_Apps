import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { API_BASE, COGNITO_DOMAIN, LOGOUT_URI, OIDC_CONFIG } from "./config";

function App() {
  const auth = useAuth();

  const [profile, setProfile] = useState(null);
  const [dataResponse, setDataResponse] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  const idToken = auth.user?.id_token;

  // Call backend when we have an idToken
  useEffect(() => {
    if (!idToken) {
      setProfile(null);
      setDataResponse(null);
      return;
    }

    setError(null);

    // /api/profile
    setLoadingProfile(true);
    fetch(`${API_BASE}/api/profile`, {
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error calling /api/profile");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProfile(false));

    // /api/data
    setLoadingData(true);
    fetch(`${API_BASE}/api/data`, {
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error calling /api/data");
        return res.json();
      })
      .then((data) => setDataResponse(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingData(false));
  }, [idToken]);

  const signOutRedirect = () => {
    const clientId = OIDC_CONFIG.client_id;
    const logoutUri = LOGOUT_URI;
    const cognitoDomain = COGNITO_DOMAIN;

    // Clear local OIDC user (react-oidc-context)
    auth.removeUser();

    // Redirect to Cognito logout endpoint
    window.location.href =
      `${cognitoDomain}/logout?client_id=${clientId}` +
      `&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div style={{ padding: 20 }}>Loading authentication...</div>;
  }

  if (auth.error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        Encountering error... {auth.error.message}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "900px" }}>
      <h1>Cognito + Express Demo (react-oidc-context)</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        {auth.isAuthenticated ? (
          <>
            <p>
              <strong>Status:</strong> Logged in as{" "}
              {auth.user?.profile?.email || "(no email claim)"}
            </p>
            <button onClick={signOutRedirect}>Sign out</button>
          </>
        ) : (
          <>
            <p>
              <strong>Status:</strong> Not logged in
            </p>
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
          </>
        )}
      </div>

      {auth.isAuthenticated && (
        <>
          <h2>Tokens</h2>
          <pre style={{ background: "#eee", padding: "10px" }}>
            ID Token: {auth.user?.id_token}
          </pre>

          <h2>/api/profile response</h2>
          {loadingProfile ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <pre style={{ background: "#eee", padding: "10px" }}>
              {JSON.stringify(profile, null, 2)}
            </pre>
          ) : (
            <p>No profile loaded yet.</p>
          )}

          <h2>/api/data response</h2>
          {loadingData ? (
            <p>Loading data...</p>
          ) : dataResponse ? (
            <pre style={{ background: "#eee", padding: "10px" }}>
              {JSON.stringify(dataResponse, null, 2)}
            </pre>
          ) : (
            <p>No data loaded yet.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
