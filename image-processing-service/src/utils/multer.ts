import multer from 'multer';

// Set up multer storage and configuration
const storage = multer.memoryStorage(); // or diskStorage if you want to save to disk
const upload = multer({ storage });

export const uploadImage = upload.single('image'); // Adjust field name as necessary
