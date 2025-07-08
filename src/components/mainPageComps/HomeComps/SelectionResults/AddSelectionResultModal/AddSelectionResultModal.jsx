import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { FaUpload } from "react-icons/fa";
import "./AddSelectionResultModal.scss";

// تعریف گزینه‌های آزمون
const examOptions = [
  {
    value:
      "آزمون به کارگیری نیرو در شرکت های طرف قرارداد شرکت برق منطقه‌ای اصفهان",
    label:
      "آزمون به کارگیری نیرو در شرکت های طرف قرارداد شرکت برق منطقه‌ای اصفهان",
  },
  {
    value: "آزمون استخدام نيروی پيمانی مشاغل عملياتی آتش‌نشانی شهرداری اصفهان",
    label: "آزمون استخدام نيروی پيمانی مشاغل عملياتی آتش‌نشانی شهرداری اصفهان",
  },
  {
    value: "اولین آزمون استخدامی اختصاصی معلولان",
    label: "اولین آزمون استخدامی اختصاصی معلولان",
  },
];

// تعریف گزینه‌های شغل
const jobOptions = [
  { value: "آینده پژوه", label: "آینده پژوه" },
  {
    value: "استاد دانشگاه (در دانشگاه‌های دولتی)",
    label: "استاد دانشگاه (در دانشگاه‌های دولتی)",
  },
  { value: "برنامه نویس", label: "برنامه نویس" },
  { value: "حسابدار دولتی", label: "حسابدار دولتی" },
  {
    value: "داروساز در داروخانه‌های دولتی",
    label: "داروساز در داروخانه‌های دولتی",
  },
  { value: "كارشناس امور بهزيستي", label: "كارشناس امور بهزيستي" },
  { value: "كارشناس امور توانبخشي", label: "كارشناس امور توانبخشي" },
  { value: "مامور اجرایی محیط زیست", label: "مامور اجرایی محیط زیست" },
  { value: "مربی فنی و حرفه‌ای", label: "مربی فنی و حرفه‌ای" },
  { value: "مسئول دبیرخانه", label: "مسئول دبیرخانه" },
  {
    value: "معاونت پیشگیری از معلولیت‌ها",
    label: "معاونت پیشگیری از معلولیت‌ها",
  },
  { value: "کارشناس امور مالی", label: "کارشناس امور مالی" },
  { value: "کارشناس شبکه", label: "کارشناس شبکه" },
  { value: "معلم (در آموزش و پرورش)", label: "معلم (در آموزش و پرورش)" },
  {
    value: "مهندس برق (در شرکت توانیر یا وزارت نیرو)",
    label: "مهندس برق (در شرکت توانیر یا وزارت نیرو)",
  },
  {
    value: "مهندس عمران (در شهرداری‌ها و وزارت راه و شهرسازی)",
    label: "مهندس عمران (در شهرداری‌ها و وزارت راه و شهرسازی)",
  },
  {
    value: "مهندس مکانیک (در سازمان‌های صنعتی دولتی)",
    label: "مهندس مکانیک (در سازمان‌های صنعتی دولتی)",
  },
  {
    value: "مهندس کشاورزی (در جهاد کشاورزی)",
    label: "مهندس کشاورزی (در جهاد کشاورزی)",
  },
  { value: "نگهبان", label: "نگهبان" },
  {
    value: "پرستار در بیمارستان‌های دولتی",
    label: "پرستار در بیمارستان‌های دولتی",
  },
  {
    value: "پزشک عمومی در مراکز بهداشت دولتی",
    label: "پزشک عمومی در مراکز بهداشت دولتی",
  },
  {
    value: "پژوهشگر در مراکز تحقیقاتی دولتی",
    label: "پژوهشگر در مراکز تحقیقاتی دولتی",
  },
  {
    value: "کارشناس آزمایشگاه محیط زیست",
    label: "کارشناس آزمایشگاه محیط زیست",
  },
  {
    value: "کارشناس آموزش و ترویج حفاظت محیط زیست",
    label: "کارشناس آموزش و ترویج حفاظت محیط زیست",
  },
  {
    value: "کارشناس ارزیاب توان اکولوژیک سرزمین",
    label: "کارشناس ارزیاب توان اکولوژیک سرزمین",
  },
  { value: "کارشناس امور اداری", label: "کارشناس امور اداری" },
  { value: "کارشناس امور مالیاتی", label: "کارشناس امور مالیاتی" },
  {
    value: "کارشناس بررسی آلودگی آب و خاک",
    label: "کارشناس بررسی آلودگی آب و خاک",
  },
  { value: "کارشناس برنامه‌ریزی آموزشی", label: "کارشناس برنامه‌ریزی آموزشی" },
  { value: "کارشناس بهداشت محیط", label: "کارشناس بهداشت محیط" },
  { value: "کارشناس بودجه و مالی", label: "کارشناس بودجه و مالی" },
  {
    value: "کارشناس تغذیه در مراکز درمانی دولتی",
    label: "کارشناس تغذیه در مراکز درمانی دولتی",
  },
  {
    value: "کارشناس حیات وحش و بیماریهای حیات وحش",
    label: "کارشناس حیات وحش و بیماریهای حیات وحش",
  },
  { value: "کارشناس زیستگاههای آبی", label: "کارشناس زیستگاههای آبی" },
  { value: "کارشناس زیستگاههای خشکی", label: "کارشناس زیستگاههای خشکی" },
  {
    value: "کارشناس فناوری اطلاعات و شبکه",
    label: "کارشناس فناوری اطلاعات و شبکه",
  },
  { value: "کارشناس منابع انسانی", label: "کارشناس منابع انسانی" },
  { value: "کارشناس پایش محیط زیست", label: "کارشناس پایش محیط زیست" },
];

const AddSelectionResultModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  organizationOptions = [],
  user, // پراپ جدید برای دسترسی به اطلاعات کاربر
}) => {
  const [formData, setFormData] = useState({
    examName: "",
    job: "",
    organization:
      user?.role === "دستگاه ستادی"
        ? user?.organization || "وزارت آموزش و پرورش"
        : "", // مقدار پیش‌فرض برای دستگاه ستادی
    date: "",
    candidateFile: null,
    status: "در انتظار ثبت نتایج",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        examName: initialData.examName || "",
        job: initialData.job || "",
        organization:
          user?.role === "دستگاه ستادی"
            ? user?.organization || "وزارت آموزش و پرورش"
            : initialData.organization || "",
        date: initialData.date || "",
        candidateFile: initialData.candidateFile || null,
        status: initialData.status || "در انتظار ثبت نتایج",
      });
    }
  }, [initialData, user]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (date) => {
    handleChange("date", date ? date.format("YYYY/MM/DD") : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      candidateFile: formData.candidateFile
        ? typeof formData.candidateFile === "string"
          ? formData.candidateFile
          : formData.candidateFile.name
        : "",
    };
    onSubmit(submittedData);
    setFormData({
      examName: "",
      job: "",
      organization:
        user?.role === "دستگاه ستادی"
          ? user?.organization || "وزارت آموزش و پرورش"
          : "",
      date: "",
      candidateFile: null,
      status: "در انتظار ثبت نتایج",
    });
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.value = "";
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      examName: "",
      job: "",
      organization:
        user?.role === "دستگاه ستادی"
          ? user?.organization || "وزارت آموزش و پرورش"
          : "",
      date: "",
      candidateFile: null,
      status: "در انتظار ثبت نتایج",
    });
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.value = "";
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-selection-result-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="add-selection-result-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="add-selection-result-modal__title">
              {initialData ? "ویرایش نتیجه گزینش" : "افزودن نتیجه گزینش"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="add-selection-result-modal__form"
            >
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">
                  اسم آزمون
                </label>
                <input
                  type="text"
                  value={formData.examName}
                  disabled
                  className="add-selection-result-modal__input disabled"
                />
              </div>
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">شغل</label>
                <select
                  value={formData.job}
                  onChange={(e) => handleChange("job", e.target.value)}
                  className="add-selection-result-modal__select"
                  required
                >
                  <option value="" disabled>
                    انتخاب شغل
                  </option>
                  {jobOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {user?.role !== "دستگاه ستادی" && (
                <div className="add-selection-result-modal__form-group">
                  <label className="add-selection-result-modal__label">
                    دستگاه
                  </label>
                  <select
                    value={formData.organization}
                    onChange={(e) =>
                      handleChange("organization", e.target.value)
                    }
                    className="add-selection-result-modal__select"
                    required
                  >
                    <option value="" disabled>
                      انتخاب دستگاه
                    </option>
                    {organizationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">
                  تاریخ برگزاری
                </label>
                <DatePicker
                  value={formData.date}
                  onChange={handleDateChange}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                  inputClassName="add-selection-result-modal__date-picker"
                  calendarPosition="bottom-right"
                  required
                />
              </div>
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">
                  نتایج گزینش
                </label>
                <div className="add-selection-result-modal__file-upload-wrapper">
                  <label className="add-selection-result-modal__file-upload-label">
                    <FaUpload className="add-selection-result-modal__file-upload-icon" />
                    <span>
                      {formData.candidateFile
                        ? typeof formData.candidateFile === "string"
                          ? formData.candidateFile
                          : formData.candidateFile.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("candidateFile", e.target.files[0])
                      }
                      className="add-selection-result-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="add-selection-result-modal__buttons">
                <button
                  type="submit"
                  className="add-selection-result-modal__submit-btn"
                >
                  {initialData ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="add-selection-result-modal__cancel-btn"
                  onClick={handleClose}
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

export default AddSelectionResultModal;
