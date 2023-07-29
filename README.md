# Zippyx - File Sharing Simplified

Zippyx is a simple file-sharing application that allows users to share their files without the need for any sign-up process. It uses Node.js, Express, Multer, MongoDB, and other technologies to achieve this functionality.

## Requirements

- Node.js and npm installed on your system.
- MongoDB database to store file data.

## Getting Started

1. Clone the repository:

```
git clone <repository_url>
cd <repository_directory>
```

2. Install the dependencies:

```
npm install
```

3. Create a `.env` file in the root directory with the following environment variables:

```
DATABASE_URL=<your_mongodb_connection_string>
PORT=<desired_port_number>
```

4. Run the application:

```
npm start
```

## How to Use

1. Access the application through your browser at `http://localhost:<PORT>`.

2. Click on the "Browse File to Upload" button to select the file you want to share.

3. Optionally, you can set a password for the file (if required) by entering it in the "Password for file (optional)" field.

4. Click the "Upload" button to start the file upload process.

5. Once the file is uploaded, you will receive a link that you can share with others to download the file.

## Folder Structure

- `models/`: Contains the MongoDB data model definition.
- `public/`: Contains static files (CSS, client-side JavaScript, etc.).
- `views/`: Contains EJS templates for rendering views.
- `uploads/`: Temporary folder to store uploaded files (configurable in the `multer` setup).
- `app.js`: The main application file that sets up the Express server and routes.

## Important Endpoints

- `GET /`: Home page to upload a file.
- `POST /upload`: Endpoint to handle file upload and generate the file-sharing link.
- `GET /file/:id/download`: Endpoint to download the file with the given ID.
- `GET /views/faq.ejs`: FAQ page (Note: FAQ content is not provided in the code snippet).

## Additional Information

- The application uses EJS templates for rendering dynamic content.
- Files are stored in the database with their details (path, original name, optional password).
- Files that have expired (if an expiration date is set) will no longer be available for download.
- The cron job runs daily at midnight to delete expired files from the database and the file system.


Enjoy sharing your files with Zippyx, hassle-free!
