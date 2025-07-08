import React, { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./AddPermitModal.scss";

const AddPermitModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    organization: "",
    permitImage: null,
    permitImageName: "فایلی انتخاب نشده",
    date: new Date(),
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fileKey, fileNameKey) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [fileKey]: file,
      [fileNameKey]: file ? file.name : "فایلی انتخاب نشده",
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date: date.toDate() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>مجوز جذب</h3>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="organization">دستگاه</label>
            <select
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            >
              <option value="">انتخاب کنید</option>
              <option value="وزارت آموزش و پرورش">وزارت آموزش و پرورش</option>
              <option value="وزارت بهداشت">وزارت بهداشت</option>
              <option value="وزارت نیرو">وزارت نیرو</option>
              <option value="وزارت نفت">وزارت نفت</option>
            </select>
          </div>
          <div className="form-group">
            <label>تصویر مجوز</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, "permitImage", "permitImageName")
                }
                required
              />
              <span className="file-upload-label">
                {formData.permitImageName}
              </span>
              <FaUpload className="file-upload-icon" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date">تاریخ</label>
            <DatePicker
              value={formData.date}
              onChange={handleDateChange}
              calendar={persian}
              locale={persian_fa}
              className="date-picker"
              format="YYYY/MM/DD"
              required
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="description">توضیحات</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="توضیحات مجوز را وارد کنید..."
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="modal-submit">
              ثبت
            </button>
            <button type="button" className="modal-cancel" onClick={onClose}>
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPermitModal;