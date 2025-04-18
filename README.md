# Financial App Backend

## Overview
This project is a backend application for a financial management system. It includes features such as user registration, login, wallet functionality, transaction management, investment options, and KYC verification.

## Technologies Used
- Node.js
- TypeScript
- Express.js
- MongoDB (or any other database)
- Twilio (for OTP verification)
- Jest (for testing)

## Project Structure
```
financial-app-backend
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── types
│   └── app.ts
├── tests
├── .env.example
├── .eslintrc.json
├── .gitignore
├── jest.config.js
├── package.json
└── tsconfig.json
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd financial-app-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in the required values.

4. **Run the application**
   ```bash
   npm run start
   ```

5. **Run tests**
   ```bash
   npm run test
   ```

## Features
- **User Registration**: Users can register using their phone number and verify it via OTP.
- **Onboarding Flow**: Users can create a transaction PIN and upload necessary documents.
- **Login Flow**: Users can log in with OTP verification and device management.
- **Wallet Functionality**: Users can send and receive money, create virtual cards, and fund their accounts.
- **Investment Feature**: Users can invest in available funds.
- **KYC Verification**: Users can complete KYC verification through a structured form.

## Contribution
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.