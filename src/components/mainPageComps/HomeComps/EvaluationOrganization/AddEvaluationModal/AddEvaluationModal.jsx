import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { FaUpload } from "react-icons/fa";
import { getHandler } from "../../../../../apiService";
import "./AddEvaluationModal.scss";

const persianToLatinDigits = (str) => {
  if (!str) return str;
  const persianDigits = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], i);
  }
  return result;
};

const AddEvaluationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  evaluation,
}) => {
  const [newEvaluation, setNewEvaluation] = useState({
    examId: "",
    examTitle: "",
    jobId: "",
    job: "",
    executiveBodyId: "",
    organization: "",
    provinceId: "",
    province: "",
    cityId: "",
    City: "",
    examDate: null,
    examTime: "00:00",
    examEndDate: null,
    examEndTime: "00:00",
    groupId: "",
    group: "",
    examinees: null,
    evaluators: null,
    status: "در انتظار اجرا", // تغییر stauss به status
  });
  const [examTitles, setExamTitles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const examResponse = await getHandler(
          "analyzeacceptedlist/analyzeacceptedlists"
        );
        const examData = examResponse.Result || examResponse;
// $&
        setExamTitles(
          examData
            .filter((item) => item?.AnalyzeAcceptedListExamRef?.ExamName)
            .map((item) => ({
              value: item.AnalyzeAcceptedListExamRef.ExamName,
              label: item.AnalyzeAcceptedListExamRef.ExamName,
              id: item.AnalyzeAcceptedListExamRef.ExamId,
            }))
        );
        setOrganizations(
          examData
            .filter(
              (item) =>
                item?.AnalyzeAcceptedListExecutiveBodyRef?.ExecutiveBodyName
            )
            .map((item) => ({
              value: item.AnalyzeAcceptedListExecutiveBodyRef.ExecutiveBodyName,
              label: item.AnalyzeAcceptedListExecutiveBodyRef.ExecutiveBodyName,
              id: item.AnalyzeAcceptedListExecutiveBodyRef.ExecutiveBodyId,
              examName: item.AnalyzeAcceptedListExamRef.ExamName,
            }))
        );

        const jobResponse = await getHandler("joblocation/joblocations");
        const jobData = jobResponse.Result || jobResponse;
// $&
        setJobs(
          jobData
            .filter((item) => item?.JobLocationJobRef?.JobName)
            .map((item) => ({
              value: item.JobLocationJobRef.JobName,
              label: item.JobLocationJobRef.JobName,
              id: item.JobLocationJobRef.JobId,
              executiveBody:
                item.JobLocationExecutiveBodyRef?.ExecutiveBodyName || "",
            }))
        );

        const geographyResponse = await getHandler("geography/geographies");
        const geographyData = geographyResponse.Result || geographyResponse;
        setProvinces(
          geographyData
            .filter((item) => !item?.GeographyParent)
            .map((item) => ({
              value: item?.GeographyName || "",
              label: item?.GeographyName || "",
              id: item?.GeographyId || "",
            }))
        );
        setCities(
          geographyData
            .filter((item) => item?.GeographyParent)
            .map((item) => ({
              value: item?.GeographyName || "",
              label: item?.GeographyName || "",
              id: item?.GeographyId || "",
              parentId: item?.GeographyParent?.GeographyId || "",
            }))
        );

        const groupResponse = await getHandler(
          "acceptedonesgroup/acceptedonesgroups"
        );
        const groupData = groupResponse.Result || groupResponse;
        setGroups(
          groupData
            .filter((item) => item?.AcceptedOnesGroupName)
            .map((item) => ({
              value: item?.AcceptedOnesGroupName || "",
              label: item?.AcceptedOnesGroupName || "",
              id: item?.AcceptedOnesGroupId || "",
            }))
        );

        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت گزینه‌ها: " + err.message);
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (isEditMode && evaluation) {
      let formattedExamTime = evaluation.OrganizingAssessmentRunTime || "00:00";
      if (formattedExamTime && !/^\d{2}:\d{2}$/.test(formattedExamTime)) {
        const timeParts = formattedExamTime.match(/(\d{1,2}):(\d{2})/);
        if (timeParts) {
          formattedExamTime = `${timeParts[1].padStart(2, "0")}:${
            timeParts[2]
          }`;
        } else {
          formattedExamTime = "00:00";
        }
      }

      let formattedExamEndTime =
        evaluation.OrganizingAssessmentEndTime || "00:00";
      if (formattedExamEndTime && !/^\d{2}:\d{2}$/.test(formattedExamEndTime)) {
        const timeParts = formattedExamEndTime.match(/(\d{1,2}):(\d{2})/);
        if (timeParts) {
          formattedExamEndTime = `${timeParts[1].padStart(2, "0")}:${
            timeParts[2]
          }`;
        } else {
          formattedExamEndTime = "00:00";
        }
      }

      setNewEvaluation({
        examId: evaluation.OrganizingAssessmentExamRef?.ExamId || "",
        examTitle: evaluation.OrganizingAssessmentExamRef?.ExamName || "",
        jobId: evaluation.OrganizingAssessmentJobRef?.JobId || "",
        job: evaluation.OrganizingAssessmentJobRef?.JobName || "",
        executiveBodyId:
          evaluation.OrganizingAssessmentExecutiveBodyRef?.ExecutiveBodyId ||
          "",
        organization:
          evaluation.OrganizingAssessmentExecutiveBodyRef?.ExecutiveBodyName ||
          "",
        provinceId:
          evaluation.OrganizingAssessmentProvinceRef?.GeographyId || "",
        province:
          evaluation.OrganizingAssessmentProvinceRef?.GeographyName || "",
        cityId:
          evaluation.OrganizingAssessmentSubProvinceRef?.GeographyId || "",
        City:
          evaluation.OrganizingAssessmentSubProvinceRef?.GeographyName || "",
        examDate: evaluation.OrganizingAssessmentRunDate || null,
        examTime: formattedExamTime,
        examEndDate: evaluation.OrganizingAssessmentEndDate || null,
        examEndTime: formattedExamEndTime,
        groupId:
          evaluation.OrganizingAssessmentGroupRef?.AcceptedOnesGroupId || "",
        group: evaluation.OrganizingAssessmentGroupRef || "",
        examinees: evaluation.OrganizingAssessmentApplicantsFileRef
          ? { name: evaluation.OrganizingAssessmentApplicantsFileRef }
          : null,
        evaluators: evaluation.OrganizingAssessmentAnalyzersFileRef
          ? { name: evaluation.OrganizingAssessmentAnalyzersFileRef }
          : null,
        status:
          evaluation.OrganizingAssessmentExamRef?.ExamStatusRef
            ?.ExamStatusName || "در انتظار اجرا", // تغییر stauss به status
      });
    } else {
      resetForm();
    }
  }, [isEditMode, evaluation]);

  const handleChange = (key, value) => {
    setNewEvaluation((prev) => ({ ...prev, [key]: value }));
    if (key === "examTitle") {
      const exam = examTitles.find((e) => e.value === value);
      setNewEvaluation((prev) => ({
        ...prev,
        examId: exam ? exam.id : "",
        organization: "",
        executiveBodyId: "",
        job: "",
        jobId: "",
      }));
    }
    if (key === "organization") {
      const org = organizations.find((o) => o.value === value);
      setNewEvaluation((prev) => ({
        ...prev,
        executiveBodyId: org ? org.id : "",
        job: "",
        jobId: "",
      }));
    }
    if (key === "job") {
      const job = jobs.find((j) => j.value === value);
      setNewEvaluation((prev) => ({ ...prev, jobId: job ? job.id : "" }));
    }
    if (key === "province") {
      const province = provinces.find((p) => p.value === value);
      setNewEvaluation((prev) => ({
        ...prev,
        provinceId: province ? province.id : "",
        City: "",
        cityId: "",
      }));
    }
    if (key === "City") {
      const city = cities.find((c) => c.value === value);
      setNewEvaluation((prev) => ({ ...prev, cityId: city ? city.id : "" }));
    }
    if (key === "group") {
      const group = groups.find((g) => g.value === value);
      setNewEvaluation((prev) => ({ ...prev, groupId: group ? group.id : "" }));
    }
  };

  const handleDateChange = (date, key) => {
    handleChange(key, date);
  };

  const handleTimeChange = (value, key) => {
    handleChange(key, value || "00:00");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !newEvaluation.examId ||
      !newEvaluation.jobId ||
      !newEvaluation.executiveBodyId ||
      !newEvaluation.provinceId ||
      !newEvaluation.cityId ||
      !newEvaluation.examDate ||
      !newEvaluation.examTime ||
      !newEvaluation.examEndDate ||
      !newEvaluation.examEndTime ||
      !newEvaluation.groupId
    ) {
      setError("لطفاً تمام فیلدهای اجباری را پر کنید.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const formattedEvaluation = {
      examId: newEvaluation.examId,
      examTitle: newEvaluation.examTitle,
      jobId: newEvaluation.jobId,
      job: newEvaluation.job,
      executiveBodyId: newEvaluation.executiveBodyId,
      organization: newEvaluation.organization,
      provinceId: newEvaluation.provinceId,
      province: newEvaluation.province,
      cityId: newEvaluation.cityId,
      City: newEvaluation.City,
      examDate: newEvaluation.examDate
        ? persianToLatinDigits(newEvaluation.examDate.format("YYYY/MM/DD"))
        : "",
      examTime: newEvaluation.examTime || "00:00",
      examEndDate: newEvaluation.examEndDate
        ? persianToLatinDigits(newEvaluation.examEndDate.format("YYYY/MM/DD"))
        : "",
      examEndTime: newEvaluation.examEndTime || "00:00",
      groupId: newEvaluation.groupId,
      group: newEvaluation.group,
      stauss: newEvaluation.stauss,
      location: `${newEvaluation.organization} استان ${newEvaluation.province}`,
      examinees: newEvaluation.examinees,
      evaluators: newEvaluation.evaluators,
    };

    onSubmit(formattedEvaluation);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewEvaluation({
      examId: "",
      examTitle: "",
      jobId: "",
      job: "",
      executiveBodyId: "",
      organization: "",
      provinceId: "",
      province: "",
      cityId: "",
      City: "",
      examDate: null,
      examTime: "00:00",
      examEndDate: null,
      examEndTime: "00:00",
      groupId: "",
      group: "",
      examinees: null,
      evaluators: null,
      stauss: "در انتظار اجرا",
    });
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.value = "";
    });
  };

  const filteredOrganizations = organizations.filter(
    (org) =>
      !newEvaluation.examTitle || org.examName === newEvaluation.examTitle
  );

  const filteredJobs = jobs.filter(
    (job) =>
      !newEvaluation.organization ||
      job.executiveBody === newEvaluation.organization
  );

  const filteredCities = cities.filter(
    (city) =>
      !newEvaluation.province ||
      city.parentId ===
        provinces.find((p) => p.value === newEvaluation.province)?.id
  );

  if (loading) {
    return (
      <div className="add-evaluation-modal__loading">در حال بارگذاری...</div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-evaluation-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="add-evaluation-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="add-evaluation-modal__title">
              {isEditMode ? "ویرایش ارزیابی" : "افزودن ارزیابی جدید"}
            </h3>
            {error && (
              <motion.div
                className="add-evaluation-modal__error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
            <form
              onSubmit={handleSubmit}
              className="add-evaluation-modal__form"
            >
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  عنوان آزمون
                </label>
                {isEditMode ? (
                  <span className="add-evaluation-modal__text">
                    {newEvaluation.examTitle}
                  </span>
                ) : (
                  <select
                    value={newEvaluation.examTitle}
                    onChange={(e) => handleChange("examTitle", e.target.value)}
                    className="add-evaluation-modal__select"
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {examTitles.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">دستگاه</label>
                {!filteredOrganizations.length && newEvaluation.examTitle ? (
                  <div className="add-evaluation-modal__error">
                    هیچ دستگاهی برای عنوان آزمون انتخاب‌شده یافت نشد.
                  </div>
                ) : (
                  <select
                    value={newEvaluation.organization}
                    onChange={(e) =>
                      handleChange("organization", e.target.value)
                    }
                    className="add-evaluation-modal__select"
                    required
                    disabled={!newEvaluation.examTitle}
                  >
                    <option value="">انتخاب کنید</option>
                    {filteredOrganizations.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">شغل</label>
                {!filteredJobs.length && newEvaluation.organization ? (
                  <div className="add-evaluation-modal__error">
                    هیچ شغلی برای دستگاه انتخاب‌شده یافت نشد.
                  </div>
                ) : (
                  <select
                    value={newEvaluation.job}
                    onChange={(e) => handleChange("job", e.target.value)}
                    className="add-evaluation-modal__select"
                    required
                    disabled={!newEvaluation.organization}
                  >
                    <option value="">انتخاب کنید</option>
                    {filteredJobs.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">استان</label>
                <select
                  value={newEvaluation.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                  className="add-evaluation-modal__select"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {provinces.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">شهر</label>
                <select
                  value={newEvaluation.City}
                  onChange={(e) => handleChange("City", e.target.value)}
                  className="add-evaluation-modal__select"
                  required
                  disabled={!newEvaluation.province}
                >
                  <option value="">انتخاب کنید</option>
                  {filteredCities.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  تاریخ برگزاری
                </label>
                <DatePicker
                  value={newEvaluation.examDate}
                  onChange={(date) => handleDateChange(date, "examDate")}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="add-evaluation-modal__input"
                  placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  ساعت برگزاری
                </label>
                <TimePicker
                  onChange={(value) => handleTimeChange(value, "examTime")}
                  value={newEvaluation.examTime}
                  format="HH:mm"
                  disableClock={true}
                  locale="fa-IR"
                  className="add-evaluation-modal__time-picker"
                  clearIcon={null}
                  maxDetail="minute"
                  escolas="انتخاب زمان (مثال: 14:30)"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  تاریخ پایان برگزاری
                </label>
                <DatePicker
                  value={newEvaluation.examEndDate}
                  onChange={(date) => handleDateChange(date, "examEndDate")}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="add-evaluation-modal__input"
                  placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  ساعت پایان برگزاری
                </label>
                <TimePicker
                  onChange={(value) => handleTimeChange(value, "examEndTime")}
                  value={newEvaluation.examEndTime}
                  format="HH:mm"
                  disableClock={true}
                  locale="fa-IR"
                  className="add-evaluation-modal__time-picker"
                  clearIcon={null}
                  maxDetail="minute"
                  placeholder="انتخاب زمان (مثال: 14:30)"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">گروه</label>
                <select
                  value={newEvaluation.group}
                  onChange={(e) => handleChange("group", e.target.value)}
                  className="add-evaluation-modal__select"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {groups.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  لیست ارزیابی‌شوندگان
                </label>
                <div className="add-evaluation-modal__file-upload-wrapper">
                  <label className="add-evaluation-modal__file-upload-label">
                    <FaUpload className="add-evaluation-modal__file-upload-icon" />
                    <span>
                      {newEvaluation.examinees
                        ? newEvaluation.examinees.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("examinees", e.target.files[0])
                      }
                      className="add-evaluation-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  لیست ارزیابان
                </label>
                <div className="add-evaluation-modal__file-upload-wrapper">
                  <label className="add-evaluation-modal__file-upload-label">
                    <FaUpload className="add-evaluation-modal__file-upload-icon" />
                    <span>
                      {newEvaluation.evaluators
                        ? newEvaluation.evaluators.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("evaluators", e.target.files[0])
                      }
                      className="add-evaluation-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="add-evaluation-modal__buttons">
                <button
                  type="submit"
                  className="add-evaluation-modal__submit-btn"
                >
                  {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="add-evaluation-modal__cancel-btn"
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

export default AddEvaluationModal;
