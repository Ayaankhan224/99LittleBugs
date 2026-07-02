# ANKER

ANKER is a resume parser and candidate ranking application. It parses resume files (PDF, DOCX, and ZIP archives) and scores candidates based on their experience and roles against requirements.

This is a demo version of the application. The pricing page and paywall use Razorpay in test/sandbox mode. You can upgrade to the Premium plan using the following test card credentials.

## Demo Card Details
* Card Number: 5500 6700 0000 1002
* Expiry Date: 12/30
* CVV: 123

## Features
* Upload resumes in PDF, DOCX, or ZIP formats.
* Scoring system based on experience, current role, and company.
* Free plan: up to 5 uploads, basic candidate ranking.
* Premium plan: unlimited uploads, deep ranking, and CSV exports.

## Tech Stack
* Frontend: React, Vite, Tailwind CSS, GSAP, Lenis.
* Backend: Node.js, Express, PostgreSQL, Razorpay SDK, document parsers.

## Project Structure
* backend/: Express server and database models.
* frontend/: React client app.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Ayaankhan224/ANKER.git
   cd ANKER
   ```

2. Set up environment variables:
   Create a .env file in the backend directory:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   DB_HOST=your_host
   DB_PORT=5432
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_db_name
   ```

   Create a .env file in the frontend directory:
   ```env
   VITE_RAZORPAY_KEY_ID=your_key_id
   ```

3. Install dependencies:
   From the root directory, run:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. Run the application:
   From the root directory, run:
   ```bash
   npm run dev
   ```
