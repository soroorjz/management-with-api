import React, { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import Select from "react-select";
import "./Step2.scss";

const Step2 = ({
  formData,
  provinceOptions,
  cityOptions,
  handleQuotaTableChange,
  handlePrevious,
  handleNext,
  errorMessage,
  jobOptions,
  isReadOnly = false,
  addQuotaRow,
  handleDeleteRow,
}) => {
  useEffect(() => {
    console.log(
      "Step2 - Current quotaTable:",
      JSON.stringify(formData.quotaTable, null, 2)
    );
  }, [formData.quotaTable]);

  const handleAddQuotaRow = () => {
    if (isReadOnly) return;
    addQuotaRow();
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      width: "100%",
      minWidth: "100px",
      border: "1px solid #d1d5db",
      borderRadius: "0.25rem",
      fontSize: "0.8rem",
      padding: "0",
      margin: "0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      "&:focus": {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
      },
      direction: "rtl",
    }),
    menu: (base) => ({
      ...base,
      width: "100%",
      zIndex: 10001,
      borderRadius: "0.25rem",
      fontSize: "0.8rem",
      color: "#4b5563",
      direction: "rtl",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "rgba(4, 54, 74, 0.0588235294)" : "white",
      color: "#04364a",
      padding: "0.3rem 0.5rem",
      cursor: "pointer",
      fontSize: "0.8rem",
      textAlign: "right",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#4b5563",
      fontSize: "0.8rem",
      textAlign: "right",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#04364a",
      fontSize: "0.8rem",
      textAlign: "right",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 4px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: "0",
    }),
  };

  // تابع کمکی برای پیدا کردن مقدار معتبر برای react-select
  const getSelectValue = (value, options) => {
    return options.find((option) => option.value === value) || null;
  };

  return (
    <div className="step-content">
      <div className="quota-table">
        <table>
          <thead>
            <tr>
              <th rowSpan="2">شغل</th>
              <th rowSpan="2">استان</th>
              <th rowSpan="2">شهرستان</th>
              <th rowSpan="2">محل</th>
              <th colSpan="3">آزاد</th>
              <th colSpan="3">سهمیه ۳%</th>
              <th colSpan="3">سهمیه ۵%</th>
              <th colSpan="3">سهمیه ۲۵%</th>
              {!isReadOnly && <th rowSpan="2">حذف</th>}
            </tr>
            <tr>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
            </tr>
          </thead>
          <tbody>
            {formData.quotaTable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="jobTd">
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.jobTitle || "نامشخص"}
                    </span>
                  ) : (
                    <Select
                      value={getSelectValue(row.jobTitle, jobOptions)}
                      noOptionsMessage={() => "یافت نشد"}
                      className="SearchingOptiopns"
                      onChange={(selectedOption) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "jobTitle",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      options={jobOptions}
                      isDisabled={isReadOnly}
                      placeholder="انتخاب کنید"
                      isSearchable
                      styles={customStyles}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.province || "نامشخص"}
                    </span>
                  ) : (
                    <Select
                      value={getSelectValue(row.province, provinceOptions)}
                      onChange={(selectedOption) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "province",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      options={provinceOptions}
                      isDisabled={isReadOnly}
                      placeholder="انتخاب کنید"
                      isSearchable
                      noOptionsMessage={() => "یافت نشد"}
                      styles={customStyles}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.city || "نامشخص"}</span>
                  ) : (
                    <Select
                      value={
                        row.province && cityOptions[row.province]
                          ? getSelectValue(row.city, cityOptions[row.province])
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "city",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      options={row.province ? cityOptions[row.province] : []}
                      isDisabled={!row.province || isReadOnly}
                      placeholder="انتخاب کنید"
                      isSearchable
                      noOptionsMessage={() => "یافت نشد"}
                      styles={customStyles}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.location || "نامشخص"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={row.location || ""}
                      className="locationInput"
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="محل خدمت"
                      disabled={isReadOnly}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.free.female || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.free.female || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "free",
                          e.target.value,
                          "free",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.free.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.free.male || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "free",
                          e.target.value,
                          "free",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.free.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.free.both || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "free",
                          e.target.value,
                          "free",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.quota3.female || "0"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota3.female || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota3",
                          e.target.value,
                          "quota3",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota3.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota3.male || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota3",
                          e.target.value,
                          "quota3",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota3.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota3.both || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota3",
                          e.target.value,
                          "quota3",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.quota5.female || "0"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota5.female || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota5",
                          e.target.value,
                          "quota5",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota5.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota5.male || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota5",
                          e.target.value,
                          "quota5",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota5.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota5.both || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota5",
                          e.target.value,
                          "quota5",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.quota25.female || "0"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota25.female || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota25",
                          e.target.value,
                          "quota25",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota25.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota25.male || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota25",
                          e.target.value,
                          "quota25",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota25.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.quota25.both || ""}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota25",
                          e.target.value,
                          "quota25",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                {!isReadOnly && (
                  <td>
                    <>
                      <button
                        className="Step2delete-btn"
                        onClick={() => handleDeleteRow(rowIndex)}
                        disabled={isReadOnly}
                        data-tooltip-id={`delete-tooltip-${rowIndex}`}
                        data-tooltip-content="حذف ردیف"
                      >
                        <MdDelete />
                      </button>
                      <Tooltip
                        id={`delete-tooltip-${rowIndex}`}
                        className="step2ToolTip"
                      />
                    </>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isReadOnly && (
        <button className="add-job-btn" onClick={handleAddQuotaRow}>
          افزودن ردیف
        </button>
      )}
      {errorMessage && <div className="permit-warning">{errorMessage}</div>}
      <div className="form-actions">
        <button className="prev-btn" onClick={handlePrevious}>
          مرحله قبل
        </button>
        <button className="next-btn" onClick={handleNext}>
          مرحله بعد
        </button>
      </div>
    </div>
  );
};

export default Step2;
