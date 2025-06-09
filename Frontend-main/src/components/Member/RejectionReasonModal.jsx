// components/RejectionModal.jsx
import React from "react";

const RejectionModal = ({ onClose, onConfirm, rejectionReason, setRejectionReason }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>거절 사유 입력</h3>
        <textarea
          rows="4"
          placeholder="거절 사유를 입력하세요"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          style={styles.textarea}
        />
        <div style={styles.buttons}>
          <button onClick={onConfirm} style={styles.confirm}>확인</button>
          <button onClick={onClose} style={styles.cancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    resize: "none"
  },
  buttons: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },
  confirm: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "4px",
    cursor: "pointer"
  },
  cancel: {
    backgroundColor: "#ccc",
    border: "none",
    padding: "8px 14px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default RejectionModal;

