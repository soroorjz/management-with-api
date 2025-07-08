import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "./SelectionOrganizationModal.scss";

const toPersianDigits = (num) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

const SelectionOrganizationModal = ({
  isModalOpen,
  isSuccessModalOpen,
  isDeleteModalOpen,
  isDeleteSuccessModalOpen,
  setIsModalOpen,
  setIsSuccessModalOpen,
  setIsDeleteModalOpen,
  setIsDeleteSuccessModalOpen,
  handleModalClose,
  handleFormChange,
  handleFormSubmit,
  handleDeleteConfirm,
  handleDeleteCancel,
  formData,
  isEditMode,
  filterConfig,
}) => {
  const examOptions = [
    "آزمون به کارگیری نیرو در شرکت های طرف قرارداد شرکت برق منطقه‌ای اصفهان",
    "آزمون استخدامی کادر اداری قوه قضاییه",
    "آزمون استخدام نیروی پیمانی مشاغل عملیاتی آتش‌ نشانی شهرداری‌ های کشور",
    "آزمون استخدامی تامین نیروی بانک شهر",
    "آزمون استخدامی نیروی انسانی سازمان زندانها و اقدامات تامینی و تربیتی کشور",
    "آزمون استخدام نيروی پيمانی مشاغل عملياتی آتش‌نشانی شهرداری اصفهان",
    "اولین آزمون استخدامی اختصاصی معلولان",
    "آزمون بکارگیری نیروی قرارداد کار معین شهرداری‌ ها",
    "آزمون استخدامی شرکت فرودگاه‌ها و ناوبری هوایی ایران",
    "آزمون استخدام نیروی انسانی وزارت امور خارجه جمهوری اسلامی",
  ];

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="selection-organization-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="selection-organization-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>
                {isEditMode
                  ? "ویرایش سازماندهی گزینش"
                  : "افزودن سازماندهی گزینش"}
              </h3>
              <form
                onSubmit={handleFormSubmit}
                className="selection-organization-modal__form"
              >
                <div className="selection-organization-modal__form-group">
                  <label>عنوان آزمون</label>
                  {isEditMode ? (
                    <p className="modal-text">{formData.examName}</p>
                  ) : (
                    <select
                      value={formData.examName || ""}
                      onChange={(e) =>
                        handleFormChange("examName", e.target.value)
                      }
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {examOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* <div className="selection-organization-modal__form-group">
                  <label>دستگاه</label>
                  <select
                    value={formData.organization || ""}
                    onChange={(e) =>
                      handleFormChange("organization", e.target.value)
                    }
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {filterConfig[0].options
                      .filter((opt) => opt.value)
                      .map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div> */}
                <div className="selection-organization-modal__form-group">
                  <label>شغل</label>
                  <select
                    value={formData.job || ""}
                    onChange={(e) => handleFormChange("job", e.target.value)}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {filterConfig[1].options
                      .filter((opt) => opt.value)
                      .map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>گروه</label>
                  <input
                    type="text"
                    value={formData.group || ""}
                    onChange={(e) => handleFormChange("group", e.target.value)}
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>مکان برگزاری</label>
                  <input
                    type="text"
                    value={formData.venue || ""}
                    onChange={(e) => handleFormChange("venue", e.target.value)}
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>مدارک موردنیاز</label>
                  <input
                    type="text"
                    value={formData.documents || ""}
                    onChange={(e) =>
                      handleFormChange("documents", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>تاریخ برگزاری</label>
                  <DatePicker
                    value={formData.examDate}
                    onChange={(date) => handleFormChange("examDate", date)}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    inputClass="form-control"
                    placeholder="انتخاب تاریخ"
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>ساعت برگزاری</label>
                  <TimePicker
                    value={formData.examTime}
                    onChange={(time) => handleFormChange("examTime", time)}
                    format="HH:mm"
                    disableClock={true}
                    clearIcon={null}
                    locale="fa-IR"
                    className="time-picker"
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>لیست نفرات (فایل اکسل)</label>
                  <div className="file-upload-wrapper">
                    <label className="file-upload-label">
                      <FaUpload className="file-upload-icon" />
                      <span>
                        {formData.candidateList
                          ? formData.candidateList.name ||
                            formData.candidateList
                          : "انتخاب فایل"}
                      </span>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFormChange("candidateList", e.target.files[0])
                        }
                        className="file-upload-input"
                        accept=".xlsx,.xls"
                      />
                    </label>
                  </div>
                </div>
                <div className="selection-organization-modal__form-actions">
                  <button
                    type="submit"
                    className="selection-organization-modal__btn selection-organization-modal__btn--submit"
                  >
                    {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    className="selection-organization-modal__btn selection-organization-modal__btn--cancel"
                    onClick={handleModalClose}
                  >
                    لغو
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccessModalOpen && (
          <>
            <motion.div
              className="selection-organization-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="selection-organization-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>
                سازماندهی گزینش با موفقیت {isEditMode ? "ویرایش" : "اضافه"} شد!
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="selection-organization-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="selection-organization-modal__delete-content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>تأیید حذف</h3>
              <p>آیا از حذف سازماندهی گزینش مطمئن هستید؟</p>
              <div className="selection-organization-modal__form-actions">
                <button
                  className="selection-organization-modal__btn selection-organization-modal__btn--submit"
                  onClick={handleDeleteConfirm}
                >
                  بله
                </button>
                <button
                  className="selection-organization-modal__btn selection-organization-modal__btn--cancel"
                  onClick={handleDeleteCancel}
                >
                  خیر
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteSuccessModalOpen && (
          <>
            <motion.div
              className="selection-organization-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="selection-organization-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>سازماندهی با موفقیت حذف شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SelectionOrganizationModal;
