import React, { useState, useEffect } from "react";
import "./EvaluationOrganization.scss";
import {
  FaFilter,
  FaSortAmountUpAlt,
  FaPlus,
  FaDownload,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../AuthContext";
import AddEvaluationModal from "./AddEvaluationModal/AddEvaluationModal";
import {
  getHandler,
  addHandler,
  updateHandler,
  deleteHandler,
} from "../../../../apiService";

const EvaluationOrganization = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    job: "",
    group: "",
    province: "",
    stauss: "",
    sort: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const canDownload = [
    "کاربر سازمان اداری و استخدامی",
    "دستگاه ستادی",
  ].includes(user?.role);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const itemsPerPage = 3;

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const response = await getHandler("organizingassessment");
      const data = response.Result || response;
      if (!Array.isArray(data)) {
        throw new Error("پاسخ API آرایه نیست: " + JSON.stringify(data));
      }
      setEvaluations(data);
      setLoading(false);
    } catch (err) {
      setError("خطا در دریافت داده‌ها: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleEditClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (evaluation) => {
    setEvaluationToDelete(evaluation);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteHandler(
        "organizingassessment",
        evaluationToDelete.OrganizingAssessmentId
      );
      setEvaluations(
        evaluations.filter(
          (e) =>
            e.OrganizingAssessmentId !==
            evaluationToDelete.OrganizingAssessmentId
        )
      );
      setIsDeleteModalOpen(false);
      setIsDeleteSuccessModalOpen(true);
      setTimeout(() => {
        setIsDeleteSuccessModalOpen(false);
        setEvaluationToDelete(null);
      }, 3000);
    } catch (err) {
      setError("خطا در حذف ارزیابی: " + err.message);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setEvaluationToDelete(null);
  };

  const handleAddEvaluation = async (newEvaluation) => {
    try {
      const formData = new FormData();
      formData.append(
        "OrganizingAssessmentExamRef",
        newEvaluation.examId // ارسال ExamId به جای ExamName
      );
      formData.append(
        "OrganizingAssessmentExecutiveBodyRef",
        newEvaluation.executiveBodyId
      );
      formData.append(
        "OrganizingAssessmentJobRef",
        newEvaluation.jobId // ارسال JobId به جای JobName
      );
      formData.append("OrganizingAssessmentGroupRef", newEvaluation.groupId); // ارسال groupId
      formData.append("OrganizingAssessmentRunDate", newEvaluation.examDate);
      formData.append("OrganizingAssessmentRunTime", newEvaluation.examTime);
      formData.append("OrganizingAssessmentEndDate", newEvaluation.examEndDate);
      formData.append("OrganizingAssessmentEndTime", newEvaluation.examEndTime);
      formData.append(
        "OrganizingAssessmentProvinceRef",
        newEvaluation.provinceId // ارسال GeographyId
      );
      formData.append(
        "OrganizingAssessmentSubProvinceRef",
        newEvaluation.cityId // ارسال GeographyId
      );
      if (newEvaluation.examinees) {
        formData.append(
          "OrganizingAssessmentApplicantsFileRef",
          newEvaluation.examinees
        );
      }
      if (newEvaluation.evaluators) {
        formData.append(
          "OrganizingAssessmentAnalyzersFileRef",
          newEvaluation.evaluators
        );
      }

// $& // لاگ برای دیباگ

      if (isEditMode && selectedEvaluation) {
        await updateHandler(
          "organizingassessment",
          selectedEvaluation.OrganizingAssessmentId,
          formData
        );
        setNotification({
          message: "ارزیابی با موفقیت ویرایش شد!",
          type: "success",
        });
        setEvaluations(
          evaluations.map((e) =>
            e.OrganizingAssessmentId ===
            selectedEvaluation.OrganizingAssessmentId
              ? {
                  ...e,
                  ...newEvaluation,
                  OrganizingAssessmentId:
                    selectedEvaluation.OrganizingAssessmentId,
                  OrganizingAssessmentExamRef: {
                    ExamId: newEvaluation.examId,
                    ExamName: newEvaluation.examTitle, // برای نمایش در UI
                    ExamStatusRef: { ExamStatusName: newEvaluation.stauss },
                  },
                  OrganizingAssessmentExecutiveBodyRef: {
                    ExecutiveBodyId: newEvaluation.executiveBodyId,
                    ExecutiveBodyName: newEvaluation.organization, // برای نمایش در UI
                    ExecutiveBodyProvince: {
                      GeographyId: newEvaluation.provinceId,
                      GeographyName: newEvaluation.province, // برای نمایش در UI
                    },
                    ExecutiveBodyCountey: {
                      GeographyId: newEvaluation.cityId,
                      GeographyName: newEvaluation.City, // برای نمایش در UI
                    },
                    ExecutiveBodyPlace: null,
                  },
                  OrganizingAssessmentJobRef: {
                    JobId: newEvaluation.jobId,
                    JobName: newEvaluation.job, // برای نمایش در UI
                  },
                  OrganizingAssessmentGroupRef: newEvaluation.groupId,
                  OrganizingAssessmentProvinceRef: {
                    GeographyId: newEvaluation.provinceId,
                    GeographyName: newEvaluation.province, // برای نمایش در UI
                  },
                  OrganizingAssessmentSubProvinceRef: {
                    GeographyId: newEvaluation.cityId,
                    GeographyName: newEvaluation.City, // برای نمایش در UI
                  },
                  OrganizingAssessmentRunDate: newEvaluation.examDate,
                  OrganizingAssessmentRunTime: newEvaluation.examTime,
                  OrganizingAssessmentEndDate: newEvaluation.examEndDate,
                  OrganizingAssessmentEndTime: newEvaluation.examEndTime,
                  OrganizingAssessmentApplicantsFileRef: newEvaluation.examinees
                    ? newEvaluation.examinees.name
                    : null,
                  OrganizingAssessmentAnalyzersFileRef: newEvaluation.evaluators
                    ? newEvaluation.evaluators.name
                    : null,
                }
              : e
          )
        );
      } else {
        const response = await addHandler(
          "organizingassessment/organizingassessments",
          formData
        );
// $&
        await fetchEvaluations(); // رفرش داده‌ها از سرور
        setNotification({
          message: "ارزیابی با موفقیت اضافه شد!",
          type: "success",
        });
      }
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setSelectedEvaluation(null);
      setIsAddSuccessModalOpen(true);
      setTimeout(() => {
        setIsAddSuccessModalOpen(false);
        setNotification({ message: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error("Error adding/editing evaluation:", err);
      setNotification({
        message: `خطا در ${isEditMode ? "ویرایش" : "افزودن"} ارزیابی: ${
          err.message
        }`,
        type: "error",
      });
      setTimeout(() => setNotification({ message: "", type: "" }), 5000);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "dateAsc", label: "قدیمی‌ترین آزمون" },
    { value: "dateDesc", label: "جدیدترین آزمون" },
  ];

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        {
          value: "بانک مرکزی جمهوری اسلامی ایران",
          label: "بانک مرکزی جمهوری اسلامی ایران",
        },
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        { value: "قوه قضاییه", label: "قوه قضاییه" },
        {
          value: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
          label: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
        },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
        { value: "وزارت راه و شهرسازی", label: "وزارت راه و شهرسازی" },
        { value: "وزارت امور خارجه", label: "وزارت امور خارجه" },
      ],
    },
    {
      label: "شغل",
      key: "job",
      options: [
        { value: "", label: "همه" },
        { value: "اپراتور فوق توزیع", label: "اپراتور فوق توزیع" },
        { value: "متصدی امور دفتری", label: "متصدی امور دفتری" },
        { value: "آتشنشان", label: "آتشنشان" },
        {
          value: "مامور گارد انتظامات زندانها",
          label: "مامور گارد انتظامات زندانها",
        },
        { value: "کارشناس اداری", label: "کارشناس اداری" },
        { value: "حسابدار", label: "حسابدار" },
        { value: "مهندس هوافضا", label: "مهندس هوافضا" },
        { value: "مترجم", label: "مترجم" },
      ],
    },
    {
      label: "گروه",
      key: "group",
      options: [
        { value: "", label: "همه" },
        { value: "گروه الف", label: "گروه الف" },
        { value: "گروه ب", label: "گروه ب" },
        { value: "گروه ج", label: "گروه ج" },
      ],
    },
    {
      label: "استان",
      key: "province",
      options: [
        { value: "", label: "همه" },
        { value: "آذربایجان شرقی", label: "آذربایجان شرقی" },
        { value: "آذربایجان غربی", label: "آذربایجان غربی" },
        { value: "اردبیل", label: "اردبیل" },
        { value: "اصفهان", label: "اصفهان" },
        { value: "البرز", label: "البرز" },
        { value: "ایلام", label: "ایلام" },
        { value: "بوشهر", label: "بوشهر" },
        { value: "تهران", label: "تهران" },
        { value: "چهارمحال و بختیاری", label: "چهارمحال و بختیاری" },
        { value: "خراسان جنوبی", label: "خراسان جنوبی" },
        { value: "خراسان رضوی", label: "خراسان رضوی" },
        { value: "خراسان شمالی", label: "خراسان شمالی" },
        { value: "خوزستان", label: "خوزستان" },
        { value: "زنجان", label: "زنجان" },
        { value: "سمنان", label: "سمنان" },
        { value: "سیستان و بلوچستان", label: "سیستان و بلوچستان" },
        { value: "فارس", label: "فارس" },
        { value: "قزوین", label: "قزوین" },
        { value: "قم", label: "قم" },
        { value: "کردستان", label: "کردستان" },
        { value: "کرمان", label: "کرمان" },
        { value: "کرمانشاه", label: "کرمانشاه" },
        { value: "کهگیلویه و بویراحمد", label: "کهگیلویه و بویراحمد" },
        { value: "گلستان", label: "گلستان" },
        { value: "گیلان", label: "گیلان" },
        { value: "لرستان", label: "لرستان" },
        { value: "مازندران", label: "مازندران" },
        { value: "مرکزی", label: "مرکزی" },
        { value: "هرمزگان", label: "هرمزگان" },
        { value: "همدان", label: "همدان" },
        { value: "یزد", label: "یزد" },
      ],
    },
    {
      label: "وضعیت",
      key: "stauss",
      options: [
        { value: "", label: "همه" },
        { value: "سازماندهی", label: "سازماندهی" },
        { value: "در انتظار اجرا", label: "در انتظار اجرا" },
        { value: "درحال اجرا", label: "درحال اجرا" },
        { value: "در انتظار اعلام نتایج", label: "در انتظار اعلام نتایج" },
        { value: "پایان یافته", label: "پایان یافته" },
      ],
    },
  ];

  const filteredFilterConfig = filterConfig;

  const filteredEvaluations = evaluations
    .filter((evaluation) =>
      Object.values({
        examTitle: evaluation.OrganizingAssessmentExamRef?.ExamName || "",
        organization:
          evaluation.OrganizingAssessmentExecutiveBodyRef?.ExecutiveBodyName ||
          "",
        job: evaluation.OrganizingAssessmentJobRef?.JobName || "",
        group: evaluation.OrganizingAssessmentGroupRef || "",
        province:
          evaluation.OrganizingAssessmentProvinceRef?.GeographyName || "",
        stauss:
          evaluation.OrganizingAssessmentExamRef?.ExamStatusRef
            ?.ExamStatusName || "",
      }).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((evaluation) => {
      return (
        (!filters.organization ||
          evaluation.OrganizingAssessmentExecutiveBodyRef?.ExecutiveBodyName ===
            filters.organization) &&
        (!filters.job ||
          evaluation.OrganizingAssessmentJobRef?.JobName === filters.job) &&
        (!filters.group ||
          evaluation.OrganizingAssessmentGroupRef === filters.group) &&
        (!filters.province ||
          evaluation.OrganizingAssessmentProvinceRef?.GeographyName ===
            filters.province) &&
        (!filters.stauss ||
          evaluation.OrganizingAssessmentExamRef?.ExamStatusRef
            ?.ExamStatusName === filters.stauss)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "dateAsc")
        return a.OrganizingAssessmentRunDate.localeCompare(
          b.OrganizingAssessmentRunDate
        );
      if (filters.sort === "dateDesc")
        return b.OrganizingAssessmentRunDate.localeCompare(
          a.OrganizingAssessmentRunDate
        );
      return 0;
    });

  const pageCount = Math.ceil(filteredEvaluations.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredEvaluations.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="evaluation-organization__loading">در حال بارگذاری...</div>
    );
  }

  if (error) {
    return <div className="evaluation-organization__error">{error}</div>;
  }

  return (
    <div className="evaluation-organization">
      <div className="evaluation-organization__title-wrapper">
        <h2 className="evaluation-organization__title">سازماندهی ارزیابی</h2>
        <button
          className="evaluation-organization__add-btn"
          onClick={() => {
// $&
            setIsEditMode(false);
            setSelectedEvaluation(null);
            setIsAddModalOpen(true);
          }}
        >
          <FaPlus /> افزودن
        </button>
      </div>

      {notification.message && (
        <motion.div
          className={`evaluation-organization__notification evaluation-organization__notification--${notification.type}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {notification.message}
        </motion.div>
      )}

      <div className="evaluation-organization__search-container">
        <div className="evaluation-organization__actions">
          <div className="evaluation-organization__filter-container">
            <div className="evaluation-organization__filter">
              <FaFilter className="evaluation-organization__filter-icon" />
              <div className="filter-selects">
                {filteredFilterConfig.map((filter) => (
                  <div key={filter.key} className="filter-select-wrapper">
                    <label className="filter-select-label">
                      {filter.label}
                    </label>
                    <select
                      value={filters[filter.key]}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="filter-select"
                    >
                      {filter.options.map((option, optIndex) => (
                        <option key={optIndex} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="evaluation-organization__sort-container">
            <div className="evaluation-organization__sort">
              <FaSortAmountUpAlt className="evaluation-organization__sort-icon" />
              <div className="sort-options">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`sort-item ${
                      filters.sort === option.value ? "active" : ""
                    }`}
                    onClick={() => {
                      handleFilterChange("sort", option.value);
                      setCurrentPage(0);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="جستجو در ارزیابی‌ها..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="evaluation-organization__search-input"
        />
      </div>

      <div className="evaluation-organization__list">
        {currentItems.length > 0 ? (
          currentItems.map((evaluation) => (
            <div
              key={evaluation.OrganizingAssessmentId}
              className="evaluation-organization__item"
            >
              <div className="evaluation-organization__details">
                <div className="evaluation-organization__header">
                  <p className="evaluation-organization__headerDetail examName">
                    <span>
                      {evaluation.OrganizingAssessmentExamRef?.ExamName ||
                        "بدون عنوان"}
                    </span>
                  </p>
                  <p className="evaluation-organization__headerDetail">
                    وضعیت:{" "}
                    <span>
                      {evaluation.OrganizingAssessmentExamRef?.ExamStatusRef
                        ?.ExamStatusName || ""}
                    </span>
                  </p>
                </div>
                <div className="evaluation-organization__body">
                  <div className="evaluation-organization__dates">
                    <p className="evaluation-organization__detail">
                      شغل:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentJobRef?.JobName || ""}
                      </span>
                    </p>
                    <p className="evaluation-organization__detail">
                      دستگاه:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentExecutiveBodyRef
                          ?.ExecutiveBodyName || ""}
                      </span>
                    </p>
                  </div>
                  <div className="evaluation-organization__organization">
                    <p className="evaluation-organization__detail">
                      استان محل برگزاری:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentProvinceRef
                          ?.GeographyName || ""}
                      </span>
                    </p>
                    <p className="evaluation-organization__detail">
                      شهر محل برگزاری:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentSubProvinceRef
                          ?.GeographyName || ""}
                      </span>
                    </p>
                  </div>
                  <div className="evaluation-organization__lastBox">
                    <p className="evaluation-organization__detail">
                      محل:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentExecutiveBodyRef
                          ?.ExecutiveBodyName +
                          " استان " +
                          evaluation.OrganizingAssessmentProvinceRef
                            ?.GeographyName}
                      </span>
                    </p>
                    <p className="evaluation-organization__detail">
                      گروه:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentGroupRef || ""}
                      </span>
                    </p>
                  </div>
                  <div className="evaluation-organization__organization">
                    <p className="evaluation-organization__detail">
                      تاریخ برگزاری:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentRunDate || ""}
                      </span>
                    </p>
                    <p className="evaluation-organization__detail">
                      ساعت برگزاری:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentRunTime || ""}
                      </span>
                    </p>
                  </div>
                  <div className="evaluation-organization__organization">
                    <p className="evaluation-organization__detail">
                      تاریخ پایان برگزاری:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentEndDate || ""}
                      </span>
                    </p>
                    <p className="evaluation-organization__detail">
                      ساعت پایان برگزاری:{" "}
                      <span>
                        {evaluation.OrganizingAssessmentEndTime || ""}
                      </span>
                    </p>
                  </div>
                  <div className="evaluation-organization__lastBox">
                    <p className="evaluation-organization__detail">
                      لیست ارزیابی‌شوندگان:
                      {evaluation.OrganizingAssessmentApplicantsFileRef ? (
                        <a
                          href={
                            canDownload
                              ? evaluation.OrganizingAssessmentApplicantsFileRef
                              : undefined
                          }
                          download={canDownload}
                          className={`download-btn ${
                            !canDownload ? "disabled-download" : ""
                          }`}
                          aria-disabled={!canDownload}
                          onClick={(e) => !canDownload && e.preventDefault()}
                        >
                          <FaDownload className="download-icon" />
                        </a>
                      ) : (
                        <span>بدون مستندات</span>
                      )}
                    </p>
                    <p className="evaluation-organization__detail">
                      لیست ارزیابان:
                      {evaluation.OrganizingAssessmentAnalyzersFileRef ? (
                        <a
                          href={
                            canDownload
                              ? evaluation.OrganizingAssessmentAnalyzersFileRef
                              : undefined
                          }
                          download={canDownload}
                          className={`download-btn ${
                            !canDownload ? "disabled-download" : ""
                          }`}
                          aria-disabled={!canDownload}
                          onClick={(e) => !canDownload && e.preventDefault()}
                        >
                          <FaDownload className="download-icon" />
                        </a>
                      ) : (
                        <span>بدون مستندات</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="evaluation-organization__btns">
                <button
                  className="evaluation-organization__details-btn edit"
                  onClick={() => handleEditClick(evaluation)}
                >
                  ویرایش
                </button>
                <button
                  className="evaluation-organization__details-btn delete"
                  onClick={() => handleDeleteClick(evaluation)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>هیچ ارزیابی یافت نشد</p>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddEvaluationModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setIsEditMode(false);
              setSelectedEvaluation(null);
            }}
            onSubmit={handleAddEvaluation}
            isEditMode={isEditMode}
            evaluation={selectedEvaluation}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddSuccessModalOpen && (
          <>
            <motion.div
              className="success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="success-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>
                {isEditMode
                  ? "ارزیابی با موفقیت ویرایش شد!"
                  : "ارزیابی با موفقیت اضافه شد!"}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="delete-modal-content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>تأیید حذف</h3>
              <p>آیا از حذف ارزیابی مطمئن هستید؟</p>
              <div className="modal-buttons">
                <button className="modal-submit" onClick={handleDeleteConfirm}>
                  بله
                </button>
                <button className="modal-cancel" onClick={handleDeleteCancel}>
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
              className="success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="success-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>ارزیابی با موفقیت حذف شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"pagination__page"}
          pageLinkClassName={"pagination__link"}
          previousClassName={"pagination__previous"}
          previousLinkClassName={"pagination__link"}
          nextClassName={"pagination__next"}
          nextLinkClassName={"pagination__link"}
          breakClassName={"pagination__break"}
          breakLinkClassName={"pagination__link"}
          activeClassName={"pagination__active"}
        />
      )}
    </div>
  );
};

export default EvaluationOrganization;
