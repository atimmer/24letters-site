import { NextResponse } from "next/server";
import { writeFile, access } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  // Check if in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "File and fileName are required" },
        { status: 400 },
      );
    }

    // Get file extension
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${fileName}.${fileExtension}`;

    // Check if file already exists
    const path = join(process.cwd(), "/public/images", newFileName);
    try {
      await access(path);
      return NextResponse.json(
        { error: "File already exists", fileName: newFileName },
        { status: 409 },
      );
    } catch (error) {
      // File doesn't exist, continue with upload
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    await writeFile(path, buffer);

    return NextResponse.json({ fileName: newFileName });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 },
    );
  }
}
