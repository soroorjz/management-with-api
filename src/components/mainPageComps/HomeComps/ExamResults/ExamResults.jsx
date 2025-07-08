import React, { Component } from "react";
import "./ExamResults.scss";
import {
  FaFilter,
  FaDownload,
  FaPlus,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { AnimatePresence, motion } from "framer-motion";
import ExamResultModal from "./ExamResultModal/ExamResultModal";
import { dataTables } from "../../../../apiService";
import "./ExamStatusModal/ExamStatusModal.scss";
import { useAuth } from "../../../../AuthContext";

class ExamResults extends Component {
  static contextType = useAuth;

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      currentPage: 0,
      filters: {
        organizer: "",
        examName: "",
        organization: "",
        status: "",
        sort: "date-desc",
      },
      isModalOpen: false,
      isEditMode: false,
      isStatusModalOpen: false,
      selectedResult: null,
      newResult: {
        examName: "",
        organizer: "",
        participants: "",
        organization: "",
        resultFile: "",
        detailsFile: "",
        resultFileName: "انتخاب فایل",
        detailsFileName: "انتخاب فایل",
      },
      isApproved: false,
      source: "ExamResults",
    };
    this.itemsPerPage = 8;
// $&
// $&
  }

  restrictAccess = (section) => {
    const role = this.context?.user?.role || this.props.user?.role || "";
// $&
    const accessRules = {
      Title: [
        "کاربر سازمان اداری و استخدامی",
        "مجری آزمون کتبی",
        "دستگاه ستادی",
      ],
      AddButton: ["مجری آزمون کتبی"],
    };
    return accessRules[section]?.includes(role) || false;
  };

  Title() {
    if (!this.restrictAccess("Title")) return null;
    return <h2 className="exam-results__title">نتایج آزمون‌</h2>;
  }

  AddButton() {
    if (!this.restrictAccess("AddButton")) return null;
    return (
      <button
        className="assign-permit__add-btn"
        onClick={() => {
// $&
          this.setState({
            isEditMode: false,
            newResult: {
              examName: "",
              organizer: "",
              participants: "",
              organization: "",
              resultFile: "",
              detailsFile: "",
              resultFileName: "انتخاب فایل",
              detailsFileName: "انتخاب فایل",
            },
            isModalOpen: true,
          });
        }}
      >
        <FaPlus /> افزودن
      </button>
    );
  }

  getInitialSwitchState = (result, source) => {
    const status =
      dataTables["resultexamstatuses"].find(
        (s) => s.resultExamStatusID === result.resultExamStatusRef
      )?.resultExamStatusName || "";
// $&
    const role = this.context?.user?.role || this.props.user?.role || "";
    if (source === "ExamResults") {
      return role === "کاربر سازمان اداری و استخدامی" && status === "تأیید شده"
        ? true
        : false;
    } else if (source === "SupplementaryAssessmentResults") {
      if (role === "کاربر سازمان اداری و استخدامی") {
        return status === "تأیید سازمان اداری و استخدامی" ? true : false;
      } else if (role === "دستگاه ستادی") {
        return status === "تأیید نهایی" ? true : false;
      }
      return false;
    } else if (source === "SelectionResults") {
      return role === "کاربر سازمان اداری و استخدامی" && status === "استخدام"
        ? true
        : false;
    }
    console.warn(`Unknown source: ${source}. Defaulting to ExamResults logic.`);
    return role === "کاربر سازمان اداری و استخدامی" && status === "تأیید شده"
      ? true
      : false;
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedResult !== this.state.selectedResult ||
      prevState.isStatusModalOpen !== this.state.isStatusModalOpen ||
      prevState.source !== this.state.source
    ) {
      if (this.state.selectedResult && this.state.isStatusModalOpen) {
        const isApproved = this.getInitialSwitchState(
          this.state.selectedResult,
          this.state.source
        );
        this.setState({ isApproved });
      }
    }
  }

  handleFilterChange = (filterType, value) => {
    this.setState(
      (prevState) => ({
        filters: { ...prevState.filters, [filterType]: value },
        currentPage: 0,
      }),
      () => {
// $&
      }
    );
  };

  handleEdit = (result) => {
    const exam =
      dataTables["exams"].find((e) => e.examId === result.resultExamRef) || {};
    this.setState({
      newResult: {
        examName: exam.examName || "",
        organizer: result.organizer || "",
        participants: result.participants || "",
        organization: result.organization || "",
        resultFile: result.resultFile || "",
        detailsFile: result.detailsFile || "",
        resultFileName: result.resultFileName || "فایل نتایج",
        detailsFileName: result.detailsFileName || "جزئیات نتایج",
      },
      selectedResult: result,
      isEditMode: true,
      isModalOpen: true,
    });
  };

  handleDelete = (id) => {
// $&
  };

  handleAddResult = (e) => {
    e.preventDefault();
// $&
    this.setState({
      newResult: {
        examName: "",
        organizer: "",
        participants: "",
        organization: "",
        resultFile: "",
        detailsFile: "",
        resultFileName: "انتخاب فایل",
        detailsFileName: "انتخاب فایل",
      },
      isModalOpen: false,
      isEditMode: false,
      selectedResult: null,
    });
  };

  handleStatusChange = (id, newStatus) => {
// $&
    this.setState({
      isStatusModalOpen: false,
      selectedResult: null,
      isApproved: false,
    });
  };

  handleStatusSubmit = (e) => {
    e.preventDefault();
    const { selectedResult, isApproved, source } = this.state;
    const role = this.context?.user?.role || this.props.user?.role || "";

    if (!selectedResult || !role) {
      console.error("Result or user role is undefined");
      this.setState({ isStatusModalOpen: false });
      return;
    }

    let newStatus = selectedResult.status || "در حال بررسی";

    if (source === "ExamResults") {
      if (role === "کاربر سازمان اداری و استخدامی") {
        newStatus = isApproved ? "تأیید شده" : "عدم تأیید";
      }
    } else if (source === "SupplementaryAssessmentResults") {
      if (role === "کاربر سازمان اداری و استخدامی") {
        if (selectedResult.status === "ارسال به سازمان اداری و استخدامی") {
          newStatus = isApproved ? "تأیید سازمان اداری و استخدامی" : "رد شده";
        } else if (selectedResult.status === "تأیید سازمان اداری و استخدامی") {
          newStatus = isApproved
            ? "تأیید سازمان اداری و استخدامی"
            : "ارسال به سازمان اداری و استخدامی";
        }
      } else if (role === "دستگاه ستادی") {
        if (selectedResult.status === "تأیید سازمان اداری و استخدامی") {
          newStatus = isApproved ? "تأیید نهایی" : "رد شده";
        } else if (selectedResult.status === "تأیید نهایی") {
          newStatus = isApproved
            ? "تأیید نهایی"
            : "تأیید سازمان اداری و استخدامی";
        }
      }
    } else if (source === "SelectionResults") {
      if (role === "کاربر سازمان اداری و استخدامی") {
        newStatus = isApproved ? "استخدام" : "ثبت شده";
      }
    } else {
      console.warn(
        `Unknown source: ${source}. Defaulting to ExamResults logic.`
      );
      if (role === "کاربر سازمان اداری و استخدامی") {
        newStatus = isApproved ? "تأیید شده" : "عدم تأیید";
      }
    }

    console.log(
      `Submitting status change for result ID ${selectedResult.id} to: ${newStatus}`
    );
    this.handleStatusChange(selectedResult.id, newStatus);
  };

  openStatusModal = (result, source = "ExamResults") => {
// $&
    const role = this.context?.user?.role || this.props.user?.role || "";
    this.setState({
      selectedResult: result,
      isStatusModalOpen: true,
      isApproved: this.getInitialSwitchState(result, source),
      source,
    });
  };

  handlePageClick = (event) => {
    this.setState({ currentPage: event.selected }, () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value, currentPage: 0 });
  };

  SearchAndFilterSection({
    filterConfig,
    sortOptions = [
      { value: "date-desc", label: "جدیدترین" },
      { value: "date-asc", label: "قدیمی‌ترین" },
      { value: "alphabet-asc", label: "الفبا (صعودی)" },
      { value: "alphabet-desc", label: "الفبا (نزولی)" },
    ],
    searchPlaceholder = "جستجو در نتایج آزمون‌ها ...",
    classNamePrefix = "exam-results",
  }) {
    const { searchTerm, filters } = this.state;

    return (
      <div className={`${classNamePrefix}__search-container`}>
        <div className={`${classNamePrefix}__actions`}>
          <div className={`${classNamePrefix}__controls`}>
            <div className={`${classNamePrefix}__filter`}>
              <FaFilter className={`${classNamePrefix}__filter-icon`} />
              <div className="filter-selects">
                {filterConfig.map((filter) => (
                  <div key={filter.key} className="filter-select-wrapper">
                    <label className="filter-select-label">
                      {filter.label}
                    </label>
                    <select
                      value={filters[filter.key] || ""}
                      onChange={(e) =>
                        this.handleFilterChange(filter.key, e.target.value)
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
            <div className={`${classNamePrefix}__sort-container`}>
              <div className={`${classNamePrefix}__sort`}>
                <FaSortAmountUpAlt
                  className={`${classNamePrefix}__sort-icon`}
                />
                <div className="sort-options">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`sort-item ${
                        filters.sort === option.value ? "active" : ""
                      }`}
                      onClick={() => {
                        this.handleFilterChange("sort", option.value);
                        this.setState({ currentPage: 0 });
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={this.handleSearchChange}
          className={`${classNamePrefix}__search-input`}
        />
      </div>
    );
  }

  ResultsListSection(currentItems) {
    const role = this.context?.user?.role || this.props.user?.role || "";
    return (
      <div className="exam-results__list">
        {currentItems.length > 0 ? (
          currentItems.map((result) => {
            const exam =
              dataTables["exams"].find(
                (e) => e.examId === result.resultExamRef
              ) || {};
            const status =
              dataTables["resultexamstatuses"].find(
                (s) => s.resultExamStatusID == result.resultExamStatusRef
              ) || {};
            const organizer =
              dataTables["organizers"].find(
                (o) => o.organizerId === exam.examOrganizerRef
              ) || {};
            const executiveBody =
              dataTables["executivebodies"].find(
                (e) => e.executiveBodyId === result.resultExecutiveBodyRef
              ) || {};
            return (
              <div key={result.id} className="exam-results__item">
                <div className="exam-results__content">
                  <div className="exam-results__header">
                    <div className="exam-results__headerTop">
                      <p className="exam-results__headerDetail title">
                        {exam.examName || "نامشخص"}
                      </p>
                      <p
                        className={`exam-results__headerDetail status ${
                          role === "کاربر سازمان اداری و استخدامی" ||
                          role === "مجری آزمون کتبی"
                            ? "status--clickable"
                            : ""
                        }`}
                        onClick={() => this.openStatusModal(result)}
                      >
                        {status.resultExamStatusName || "نامشخص"}
                      </p>
                    </div>
                    {role !== "مجری آزمون کتبی" && (
                      <p className="exam-results__headerDetail organizer">
                        مجری: <span>{organizer.organizerName || "نامشخص"}</span>
                      </p>
                    )}
                    <p className="exam-results__headerDetail exam-results__exam-date">
                      تاریخ آزمون: <span>{exam.examDate || "نامشخص"}</span>
                    </p>
                  </div>
                  <div className="exam-results__body">
                    <p className="exam-results__detail">
                      شرکت‌کنندگان:{" "}
                      <span>
                        {result.resultApplicantsCount
                          ? result.resultApplicantsCount + " نفر"
                          : "نامشخص"}
                      </span>
                    </p>
                    <p className="exam-results__detail">
                      دستگاه:{" "}
                      <span>{executiveBody.executiveBodyName || "نامشخص"}</span>
                    </p>
                  </div>
                  {status.resultExamStatusName === "تأیید شده" && (
                    <div className="exam-result__date">
                      <p>
                        <span className="bold">تاریخ انتشار نتایج </span>
                        <span>{result.resultExamPublishDate || "نامشخص"}</span>
                      </p>
                    </div>
                  )}
                  <div className="exam-results__actions">
                    <div className="exam-results__download-buttons">
                      <a
                        href={
                          "data:@file/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
                          result.resultExamExcel
                        }
                        download={exam.examName + "-نتیجه.xlsx"}
                        className="exam-results__download-btn results"
                      >
                        فایل نتایج
                        <FaDownload />
                      </a>
                      <a
                        href={
                          "data:@file/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
                          result.resultExamDetailsExcel
                        }
                        download={exam.examName + "-جزئیات.xlsx"}
                        className="exam-results__download-btn details"
                      >
                        جزئیات نتایج
                        <FaDownload />
                      </a>
                    </div>
                    {role === "مجری آزمون کتبی" &&
                      status.resultExamStatusName === "بررسی نشده" && (
                        <div className="exam-results__edit-delete">
                          <button
                            className="exam-results__action-btn edit"
                            onClick={() => this.handleEdit(result)}
                          >
                            ویرایش
                          </button>
                          <button
                            className="exam-results__action-btn delete"
                            onClick={() => this.handleDelete(result.id)}
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
    );
  }

  PaginationSection(pageCount) {
    return (
      pageCount > 1 && (
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={this.handlePageClick}
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
      )
    );
  }

  ExamResultModalSection(filterConfig, examOptions) {
    const { isModalOpen, isEditMode, newResult } = this.state;

    return (
      <ExamResultModal
        isOpen={isModalOpen}
        onClose={() => {
          this.setState({
            isModalOpen: false,
            isEditMode: false,
            newResult: {
              examName: "",
              organizer: "",
              participants: "",
              organization: "",
              resultFile: "",
              detailsFile: "",
              resultFileName: "انتخاب فایل",
              detailsFileName: "انتخاب فایل",
            },
          });
        }}
        onSubmit={this.handleAddResult}
        newResult={newResult}
        setNewResult={(newResult) => this.setState({ newResult })}
        filterConfig={filterConfig}
        examOptions={examOptions}
        isEditMode={isEditMode}
      />
    );
  }

  ExamStatusModalSection() {
    const { isStatusModalOpen, selectedResult, isApproved, source } =
      this.state;

    const getTitleText = () => {
      if (source === "SupplementaryAssessmentResults")
        return "تغییر وضعیت نتایج ارزیابی تکمیلی";
      if (source === "SelectionResults") return "تغییر وضعیت نتایج گزینش";
      return "تغییر وضعیت نتایج آزمون";
    };

    const getLabelText = () => {
      if (source === "SupplementaryAssessmentResults")
        return "وضعیت نتایج ارزیابی تکمیلی";
      if (source === "SelectionResults") return "وضعیت نتایج گزینش";
      return "وضعیت نتایج آزمون";
    };

    return (
      <AnimatePresence>
        {isStatusModalOpen && selectedResult ? (
          <motion.div
            className="exam-status-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="exam-status-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3 className="exam-status-modal__title">{getTitleText()}</h3>
              <form
                onSubmit={this.handleStatusSubmit}
                className="exam-status-modal__form"
              >
                <div className="exam-status-modal__form-group">
                  <label className="exam-status-modal__label">
                    {getLabelText()}
                  </label>
                  <div className="exam-status-modal__switch-container">
                    <span className="exam-status-modal__switch-label exam-status-modal__switch-label--approve">
                      تأیید
                    </span>
                    <label className="exam-status-modal__switch">
                      <input
                        type="checkbox"
                        checked={isApproved}
                        onChange={() =>
                          this.setState({ isApproved: !isApproved })
                        }
                      />
                      <span className="exam-status-modal__slider"></span>
                    </label>
                    <span className="exam-status-modal__switch-label exam-status-modal__switch-label--reject">
                      عدم تأیید
                    </span>
                  </div>
                </div>
                <div className="exam-status-modal__buttons">
                  <button
                    type="submit"
                    className="exam-status-modal__submit-btn"
                  >
                    تأیید
                  </button>
                  <button
                    type="button"
                    className="exam-status-modal__cancel-btn"
                    onClick={() => {
                      this.setState({
                        isStatusModalOpen: false,
                        selectedResult: null,
                        isApproved: false,
                      });
                    }}
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  getFilterConfig() {
    const role = this.context?.user?.role || this.props.user?.role || "";
    const examNameOptions = [
      { value: "", label: "همه" },
      ...[...new Set(dataTables["exams"].map((exam) => exam.examName))]
        .filter((examName) => examName)
        .map((examName) => ({ value: examName, label: examName })),
    ];

    const statusOptions = [
      { value: "", label: "همه" },
      ...dataTables["resultexamstatuses"].map((status) => ({
        value: status.resultExamStatusID,
        label: status.resultExamStatusName,
      })),
    ];

    const organizerOptions = [
      { value: "", label: "همه" },
      ...[
        ...new Set(dataTables["resultexams"].map((result) => result.organizer)),
      ]
        .filter((organizer) => organizer)
        .map((organizer) => ({ value: organizer, label: organizer })),
    ];

    const organizationOptions = [
      { value: "", label: "همه" },
      ...[
        ...new Set(
          dataTables["resultexams"].map((result) => result.organization)
        ),
      ]
        .filter((organization) => organization)
        .map((organization) => ({ value: organization, label: organization })),
    ];

    return [
      ...(role !== "مجری آزمون کتبی"
        ? [
            {
              label: "مجری",
              key: "organizer",
              options: organizerOptions,
            },
          ]
        : []),
      {
        label: "عنوان آزمون",
        key: "examName",
        options: examNameOptions,
      },
      {
        label: "دستگاه",
        key: "organization",
        options: organizationOptions,
      },
      {
        label: "وضعیت",
        key: "status",
        options: statusOptions,
      },
    ];
  }

  getExamOptions() {
    return [
      { value: "", label: "انتخاب کنید" },
      ...dataTables["exams"].map((exam) => ({
        value: exam.examId,
        label: exam.examName,
      })),
    ];
  }

  getFilteredResults() {
    const { searchTerm, filters, currentPage } = this.state;

    let filteredResults = dataTables["resultexams"]
      .filter((result) => {
        const exam =
          dataTables["exams"].find((e) => e.examId === result.resultExamRef) ||
          {};
        const status =
          dataTables["resultexamstatuses"].find(
            (s) => s.resultExamStatusID === result.resultExamStatusRef
          ) || {};
        return Object.values({
          ...result,
          examName: exam.examName,
          status: status.resultExamStatusName,
        }).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .filter((result) =>
        !filters.organizer ? true : result.organizer === filters.organizer
      )
      .filter((result) => {
        const exam =
          dataTables["exams"].find((e) => e.examId === result.resultExamRef) ||
          {};
        return !filters.examName ? true : exam.examName === filters.examName;
      })
      .filter((result) =>
        !filters.organization
          ? true
          : result.organization === filters.organization
      )
      .filter((result) => {
        const status =
          dataTables["resultexamstatuses"].find(
            (s) => s.resultExamStatusID === result.resultExamStatusRef
          ) || {};
        return !filters.status
          ? true
          : String(status.resultExamStatusID) === filters.status;
      });

    filteredResults = [...filteredResults].sort((a, b) => {
      const examA =
        dataTables["exams"].find((e) => e.examId === a.resultExamRef) || {};
      const examB =
        dataTables["exams"].find((e) => e.examId === b.resultExamRef) || {};
      const dateA = examA.examDate || "";
      const dateB = examB.examDate || "";
      const nameA = examA.examName || "";
      const nameB = examB.examName || "";

      if (filters.sort === "date-asc") {
        return dateA.localeCompare(dateB);
      } else if (filters.sort === "date-desc") {
        return dateB.localeCompare(dateA);
      } else if (filters.sort === "alphabet-asc") {
        return nameA.localeCompare(nameB);
      } else if (filters.sort === "alphabet-desc") {
        return nameB.localeCompare(nameA);
      }
      return 0;
    });

    const pageCount = Math.ceil(filteredResults.length / this.itemsPerPage);
    const offset = currentPage * this.itemsPerPage;
    const currentItems = filteredResults.slice(
      offset,
      offset + this.itemsPerPage
    );

    return { filteredResults, pageCount, currentItems };
  }

  render() {
    const { filteredResults, pageCount, currentItems } =
      this.getFilteredResults();
    const filterConfig = this.getFilterConfig();
    const examOptions = this.getExamOptions();

    return (
      <div className="exam-results">
        <div className="exam-results__titleWrapper">
          {this.Title()}
          {this.AddButton()}
        </div>
        {this.SearchAndFilterSection({
          filterConfig,
          sortOptions: [
            { value: "date-desc", label: "جدیدترین" },
            { value: "date-asc", label: "قدیمی‌ترین" },
            { value: "alphabet-asc", label: "الفبا (صعودی)" },
            { value: "alphabet-desc", label: "ال بزرگوار (نزولی)" },
          ],
          searchPlaceholder: "جستجو در نتایج آزمون‌ها ...",
          classNamePrefix: "exam-results",
        })}
        {this.ExamResultModalSection(filterConfig, examOptions)}
        {this.ExamStatusModalSection()}
        {this.ResultsListSection(currentItems)}
        {this.PaginationSection(pageCount)}
      </div>
    );
  }
}

export default ExamResults;
