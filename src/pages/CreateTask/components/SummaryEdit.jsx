import React, {  useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./SummaryEdit.module.css";

export default function SummaryEdit({ description, handleChange }) {
  const [value, setValue] = useState(description);

  function handleBlur() {
    console.log("Loses FOCUS!!!");
    // Update the description here
    if (handleChange !== undefined) {
      handleChange({
        target: {
          name: "description",
          value,
        },
      });
    }
  }

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ align: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };
  return (
    <ReactQuill
      className={styles.summaryBox}
      value={value}
      modules={modules}
      theme="snow"
      onChange={setValue}
      placeholder="Task Summary"
      onBlur={handleBlur}
    />
  );
}
