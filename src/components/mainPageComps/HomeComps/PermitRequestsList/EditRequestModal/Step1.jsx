import React, { useState, useEffect } from "react";
import "./Step1.scss";
import { dataTables } from "../../../../../apiService";

const Step1 = ({
  formData,
  handleChange,
  handleNext,
  isReadOnly,
  handlePrevious,
}) => {
  const [errors, setErrors] = useState({});
  const [executiveBodies, setExecutiveBodies] = useState([]);
  const [hireTypes, setHireTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // گزینه‌های ثابت برای capacityMultiplier و scoreRatio (می‌تونی از API بگیری)
  const capacityMultiplierOptions = [
    { value: "3", label: "3 برابر" },
    { value: "4", label: "4 برابر" },
    { value: "5", label: "5 برابر" },
  ];

  const scoreRatioOptions = [
    { value: "70/30", label: "70/30" },
    { value: "40/60", label: "40/60" },
    { value: "30/70", label: "30/70" },
  ];

  // لود داده‌ها از dataTables
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // لود دستگاه‌ها
        const bodies = dataTables["executivebodies"] || [];
        setExecutiveBodies(bodies);

        // لود نوع قرارداد
        const types = dataTables["hiretypes"] || [];
        setHireTypes(types);

// $&
// $&
      } catch (error) {
        console.error("Error loading data:", error);
        setErrors({ api: "خطا در لود داده‌ها از سرور" });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // فیلتر دستگاه‌های اصلی (executiveBodyParent === null)
  const mainOrganizations = executiveBodies.filter(
    (body) => body.executiveBodyParent === null
  );

  // پیدا کردن لیبل دستگاه
  const getOrganizationLabel = (executiveBodyId) => {
    const body = executiveBodies.find(
      (b) => b.executiveBodyId === Number(executiveBodyId)
    );
    return body ? body.executiveBodyName : "نامشخص";
  };

  // پیدا کردن لیبل نوع قرارداد
  const getHireTypeLabel = (hireTypeId) => {
    const type = hireTypes.find((t) => t.hireTypeId === Number(hireTypeId));
    return type ? type.hireTypeName : "نامشخص";
  };

  // پیدا کردن لیبل چند برابر ظرفیت
  const getCapacityMultiplierLabel = (value) => {
    const option = capacityMultiplierOptions.find(
      (opt) => opt.value === value.toString()
    );
    return option ? option.label : "نامشخص";
  };

  // پیدا کردن لیبل نسبت امتیاز
  const getScoreRatioLabel = (value) => {
    const option = scoreRatioOptions.find((opt) => opt.value === value);
    return option ? option.label : "نامشخص";
  };

  // اعتبارسنجی قبل از رفتن به مرحله بعد
  const validateForm = () => {
    const newErrors = {};
    if (!formData.requestExecutiveBodyRef) {
      newErrors.requestExecutiveBodyRef = "لطفاً دستگاه را انتخاب کنید";
    }
    if (!formData.requestHireTypeRef) {
      newErrors.requestHireTypeRef = "لطفاً نوع قرارداد را انتخاب کنید";
    }
    if (!formData.requestHireCapacity || formData.requestHireCapacity <= 0) {
      newErrors.requestHireCapacity = "لطفاً ظرفیت استخدام معتبر وارد کنید";
    }
    if (!formData.requestModel) {
      newErrors.requestModel = "لطفاً نسبت امتیاز را انتخاب کنید";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onNext = () => {
    if (isReadOnly) {
      handleNext();
      return;
    }
    if (validateForm()) {
      handleNext();
    }
  };

  if (loading) {
    return <div>در حال لود داده‌ها...</div>;
  }

  if (errors.api) {
    return <div>{errors.api}</div>;
  }

  return (
    <>
      <h1 className="step-content-Title">اطلاعات پایه</h1>
      <div className="step-content step-1">
        <div className="form-group">
          <label>دستگاه</label>
          {isReadOnly ? (
            <p className="read-only">
              {getOrganizationLabel(formData.requestExecutiveBodyRef)}
            </p>
          ) : (
            <>
              <select
                value={formData.requestExecutiveBodyRef || ""}
                onChange={(e) =>
                  handleChange("requestExecutiveBodyRef", e.target.value)
                }
                required
                disabled={isReadOnly}
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                {mainOrganizations.map((body) => (
                  <option
                    key={body.executiveBodyId}
                    value={body.executiveBodyId}
                  >
                    {body.executiveBodyName}
                  </option>
                ))}
              </select>
              {errors.requestExecutiveBodyRef && (
                <span className="error">{errors.requestExecutiveBodyRef}</span>
              )}
            </>
          )}
        </div>

        <div className="form-group">
          <label>نوع قرارداد</label>
          {isReadOnly ? (
            <p className="read-only">
              {getHireTypeLabel(formData.requestHireTypeRef)}
            </p>
          ) : (
            <>
              <select
                value={formData.requestHireTypeRef || ""}
                onChange={(e) =>
                  handleChange("requestHireTypeRef", e.target.value)
                }
                required
                disabled={isReadOnly}
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                {hireTypes.map((type) => (
                  <option key={type.hireTypeId} value={type.hireTypeId}>
                    {type.hireTypeName}
                  </option>
                ))}
              </select>
              {errors.requestHireTypeRef && (
                <span className="error">{errors.requestHireTypeRef}</span>
              )}
            </>
          )}
        </div>

        <div className="form-group">
          <label>ظرفیت استخدام</label>
          {isReadOnly ? (
            <p className="read-only">
              {formData.requestHireCapacity || "نامشخص"}
            </p>
          ) : (
            <>
              <input
                type="number"
                value={formData.requestHireCapacity || ""}
                onChange={(e) =>
                  handleChange("requestHireCapacity", Number(e.target.value))
                }
                required
                min="1"
                disabled={isReadOnly}
              />
              {errors.requestHireCapacity && (
                <span className="error">{errors.requestHireCapacity}</span>
              )}
            </>
          )}
        </div>

        <div className="form-group">
          <label>چند برابر ظرفیت</label>
          {isReadOnly ? (
            <p className="read-only">
              {getCapacityMultiplierLabel(formData.requestExtraCapacity)}
            </p>
          ) : (
            <select
              value={formData.requestExtraCapacity || ""}
              onChange={(e) =>
                handleChange("requestExtraCapacity", e.target.value)
              }
              disabled={isReadOnly}
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              {capacityMultiplierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>نسبت امتیاز</label>
          {isReadOnly ? (
            <p className="read-only">
              {getScoreRatioLabel(formData.requestModel)}
            </p>
          ) : (
            <>
              <select
                value={formData.requestModel || ""}
                onChange={(e) => handleChange("requestModel", e.target.value)}
                required
                disabled={isReadOnly}
              >
                <option value="" disabled>
                  انتخاب کنید
                </option>
                {scoreRatioOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.requestModel && (
                <span className="error">{errors.requestModel}</span>
              )}
            </>
          )}
        </div>

        <div className="form-group">
          <label>شرایط اختصاصی دستگاه</label>
          {isReadOnly ? (
            <p className="read-only">{formData.requestAuthDesc || "نامشخص"}</p>
          ) : (
            <textarea
              value={formData.requestAuthDesc || ""}
              onChange={(e) => handleChange("requestAuthDesc", e.target.value)}
              placeholder="شرایط اختصاصی دستگاه را وارد کنید"
              disabled={isReadOnly}
            />
          )}
        </div>

        <div className="form-actions">
          <button className="prev-btn" onClick={handlePrevious}>
            مرحله قبل
          </button>
          <button className="next-btn" onClick={onNext} disabled={loading}>
            مرحله بعد
          </button>
        </div>
      </div>
    </>
  );
};

export default Step1;
