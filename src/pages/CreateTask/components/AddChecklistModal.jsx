import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const AddChecklistModal = ({ isOpen, onRequestClose, onAddChecklist }) => {
  const [checklistTitle, setChecklistTitle] = useState("");
  const [checklistDesc, setChecklistDesc] = useState("");
  const handleAddClick = () => {
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
    >
      <h2>Add Checklist</h2>
      <label>
        Title:
        <input
          type="text"
          value={checklistTitle}
          onChange={(e) => setChecklistTitle(e.target.value)}
        />
      </label>
      <label>
        Description:
        <textarea
          value={checklistDesc}
          onChange={(e) => setChecklistDesc(e.target.value)}
        />
      </label>
      <button onClick={handleAddClick}>OK</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default AddChecklistModal;
