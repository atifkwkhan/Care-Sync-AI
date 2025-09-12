# CareSync AI - Modern Healthcare Management Platform

<div align="center">
  <img src="Logo Files/svg/Color logo - no background.svg" alt="CareSync AI Logo" width="400"/>
</div>

## Overview

CareSync AI is a cutting-edge healthcare management platform designed to streamline and modernize the healthcare experience. Our platform combines advanced technology with user-friendly interfaces to provide efficient, reliable, and secure healthcare management solutions.

## Features

### 🏥 Modern Healthcare Interface
- Clean, intuitive user interface built with React and Tailwind CSS
- Responsive design that works seamlessly across all devices
- Professional and accessible healthcare management dashboard
- Comprehensive patient management system with filtering, sorting, and pagination

### 🔒 Secure Database Integration
- PostgreSQL database integration through Aptible for HIPAA compliance
- Secure data handling and storage
- Encrypted communication channels
- Automated database migrations and sample data seeding

### 💻 Technical Stack
- **Frontend**: React.js with modern JavaScript features
- **Backend**: Node.js with Express.js
- **Styling**: Tailwind CSS for responsive and modern design
- **Database**: PostgreSQL hosted on Aptible
- **Security**: Industry-standard encryption and security practices

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Aptible CLI installed and configured
- Access to the CareSync AI Aptible database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shkhan-caresync/Care-Sync-AI.git
cd Care-Sync-AI
```

2. Install dependencies:
```bash
npm install
```

3. Install and configure Aptible CLI (if not already installed):
```bash
# Install Aptible CLI
brew install aptible/tap/aptible

# Login to Aptible
aptible login
```

4. Create a `.env` file in the root directory with your database credentials:
```bash
# Create .env file
touch .env
```

Add the following to your `.env` file:
```env
# Database credentials (get these from your Aptible tunnel output)
DB_USER=aptible
DB_PASSWORD=K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH
DB_HOST=localhost.aptible.in
DB_NAME=db
# Note: DB_PORT will be provided by the tunnel output

# Complete DATABASE_URL (update the port number from tunnel output)
# DATABASE_URL=postgresql://aptible:K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH@localhost.aptible.in:55887/db
```

## Database Credentials

The application uses the following database credentials (these are provided by Aptible):

- **Username**: `aptible`
- **Password**: `K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH`
- **Host**: `localhost.aptible.in`
- **Database**: `db`
- **Port**: *Dynamic* (provided by tunnel output)

**Security Note**: These credentials are for the development database tunnel only. The production database uses different, more secure credentials.

## Local Development Setup

### Step 1: Start the Database Tunnel

The application uses a PostgreSQL database hosted on Aptible. You need to create a tunnel to access it locally:

```bash
# Start the database tunnel
aptible db:tunnel care-sync-ai-postgresql
```

**Important**: Keep this terminal window open! The tunnel must remain active while developing.

The tunnel will output connection details like:
```
Connect at postgresql://aptible:K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH@localhost.aptible.in:55887/db
Or, use the following arguments:
* Host: localhost.aptible.in
* Port: 55887
* Username: aptible
* Password: K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH
* Database: db
```

**Important**: Copy the complete connection string and port number from this output - you'll need them for the next step.

### Step 2: Start the Backend Server

Open a new terminal window and start the backend server with the database connection:

```bash
# Replace 55887 with the actual port from your tunnel output
DATABASE_URL="postgresql://aptible:K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH@localhost.aptible.in:55887/db" node server.js
```

**Alternative**: You can also set the DATABASE_URL in your `.env` file and use:
```bash
# Add to your .env file:
# DATABASE_URL=postgresql://aptible:K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH@localhost.aptible.in:55887/db

# Then run (server.js automatically loads .env file):
node server.js
```

**Recommended**: Use the `.env` file approach as it's more secure and easier to manage.

The server will:
- Run database migrations automatically
- Create all required tables (users, organizations, patients, doctors, treatments, episodes)
- Seed sample data
- Start on port 8080

You should see output like:
```
Migration 000_enable_uuid_extension.sql completed successfully
Migration 001_create_users_table.sql completed successfully
...
Database initialized successfully
Server running on port 8080
```

### Step 3: Start the Frontend Development Server

Open another terminal window and start the frontend:

```bash
npm run dev
```

The frontend will start on http://localhost:3000

### Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## Development Workflow

### Running All Services

You need **3 terminal windows** running simultaneously:

1. **Terminal 1**: Database tunnel
   ```bash
   aptible db:tunnel care-sync-ai-postgresql
   ```

2. **Terminal 2**: Backend server
   ```bash
   # Option 1: Set DATABASE_URL directly
   DATABASE_URL="postgresql://aptible:K95Lm_hc1GS3K7aIrliHdqlGYlYURNSH@localhost.aptible.in:[PORT]/db" node server.js
   
   # Option 2: Use .env file (recommended)
   node server.js
   ```

3. **Terminal 3**: Frontend development server
   ```bash
   npm run dev
   ```

### Stopping Services

To stop all services:
```bash
# Stop all Node.js processes
pkill -f "node server.js"
pkill -f "vite"

# Stop Aptible tunnel
pkill -f "aptible.*tunnel"
```

### Troubleshooting

**Database Connection Issues:**
- Ensure the Aptible tunnel is running and note the correct port
- Update the DATABASE_URL with the correct port number
- Check that you're logged into Aptible: `aptible login`

**Port Conflicts:**
- Frontend runs on port 3000
- Backend runs on port 8080
- Database tunnel uses a random port (check tunnel output)

**Migration Errors:**
- The server automatically runs migrations on startup
- If migrations fail, check the database connection
- Sample data is automatically seeded for development

## Available Scripts

```bash
# Development
npm run dev          # Start frontend development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run coverage     # Generate test coverage report

# Linting
npm run lint         # Run ESLint
```

## Project Structure

```
Care-Sync-AI/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   └── ...            # Other components
│   ├── api/               # API route handlers
│   ├── db/                # Database configuration and migrations
│   ├── routes/            # React Router configuration
│   ├── context/           # React Context providers
│   ├── tests/             # Test files
│   └── utils/             # Utility functions
├── Logo Files/            # Brand assets
├── dist/                  # Production build output
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
├── tailwind.config.cjs   # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
├── server.js             # Express server
└── README.md             # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Organizations
- `POST /api/organizations/register` - Organization registration
- `POST /api/auth/organization/login` - Organization login

### Patients
- `GET /api/patients` - List patients with filtering and pagination
- `GET /api/patients/:id` - Get specific patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/doctors/list` - Get doctors list
- `GET /api/patients/treatments/list` - Get treatments list

## Database Schema

The application includes the following main tables:
- **users** - User accounts and authentication
- **organizations** - Healthcare organizations
- **patients** - Patient information and records
- **doctors** - Doctor profiles and specialties
- **treatments** - Treatment types and categories
- **episodes** - Patient visits and episode management

## Development

### Code Style
- We use ESLint for JavaScript linting
- Prettier for code formatting
- Follow React best practices and conventions

### Building for Production
To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Security

CareSync AI takes security seriously:
- All data is encrypted in transit and at rest
- Regular security audits and updates
- HIPAA compliance through Aptible integration
- Secure authentication and authorization
- Input validation and SQL injection prevention

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

For any inquiries, please reach out to:
- Website: [CareSync AI](https://www.mycaresync.ai)
- Email: shkhan@caresynchh.com

## Acknowledgments

Special thanks to:
- Homaira and Hossai for their valuable contributions
- The healthcare professionals who provided feedback
- Our development team for their dedication

---

© 2025 CareSync AI. All Rights Reserved.