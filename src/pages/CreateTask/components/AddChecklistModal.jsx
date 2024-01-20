import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./AddChecklistModal.module.css"; // Import your CSS styles for the modal

Modal.setAppElement("#root");

const AddChecklistModal = ({ isOpen, onRequestClose, onAddChecklist,toast }) => {
  const [checklistTitle, setChecklistTitle] = useState("");
  const [checklistDesc, setChecklistDesc] = useState("");

  const handleAddClick = () => {
    if(checklistTitle.length<1 && checklistDesc.length<3) {
      toast.error("Bitch, Are you Mad! Fill something...")
      return;}
    onAddChecklist({
      title: checklistTitle,
      desc: checklistDesc,
      done: false,
      id: null,
      index: 0,
    });

    // Clear inputs
    setChecklistTitle("");
    setChecklistDesc("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Checklist Modal"
      className={styles.modal} // Apply your modal styling class
      overlayClassName={styles.overlay} // Apply your overlay styling class
    >
      <div className={styles.modalContent}>
        <h2>Add Checklist</h2>
        <label>
          Title:
          <input
            type="text"
            value={checklistTitle}
            onChange={(e) => setChecklistTitle(e.target.value)}
            className={styles.inputField} // Apply your input field styling class
          />
        </label>
        <label>
          Description:
          <textarea
            value={checklistDesc}
            onChange={(e) => setChecklistDesc(e.target.value)}
            className={styles.textareaField} // Apply your textarea field styling class
          />
        </label>
        <div className={styles.buttonContainer}>
          <button onClick={handleAddClick} className={styles.okButton}>
            OK
          </button>
          <button onClick={onRequestClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddChecklistModal;
