# TipNot Medical Education Platform

A comprehensive medical education platform for sharing and accessing educational content.

## Project Structure

This project consists of:

- **Frontend**: React.js application in the `/tipnot-frontend` directory
- **Backend**: Node.js/Express API in the `/tipnot-backend` directory

## Deployment to Render.com

### Option 1: Deploy Frontend and Backend Separately (Recommended)

#### Backend Deployment

1. Create a Web Service on Render
2. Connect your GitHub repository
3. Configure as follows:
   - **Name**: tipnot-backend
   - **Root Directory**: tipnot-backend
   - **Runtime Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `MONGODB_URI`: Your MongoDB connection string (from MongoDB Atlas or other provider)
     - `JWT_SECRET`: Your secure JWT secret
     - `PORT`: 8000 (or leave empty to use Render's default)

#### Frontend Deployment

1. Create a Static Site on Render
2. Connect the same GitHub repository
3. Configure as follows:
   - **Name**: tipnot-frontend
   - **Root Directory**: tipnot-frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build
   - **Environment Variables**:
     - `REACT_APP_API_URL`: URL of your backend service + /api (e.g., https://tipnot-backend.onrender.com/api)
     - `REACT_APP_DIRECT_IMAGE_URL`: URL of your backend service + /direct-image (e.g., https://tipnot-backend.onrender.com/direct-image)

### Option 2: Deploy as a Single Service

1. Create a Web Service on Render
2. Connect your GitHub repository
3. Configure as follows:
   - **Name**: tipnot-v2
   - **Root Directory**: / (root of the repository)
   - **Runtime Environment**: Node
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your secure JWT secret
     - `PORT`: 8000 (or leave empty to use Render's default)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd tipnot-backend && npm install
   cd ../tipnot-frontend && npm install
   ```
3. Create `.env` files in both frontend and backend directories with appropriate configuration
4. Run both services:
   ```
   # Terminal 1
   cd tipnot-backend && npm run dev
   
   # Terminal 2
   cd tipnot-frontend && npm start
   ```

## Environment Variables

### Backend
- `NODE_ENV`: development/production
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Port to run the server (default: 8000)

### Frontend
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_DIRECT_IMAGE_URL`: URL for direct image access

## Features

- User authentication and authorization
- Content management with rich text editing
- Image upload and management
- Responsive design for all devices
- Admin dashboard for content management 