import React, { useState, useEffect } from "react";
import "./CandidateList.scss";
import { FaFilter, FaDownload, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useAuth } from "../../../../AuthContext";
import { dataTables } from "../../../../apiService";
import CandidateReportModal from "./CandidateReportModal";

const CandidateList = () => {
  const { user } = useAuth();
  const analyzeAcceptedLists = dataTables["analyzeacceptedlists"] || [];
  const exams = dataTables["exams"] || [];
  const executiveBodies = dataTables["executivebodies"] || [];
  const analyzeOrganizerAssigns = dataTables["analyzeorganizerassigns"] || [];

  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newReport, setNewReport] = useState({
    examName: "",
    organization: "",
    capacityMultiple: "",
    candidateFile: "",
    candidateFileName: "انتخاب فایل",
  });
  const itemsPerPage = 10;

  // لاگ برای دیباگ
  console.log("dataTables loaded:", {
    analyzeAcceptedLists,
    exams,
    executiveBodies,
    analyzeOrganizerAssigns,
  });

  // لود و نگاشت داده‌ها
  useEffect(() => {
    const mappedCandidates = analyzeAcceptedLists.map((list) => {
      const exam = exams.find(
        (e) => e.examId === list.analyzeAcceptedListExamRef
      );
      const executiveBody = executiveBodies.find(
        (eb) => eb.executiveBodyId === list.analyzeAcceptedListExecutiveBodyRef
      );
// $&
      return {
        id: list.analyzeAcceptedListId,
        examName: exam ? exam.examName || "-" : "-",
        organization: executiveBody
          ? executiveBody.executiveBodyName || "-"
          : "-",
        capacityMultiple: list.analyzeAcceptedListExtraCapacity
          ? `${list.analyzeAcceptedListExtraCapacity} برابر ظرفیت`
          : "-",
        candidateFile: list.analyzeAcceptedListExcel || "",
        candidateFileName: list.analyzeAcceptedListExcel
          ? list.analyzeAcceptedListExcel.split("/").pop() || "لیست نفرات"
          : "انتخاب فایل",
        status: "ارسال شده", // موقت
      };
    });
// $&
    setCandidates(mappedCandidates);
  }, [analyzeAcceptedLists, exams, executiveBodies]);

  // بررسی وجود داده‌ها
  if (!analyzeAcceptedLists.length || !exams.length) {
    console.warn("Missing required data: analyzeAcceptedLists or exams empty");
    return <div>داده‌های مورد نیاز یافت نشد. لطفاً دوباره تلاش کنید.</div>;
  }

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
// $&
  };

  const handleEdit = (candidate) => {
    setNewReport({
      examName: candidate.examName,
      organization: candidate.organization,
      capacityMultiple: candidate.capacityMultiple.replace(" برابر ظرفیت", ""),
      candidateFile: candidate.candidateFile,
      candidateFileName: candidate.candidateFileName,
    });
    setSelectedCandidate(candidate);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
// $&
    // TODO: حذف در دیتابیس
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    const exam = exams.find((e) => e.examName === newReport.examName);
    const executiveBody = executiveBodies.find(
      (eb) => eb.executiveBodyName === newReport.organization
    );
    const capacityValue = parseInt(newReport.capacityMultiple) || 0;
    console.log("Adding/Editing report:", {
      exam,
      executiveBody,
      capacityValue,
      newReport,
    });

    if (isEditMode) {
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === selectedCandidate.id
            ? {
                ...candidate,
                examName: newReport.examName,
                organization: newReport.organization,
                capacityMultiple: capacityValue
                  ? `${capacityValue} برابر ظرفیت`
                  : "-",
                candidateFile: newReport.candidateFile,
                candidateFileName: newReport.candidateFileName,
                status: "ارسال شده", // موقت
              }
            : candidate
        )
      );
      // TODO: به‌روزرسانی در دیتابیس
    } else {
      const newId = candidates.length
        ? Math.max(...candidates.map((c) => c.id)) + 1
        : 1;
      const reportToAdd = {
        id: newId,
        examName: newReport.examName,
        organization: newReport.organization,
        capacityMultiple: capacityValue ? `${capacityValue} برابر ظرفیت` : "-",
        candidateFile: newReport.candidateFile,
        candidateFileName: newReport.candidateFileName,
        status: "ارسال شده", // موقت
      };
      setCandidates((prev) => [reportToAdd, ...prev]);
      // TODO: افزودن به دیتابیس
    }
    setNewReport({
      examName: "",
      organization: "",
      capacityMultiple: "",
      candidateFile: "",
      candidateFileName: "انتخاب فایل",
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedCandidate(null);
  };

  // داینامیک کردن فیلترها و گزینه‌ها
  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        ...executiveBodies.map((eb) => ({
          value: eb.executiveBodyName || "-",
          label: eb.executiveBodyName || "-",
        })),
      ],
    },
  ];

  const examOptions = [
    { value: "", label: "انتخاب کنید" },
    ...exams.map((exam) => ({
      value: exam.examName || "-",
      label: exam.examName || "-",
    })),
  ];

  const capacityOptions = [
    { value: "", label: "انتخاب کنید" },
    { value: "1", label: "1 برابر ظرفیت" },
    { value: "2", label: "2 برابر ظرفیت" },
    { value: "3", label: "3 برابر ظرفیت" },
    { value: "4", label: "4 برابر ظرفیت" },
    { value: "5", label: "5 برابر ظرفیت" },
  ];

  const filteredCandidates = candidates
    .filter((candidate) =>
      Object.values(candidate).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((candidate) =>
      !filters.organization
        ? true
        : candidate.organization === filters.organization
    );
// $&

  const pageCount = Math.ceil(filteredCandidates.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredCandidates.slice(offset, offset + itemsPerPage);
// $&

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="candidate-list">
      <div className="candidate-list__titleWrapper">
        <h2 className="candidate-list__title">لیست نفرات ارزیابی تکمیلی</h2>
        {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button
            className="candidate-list__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setNewReport({
                examName: "",
                organization: "",
                capacityMultiple: "",
                candidateFile: "",
                candidateFileName: "انتخاب فایل",
              });
              setIsModalOpen(true);
            }}
          >
            <FaPlus /> افزودن گزارش
          </button>
        )}
      </div>

      <div className="candidate-list__search-container">
        <div className="candidate-list__actions">
          <div className="candidate-list__filter">
            <FaFilter className="candidate-list__filter-icon" />
            <div className="filter-selects">
              {filterConfig.map((filter) => (
                <div key={filter.key} className="filter-select-wrapper">
                  <label className="filter-select-label">{filter.label}</label>
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
        <input
          type="text"
          placeholder="جستجو در لیست نفرات..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="candidate-list__search-input"
        />
      </div>

      <CandidateReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setNewReport({
            examName: "",
            organization: "",
            capacityMultiple: "",
            candidateFile: "",
            candidateFileName: "انتخاب فایل",
          });
        }}
        onSubmit={handleAddReport}
        newReport={newReport}
        setNewReport={setNewReport}
        filterConfig={filterConfig}
        examOptions={examOptions}
        capacityOptions={capacityOptions}
        isEditMode={isEditMode}
      />

      <div className="candidate-list__list">
        {currentItems.length > 0 ? (
          currentItems.map((candidate) => (
            <div key={candidate.id} className="candidate-list__item">
              <div className="candidate-list__content">
                <div className="candidate-list__header">
                  <p className="candidate-list__headerDetail title">
                    {candidate.examName}
                  </p>
                  <p className="candidate-list__headerDetail headerDetailStatus">
                    {candidate.status}
                  </p>
                </div>
                <hr className="candidate-list__divider" />
                <div className="candidate-list__body">
                  <p className="candidate-list__detail">
                    دستگاه: <span>{candidate.organization}</span>
                  </p>
                  <p className="candidate-list__detail">
                    چند برابر ظرفیت: <span>{candidate.capacityMultiple}</span>
                  </p>
                </div>
                <div className="candidate-list__actions">
                  <div className="candidate-list__download-buttons">
                    {candidate.candidateFile ? (
                      <a
                        href={candidate.candidateFile}
                        download
                        className="candidate-list__download-btn details"
                      >
                        دریافت لیست نفرات
                        <FaDownload />
                      </a>
                    ) : (
                      <span className="candidate-list__no-file">
                        فایلی موجود نیست
                      </span>
                    )}
                  </div>

                  {user?.role !== "کاربر سازمان اداری و استخدامی" && (
                    <div className="candidate-list__edit-delete">
                      <button
                        className="candidate-list__action-btn edit"
                        onClick={() => handleEdit(candidate)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="candidate-list__action-btn delete"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>هیچ لیستی یافت نشد</p>
        )}
      </div>

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

export default CandidateList;
