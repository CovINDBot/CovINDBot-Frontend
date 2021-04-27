import React, { useState } from "react";
import GoogleLogin from "react-google-login";

const AuthenticatedRoute = ({ renderComponent }) => {
  const [authResponse, setAuthResponse] = useState(null);
  const responseGoogle = (response) => {
    setAuthResponse({
      token: response.tokenId,
      name: response.profileObj.name,
      provider: "Google",
    });
  };
  if (!authResponse) {
    return (
      <div
        style={{
          marginTop: "7rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "2rem", fontWeight: 200 }}>
          You would need to sign-in first
        </h2>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Sign In via Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      </div>
    );
  }
  const Component = renderComponent;
  return <Component authResponse={authResponse} />;
};

export { AuthenticatedRoute };
