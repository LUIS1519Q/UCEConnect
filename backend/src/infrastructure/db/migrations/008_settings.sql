ALTER TABLE about_info
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS max_files_per_upload INTEGER DEFAULT 5,
  ADD COLUMN IF NOT EXISTS max_image_size_bytes INTEGER DEFAULT 10485760,
  ADD COLUMN IF NOT EXISTS max_document_size_bytes INTEGER DEFAULT 10485760,
  ADD COLUMN IF NOT EXISTS max_video_size_bytes INTEGER DEFAULT 52428800,
  ADD COLUMN IF NOT EXISTS allowed_image_types JSONB DEFAULT '["image/jpeg","image/jpg","image/png","image/webp"]',
  ADD COLUMN IF NOT EXISTS allowed_document_types JSONB DEFAULT '["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]',
  ADD COLUMN IF NOT EXISTS allowed_video_types JSONB DEFAULT '["video/mp4","video/quicktime","video/webm"]';
