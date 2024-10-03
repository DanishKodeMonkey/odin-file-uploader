# File Upload and Management System

## Project Overview

This project is a file upload and management system that allows authenticated users to upload, manage, and download files and folders. The application uses Node.js, Express, and Prisma with PostgreSQL, along with Cloudinary for storing files. Users can create folders, upload files, and navigate through their directory structure seamlessly.

## Features

- User authentication with Passport.js
- File upload with Multer and storage in Cloudinary
- User-specific folders for organizing files
- File and folder management, including creating, viewing, and downloading
- Responsive design with EJS templating

## Technologies Used

- Node.js
- Express.js
- Prisma (with PostgreSQL)
- Cloudinary for file storage
- Passport.js for authentication
- Multer for file handling
- EJS for templating
- HTML/CSS with bootstrap for frontend design

## File Structure

```
project-root/
│
├── src/
│   ├── config/
│   │   ├── cloudinary.js                   - Cloudinary configuration and export
│   │   ├── multer.js                       - Multer configuration and export
│   │   └── passport.js                     - Passport configuration and export
│   │
│   ├── controllers/
│   │   ├── filesController.js              - Functions relating to file management, including viewing, 
│   │                                         deleting, and downloading files
│   │   ├── indexController.js              - A single function to render the index page
│   │   ├── uploaderController.js           - Functions pertaining to the upload feature of the project
│   │   └── usersController.js              - User-related pages and logic involving Passport and 
│   │                                         authentication
│   │
│   ├── db/
│   │   ├── prismaClient.js                 - Prisma configuration and export for database interactions
│   │   └── prismaQueries.js                - Prisma SQL query functions for data retrieval and 
│   │                                         manipulation
│   │
│   ├── middleware/
│   │   └── authMiddleware.js               - Custom authentication middleware to protect routes
│   │
│   ├── routers/
│   │   ├── filesRouter.js                  - Route definitions for file management-related requests
│   │   ├── indexRouter.js                  - Route definitions for the index page
│   │   ├── uploaderRouter.js               - Route definitions for the file upload functionality
│   │   └── usersRouter.js                  - Route definitions for user-related actions and 
│   │                                         authentication
│   │
│   ├── utils/
│   │   └── helpers.js                      - Helper functions used throughout the application
│   │
│   └── views/
│       ├── pages/
│       │   ├── fileDetailsView.ejs         - View for displaying file details
│       │   ├── folderView.ejs              - View for displaying folder contents
│       │   ├── index.ejs                   - Main index page view
│       │   ├── login.ejs                   - Login page view
│       │   ├── signup.ejs                  - Signup page view
│       │   └── userFiles.ejs               - User's file management page view
│       │
│       └── partials/
│           ├── _fileUploadModal.ejs        - Modal partial for file uploads
│           ├── _folderCreationModal.ejs    - Modal partial for folder creation
│           ├── error.ejs                   - Error display partial
│           ├── fileDetails.ejs             - Partial for displaying file details
│           ├── fileExplorer.ejs            - Partial for file and folder exploration
│           ├── footer.ejs                  - Footer partial for all views
│           ├── head.ejs                    - Head partial for common head elements
│           ├── header.ejs                  - Header partial for navigation
│           └── errorPage.ejs               - Error page view when an issue occurs
│
├── .gitignore                              - Specifies files and directories to ignore in Git
├── .prettierrc                             - Prettier configuration file
├── app.js                                  - Main application entry point
├── package.json                            - Project metadata and dependencies
└── package-lock.json                       - Locks dependencies to specific versions
```


# Usage

- Users can register and log in to their accounts.
- After logging in, users can create folders and upload files.
- Users can navigate their files and folders, view details of files, and download them.


# Check it out!

[Have a look at the project here](https://odin-file-uploader-v38i.onrender.com/)