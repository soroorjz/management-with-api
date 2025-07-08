import React from "react";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";

const AddDesignerModal = ({
  isOpen,
  onClose,
  newDesigner,
  setNewDesigner,
  onSubmit,
  provinces,
  statuses,
}) => {
  const handleAddFormChange = (key, value) => {
    setNewDesigner((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      className="modal-overlay assign-permit__modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="modal-content assign-permit__modal-content"
        initial={{ scale: 0.7, y: "-50%" }}
        animate={{ scale: 1, y: "0%" }}
        exit={{ scale: 0.7, y: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <h3>افزودن طراح</h3>
        <form
          onSubmit={onSubmit}
          className="QuestionDesignerManagement-modal-form"
        >
          <div className="QuestionDesignerform-group">
            <label>نام</label>
            <input
              type="text"
              value={newDesigner.firstName}
              onChange={(e) => handleAddFormChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>نام خانوادگی</label>
            <input
              type="text"
              value={newDesigner.lastName}
              onChange={(e) => handleAddFormChange("lastName", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>شماره همراه</label>
            <input
              type="text"
              value={newDesigner.mobileNumber}
              onChange={(e) =>
                handleAddFormChange("mobileNumber", e.target.value)
              }
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>کد ملی</label>
            <input
              type="text"
              value={newDesigner.nationalCode}
              onChange={(e) =>
                handleAddFormChange("nationalCode", e.target.value)
              }
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>شماره شناسنامه</label>
            <input
              type="text"
              value={newDesigner.idNumber}
              onChange={(e) => handleAddFormChange("idNumber", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>تصویر قرارداد</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                value={newDesigner.contractImage}
                className="file-upload-input"
                placeholder="تصویر قرارداد را وارد کنید"
                onChange={(e) =>
                  handleAddFormChange("contractImage", e.target.value)
                }
              />
              <span className="file-upload-label"></span>
              <FaUpload className="file-upload-icon" />
            </div>
          </div>
          <div className="QuestionDesignerform-group">
            <label>مبلغ قرارداد (ریال)</label>
            <input
              type="number"
              value={newDesigner.contractAmount}
              onChange={(e) =>
                handleAddFormChange("contractAmount", e.target.value)
              }
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>رتبه عملکرد</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="1"
                  checked={newDesigner.performanceRating === "1"}
                  onChange={(e) =>
                    handleAddFormChange("performanceRating", e.target.value)
                  }
                  required
                />
                ضعیف
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="2"
                  checked={newDesigner.performanceRating === "2"}
                  onChange={(e) =>
                    handleAddFormChange("performanceRating", e.target.value)
                  }
                />
                متوسط
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="3"
                  checked={newDesigner.performanceRating === "3"}
                  onChange={(e) =>
                    handleAddFormChange("performanceRating", e.target.value)
                  }
                />
                خوب
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="4"
                  checked={newDesigner.performanceRating === "4"}
                  onChange={(e) =>
                    handleAddFormChange("performanceRating", e.target.value)
                  }
                />
                عالی
              </label>
            </div>
          </div>
          <div className="QuestionDesignerform-group">
            <label>نام کاربری</label>
            <input
              type="text"
              value={newDesigner.username}
              onChange={(e) => handleAddFormChange("username", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>رمز عبور</label>
            <input
              type="password"
              value={newDesigner.password}
              onChange={(e) => handleAddFormChange("password", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>استان</label>
            <select
              value={newDesigner.province}
              onChange={(e) => handleAddFormChange("province", e.target.value)}
              required
            >
              <option value="">انتخاب کنید</option>
              {provinces
                .filter((p) => p.value !== "")
                .map((province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="QuestionDesignerform-group QuestionDesignerformFullWidth">
            <label>آدرس</label>
            <textarea
              value={newDesigner.address}
              onChange={(e) => handleAddFormChange("address", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group QuestionDesignerformFullWidth">
            <label>نظر مجری</label>
            <textarea
              value={newDesigner.managerComment}
              onChange={(e) =>
                handleAddFormChange("managerComment", e.target.value)
              }
            />
          </div>
          <div className="assign-permit__modal-buttons full-width">
            <button
              type="submit"
              className="modal-submit assign-permit__modal-btn assign-permit__modal-btn--submit"
            >
              افزودن
            </button>
            <button
              type="button"
              className="modal-cancel assign-permit__modal-btn assign-permit__modal-btn--cancel"
              onClick={onClose}
            >
              انصراف
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddDesignerModal;
