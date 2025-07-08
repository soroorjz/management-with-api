import React, { useMemo, useState } from "react";
import "./AssessmentMaterials.scss";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import {
  FaPlus,
  FaDownload,
  FaFilter,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import AssessmentMaterialsModal from "./AssessmentMaterialsModal";
import { useAuth } from "../../../../AuthContext";
import { dataTables } from "../../../../apiService";

const AssessmentMaterials = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    examTitle: "",
    organization: "",
    job: "",
    materials: "",
  });
  const [filters, setFilters] = useState({
    organization: "",
    job: "",
    sort: "",
  });

  const itemsPerPage = 5;

  // بررسی وجود جداول
  const materials = dataTables["analyzematerials"] || [];
  if (
    !dataTables["exams"] ||
    !dataTables["executivebodies"] ||
    !dataTables["jobs"] ||
    !materials.length
  ) {
    return <div>داده‌های مورد نیاز یافت نشد. لطفاً دوباره تلاش کنید.</div>;
  }

  // نگاشت داده‌های analyzematerials به فرمت UI
  const mappedData = useMemo(() => {
    return materials.map((material) => {
      const exam =
        dataTables["exams"].find(
          (e) => e.examId === material.analyzeMaterialExamRef
        ) || {};
      const executiveBody =
        dataTables["executivebodies"].find(
          (eb) =>
            eb.executiveBodyId === material.analyzeMaterialExecutiveBodyRef
        ) || {};
      const job =
        dataTables["jobs"].find(
          (j) => j.jobId === material.analyzeMaterialJobRef
        ) || {};

      return {
        id: material.analyzeMaterialId || "-",
        examTitle: exam.examName || "-",
        organization: executiveBody.executiveBodyName || "-",
        job: job.jobName || "-",
        materials: "-", // غایب در analyzematerials
        examDate: exam.examDate || "-",
      };
    });
  }, [materials]);

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

  const jobs = useMemo(() => {
    const uniqueJobs = [
      ...new Set(dataTables["jobs"].map((job) => job.jobName)),
    ].filter(Boolean);
    return [
      { value: "", label: "همه" },
      ...uniqueJobs.map((job) => ({ value: job, label: job })),
    ];
  }, []);

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: organizations,
    },
    {
      label: "شغل",
      key: "job",
      options: jobs,
    },
  ];

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "examDateAsc", label: "قدیمی‌ترین تاریخ آزمون" },
    { value: "examDateDesc", label: "جدیدترین تاریخ آزمون" },
  ];

  // فیلتر و مرتب‌سازی
  const filteredData = useMemo(() => {
    let result = mappedData
      .filter(
        (item) =>
          item.examTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.job.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((item) => {
        return (
          (!filters.organization ||
            item.organization === filters.organization) &&
          (!filters.job || item.job === filters.job)
        );
      });

    if (filters.sort) {
      result = [...result].sort((a, b) => {
        if (filters.sort === "examDateAsc")
          return a.examDate.localeCompare(b.examDate);
        if (filters.sort === "examDateDesc")
          return b.examDate.localeCompare(a.examDate);
        return 0;
      });
    }

    return result;
  }, [mappedData, searchTerm, filters]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Submit material:",
      isEditMode ? selectedMaterial : newMaterial
    );
    setNewMaterial({
      examTitle: "",
      organization: "",
      job: "",
      materials: "",
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedMaterial(null);
    setTimeout(() => {
      setIsAddSuccessModalOpen(true);
      setTimeout(() => {
        setIsAddSuccessModalOpen(false);
      }, 3000);
    }, 300);
  };

  const handleFormChange = (key, value) => {
    if (isEditMode) {
      setSelectedMaterial((prev) => ({ ...prev, [key]: value }));
    } else {
      setNewMaterial((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleEditClick = (item) => {
    setSelectedMaterial(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDownload = (materialFile) => {
    if (materialFile && materialFile !== "-") {
      const fileUrl = materialFile.startsWith("http")
        ? materialFile
        : `https://example.com/files/${materialFile}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = materialFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟"
    );
    if (confirmDelete) {
// $&
    }
  };

  return (
    <div className="exam-list">
      <div className="exam-list__header">
        <div className="exam-list__titleWrapper">
          <h3 className="exam-list__title">مواد ارزیابی تکمیلی</h3>
          {user?.role === "کانون ارزیابی" && (
            <button
              className="assign-permit__add-btn"
              onClick={() => {
                setIsEditMode(false);
                setNewMaterial({
                  examTitle: "",
                  organization: "",
                  job: "",
                  materials: "",
                });
                setIsModalOpen(true);
              }}
            >
              <FaPlus /> افزودن
            </button>
          )}
        </div>
        <div className="exam-list__search-container">
          <div className="exam-list__actions">
            <div className="exam-list__filter-container">
              <div className="exam-list__filter">
                <FaFilter className="exam-list__filter-icon" />
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
            <div className="exam-list__sort-container">
              <div className="exam-list__sort">
                <FaSortAmountUpAlt className="exam-list__sort-icon" />
                <div className="sort-options">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`sort-item ${
                        filters.sort === option.value ? "active" : ""
                      }`}
                      onClick={() => {
                        handleFilterChange("sort", option.value);
                        setCurrentPage(1);
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
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="exam-list__search"
          />
        </div>
      </div>

      <table className="exam-list__table">
        <thead>
          <tr>
            <th className="exam-list__table-header">عنوان آزمون</th>
            <th className="exam-list__table-header">تاریخ آزمون</th>
            <th className="exam-list__table-header">دستگاه</th>
            <th className="exam-list__table-header">شغل</th>
            <th className="exam-list__table-header">مواد ارزیابی</th>
            {user?.role === "کانون ارزیابی" && (
              <th className="exam-list__table-header">عملیات</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <tr key={item.id} className="exam-list__table-row">
                <td className="exam-list__table-cell">{item.examTitle}</td>
                <td className="exam-list__table-cell">{item.examDate}</td>
                <td className="exam-list__table-cell">{item.organization}</td>
                <td className="exam-list__table-cell">{item.job}</td>
                <td className="exam-list__table-cell">
                  {item.materials !== "-" ? (
                    <button
                      className="exam-list__download-btn"
                      onClick={() => handleDownload(item.materials)}
                      data-tooltip-id={`download-${item.id}`}
                      data-tooltip-content="دریافت فایل"
                    >
                      <FaDownload />
                    </button>
                  ) : (
                    <span>فایلی موجود نیست</span>
                  )}
                  {item.materials !== "-" && (
                    <Tooltip
                      id={`download-${item.id}`}
                      place="top"
                      effect="solid"
                      className="exam-list__tooltip"
                    />
                  )}
                </td>
                {user?.role === "کانون ارزیابی" && (
                  <td className="exam-list__table-cell">
                    <div className="exam-list__table-actions">
                      <button
                        className="exam-list__action-btn exam-list__action-btn--edit"
                        data-tooltip-id={`edit-${item.id}`}
                        data-tooltip-content="ویرایش"
                        onClick={() => handleEditClick(item)}
                      >
                        <MdOutlineEdit />
                      </button>
                      <Tooltip
                        id={`edit-${item.id}`}
                        place="top"
                        effect="solid"
                        className="exam-list__tooltip"
                      />
                      <button
                        className="exam-list__action-btn exam-list__action-btn--delete"
                        data-tooltip-id={`delete-${item.id}`}
                        data-tooltip-content="حذف"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <RiDeleteBin5Line />
                      </button>
                      <Tooltip
                        id={`delete-${item.id}`}
                        place="top"
                        effect="solid"
                        className="exam-list__tooltip"
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={user?.role === "کانون ارزیابی" ? 6 : 5}
                className="exam-list__table-cell exam-list__table-cell--empty"
              >
                داده‌ای یافت نشد
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AssessmentMaterialsModal
        isModalOpen={isModalOpen}
        isAddSuccessModalOpen={isAddSuccessModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsAddSuccessModalOpen={setIsAddSuccessModalOpen}
        handleMaterialSubmit={handleMaterialSubmit}
        handleFormChange={handleFormChange}
        newMaterial={newMaterial}
        selectedMaterial={selectedMaterial}
        isEditMode={isEditMode}
        examTitles={[]} // فعلاً خالی، چون در UI استفاده نمی‌شود
        organizations={organizations}
        jobs={jobs}
      />

      {totalPages > 1 && (
        <div className="exam-list__pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`exam-list__pagination-btn ${
                currentPage === page ? "exam-list__pagination-btn--active" : ""
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentMaterials;
