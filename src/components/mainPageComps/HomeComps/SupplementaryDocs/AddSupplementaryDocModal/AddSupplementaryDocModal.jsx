import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./AddSupplementaryDocModal.scss";

const AddSupplementaryDocModal = ({
  isOpen,
  onClose,
  onSubmit,
  examNameOptions,
  organizerOptions,
  organizationOptions,
  jobOptions,
  initialData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    examName: "",
    organizer: "",
    organization: "",
    job: "",
    MultipleCapacity: "",
    examDate: null,
    Province: "",
    detailsFile: null,
    documentFile: null,
  });

  useEffect(() => {
    if (isEditMode && initialData) {
// $&

      let examDateValue = null;
      if (initialData.examDate && typeof initialData.examDate === "string") {
        try {
          examDateValue = new DateObject({
            calendar: persian,
            locale: persian_fa,
            date: initialData.examDate, 
          });
// $&
        } catch (error) {
          console.error("Error parsing examDate:", error);
          examDateValue = null; 
        }
      }

      setFormData({
        examName: initialData.examName || "",
        organizer: initialData.organizer || "",
        organization: initialData.organization || "",
        job: initialData.job || "",
        MultipleCapacity: initialData.MultipleCapacity?.toString() || "",
        examDate: examDateValue,
        Province: initialData.Province || "",
        detailsFile: null,
        documentFile: null,
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
// $&
    onSubmit({
      ...formData,
      examDate: formData.examDate
        ? formData.examDate.format("YYYY/MM/DD")
        : null,
    });
  };

  const provinces = [
    { value: "", label: "انتخاب کنید" },
    { value: "تهران", label: "تهران" },
    { value: "اصفهان", label: "اصفهان" },
    { value: "فارس", label: "فارس" },
    { value: "خوزستان", label: "خوزستان" },
    { value: "مازندران", label: "مازندران" },
    { value: "آذربایجان شرقی", label: "آذربایجان شرقی" },
    { value: "آذربایجان غربی", label: "آذربایجان غربی" },
    { value: "کرمان", label: "کرمان" },
    { value: "سیستان و بلوچستان", label: "سیستان و بلوچستان" },
    { value: "البرز", label: "البرز" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="supplementary-doc-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="supplementary-doc-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="supplementary-doc-modal__title">
              {isEditMode ? "ویرایش مستند" : "افزودن مستند جدید"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="supplementary-doc-modal__form"
            >
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">
                  نام آزمون
                </label>
                {isEditMode ? (
                  <p className="supplementary-doc-modal__display-text">
                    {formData.examName}
                  </p>
                ) : (
                  <select
                    value={formData.examName}
                    onChange={(e) => handleChange("examName", e.target.value)}
                    className="supplementary-doc-modal__select"
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {examNameOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">مجری</label>
                <select
                  value={formData.organizer}
                  onChange={(e) => handleChange("organizer", e.target.value)}
                  className="supplementary-doc-modal__select"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {organizerOptions
                    .filter((opt) => opt.value !== "")
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">دستگاه</label>
                <select
                  value={formData.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  className="supplementary-doc-modal__select"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {organizationOptions
                    .filter((opt) => opt.value !== "")
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">شغل</label>
                <input
                  type="text"
                  value={formData.job}
                  onChange={(e) => handleChange("job", e.target.value)}
                  className="supplementary-doc-modal__input"
                  required
                />
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">
                  چند برابر ظرفیت
                </label>
                <div className="supplementary-doc-modal__capacity-input-wrapper">
                  <input
                    type="number"
                    min="1"
                    value={formData.MultipleCapacity}
                    onChange={(e) =>
                      handleChange("MultipleCapacity", e.target.value)
                    }
                    className="supplementary-doc-modal__input supplementary-doc-modal__input--number"
                    required
                  />
                  <span className="supplementary-doc-modal__capacity-unit">
                    برابر
                  </span>
                </div>
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">
                  تاریخ برگزاری
                </label>
                <DatePicker
                  value={formData.examDate}
                  onChange={(date) => handleChange("examDate", date)}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="supplementary-doc-modal__input"
                  placeholder="انتخاب تاریخ"
                  required
                />
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">استان</label>
                <select
                  value={formData.Province}
                  onChange={(e) => handleChange("Province", e.target.value)}
                  className="supplementary-doc-modal__select"
                  required
                >
                  {provinces.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="supplementary-doc-modal__form-group supplementary-doc-modal__file-upload-group">
                <label className="supplementary-doc-modal__label">
                  جزئیات نتایج
                </label>
                <div className="supplementary-doc-modal__file-upload-wrapper">
                  <label className="supplementary-doc-modal__file-upload-label">
                    <FaUpload className="supplementary-doc-modal__file-upload-icon" />
                    <span>
                      {formData.detailsFile
                        ? formData.detailsFile.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("detailsFile", e.target.files[0])
                      }
                      className="supplementary-doc-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="supplementary-doc-modal__form-group supplementary-doc-modal__file-upload-group">
                <label className="supplementary-doc-modal__label">
                  سند ارزیابی
                </label>
                <div className="supplementary-doc-modal__file-upload-wrapper">
                  <label className="supplementary-doc-modal__file-upload-label">
                    <FaUpload className="supplementary-doc-modal__file-upload-icon" />
                    <span>
                      {formData.documentFile
                        ? formData.documentFile.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("documentFile", e.target.files[0])
                      }
                      className="supplementary-doc-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="supplementary-doc-modal__buttons">
                <button
                  type="submit"
                  className="supplementary-doc-modal__submit-btn"
                >
                  {isEditMode ? "به‌روزرسانی" : "تأیید"}
                </button>
                <button
                  type="button"
                  className="supplementary-doc-modal__cancel-btn"
                  onClick={onClose}
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

export default AddSupplementaryDocModal;
