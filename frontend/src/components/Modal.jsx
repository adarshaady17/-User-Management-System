import "./Modal.css";

const Modal = ({ isOpen, onClose, title, children, confirmText = "Confirm", cancelText = "Cancel", onConfirm, showCancel = true }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          {showCancel && (
            <button className="btn btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;


