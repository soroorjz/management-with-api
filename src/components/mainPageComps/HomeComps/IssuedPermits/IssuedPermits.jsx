import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaSortAmountUpAlt,
  FaPlus,
  FaDownload,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import ReactPaginate from "react-paginate";
import EditRequestModal from "../PermitRequestsList/EditRequestModal/EditRequestModal";
import AddPermitModal from "./AddPermitModal/AddPermitModal";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./IssuedPermitsList.scss";
import { useAuth } from "../../../../AuthContext";
import { getMasters } from "../../../../apiService";

const IssuedPermits = () => {
  const { user } = useAuth();
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    sort: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchPermits = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMasters();
        setPermits(data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت لیست مجوزها: " + err.message);
        setLoading(false);
      }
    };
    fetchPermits();
  }, []);

  const toPersianDate = (dateString) => {
    try {
      if (!dateString) {
        return "نامعتبر";
      }
      const persianDateRegex = /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/;
      if (persianDateRegex.test(dateString)) {
        return dateString.replace(/\-/g, "/");
      }
      const date = new DateObject({
        date: new Date(dateString),
        calendar: persian,
        locale: persian_fa,
      });
      if (!date.isValid) {
        throw new Error("Invalid date");
      }
      return date.format("YYYY/MM/DD");
    } catch (error) {
      return dateString || "نامعتبر";
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "dateAsc", label: "قدیمی‌ترین مجوز" },
    { value: "dateDesc", label: "جدیدترین مجوز" },
  ];

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        // اگر داده‌های سازمان‌ها در API موجود بود اینجا اضافه شود
      ],
    },
  ];

  // فیلتر و جستجو و مرتب‌سازی مشابه ExamCenter
  const filteredPermits = permits
    .filter((permit) => {
      return (
        (!filters.organization || permit.organization === filters.organization) &&
        (searchTerm === "" ||
          Object.values(permit)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (filters.sort === "dateAsc")
        return (a.confirmationDate || "").localeCompare(b.confirmationDate || "");
      if (filters.sort === "dateDesc")
        return (b.confirmationDate || "").localeCompare(a.confirmationDate || "");
      return 0;
    });

  const pageCount = Math.ceil(filteredPermits.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredPermits.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // حذف و افزودن و ویرایش و مودال‌ها فعلاً بدون تغییر (در صورت نیاز بعداً داینامیک می‌شود)

  if (loading) return <div>در حال دریافت لیست مجوزها...</div>;
  if (error) return <div>{error}</div>;
  if (!permits.length) return <div>مجوزی یافت نشد.</div>;

  return (
    <div className="issued-permits">
      <div className="issued-permits__headerTitle">
        <h2 className="issued-permits__title">مدیریت مجوز ها</h2>
        {user?.role === "کاربر سازمان اداری و استخدامی" && (
          <button className="assign-permit__add-btn" onClick={() => setIsAddModalOpen(true)}>
            <FaPlus /> افزودن
          </button>
        )}
      </div>
      <div className="issued-permits__search-container">
        <div className="issued-permits__actions">
          <div className="issued-permits__filter-container">
            <div className="issued-permits__filter">
              <FaFilter className="issued-permits__filter-icon" />
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
          <div className="issued-permits__sort-container">
            <div className="issued-permits__sort">
              <FaSortAmountUpAlt className="issued-permits__sort-icon" />
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
          placeholder="جستجو در مجوزها..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="issued-permits__search-input"
        />
      </div>
      <div className="issued-permits__list">
        {currentItems.length > 0 ? (
          currentItems.map((permit) => (
            <div key={permit.masterId} className="issued-permits__item">
              <div className="issued-permits__content">
                <div className="issued-permits__header">
                  <div className="issued-permits__headerTop">
                    <p className="issued-permits__headerDetail title">
                      مجوز {permit.masterId}
                    </p>
                  </div>
                </div>
                <div className="issued-permits__body">
                  <p className="issued-permits__detail">
                    نام: <span>{permit.firstName} {permit.lastName}</span>
                  </p>
                  <p className="issued-permits__detail">
                    شماره همراه: <span>{permit.mobileNumber}</span>
                  </p>
                  <p className="issued-permits__detail">
                    استان: <span>{permit.province}</span>
                  </p>
                  <p className="issued-permits__detail">
                    توضیحات: <span>{permit.managerComment || "بدون توضیحات"}</span>
                  </p>
                </div>
                {/* دکمه دانلود و سایر اکشن‌ها در صورت نیاز اضافه شود */}
              </div>
            </div>
          ))
        ) : (
          <p>هیچ مجوزی یافت نشد</p>
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

export default IssuedPermits;
