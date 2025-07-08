import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./ExamCenterModal.scss";

const ExamCenterModal = ({
  isModalOpen,
  isAddSuccessModalOpen,
  isDeleteModalOpen,
  isDeleteSuccessModalOpen,
  setIsModalOpen,
  setIsAddSuccessModalOpen,
  setIsDeleteModalOpen,
  setIsDeleteSuccessModalOpen,
  handleModalClose,
  handleFormChange,
  handleFormSubmit,
  handleDeleteConfirm,
  handleDeleteCancel,
  newCenter,
  isEditMode,
  provinces,
  cities,
  genders,
  statuses,
  categories,
}) => {
  // Debugging: log cities and selected cityId and provinceId
// $&
// $&
// $&

  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (newCenter.provinceId) {
      setFilteredCities(cities); // همه شهرها را نمایش بده
    } else {
      setFilteredCities([]);
    }
  }, [newCenter.provinceId, cities]);

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="exam-center-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="exam-center-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>{isEditMode ? "ویرایش حوزه آزمون" : "افزودن حوزه آزمون"}</h3>
              <form
                onSubmit={handleFormSubmit}
                className="exam-center-modal__form"
              >
                <div className="exam-center-modal__form-group">
                  <label>عنوان</label>
                  <input
                    type="text"
                    value={newCenter.title || ""}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    required
                    placeholder="عنوان حوزه را وارد کنید"
                    maxLength={100}
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>استان</label>
                  <select
                    value={newCenter.provinceId || ""}
                    onChange={(e) => handleFormChange("provinceId", e.target.value)}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="exam-center-modal__form-group">
                  <label>شهر</label>
                  <select
                    value={newCenter.cityId || ""}
                    onChange={(e) => handleFormChange("cityId", e.target.value)}
                    required
                    disabled={!newCenter.provinceId}
                  >
                    <option value="">انتخاب کنید</option>
                    {filteredCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="exam-center-modal__form-group">
                  <label>ظرفیت (نفر)</label>
                  <input
                    type="number"
                    value={newCenter.capacity || ""}
                    onChange={(e) =>
                      handleFormChange("capacity", e.target.value)
                    }
                    required
                    min="1"
                    max="10000"
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "لطفاً یک عدد مثبت بین 1 تا 10000 وارد کنید"
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    placeholder="تعداد ظرفیت"
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>جنسیت</label>
                  <select
                    value={newCenter.gender || ""}
                    onChange={(e) => handleFormChange("gender", e.target.value)}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {genders
                      .filter((g) => g.value !== "")
                      .map((gender) => (
                        <option key={gender.value} value={gender.value}>
                          {gender.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="exam-center-modal__form-group">
                  <label>نام مدیر حوزه</label>
                  <input
                    type="text"
                    value={newCenter.firstName || ""}
                    onChange={(e) =>
                      handleFormChange("firstName", e.target.value)
                    }
                    required
                    placeholder="نام مدیر را وارد کنید"
                    maxLength={50}
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>نام خانوادگی مدیر حوزه</label>
                  <input
                    type="text"
                    value={newCenter.lastName || ""}
                    onChange={(e) =>
                      handleFormChange("lastName", e.target.value)
                    }
                    required
                    placeholder="نام خانوادگی مدیر را وارد کنید"
                    maxLength={50}
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>تاریخ قرارداد</label>
                  <DatePicker
                    value={newCenter.contractDate || ""}
                    onChange={(date) => handleFormChange("contractDate", date)}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    inputClass="form-control"
                    placeholder="انتخاب تاریخ"
                    required
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>مبلغ قرارداد (ریال)</label>
                  <input
                    type="number"
                    value={newCenter.contractAmount || ""}
                    onChange={(e) =>
                      handleFormChange("contractAmount", e.target.value)
                    }
                    required
                    min="0"
                    max="1000000000"
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "لطفاً یک عدد غیرمنفی تا 1 میلیارد وارد کنید"
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    placeholder="مبلغ قرارداد"
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>آدرس</label>
                  <input
                    type="text"
                    value={newCenter.address || ""}
                    onChange={(e) =>
                      handleFormChange("address", e.target.value)
                    }
                    required
                    placeholder="آدرس حوزه را وارد کنید"
                    maxLength={200}
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>تلفن</label>
                  <input
                    type="tel"
                    value={newCenter.phone || ""}
                    onChange={(e) =>
                      handleFormChange(
                        "phone",
                        e.target.value.replace(/[^\d]/g, "")
                      )
                    }
                    required
                    pattern="\d{10,11}"
                    title="شماره تلفن باید 10 یا 11 رقم باشد"
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "لطفاً شماره تلفن معتبر 10 یا 11 رقمی وارد کنید"
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    placeholder="شماره تلفن"
                  />
                </div>
                {/* <div className="exam-center-modal__form-group">
                  <label>دسته‌بندی</label>
                  <select
                    value={newCenter.category || ""}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {categories
                      .filter((c) => c.value !== "")
                      .map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                  </select>
                </div> */}
                <div className="exam-center-modal__form-actions">
                  <button
                    type="submit"
                    className="exam-center-modal__btn exam-center-modal__btn--submit"
                  >
                    {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    className="exam-center-modal__btn exam-center-modal__btn--cancel"
                    onClick={handleModalClose}
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
              className="exam-center-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="exam-center-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>حوزه آزمون با موفقیت {isEditMode ? "ویرایش" : "اضافه"} شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="exam-center-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="exam-center-modal__delete-content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>تأیید حذف</h3>
              <p>آیا از حذف حوزه آزمون مطمئن هستید؟</p>
              <div className="exam-center-modal__form-actions">
                <button
                  className="exam-center-modal__btn exam-center-modal__btn--submit"
                  onClick={handleDeleteConfirm}
                >
                  بله
                </button>
                <button
                  className="exam-center-modal__btn exam-center-modal__btn--cancel"
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
              className="exam-center-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="exam-center-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>حوزه آزمون با موفقیت حذف شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExamCenterModal;