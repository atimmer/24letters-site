"use client";

import { useState, useRef, useEffect } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function UploadForm() {
  const [file, setFile] = useState<FileWithPath | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [markdownCode, setMarkdownCode] = useState("");
  const [fileExists, setFileExists] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when file changes
  useEffect(() => {
    if (file) {
      inputRef.current?.focus();
    }
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name.split(".")[0]);
      setFileExists(false);
    },
  });

  const handleUpload = async () => {
    if (!file || !fileName) {
      setUploadStatus("Please select a file and provide a name");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMarkdownCode(`![${fileName}](/images/${encodeURI(data.fileName)})`);
        setUploadStatus("File uploaded successfully!");
        toast.success("Image uploaded successfully!");
        setFileExists(false);
      } else if (response.status === 409) {
        const data = await response.json();
        setFileExists(true);
        setUploadStatus(`File "${data.fileName}" already exists`);
        toast.error("File already exists");
      } else {
        setUploadStatus("Upload failed");
        toast.error("Failed to upload image");
      }
    } catch (error) {
      setUploadStatus("Error uploading file");
      toast.error("An error occurred while uploading");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpload();
    }
  };

  const appendNumber = () => {
    setFileName((prev) => {
      // Check if the name already ends with a number
      const match = prev.match(/(.*?)(\s\d+)?$/);
      if (match) {
        const baseName = match[1];
        const number = match[2] ? parseInt(match[2]) + 1 : 2;
        return `${baseName} ${number}`;
      }
      return `${prev} 2`;
    });
    setFileExists(false);
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Image Upload</h1>

      <div
        {...getRootProps()}
        className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
      </div>

      {file && (
        <div className="mb-4">
          <p className="mb-2">Selected file: {file.name}</p>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter image name"
              className="flex-1 rounded border p-2"
            />
            {fileExists && (
              <Button
                onClick={appendNumber}
                variant="outline"
                className="whitespace-nowrap"
              >
                Add number
              </Button>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || !fileName}
        className="w-full"
      >
        Upload
      </Button>

      {uploadStatus && (
        <p
          className={`mt-4 ${
            uploadStatus.includes("success") ? "text-green-500" : "text-red-500"
          }`}
        >
          {uploadStatus}
        </p>
      )}

      {markdownCode && (
        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Markdown Code:</h2>
          <div className="rounded bg-gray-100 p-4">
            <code className="block">{markdownCode}</code>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(markdownCode);
                toast.success("Markdown code copied to clipboard");
              }}
              variant="outline"
              className="mt-2 w-full"
            >
              Copy to clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
