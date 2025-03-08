# Testing TrueLayer Integration

This document provides instructions on how to test the TrueLayer integration for retrieving bank account information, transactions, and identifying subscriptions.

## Prerequisites

1. TrueLayer Developer Account

   - Sign up at [TrueLayer Console](https://console.truelayer.com/)
   - Create a new application in the **Sandbox** environment
   - Configure the redirect URI to `http://localhost:8000/api/v1/banking/callback`
   - Enable the application and make sure it's in "Live" mode in the sandbox environment
   - Get your client ID and client secret (they should start with "sandbox-")

2. Environment Setup
   - Update your `.env` file with your TrueLayer sandbox credentials:
     ```
     TRUELAYER_CLIENT_ID=your_sandbox_client_id
     TRUELAYER_CLIENT_SECRET=your_sandbox_client_secret
     TRUELAYER_REDIRECT_URI=http://localhost:8000/api/v1/banking/callback
     ```

## Testing Methods

### 1. Using the Direct Test Script (Recommended)

We've provided a direct test script that tests the TrueLayer API integration without requiring browser authentication:

```bash
# Activate your virtual environment
source venv/bin/activate

# Run the direct test script
python test_truelayer_direct.py
```

This script will:

1. Check if the TrueLayer sandbox is available
2. Test the client credentials flow
3. Generate an authorization URL for testing with real user data
4. Provide instructions for completing the OAuth flow

The direct test script is useful for verifying that your TrueLayer credentials are working correctly and that you can obtain access tokens. However, it doesn't provide access to user data, which requires completing the OAuth flow.

### 2. Using the Browser-Based Test Script

If you need to test the full OAuth flow including browser authentication:

```bash
# Activate your virtual environment
source venv/bin/activate

# Run the browser-based test script
python test_truelayer.py
```

The script will:

1. Generate an authorization URL for the TrueLayer sandbox
2. Display the URL - open this in your browser
3. In your browser, you'll be asked to select a test bank (choose "Mock Bank")
4. Enter any credentials when prompted (username, password, and OTP)
5. After successful authorization, you'll be redirected to your redirect URI with a code parameter
6. Copy the code from the URL (it will look like `http://localhost:8000/api/v1/banking/callback?code=YOUR_CODE&state=test_state`)
7. Paste the code when prompted by the test script
8. The script will exchange the code for tokens and retrieve account information

### 3. Using FastAPI Swagger UI

You can also test the API endpoints using the FastAPI Swagger UI:

1. Start the FastAPI server:

   ```bash
   uvicorn app.main:app --reload
   ```

2. Open your browser and navigate to `http://localhost:8000/docs`

3. Authenticate using the login endpoint (if required)

4. Test the banking endpoints:
   - `/api/v1/banking/connect` - Initiates the TrueLayer connection flow
   - `/api/v1/banking/accounts` - Gets connected bank accounts
   - `/api/v1/banking/transactions` - Gets transactions for a specific account
   - `/api/v1/banking/subscriptions` - Gets subscriptions based on transaction history

## TrueLayer Authentication Flows

TrueLayer provides two main authentication flows:

### 1. Client Credentials Flow

The client credentials flow allows your application to authenticate with TrueLayer using your client ID and client secret. This flow is useful for:

- Verifying that your TrueLayer credentials are working correctly
- Accessing non-user-specific API endpoints
- Testing the basic connectivity to the TrueLayer API

However, the client credentials flow **does not** provide access to user data such as bank accounts, transactions, or subscriptions. For that, you need to use the OAuth flow.

### 2. OAuth Flow

The OAuth flow allows your application to access user data with the user's consent. This flow involves:

1. Redirecting the user to TrueLayer's authorization page
2. The user selecting their bank and authorizing access
3. TrueLayer redirecting back to your application with an authorization code
4. Your application exchanging the authorization code for access and refresh tokens
5. Using the access token to retrieve user data

This is the flow you need to use to access bank accounts, transactions, and subscription data.

## TrueLayer Sandbox Testing

For development and testing, TrueLayer provides a sandbox environment with test banks:

1. When connecting a bank, choose "Mock Bank" from the list
2. Use the following credentials:
   - Username: any value (e.g., "test")
   - Password: any value (e.g., "test")
   - OTP: any 6 digits (e.g., "123456")

The sandbox environment provides simulated data for testing:

- Mock bank accounts
- Mock transactions
- Mock standing orders
- Mock direct debits

## Troubleshooting

### Common Issues

1. **Authorization URL Shows as Text**: If the authorization URL is displayed as text instead of redirecting to the TrueLayer authorization page, make sure:

   - You're using sandbox credentials (client ID starts with "sandbox-")
   - The TrueLayer service is using sandbox URLs (`auth.truelayer-sandbox.com` and `api.truelayer-sandbox.com`)
   - Your application is enabled in the TrueLayer Console

2. **Content Security Policy (CSP) Error**: If you see errors like "Refused to load the script because it violates Content Security Policy directive":

   - This is a browser security restriction in the TrueLayer sandbox environment
   - Use the direct test script (`test_truelayer_direct.py`) instead, which bypasses browser authentication
   - Alternatively, try using a different browser or disabling browser extensions that might interfere with the authentication flow

3. **Invalid Grant Error**: If you get an "invalid_grant" error when exchanging the code for a token:

   - Make sure you're copying the entire code from the redirect URL
   - The code is only valid for a short time (usually a few minutes)
   - The redirect URI in your `.env` file matches exactly what's configured in the TrueLayer Console

4. **No Such Table Error**: If you get a "no such table" error when running tests:

   - Make sure you've created the database and run migrations
   - For testing, you can use mocks to avoid database dependencies

5. **Session Middleware Error**: If you get a "SessionMiddleware must be installed" error:
   - Add SessionMiddleware to your FastAPI application for the connect endpoint
   - For testing, you can mock the session

### Getting Help

If you encounter issues not covered here, refer to:

- [TrueLayer API Documentation](https://docs.truelayer.com/)
- [TrueLayer Sandbox Guide](https://docs.truelayer.com/docs/sandbox-and-testing)
- [TrueLayer Support](https://support.truelayer.com/)
