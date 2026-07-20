import fs from 'fs';
import path from 'path';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'Please upload a file'));
    }

    const mode = process.env.FILE_STORAGE_MODE || 'LOCAL';

    if (mode === 'ATLAS_DB') {
      // Dynamic base64 data conversion
      const base64Data = req.file.buffer.toString('base64');
      const fileUrl = `data:${req.file.mimetype};base64,${base64Data}`;

      return res.status(200).json(
        new ApiResponse(
          200,
          { fileUrl, url: fileUrl, filename: req.file.originalname, mimetype: req.file.mimetype },
          'File uploaded as Base64 successfully'
        )
      );
    } else {
      // Local disk file storage operations
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(req.file.originalname);
      const filename = uniqueSuffix + ext;
      const filePath = path.join(uploadsDir, filename);

      // Write file from memory stream buffer
      await fs.promises.writeFile(filePath, req.file.buffer);

      // Force HTTPS protocol for cloud hosting reverse proxies (Render, Vercel)
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const fileUrl = `${protocol}://${req.get('host')}/uploads/${filename}`;

      return res.status(200).json(
        new ApiResponse(
          200,
          { fileUrl, url: fileUrl, filename, mimetype: req.file.mimetype },
          'File uploaded to local disk successfully'
        )
      );
    }
  } catch (error) {
    next(error);
  }
};
