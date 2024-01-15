import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./SummaryEdit.module.css";
import htmlToMd from "html-to-md";
import { storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import generateRandomFileName from "../../../helpers/generateRandomFileName.js";

export default function SummaryEdit({ description, handleChange, task }) {
  const [value, setValue] = useState(description);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  // UseEffect to run handleBlur function for value change
  useEffect(() => {
    handleBlur();
  }, [value]);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().on("text-change", () => {
        setValue(quillRef.current.getEditor().root.innerHTML);
      });
    }
  }, []);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.addEventListener("change", handleImageUpload);
    }

    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.removeEventListener("change", handleImageUpload);
      }
    };
  }, [handleImageUpload]);

  async function handleBlur() {
    let replacedValue = value.replace(/!\[image!]/g, "uniquePlaceholder");
    console.log("Before Markdown", replacedValue);
    let markdownValue = htmlToMd(replacedValue);
    markdownValue = markdownValue.replace(/uniquePlaceholder/g, "![image!]");
    console.log("Markdown Value after conversion", markdownValue);
    if (handleChange !== undefined) {
      handleChange({
        target: {
          name: "description",
          value: markdownValue,
        },
      });
    }
  }

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ align: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    },
  };

  async function handleImageUpload() {
    console.log("Uploading Image!!!");
    setIsUploading(true);
    const files = fileInputRef.current.files;
    const file = files[0];
    const storageRef = ref(
      storage,
      `images/${task.project_ID}/${generateRandomFileName()}`
    );
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    insertImageToQuill(downloadURL);
    // Set focus to ReactQuill after image upload
    if (quillRef.current) {
      quillRef.current.focus();
    }
  }

  function insertImageToQuill(imageURL) {
    const range = quillRef.current.getEditor().getSelection();
    const imagePath = `![image!](${imageURL})`;
    if (range) {
      quillRef.current
        .getEditor()
        .clipboard.dangerouslyPasteHTML(range.index, imagePath, "api");
    }
    setIsUploading(false);
    console.log("Image Uploaded");
  }

  return (
    <>
      <ReactQuill
        ref={quillRef}
        className={styles.summaryBox}
        value={value}
        modules={modules}
        theme="snow"
        onChange={setValue}
        placeholder="Task Summary"
        onBlur={handleBlur}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleImageUpload(e)}
      />
      {isUploading && (
        <span style={{ fontSize: "0.8rem" }}>Uploading Image</span>
      )}
    </>
  );
}
