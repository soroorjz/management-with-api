import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import "./ExamResultModal.scss";
import { useAuth } from "../../../../../AuthContext";

const ExamResultModal = ({
  isOpen,
  onClose,
  onSubmit,
  newResult,
  setNewResult,
  filterConfig,
  examOptions,
  isEditMode = false,
}) => {
  const { user } = useAuth();

  const handleFileChange = (e, key, labelKey) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setNewResult((prev) => ({
        ...prev,
        [key]: fileUrl,
        [labelKey]: file.name,
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="assign-permit__modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="assign-permit__modal-content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3>{isEditMode ? "ویرایش نتیجه آزمون" : "افزودن نتیجه آزمون"}</h3>
            <form onSubmit={onSubmit} className="modal-form">
              <div className="assign-permit__modal-form-group">
                <label>آزمون</label>
                {isEditMode ? (
                  <p className="modal-text">{newResult.examName}</p>
                ) : (
                  <select
                    value={newResult.examName}
                    onChange={(e) =>
                      setNewResult({ ...newResult, examName: e.target.value })
                    }
                    required
                  >
                    {examOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {user?.role !== "مجری آزمون کتبی" && (
                <div className="assign-permit__modal-form-group">
                  <label>مجری</label>
                  <select
                    value={newResult.organizer}
                    onChange={(e) =>
                      setNewResult({ ...newResult, organizer: e.target.value })
                    }
                    required
                  >
                    {filterConfig
                      .find((f) => f.key === "organizer")
                      ?.options?.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      )) || <option value="">هیچ گزینه‌ای موجود نیست</option>}
                  </select>
                </div>
              )}
              <div className="assign-permit__modal-form-group">
                <label>فایل نتایج</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleFileChange(e, "resultFile", "resultFileName")
                    }
                    required={!isEditMode}
                  />
                  <span className="file-upload-label">
                    {newResult.resultFileName}
                  </span>
                  <FaUpload className="file-upload-icon" />
                </div>
              </div>
              <div className="assign-permit__modal-form-group">
                <label>جزئیات نتایج</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleFileChange(e, "detailsFile", "detailsFileName")
                    }
                    required={!isEditMode}
                  />
                  <span className="file-upload-label">
                    {newResult.detailsFileName}
                  </span>
                  <FaUpload className="file-upload-icon" />
                </div>
              </div>
              <div className="assign-permit__modal-form-group">
                <label>شرکت‌کنندگان</label>
                <input
                  type="number"
                  value={newResult.participants}
                  onChange={(e) =>
                    setNewResult({
                      ...newResult,
                      participants: e.target.value,
                    })
                  }
                  required
                  min="1"
                />
              </div>
              <div className="assign-permit__modal-form-group">
                <label>دستگاه</label>
                <select
                  value={newResult.organization}
                  onChange={(e) =>
                    setNewResult({
                      ...newResult,
                      organization: e.target.value,
                    })
                  }
                  required
                >
                  {filterConfig
                    .find((f) => f.key === "organization")
                    ?.options?.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    )) || <option value="">هیچ گزینه‌ای موجود نیست</option>}
                </select>
              </div>
              <div className="assign-permit__modal-form-actions">
                <button
                  type="submit"
                  className="assign-permit__modal-btn assign-permit__modal-btn--submit"
                >
                  {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="assign-permit__modal-btn assign-permit__modal-btn--cancel"
                  onClick={onClose} // اصلاح onClk به onClick
                >
                  انصراف
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExamResultModal;
