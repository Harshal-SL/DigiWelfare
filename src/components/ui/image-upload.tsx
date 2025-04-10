import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';
import { Button } from './button';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export const ImageUpload = ({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // In a real implementation, you would upload the file to your storage service
      // and get back a URL. For now, we'll create a mock URL.
      const mockUrl = URL.createObjectURL(file);
      onChange(mockUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
  });

  if (value) {
    return (
      <div className="relative w-full h-[200px] rounded-md overflow-hidden">
        <div className="absolute right-2 top-2 z-10">
          <Button
            type="button"
            onClick={onRemove}
            variant="destructive"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <img
          src={value}
          alt="Scheme image"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-md p-4 w-full h-[200px] flex items-center justify-center
        ${isDragActive ? 'border-primary' : 'border-gray-300'}
        ${isLoading ? 'opacity-50' : ''}
      `}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
          <p className="text-sm text-gray-500">Uploading...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image here, or click to select one'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PNG, JPG, JPEG up to 5MB
          </p>
        </div>
      )}
    </div>
  );
}; 