import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./SummaryEdit.module.css";
import htmlToMd from "html-to-md";
import { storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import generateRandomFileName from "../../../helpers/generateRandomFileName.js"

export default function SummaryEdit({ description, handleChange, task }) {
  const [value, setValue] = useState(description);
  const quillRef = useRef(null);
  // UseEffect to run handleBlur function for value change

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.getEditor().on("text-change", () => {
        setValue(quillRef.current.getEditor().root.innerHTML);
      });
    }
  }, []);

  async function handleBlur() {
    let replacedValue = value.replace(/!\[image!]/g, 'uniquePlaceholder');
    console.log("Before Markdown",replacedValue)
    let markdownValue = htmlToMd(replacedValue);
    markdownValue = markdownValue.replace(/uniquePlaceholder/g, '![image!]');
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

  async function handleImageUpload(files) {
    console.log("Uploading Image!!!")
    const file = files[0];
    const storageRef = ref(storage, `images/${task.project_ID}/${generateRandomFileName()}`);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    insertImageToQuill(downloadURL);
  }

  function insertImageToQuill(imageURL) {
    console.log("Image Uploaded")
    const range = quillRef.current.getEditor().getSelection();
    const imagePath = `![image!](${imageURL})`;
    if (range) {
      quillRef.current
        .getEditor()
        .clipboard.dangerouslyPasteHTML(range.index, imagePath, "api");
    }
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
      <input type="file" onChange={(e) => handleImageUpload(e.target.files)} />
    </>
  );
}
