import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "jalali-moment";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import "./EditRequestModal.scss";
import {
  steps,
  stepIcons,
  jobOptions,
  provinceOptions,
  cityOptions,
  degreeOptions,
  fieldOptions,
  defaultFormData,
} from "./stepperData";
import { useAuth } from "../../../../../AuthContext";

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const generateRandomQuotaTable = (hiringCapacity = 120) => {
  const quotaTable = [
    {
      jobTitle: "کارشناس",
      province: "تهران",
      city: "تهران",
      location: "دفتر مرکزی",
      free: { female: "0", male: "0", both: "0" },
      quota3: { female: "0", male: "0", both: "0" },
      quota5: { female: "0", male: "0", both: "0" },
      quota25: { female: "0", male: "0", both: "0" },
    },
  ];
  let remaining = hiringCapacity;
  const quotas = ["free", "quota3", "quota5", "quota25"];
  const genders = ["female", "male", "both"];

  quotas.forEach((quotaType) => {
    genders.forEach((gender) => {
      const maxAllocation = Math.min(
        remaining,
        Math.floor(Math.random() * (remaining / 2))
      );
      quotaTable[0][quotaType][gender] = maxAllocation.toString();
      remaining -= maxAllocation;
    });
  });

  if (remaining > 0) {
    quotaTable[0].free.both = (
      parseInt(quotaTable[0].free.both) + remaining
    ).toString();
  }

  return quotaTable;
};

const EditRequestModal = ({
  isOpen,
  onClose,
  request,
  onUpdate,
  isEditMode = true,
  isReadOnly = false,
  fromPage = "permitRequests",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => deepCopy(defaultFormData));
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormDataReset, setIsFormDataReset] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { user } = useAuth();
  const resetFormData = () => {
// $&
    const today = moment().locale("fa").format("YYYY/MM/DD");
    const newFormData = deepCopy({
      ...defaultFormData,
      requestRegisterDate: today,
      requestStatusRef: 1, // "در انتظار"
      rejectionReason: "",
    });
    setFormData(newFormData);
    setIsFormDataReset(true);
    try {
      localStorage.removeItem("formData");
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
    console.log(
      "After reset - formData.requestRegisterDate:",
      newFormData.requestRegisterDate
    );
  };

  useEffect(() => {
// $&
    if (isOpen) {
      setCurrentStep(1);
      setErrorMessage("");
      setIsFormDataReset(false);
      if (!isEditMode) {
// $&
        resetFormData();
      }
    } else {
      resetFormData();
    }
  }, [isOpen, isEditMode]);

  useEffect(() => {
    if (isOpen && isEditMode && request) {
// $&
      let newQuotaTable = request.quotaTable;

      const isQuotaTableValid =
        newQuotaTable &&
        newQuotaTable.length > 0 &&
        newQuotaTable.every(
          (row) =>
            row.free &&
            row.quota3 &&
            row.quota5 &&
            row.quota25 &&
            ["female", "male", "both"].every(
              (gender) =>
                row.free[gender] !== undefined &&
                row.quota3[gender] !== undefined &&
                row.quota5[gender] !== undefined &&
                row.quota25[gender] !== undefined
            )
        );

      if (!isQuotaTableValid) {
        console.log(
          "QuotaTable is invalid or missing, generating random quotas"
        );
        newQuotaTable = generateRandomQuotaTable(
          request.requestHireCapacity || 120
        );
      }

      const newFormData = deepCopy({
        ...defaultFormData,
        requestId: request.requestId || null,
        requestCode: request.requestCode || "",
        requestDate: request.requestDate || "",
        requestRegisterDate:
          request.requestRegisterDate &&
          moment(request.requestRegisterDate, [
            "YYYY/MM/DD",
            "YYYY-MM-DD",
          ]).isValid()
            ? request.requestRegisterDate
            : moment().locale("fa").format("YYYY/MM/DD"),
        requestHireTypeRef: request.requestHireTypeRef || "",
        requestExecutiveBodyRef: request.requestExecutiveBodyRef || "",
        requestSubExecutiveBodyRef: request.requestSubExecutiveBodyRef || "",
        requestConfirmDate: request.requestConfirmDate || "",
        requestModel: request.requestModel || "",
        requestAuthDesc: request.requestAuthDesc || "",
        requestHireCapacity: request.requestHireCapacity || "",
        requestExtraCapacity: request.requestExtraCapacity || "",
        requestJobCount: request.requestJobCount || 0,
        requestStatusRef: request.requestStatusRef || 1,
        quotaTable: newQuotaTable,
        rejectionReason: request.rejectionReason || "",
      });
      setFormData(newFormData);
      setIsFormDataReset(true);
      console.log(
        "After setting edit data - formData.requestRegisterDate:",
        newFormData.requestRegisterDate
      );
    }
  }, [isOpen, isEditMode, request]);

  useEffect(() => {
// $&
    console.log(
      "Current quotaTable:",
      JSON.stringify(formData.quotaTable, null, 2)
    );
    try {
      localStorage.setItem("formData", JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [formData]);

  const calculateTotalQuota = (quotaTable) => {
    return quotaTable.reduce((total, row) => {
      const quotas = ["free", "quota3", "quota5", "quota25"];
      const rowTotal = quotas.reduce((rowSum, quotaType) => {
        const quota = row[quotaType];
        const female = parseInt(quota.female) || 0;
        const male = parseInt(quota.male) || 0;
        const both = parseInt(quota.both) || 0;
        return rowSum + female + male + both;
      }, 0);
      return total + rowTotal;
    }, 0);
  };

  const addQuotaRow = () => {
    setFormData((prev) => ({
      ...prev,
      quotaTable: [
        ...prev.quotaTable,
        {
          jobTitle: "",
          province: "",
          city: "",
          location: "",
          free: { female: "0", male: "0", both: "0" },
          quota3: { female: "0", male: "0", both: "0" },
          quota5: { female: "0", male: "0", both: "0" },
          quota25: { female: "0", male: "0", both: "0" },
        },
      ],
    }));
  };

  const handleDeleteRow = (rowIndex) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      quotaTable: prev.quotaTable.filter((_, index) => index !== rowIndex),
    }));
  };

  const handleDeleteEducationRow = (rowIndex) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      educationTable: prev.educationTable.filter(
        (_, index) => index !== rowIndex
      ),
    }));
  };

  const addEducationRow = () => {
    setFormData((prev) => ({
      ...prev,
      educationTable: [
        ...prev.educationTable,
        { job: "", degree: "", field: [] },
      ],
    }));
  };

  const handleDeleteExamRow = (tableKey, rowIndex) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [tableKey]: prev[tableKey].filter((_, index) => index !== rowIndex),
    }));
  };

  const addExamRow = (tableKey) => {
    setFormData((prev) => ({
      ...prev,
      [tableKey]: [
        ...prev[tableKey],
        { job: "", title: "", share: "", resources: "" },
      ],
    }));
  };

  const setSupplementaryEvaluationTable = (newTable) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      supplementaryEvaluationTable: newTable,
    }));
  };

  if (!isOpen) return null;
  if (isEditMode && !request) return null;
  if (!isFormDataReset && !isEditMode) return null;

  const handleNext = () => {
    if (isReadOnly) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (currentStep === 3) {
      const totalQuota = calculateTotalQuota(formData.quotaTable);
      const hiringCapacity = parseInt(formData.requestHireCapacity) || 0;
      const hasEmptyJobTitle = formData.quotaTable.some(
        (row) => !row.jobTitle || row.jobTitle.trim() === ""
      );

      if (hasEmptyJobTitle) {
        setErrorMessage("لطفاً عنوان تمام شغل‌ها را وارد کنید.");
        return;
      }

      if (totalQuota !== hiringCapacity) {
        const difference = Math.abs(hiringCapacity - totalQuota);
        if (totalQuota < hiringCapacity) {
          setErrorMessage(`${difference} نفر از ظرفیت استخدام باقی مانده است.`);
        } else {
          setErrorMessage(
            `${difference} نفر بیشتر از ظرفیت استخدام وارد شده است.`
          );
        }
        return;
      }
    }

    if (currentStep === 4) {
      const quotaJobs = formData.quotaTable.map((row) => row.jobTitle);
      const educationTable = formData.educationTable;

      const hasEmptyFields = educationTable.some(
        (row) =>
          !row.job ||
          row.job.trim() === "" ||
          !row.degree ||
          row.field.length === 0
      );
      if (hasEmptyFields) {
        setErrorMessage(
          "لطفاً تمام فیلدها (شغل، مقطع، و حداقل یک رشته) را برای همه ردیف‌ها پر کنید."
        );
        return;
      }

      const educationJobs = educationTable.map((row) => row.job);
      const missingJobs = quotaJobs.filter(
        (job) => !educationJobs.includes(job)
      );
      if (missingJobs.length > 0) {
        setErrorMessage(
          `لطفاً برای شغل‌های زیر حداقل یک مقطع و رشته مشخص کنید: ${missingJobs.join(
            "، "
          )}`
        );
        return;
      }

      const jobDegreeMap = {};
      educationTable.forEach((row, index) => {
        if (!jobDegreeMap[row.job]) {
          jobDegreeMap[row.job] = [];
        }
        jobDegreeMap[row.job].push({ degree: row.degree, index });
      });

      const duplicateDegreeErrors = [];
      Object.entries(jobDegreeMap).forEach(([job, degrees]) => {
        const seenDegrees = new Set();
        degrees.forEach(({ degree, index }) => {
          if (seenDegrees.has(degree)) {
            duplicateDegreeErrors.push(
              `مقطع "${degree}" برای شغل "${job}" در ردیف ${
                index + 1
              } تکراری است.`
            );
          } else {
            seenDegrees.add(degree);
          }
        });
      });

      if (duplicateDegreeErrors.length > 0) {
        setErrorMessage(duplicateDegreeErrors.join(" "));
        return;
      }
    }

    if (currentStep === 5) {
      // Validation logic for step 4
    }

    if (currentStep === 6) {
      // Validation logic for step 5
    }

    setErrorMessage("");
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (key, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuotaTableChange = (
    rowIndex,
    field,
    value,
    quotaType,
    genderType
  ) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const updatedQuotaTable = [...prev.quotaTable];
      if (quotaType && genderType) {
        updatedQuotaTable[rowIndex][quotaType][genderType] = value;
      } else {
        updatedQuotaTable[rowIndex][field] = value;
      }
      return { ...prev, quotaTable: updatedQuotaTable };
    });
  };

  const handleEducationTableChange = (rowIndex, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const updatedEducationTable = [...prev.educationTable];
      updatedEducationTable[rowIndex][field] = value;
      return { ...prev, educationTable: updatedEducationTable };
    });
  };

  const handleExamTableChange = (tableKey, rowIndex, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const updatedTable = [...prev[tableKey]];
      updatedTable[rowIndex][field] = value;
      return { ...prev, [tableKey]: updatedTable };
    });
  };

  const handleSupplementaryTableChange = (rowIndex, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const updatedTable = [...prev.supplementaryEvaluationTable];
      updatedTable[rowIndex][field] = value;
      return { ...prev, supplementaryEvaluationTable: updatedTable };
    });
  };

  const handlePermitNumberChange = (value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, permitNumber: value }));
  };

  const handleSubmit = (status, rejectionReason) => {
    console.log("Submitting from EditRequestModal:", {
      status,
      rejectionReason,
    });
    if (isReadOnly) return;
// $&
    const permitNumber =
      formData.permitNumber || `PERMIT-${Math.floor(Math.random() * 100000)}`;
    const formattedData = {
      ...formData,
      requestRegisterDate:
        formData.requestRegisterDate ||
        moment().locale("fa").format("YYYY/MM/DD"),
      requestConfirmDate:
        status === "تأیید شده"
          ? moment().locale("fa").format("YYYY/MM/DD")
          : "",
      permitNumber,
      requestStatusRef:
        status === "تأیید شده" ? 2 : status === "رد شده" ? 3 : 1,
      rejectionReason: rejectionReason || "",
      requestExtraCapacity: `${formData.requestExtraCapacity}`,
    };
    try {
      localStorage.setItem("formData", JSON.stringify(formattedData));
      console.log(
        "Saved to localStorage:",
        JSON.stringify(formattedData, null, 2)
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    onUpdate({
      ...(isEditMode ? request : {}),
      ...formattedData,
    });
    if (status === "تأیید شده") {
      setIsSuccessModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
// $&
    resetFormData();
    onClose();
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    onClose();
  };

  return (
    <motion.div
      className="edit-request-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="edit-request-modal-content"
        initial={{ scale: 0.7, y: "-50%" }}
        animate={{ scale: 1, y: "0%" }}
        exit={{ scale: 0.7, y: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <div className="edit-request-modal-header">
          <h3>
            {fromPage === "issuedPermits"
              ? "بررسی مجوزهای صادر شده"
              : isReadOnly
              ? "مشاهده درخواست مجوز"
              : isEditMode
              ? "ویرایش درخواست مجوز"
              : "افزودن درخواست مجوز"}
          </h3>
        </div>
        <div className="stepperContent">
          <div className="stepper-header">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`stepper-step ${
                  currentStep === index + 1 ? "active" : ""
                } ${currentStep > index + 1 ? "completed" : ""}`}
              >
                <div className="stepper-circle">{stepIcons[index]}</div>
                <div className="stepper-info">
                  <p className="stepper-name">{step.name}</p>
                  <p className="stepper-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="edit-request-modal-body">
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            {currentStep === 1 && (
              <Step6
                formData={formData}
                handlePermitNumberChange={handlePermitNumberChange}
                handlePrevious={handlePrevious}
                handleSubmit={handleSubmit}
                isEditMode={isEditMode}
                isReadOnly={isReadOnly}
                handleNext={handleNext}
                handleClose={handleClose}
              />
            )}
            {currentStep === 2 && (
              <Step1
                handlePrevious={handlePrevious}
                formData={formData}
                handleChange={handleChange}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
              />
            )}
            {currentStep === 3 && (
              <Step2
                key={`step2-${isOpen}-${isFormDataReset}`}
                formData={formData}
                jobOptions={jobOptions}
                provinceOptions={provinceOptions}
                cityOptions={cityOptions}
                handleQuotaTableChange={handleQuotaTableChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                errorMessage={errorMessage}
                isReadOnly={isReadOnly}
                addQuotaRow={addQuotaRow}
                handleDeleteRow={handleDeleteRow}
              />
            )}
            {currentStep === 4 && (
              <Step3
                formData={formData}
                degreeOptions={degreeOptions}
                fieldOptions={fieldOptions}
                handleEducationTableChange={handleEducationTableChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
                addEducationRow={addEducationRow}
                handleDeleteEducationRow={handleDeleteEducationRow}
              />
            )}
            {currentStep === 5 && (
              <Step4
                formData={formData}
                handleExamTableChange={handleExamTableChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
                addExamRow={addExamRow}
                handleDeleteExamRow={handleDeleteExamRow}
              />
            )}
            {currentStep === 6 && (
              <Step5
                formData={formData}
                handleSupplementaryTableChange={handleSupplementaryTableChange}
                setSupplementaryEvaluationTable={
                  setSupplementaryEvaluationTable
                }
                handlePrevious={handlePrevious}
                handleClose={handleClose}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
              />
            )}
            {currentStep === 7 && (
              <Step7
                formData={formData}
                handlePermitNumberChange={handlePermitNumberChange}
                handlePrevious={handlePrevious}
                handleSubmit={handleSubmit}
                isEditMode={isEditMode}
                isReadOnly={isReadOnly}
                handleNext={handleNext}
                handleClose={handleClose}
              />
            )}
          </div>
        </div>
      </motion.div>

      {isSuccessModalOpen && (
        <motion.div
          className="success-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="success-modal-content"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>تأیید موفقیت‌آمیز</h3>
            <p>تأیید درخواست مجوز با موفقیت انجام شد.</p>
            <button
              className="success-modal-close-btn"
              onClick={closeSuccessModal}
            >
              بستن
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EditRequestModal;
