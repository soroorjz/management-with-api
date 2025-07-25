import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import "./AssessmentMaterialsModal.scss";

const AssessmentMaterialsModal = ({
  isModalOpen,
  isAddSuccessModalOpen,
  setIsModalOpen,
  setIsAddSuccessModalOpen,
  handleMaterialSubmit,
  handleFormChange,
  newMaterial,
  selectedMaterial,
  isEditMode,
  examTitles,
  organizations,
  jobs,
}) => {
  const materialData = isEditMode ? selectedMaterial : newMaterial;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFormChange("materials", file.name);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="assessment-materials-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="assessment-materials-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>
                {isEditMode
                  ? "ویرایش مواد ارزیابی"
                  : "افزودن مواد ارزیابی جدید"}
              </h3>
              <form
                onSubmit={handleMaterialSubmit}
                className="assessment-materials-modal__form"
              >
                <div className="assessment-materials-modal__form-group">
                  <label>عنوان آزمون</label>
                  {isEditMode ? (
                    <p className="modal-text">{materialData.examTitle}</p>
                  ) : (
                    <select
                      value={materialData.examTitle}
                      onChange={(e) =>
                        handleFormChange("examTitle", e.target.value)
                      }
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {examTitles.map((title) => (
                        <option key={title.value} value={title.value}>
                          {title.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="assessment-materials-modal__form-group">
                  <label>دستگاه</label>
                  <select
                    value={materialData.organization}
                    onChange={(e) =>
                      handleFormChange("organization", e.target.value)
                    }
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {organizations.map((org) => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="assessment-materials-modal__form-group">
                  <label>شغل</label>
                  <select
                    value={materialData.job}
                    onChange={(e) => handleFormChange("job", e.target.value)}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {jobs.map((job) => (
                      <option key={job.value} value={job.value}>
                        {job.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="assessment-materials-modal__form-group">
                  <label>مواد ارزیابی (فایل اکسل)</label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      required={!isEditMode}
                      className="assessment-materials-modal__file-input"
                    />
                    <span className="file-upload-label">
                      {materialData.materials || "فایلی انتخاب نشده"}
                    </span>
                    <FaUpload className="file-upload-icon" />
                  </div>
                </div>
                <div className="assessment-materials-modal__form-actions">
                  <button
                    type="submit"
                    className="assessment-materials-modal__btn assessment-materials-modal__btn--submit"
                  >
                    {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    className="assessment-materials-modal__btn assessment-materials-modal__btn--cancel"
                    onClick={() => setIsModalOpen(false)}
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddSuccessModalOpen && (
          <>
            <motion.div
              className="assessment-materials-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="assessment-materials-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>
                مواد ارزیابی با موفقیت {isEditMode ? "ویرایش" : "اضافه"} شد!
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AssessmentMaterialsModal;
