import React, { Component } from "react";
import "./ExamAssessmentList.scss";
import { FaFilter, FaDownload, FaSortAmountUpAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { dataTables } from "../../../../apiService";

class ExamAssessmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assessments: [],
      searchTerm: "",
      currentPage: 0,
      filters: {
        organization: "",
        sort: "date-desc",
      },
    };
    this.itemsPerPage = 10;
  }

  // لود و نگاشت داده‌ها
  componentDidMount() {
    const preregisters = dataTables["preregisters"] || [];
    const exams = dataTables["exams"] || [];
    const profiles = dataTables["profiles"] || [];
    const genders = dataTables["genders"] || [];
    const executiveBodies = dataTables["executivebodies"] || [];
    const analyzeDetails = dataTables["analyzedetails"] || [];

    // گروه‌بندی preregisters بر اساس examId
    const examGroups = preregisters.reduce((acc, pr) => {
      const examId = pr.preRegisterExamRef;
      if (!acc[examId]) {
        acc[examId] = [];
      }
      acc[examId].push(pr);
      return acc;
    }, {});

    const mappedAssessments = Object.keys(examGroups).map((examId) => {
      const exam = exams.find((e) => e.examId === parseInt(examId));
      const prList = examGroups[examId];

      const relatedDetail = analyzeDetails.find(
        (detail) => detail.analyzeDetailExamRef === parseInt(examId)
      );
      const executiveBody = relatedDetail
        ? executiveBodies.find(
            (eb) =>
              eb.executiveBodyId === relatedDetail.analyzeDetailExecutiveBodyRef
          )
        : null;

      const totalCount = prList.length;
      const femaleCount = prList.filter((pr) => {
        const profile = profiles.find(
          (p) => p.profileId === pr.preRegisterApplicantRef
        );
        return profile && profile.profileGenderRef === 2;
      }).length;
      const maleCount = prList.filter((pr) => {
        const profile = profiles.find(
          (p) => p.profileId === pr.preRegisterApplicantRef
        );
        return profile && profile.profileGenderRef === 1;
      }).length;

      return {
        id: examId,
        examName: exam ? exam.examName || "-" : "-",
        examDate: exam ? exam.examDate || "-" : "-",
        organization: executiveBody
          ? executiveBody.executiveBodyName || "-"
          : "-",
        totalCount,
        femaleCount,
        maleCount,
        assessmentFile: "/files/assessment-list.xlsx",
        status: "ارسال شده",
      };
    });

// $&
    this.setState({ assessments: mappedAssessments });
  }

  // متدهای هندلر
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

  handleEdit = (id) => {
// $&
    // TODO: پیاده‌سازی ویرایش
  };

  handleDelete = (id) => {
    this.setState(
      (prevState) => ({
        assessments: prevState.assessments.filter(
          (assessment) => assessment.id !== id
        ),
      }),
      () => {
// $&
      }
    );
    // TODO: حذف در دیتابیس
  };

  handlePageClick = (event) => {
    this.setState({ currentPage: event.selected }, () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value, currentPage: 0 });
  };

  // تولید بخش‌های JSX
  TitleSection() {
    return <h2 className="exam-assessment-list__title">لیست نفرات</h2>;
  }

  SearchAndFilterSection({
    tableName,
    filterLabel,
    filterKey,
    valueField,
    labelField,
    defaultOption = { value: "", label: "همه" },
    sortOptions = [
      { value: "date-desc", label: "جدیدترین" },
      { value: "date-asc", label: "قدیمی‌ترین" },
    ],
    searchPlaceholder = "جستجو ...",
    classNamePrefix = "exam-assessment-list",
  }) {
    const { searchTerm, filters } = this.state;
    const dataSource = dataTables[tableName] || [];

    // تابع داخلی برای تولید پیکربندی فیلتر
    const generateFilterConfig = (
      dataSource = [],
      label,
      key,
      valueField,
      labelField,
      defaultOption = { value: "", label: "همه" }
    ) => [
      {
        label,
        key,
        options: [
          defaultOption,
          ...dataSource.map((item) => ({
            value: item[valueField] || "-",
            label: item[labelField] || "-",
          })),
        ],
      },
    ];

    const filterConfig = generateFilterConfig(
      dataSource,
      filterLabel,
      filterKey,
      valueField,
      labelField,
      defaultOption
    );

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

  AssessmentListSection() {
    const { assessments, searchTerm, currentPage, filters } = this.state;
    const preregisters = dataTables["preregisters"] || [];
    const exams = dataTables["exams"] || [];
    const analyzeDetails = dataTables["analyzedetails"] || [];

    if (!preregisters.length || !exams.length) {
      console.warn("Missing required data: preregisters or exams empty");
      return <div>داده‌های مورد نیاز یافت نشد. لطفاً دوباره تلاش کنید.</div>;
    }

    let filteredAssessments = assessments
      .filter((assessment) =>
        Object.values(assessment).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((assessment) =>
        !filters.organization
          ? true
          : assessment.organization === filters.organization
      );

    filteredAssessments = [...filteredAssessments].sort((a, b) => {
      if (filters.sort === "date-asc") {
        return a.examDate.localeCompare(b.examDate);
      } else if (filters.sort === "date-desc") {
        return b.examDate.localeCompare(a.examDate);
      } else if (filters.sort === "alphabet-asc") {
        return a.examName.localeCompare(b.examName);
      } else if (filters.sort === "alphabet-desc") {
        return b.examName.localeCompare(a.examName);
      }
      return 0; // پیش‌فرض
    });

    const pageCount = Math.ceil(filteredAssessments.length / this.itemsPerPage);
    const offset = currentPage * this.itemsPerPage;
    const currentItems = filteredAssessments.slice(
      offset,
      offset + this.itemsPerPage
    );

    return (
      <div className="exam-assessment-list__list">
        {currentItems.length > 0 ? (
          currentItems.map((assessment) => (
            <div key={assessment.id} className="exam-assessment-list__item">
              <div className="exam-assessment-list__content">
                <div className="exam-assessment-list__header">
                  <p className="exam-assessment-list__headerDetail title">
                    {assessment.examName}
                  </p>
                  <p className="headerDetailStatus">{assessment.status}</p>
                </div>
                <p className="exam-assessment-list__headerDetail exam-date">
                  دستگاه: <span>{assessment.organization}</span>
                </p>
                <p className="exam-assessment-list__headerDetail exam-date">
                  تاریخ آزمون: <span>{assessment.examDate}</span>
                </p>
                <div className="exam-assessment-list__body">
                  <p className="exam-assessment-list__detail">
                    تعداد کل: <span>{assessment.totalCount} نفر</span>
                  </p>
                  <p className="exam-assessment-list__detail">
                    تعداد زن: <span>{assessment.femaleCount} نفر</span>
                  </p>
                  <p className="exam-assessment-list__detail">
                    تعداد مرد: <span>{assessment.maleCount} نفر</span>
                  </p>
                </div>
                <div className="exam-assessment-list__actions">
                  <div className="exam-assessment-list__download-buttons">
                    {assessment.assessmentFile ? (
                      <a
                        href={assessment.assessmentFile}
                        download
                        className="exam-assessment-list__download-btn details"
                      >
                        دریافت لیست نفرات
                        <FaDownload />
                      </a>
                    ) : (
                      <span className="exam-assessment-list__no-file">
                        فایلی موجود نیست
                      </span>
                    )}
                  </div>
                  <div className="exam-assessment-list__edit-delete">
                    <button
                      className="exam-assessment-list__action-btn edit"
                      onClick={() => this.handleEdit(assessment.id)}
                    >
                      ویرایش
                    </button>
                    <button
                      className="exam-assessment-list__action-btn delete"
                      onClick={() => this.handleDelete(assessment.id)}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>هیچ لیستی یافت نشد</p>
        )}
      </div>
    );
  }

  PaginationSection() {
    const { assessments, searchTerm, currentPage, filters } = this.state;
    let filteredAssessments = assessments
      .filter((assessment) =>
        Object.values(assessment).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((assessment) =>
        !filters.organization
          ? true
          : assessment.organization === filters.organization
      );

    const pageCount = Math.ceil(filteredAssessments.length / this.itemsPerPage);

    return pageCount > 1 ? (
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
    ) : null;
  }

  render() {
    return (
      <div className="exam-assessment-list">
        {this.TitleSection()}
        {this.SearchAndFilterSection({
          tableName: "executivebodies",
          filterLabel: "دستگاه",
          filterKey: "organization",
          valueField: "executiveBodyName",
          labelField: "executiveBodyName",
          sortOptions: [
            { value: "date-desc", label: "جدیدترین" },
            { value: "date-asc", label: "قدیمی‌ترین" },
            { value: "alphabet-asc", label: "الفبا (ا- ی)" },
            { value: "alphabet-desc", label: "الفبا (ی- ا)" },
          ],
          searchPlaceholder: "جستجو ...",
          classNamePrefix: "exam-assessment-list",
        })}
        {this.AssessmentListSection()}
        {this.PaginationSection()}
      </div>
    );
  }
}

export default ExamAssessmentList;
