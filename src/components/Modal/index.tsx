import React from "react";
import "./styles.css";

interface ModalProps {
  children: any;
  isShowing: boolean;
  onClose: () => void;
}

const Modal = ({ children, isShowing, onClose }: ModalProps) => {
  if (!isShowing) {
    return <div></div>;
  }

  return (
    <div className="modal">
      <div className="modal-body relative shadow">
        <div className="modal-close" onClick={onClose}>
          Close
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
