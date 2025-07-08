import React, { useState, useMemo } from "react";
import "./SupplementaryAssessmentResults.scss";
import {
  FaFilter,
  FaDownload,
  FaEdit,
  FaTrash,
  FaSortAmountUpAlt,
  FaPlus,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../AuthContext";
import AddSupplementaryResultModal from "./AddSupplementaryResultModal/AddSupplementaryResultModal";
import ExamStatusModal from "../ExamResults/ExamStatusModal/ExamStatusModal";
import { Tooltip } from "react-tooltip";
import { dataTables } from "../../../../apiService";

const SupplementaryAssessmentResults = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    status: "",
    sort: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusResult, setSelectedStatusResult] = useState(null);
  const itemsPerPage = 10;

  // بررسی وجود جداول
  const results = dataTables["analyzeresults"] || [];
  if (
    !dataTables["exams"] ||
    !dataTables["executivebodies"] ||
    !dataTables["jobs"] ||
    !dataTables["organizers"] ||
    !results.length
  ) {
    return <div>داده‌های مورد نیاز یافت نشد. لطفاً دوباره تلاش کنید.</div>;
  }

  // نگاشت داده‌های analyzeresults به فرمت UI
  const mappedResults = useMemo(() => {
    return results.map((result) => {
      const exam =
        dataTables["exams"].find(
          (e) => e.examId === result.analyzeResultExamRef
        ) || {};
      const executiveBody =
        dataTables["executivebodies"].find(
          (eb) => eb.executiveBodyId === result.analyzeResultExecutiveBodyRef
        ) || {};
      const job =
        dataTables["jobs"].find(
          (j) => j.jobId === result.analyzeResultJobRef
        ) || {};
      const organizer =
        dataTables["organizers"].find(
          (o) => o.organizerId === result.analyzeResultOrganizerRef
        ) || {};

      return {
        id: result.analyzeResultId || "-",
        assessmentName: exam.examName || "-",
        organizer: organizer.organizerName || "-",
        job: job.jobName || "-",
        organization: executiveBody.executiveBodyName || "-",
        date: result.analyzeResultRunDate || "-",
        Province: "-", // غایب
        resultDate: "-", // غایب
        resultFile: result.analyzeResultExcel || "-",
        status:
          result.analyzeResultConfirmed === "Y"
            ? "تأیید سازمان اداری و استخدامی"
            : "ارسال به سازمان اداری و استخدامی",
      };
    });
  }, [results]);

  // گزینه‌های فیلتر
  const organizations = useMemo(() => {
    const uniqueOrgs = [
      ...new Set(
        dataTables["executivebodies"].map((eb) => eb.executiveBodyName)
      ),
    ].filter(Boolean);
    return [
      { value: "", label: "همه" },
      ...uniqueOrgs.map((org) => ({ value: org, label: org })),
    ];
  }, []);

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: organizations,
    },
    {
      label: "وضعیت",
      key: "status",
      options: [
        { value: "", label: "همه" },
        {
          value: "ارسال به سازمان اداری و استخدامی",
          label: "ارسال به سازمان اداری و استخدامی",
        },
        {
          value: "تأیید سازمان اداری و استخدامی",
          label: "تأیید سازمان اداری و استخدامی",
        },
        { value: "تأیید نهایی", label: "تأیید نهایی" },
      ],
    },
  ];

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "dateAsc", label: "قدیمی‌ترین" },
    { value: "dateDesc", label: "جدیدترین" },
  ];

  const convertPersianDateToComparable = (persianDate) => {
    if (persianDate === "-") return "";
    const [year, month, day] = persianDate.split("/").map(Number);
    return `${year}${month.toString().padStart(2, "0")}${day
      .toString()
      .padStart(2, "0")}`;
  };

  // فیلتر و مرتب‌سازی
  const filteredResults = useMemo(() => {
    let result = mappedResults
      .filter((result) =>
        Object.values(result).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((result) =>
        !filters.organization
          ? true
          : result.organization === filters.organization
      )
      .filter((result) =>
        !filters.status ? true : result.status === filters.status
      );

    if (filters.sort) {
      result = [...result].sort((a, b) => {
        const dateA = convertPersianDateToComparable(a.date);
        const dateB = convertPersianDateToComparable(b.date);
        return filters.sort === "dateAsc"
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      });
    }

    return result;
  }, [mappedResults, searchTerm, filters]);

  const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredResults.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleEdit = (result) => {
    setSelectedResult(result);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
// $&
  };

  const handleAddResult = (newResult) => {
// $&
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setSelectedResult(null);
    setIsAddSuccessModalOpen(true);
    setTimeout(() => {
      setIsAddSuccessModalOpen(false);
    }, 3000);
  };

  const handleStatusChange = (id, newStatus) => {
// $&
    setIsStatusModalOpen(false);
    setSelectedStatusResult(null);
  };

  const openStatusModal = (result) => {
    if (!result || !user) {
      console.error("Result or user is undefined");
      alert("خطا: اطلاعات کاربر یا نتیجه یافت نشد.");
      return;
    }

    const normalizedStatus = result.status?.trim();
    const canAccess =
      (user?.role === "کاربر سازمان اداری و استخدامی" &&
        (normalizedStatus === "ارسال به سازمان اداری و استخدامی" ||
          normalizedStatus === "تأیید سازمان اداری و استخدامی")) ||
      (user?.role === "دستگاه ستادی" &&
        (normalizedStatus === "تأیید سازمان اداری و استخدامی" ||
          normalizedStatus === "تأیید نهایی"));

    if (canAccess) {
      setSelectedStatusResult(result);
      setIsStatusModalOpen(true);
    } else {
      console.error("Access denied: User does not have required permissions.");
      alert("شما دسترسی لازم برای تغییر وضعیت را ندارید.");
    }
  };

  return (
    <div className="supplementary-results">
      <div className="supplementary-results__title-wrapper">
        <h2 className="supplementary-results__title">نتایج ارزیابی تکمیلی</h2>
        {user?.role === "کانون ارزیابی" && (
          <button
            className="supplementary-results__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setSelectedResult(null);
              setIsAddModalOpen(true);
            }}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="supplementary-results__search-container">
        <div className="supplementary-results__actions">
          <div className="supplementary-results__filter-container">
            <div className="supplementary-results__filter">
              <FaFilter className="supplementary-results__filter-icon" />
              <div className="filter-selects">
                {filterConfig.map((filter) => (
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
          <div className="supplementary-results__sort-container">
            <div className="supplementary-results__sort">
              <FaSortAmountUpAlt className="supplementary-results__sort-icon" />
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
          placeholder="جستجو در نتایج ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="supplementary-results__search-input"
        />
      </div>

      <div className="supplementary-results__list">
        {currentItems.length > 0 ? (
          currentItems.map((result) => {
            const canChangeStatus =
              (result.status?.trim() === "ارسال به سازمان اداری و استخدامی" &&
                user?.role === "کاربر سازمان اداری و استخدامی") ||
              (result.status?.trim() === "تأیید سازمان اداری و استخدامی" &&
                (user?.role === "دستگاه ستادی" ||
                  user?.role === "کاربر سازمان اداری و استخدامی")) ||
              (result.status?.trim() === "تأیید نهایی" &&
                user?.role === "دستگاه ستادی");

            const isDownloadDisabled =
              result.status === "ارسال به سازمان اداری و استخدامی" &&
              user?.role === "دستگاه ستادی";

            return (
              <div key={result.id} className="supplementary-results__item">
                <div className="supplementary-results__content">
                  <div className="supplementary-results__header">
                    <div className="supplementary-results__headerTop">
                      <p className="supplementary-results__headerDetail title">
                        {result.assessmentName}
                      </p>
                      <p
                        className={`supplementary-results__headerDetail status ${
                          canChangeStatus ? "status--clickable" : ""
                        }`}
                        onClick={() => openStatusModal(result)}
                      >
                        {result.status}
                      </p>
                    </div>
                  </div>
                  <div className="supplementary-results__body">
                    <p className="supplementary-results__detail">
                      مجری: <span>{result.organizer}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      شغل: <span>{result.job}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      دستگاه: <span>{result.organization}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      تاریخ برگزاری: <span>{result.date}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      استان برگزاری ارزیابی تکمیلی:{" "}
                      <span>{result.Province}</span>
                    </p>
                    {result.status === "تأیید نهایی" && (
                      <p className="supplementary-results__detail">
                        تاریخ انتشار نتایج: <span>{result.resultDate}</span>
                      </p>
                    )}
                  </div>
                  <div className="supplementary-results__actions">
                    <div className="supplementary-results__download-buttons">
                      <a
                        href={
                          result.resultFile === "-" ? "#" : result.resultFile
                        }
                        download
                        className={`supplementary-results__download-btn results ${
                          isDownloadDisabled || result.resultFile === "-"
                            ? "disabled"
                            : ""
                        }`}
                        data-tooltip-id={`download-tooltip-${result.id}`}
                        data-tooltip-content={
                          isDownloadDisabled
                            ? "نتایج ارزیابی تکمیلی در دسترس نمی‌باشد"
                            : result.resultFile === "-"
                            ? "فایلی موجود نیست"
                            : ""
                        }
                        onClick={(e) => {
                          if (isDownloadDisabled || result.resultFile === "-") {
                            e.preventDefault();
                          }
                        }}
                      >
                        فایل نتایج
                        <FaDownload />
                      </a>
                      <Tooltip
                        id={`download-tooltip-${result.id}`}
                        place="top"
                        effect="solid"
                      />
                    </div>
                    {user?.role === "کانون ارزیابی" &&
                      result.status === "ارسال به سازمان اداری و استخدامی" && (
                        <div className="supplementary-results__edit-delete">
                          <button
                            className="supplementary-results__action-btn edit"
                            onClick={() => handleEdit(result)}
                          >
                            ویرایش
                          </button>
                          <button
                            className="supplementary-results__action-btn delete"
                            onClick={() => handleDelete(result.id)}
                          >
                            حذف
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>هیچ نتیجه‌ای یافت نشد</p>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddSupplementaryResultModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setIsEditMode(false);
              setSelectedResult(null);
            }}
            onSubmit={handleAddResult}
            isEditMode={isEditMode}
            result={selectedResult}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStatusModalOpen && selectedStatusResult && (
          <ExamStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false);
              setSelectedStatusResult(null);
            }}
            onSubmit={handleStatusChange}
            result={selectedStatusResult}
            source="SupplementaryAssessmentResults"
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
                  ? "نتیجه با موفقیت ویرایش شد!"
                  : "نتیجه با موفقیت اضافه شد!"}
              </p>
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

export default SupplementaryAssessmentResults;
