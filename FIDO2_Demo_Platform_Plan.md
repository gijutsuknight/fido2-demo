# FIDO2 Demo Platform Plan

## Tech Stack

-   **Mobile:** React Native (TypeScript)
-   **Web:** React + Vite + TypeScript
-   **Backend:** Spring Boot 3 (Java 21)
-   **Database:** MySQL
-   **Reverse Proxy:** Nginx
-   **Container:** Docker Compose
-   **CI/CD:** GitHub Actions or Jenkins

## Architecture

``` text
Internet
   |
 Nginx
   |
+--+------------------+
|                     |
React Web      Spring Boot API
React Native         |
                     |
                MySQL
```

## Repository Structure

``` text
fido-demo/
├── backend/
├── web/
├── mobile/
├── nginx/
├── docker/
├── docs/
├── scripts/
├── postman/
└── README.md
```

## Backend

### Dependencies

-   Spring Web
-   Spring Security
-   Spring Data JPA
-   Validation
-   MySQL Driver
-   Flyway
-   JWT
-   Yubico Java WebAuthn Server

### Modules

-   controller
-   service
-   repository
-   entity
-   dto
-   security
-   webauthn
-   config
-   util

### APIs

#### Registration

-   POST /api/register/options
-   POST /api/register/verify

#### Authentication

-   POST /api/login/options
-   POST /api/login/verify

#### User

-   GET /api/me
-   PUT /api/me

#### Credentials

-   GET /api/credentials
-   DELETE /api/credentials/{id}

## Database

### users

-   id
-   username
-   display_name
-   email
-   created_at

### credentials

-   id
-   user_id
-   credential_id
-   public_key
-   sign_count
-   aaguid
-   transports
-   created_at
-   last_used

### challenges

-   id
-   challenge
-   username
-   expires_at

### login_history

-   id
-   user_id
-   device
-   browser
-   ip
-   success
-   created_at

## React Web

Pages: - Home - Register - Login - Dashboard - Credential Management -
Profile - Protocol Viewer - Admin

Libraries: - React - Vite - React Router - TanStack Query - Zustand -
Tailwind CSS - shadcn/ui

## React Native

Pages: - Splash - Login - Register - Dashboard - Credentials - Profile -
Settings

Libraries: - React Navigation - TanStack Query - React Hook Form -
NativeWind or React Native Paper - Passkey library

## Demo Features

-   Passkey registration
-   Passkey login
-   Multi-device login
-   Security key support
-   Credential management
-   Login history
-   Protocol viewer
-   JSON inspector
-   Challenge viewer
-   Authenticator data decoder
-   Attack simulation

## Security

-   HTTPS
-   JWT
-   Challenge expiration
-   Origin verification
-   RP ID verification
-   Signature verification
-   Counter verification

## Docker

Services: - nginx - web - backend - mysql

## Documentation

-   architecture.md
-   backend.md
-   frontend.md
-   mobile.md
-   api.md
-   deployment.md

## Timeline

  Phase                   Duration
  ----------------------- ----------
  Setup                   1 week
  Backend foundation      1 week
  WebAuthn (Web)          2 weeks
  React Native Passkeys   2 weeks
  Credential management   1 week
  Demo tools              1 week
  Deployment & Docs       1 week
