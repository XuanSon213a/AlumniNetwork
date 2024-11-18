interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
}

const uploadFile = async (file: File): Promise<CloudinaryResponse> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  
  const uploadPreset = 'chat-app-file'; // Thay thế bằng preset của bạn nếu cần

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not defined in environment variables.');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Upload failed:', errorData);
    throw new Error('Failed to upload file');
  }

  const responseData: CloudinaryResponse = await response.json();
  return responseData;
};

export default uploadFile;
