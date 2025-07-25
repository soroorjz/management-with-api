import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/jalali";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./DynamicListModal.scss";
import SubOrganizationsModal from "../SubOrganizationsModal";

const DynamicListModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  editItemId,
  section,
  mode,
}) => {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedSubOrganizations, setSelectedSubOrganizations] = useState([]);

  if (!isOpen || !section) return null;

  const handeleSubmitBody = (section, formData) => {
    if (section.title === "وضعیت نظام وظیفه") {
      return {
        DutyStatusId:
          mode === "add" ? String(data.Result.length + 1) : formData.id,
        DutyStatusName: formData.DutyStatusName,
      };
    }
  };
  const handeleEditBody = (section, formData, id) => {
    if (section.title === "وضعیت نظام وظیفه") {
      return {
        Id: id,
        body: formData,
      };
    }
  };
  // $&
  const { columns, data, title, submitBody } = section;

  const editableColumns = columns.filter(
    (col) => !col.render || col.type === "date"
  );

  const getAllSubOrganizations = (parentId) => {
    const subs = [];
    const findSubs = (id, depth = 1) => {
      const directSubs = data.filter((item) => item.parent === id);
      directSubs.forEach((sub) => {
        subs.push({ ...sub, depth });
        findSubs(sub.id, depth + 1);
      });
    };
    findSubs(parentId);
    return subs;
  };

  const handleOpenSubModal = () => {
    if (formData.id) {
      const subOrganizations = getAllSubOrganizations(formData.id);
      setSelectedSubOrganizations(subOrganizations);
      setIsSubModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = [...data?.Result];

    const newItem =
      mode === "add"
        ? handeleSubmitBody(section, formData)
        : handeleEditBody(section, formData,editItemId);

    if (mode === "add") {
      section.setData(newItem, "add");
      localStorage.setItem(title, JSON.stringify(updatedData));
      updatedData.push(newItem);
    } else if (mode === "edit") {
      section.editData(newItem, "edit");
      localStorage.setItem(title, JSON.stringify(updatedData));
      onSubmit(section);
    } else {
      const index = updatedData.findIndex((item) => item.id === newItem.id);
      updatedData[index] = newItem;
    }

    onClose();
  };

  const renderInput = (column) => {
    const { key, type, options } = column;

    if (type === "date") {
      return (
        <DatePicker
          value={formData[key] || ""}
          calendar={persian}
          locale={persian_fa}
          format="YYYY/MM/DD"
          onChange={(date) =>
            onInputChange({
              target: {
                name: key,
                value: date ? date.format() : "",
              },
            })
          }
          placeholder={`انتخاب ${column.header}`}
          className="form-input"
          calendarPosition="bottom-right"
          required
        />
      );
    }

    if (type === "select") {
      return (
        <select
          name={key}
          value={formData[key] || ""}
          onChange={onInputChange}
          className="form-input"
          required
        >
          <option value="" disabled>
            انتخاب {column.header}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        name={key}
        value={formData[key] || ""}
        onChange={onInputChange}
        placeholder={`وارد کردن ${column.header}`}
        className="form-input"
        required
      />
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal DynamicListModal">
        <div className="modal-content">
          <h2>{mode === "add" ? `افزودن ${title}` : `ویرایش ${title}`}</h2>
          <form onSubmit={handleSubmit}>
            {editableColumns.map((column) => (
              <div key={column.key} className="form-group">
                <label>{column.header}</label>
                {renderInput(column)}
              </div>
            ))}
            {mode === "edit" && title === "دستگاه اجرایی" && (
              <div className="form-group">
                <button
                  type="button"
                  className="sub-orgs-button"
                  onClick={handleOpenSubModal}
                >
                  مشاهده و مدیریت دستگاه‌های تابعه
                </button>
              </div>
            )}
            <div className="modal-actions">
              <button type="submit">ثبت</button>
              <button type="button" onClick={onClose}>
                لغو
              </button>
            </div>
          </form>
        </div>
      </div>
      <SubOrganizationsModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        subOrganizations={selectedSubOrganizations}
        setSubOrganizations={setSelectedSubOrganizations}
        allData={data}
        setAllData={section.setData}
        parentId={formData.id}
        title={title}
      />
    </div>
  );
};

export default DynamicListModal;
