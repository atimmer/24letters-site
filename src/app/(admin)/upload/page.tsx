import { notFound } from "next/navigation";
import UploadForm from "./UploadForm";

export default function UploadPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <UploadForm />;
}
