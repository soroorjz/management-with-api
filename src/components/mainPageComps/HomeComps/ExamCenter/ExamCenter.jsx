import React, { useState, useMemo, useEffect } from "react";
import DateObject from "react-date-object";
import ReactPaginate from "react-paginate";
import "./ExamCenter.scss";
import {
  FaFilter,
  FaBuilding,
  FaPlus,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import ExamCenterModal from "./ExamCenterModal";
import { useAuth } from "../../../../AuthContext";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { getHandler, addHandler, getBirthProvinces, deleteHandler } from "../../../../apiService";
import axios from "axios";

const ExamCenter = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    province: "",
    status: "",
    gender: "",
    sort: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("حوزه‌های من");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centerToDelete, setCenterToDelete] = useState(null);
  const [newCenter, setNewCenter] = useState({
    title: "",
    province: "",
    provinceId: "",
    city: "",
    cityId: "",
    capacity: "",
    gender: "مختلط",
    status: "فعال",
    contractDate: null,
    address: "",
    phone: "",
    category: "حوزه‌های من", // پیش‌فرض
    firstName: "",
    lastName: "",
    contractAmount: 0,
  });
  const itemsPerPage = 12;

  // استیت‌های جدید برای داده‌های API
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geographies, setGeographies] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getHandler("zone/zones");
        const data = response.Result || response;
        if (!Array.isArray(data)) {
          throw new Error("پاسخ API آرایه نیست: " + JSON.stringify(data));
        }
        setZones(data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت داده‌های حوزه‌ها: " + err.message);
        setLoading(false);
      }
    };
    fetchZones();
    // گرفتن جغرافیاها (استان و شهر)
    const fetchGeographies = async () => {
      try {
        const response = await getHandler("geography/geographies");
        const data = response.Result || response;
        setGeographies(data);
        const provs = data
          .filter((item) => !item.GeographyParent)
          .map((item) => ({
            value: item.GeographyName,
            label: item.GeographyName,
            id: item.GeographyId,
          }));
        const cits = data
          .filter((item) => item.GeographyParent)
          .map((item) => ({
            value: item.GeographyName,
            label: item.GeographyName,
            id: item.GeographyId,
            parentId: String(item.GeographyParent),
          }));
        setProvinces(provs);
        setCities(cits);
// $&
// $&
      } catch (err) {
        setProvinces([]);
        setCities([]);
      }
    };
    fetchGeographies();
  }, []);

  // فیلتر شهرها بر اساس استان انتخاب‌شده
  useEffect(() => {
    if (newCenter.provinceId) {
      const filtered = cities.filter((city) => {
        const p1 = String(city.parentId).trim();
        const p2 = String(newCenter.provinceId).trim();
// $&
        return p1 === p2;
      });
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [newCenter.provinceId, cities]);

  const centers = zones || [];
  const tabs = [
    "حوزه‌های من",
    "حوزه‌های جهاد دانشگاهی",
    "حوزه‌های سازمان سنجش و آموزش کشور",
    "حوزه‌های شرکت آزمون گستر",
  ];
  const genders = useMemo(() => [
      { value: "", label: "همه" },
      { value: "مرد", label: "مرد" },
      { value: "زن", label: "زن" },
      { value: "مختلط", label: "مختلط" },
  ], []);
  const statuses = useMemo(() => [
      { value: "", label: "همه" },
      { value: "فعال", label: "فعال" },
      { value: "غیرفعال", label: "غیرفعال" },
  ], []);
  const categories = useMemo(() => tabs.map((tab) => ({ value: tab, label: tab })), [tabs]);
  const sortOptions = useMemo(() => [
      { value: "", label: "پیش‌فرض" },
      { value: "capacity-asc", label: "کمترین ظرفیت" },
      { value: "capacity-desc", label: "بیشترین ظرفیت" },
      { value: "contractDate-asc", label: "نزدیک‌ترین تاریخ قرارداد" },
      { value: "contractDate-desc", label: "دورترین تاریخ قرارداد" },
  ], []);
  const filterConfig = [
    { label: "استان", key: "province", options: provinces },
    { label: "وضعیت", key: "status", options: statuses },
    { label: "جنسیت", key: "gender", options: genders },
  ];
  const filteredCenters = useMemo(() => {
    let result = centers.map((center) => ({
      id: center.ZoneId,
      title: center.ZoneName,
      province: center.ZoneProvinceRef || "",
      city: center.ZoneSubProvinceRef || "",
      capacity: center.ZoneTotalCapacity || 0,
        gender: center.gender || "مختلط", // پیش‌فرض موقت
      status: center.ZoneIsActive === "Y" ? "فعال" : "غیرفعال",
      contractDate: center.ZoneContractDate || "",
      address: center.ZoneAddress || "",
      phone: center.ZonePhoneNumber || "",
        category: center.category || "حوزه‌های من", // پیش‌فرض موقت
        firstName: center.firstName || "",
        lastName: center.lastName || "",
        contractAmount: center.contractAmount || 0,
    }));
    result = result.filter((center) => {
      const tabMatch = center.category === activeTab;
      const searchMatch =
        searchTerm === "" ||
        Object.values(center)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const provinceMatch =
        filters.province === "" || center.province === filters.province;
      const statusMatch =
        filters.status === "" || center.status === filters.status;
      const genderMatch =
        filters.gender === "" || center.gender === filters.gender;
      return (
        tabMatch && searchMatch && provinceMatch && statusMatch && genderMatch
      );
    });
    if (filters.sort) {
      result = [...result].sort((a, b) => {
        if (filters.sort === "capacity-asc") {
          return a.capacity - b.capacity;
        } else if (filters.sort === "capacity-desc") {
          return b.capacity - a.capacity;
        } else if (filters.sort === "contractDate-asc") {
          const dateA = a.contractDate
            ? new Date(a.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          const dateB = b.contractDate
            ? new Date(b.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          return dateA - dateB;
        } else if (filters.sort === "contractDate-desc") {
          const dateA = a.contractDate
            ? new Date(a.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          const dateB = b.contractDate
            ? new Date(b.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          return dateB - dateA;
        }
        return 0;
      });
    }
    return result;
  }, [centers, activeTab, searchTerm, filters]);
  const pageCount = Math.ceil(filteredCenters.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCenters = filteredCenters.slice(startIndex, endIndex);

  // بعد از تعریف همه هوک‌ها، حالا returnهای شرطی
  if (loading) return <div>در حال دریافت داده‌های حوزه‌ها...</div>;
  if (error) return <div>خطا: {error}</div>;
  if (!centers.length) {
    return <div>داده‌ای برای حوزه‌ها یافت نشد.</div>;
  }

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(0);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddClick = () => {
    setNewCenter({
      title: "",
      province: "",
      provinceId: "",
      city: "",
      cityId: "",
      capacity: "",
      gender: "مختلط",
      status: "فعال",
      contractDate: null,
      address: "",
      phone: "",
      category: activeTab,
      firstName: "",
      lastName: "",
      contractAmount: 0,
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (center) => {
    setSelectedCenter(center);
    setNewCenter({
      title: center.title || "",
      province: center.province || "",
      provinceId: center.provinceId || "",
      city: center.city || "",
      cityId: center.cityId || "",
      capacity: center.capacity || "",
      gender: center.gender || "مختلط",
      status: center.status || "فعال",
      contractDate: center.contractDate
        ? new DateObject({
            date: center.contractDate,
            format: "YYYY/MM/DD",
            calendar: persian,
            locale: persian_fa,
          })
        : null,
      address: center.address || "",
      phone: center.phone || "",
      category: center.category || activeTab,
      firstName: center.firstName || "",
      lastName: center.lastName || "",
      contractAmount: center.contractAmount || 0,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (center) => {
    setCenterToDelete(center);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCenter(null);
    setNewCenter({
      title: "",
      province: "",
      provinceId: "",
      city: "",
      cityId: "",
      capacity: "",
      gender: "مختلط",
      status: "فعال",
      contractDate: null,
      address: "",
      phone: "",
      category: "حوزه‌های من",
      firstName: "",
      lastName: "",
      contractAmount: 0,
    });
  };

  const handleFormChange = (key, value) => {
    setNewCenter(prev => {
      let updated = { ...prev, [key]: value };
      if (key === "provinceId") {
        const provinceObj = provinces.find(p => p.id === value);
        updated.province = provinceObj ? provinceObj.label : "";
        updated.cityId = "";
        updated.city = "";
      }
      if (key === "cityId") {
        const cityObj = cities.find(c => c.id === value);
        updated.city = cityObj ? cityObj.label : "";
      }
      return updated;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ZoneName: newCenter.title,
        ZoneProvinceRef: newCenter.provinceId,
        ZoneSubProvinceRef: newCenter.cityId,
        ZoneTotalCapacity: newCenter.capacity,
        gender: newCenter.gender,
        ZoneIsActive: newCenter.status === "فعال" ? "Y" : "N",
        ZoneContractDate: newCenter.contractDate,
        ZoneAddress: newCenter.address,
        ZonePhoneNumber: newCenter.phone,
        contractAmount: newCenter.contractAmount,
      };
      const response = await addHandler("zone", postData);
      setZones((prev) => [response, ...prev]);
    setIsModalOpen(false);
    setTimeout(() => {
      setIsAddSuccessModalOpen(true);
      setTimeout(() => {
        setIsAddSuccessModalOpen(false);
      }, 3000);
    }, 300);
    } catch (err) {
      alert("خطا در ثبت مرکز آزمون: " + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // استفاده از API خاص برای حذف آزمون
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.Token;
      
      const response = await axios.delete("https://neoapi.devrayan.ir/api/exam/1", {
        headers: {
          "Token": token,
          "Debug": true,
          "NOCATCH": true,
          "Content-Type": "application/json"
        }
      });
      
// $&
      
      // حذف از state محلی
      setZones((prev) => prev.filter(zone => zone.ZoneId !== centerToDelete.id));
      
      setIsDeleteModalOpen(false);
      setIsDeleteSuccessModalOpen(true);
      setTimeout(() => {
        setIsDeleteSuccessModalOpen(false);
        setCenterToDelete(null);
      }, 3000);
    } catch (err) {
      console.error("خطا در حذف آزمون:", err);
      alert("خطا در حذف آزمون: " + (err.response?.data?.message || err.message));
      setIsDeleteModalOpen(false);
      setCenterToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCenterToDelete(null);
  };

  return (
    <div className="exam-center">
      <div className="exam-center__titleWrapper">
        <h2 className="exam-center__title">حوزه‌ آزمون</h2>
        {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button className="assign-permit__add-btn" onClick={handleAddClick}>
            <FaPlus /> افزودن
          </button>
        )}
      </div>
      <div className="exam-center__search-container">
        <div className="exam-center__actions">
          <div className="exam-center__controls">
            <div className="exam-center__filter">
              <FaFilter className="exam-center__filter-icon" />
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
            <div className="exam-center__sort-container">
              <div className="exam-center__sort">
                <FaSortAmountUpAlt className="exam-center__sort-icon" />
                <div className="sort-options">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`sort-item ${filters.sort === option.value ? "active" : ""}`}
                      onClick={() => handleFilterChange("sort", option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="exam-center__grid">
        {currentCenters.length > 0 ? (
          currentCenters.map((center) => (
            <div key={center.id} className="exam-center__card">
              <div className="exam-center__header">
                <div className="exam-center__center-info">
                  <FaBuilding className="exam-center__center-icon" />
                  <span className="exam-center__title">{center.title}</span>
                </div>
                <span className={`exam-center__status exam-center__status--${center.status}`}>{center.status}</span>
              </div>
              <div className="exam-center__details">
                <p className="exam-center__capacity">
                  ظرفیت: <span>{center.capacity} نفر</span>
                </p>
                <p className="exam-center__gender">
                  جنسیت: <span>{center.gender}</span>
                </p>
                <p className="exam-center__contract-date">
                  تاریخ قرارداد: <span>{center.contractDate}</span>
                </p>
                <p className="exam-center__address">
                  آدرس: <span>{center.address}</span>
                </p>
                <p className="exam-center__phone">
                  تلفن: <span>{center.phone || "-"}</span>
                </p>
                <p className="exam-center__province">
                  استان: <span>{typeof center.province === 'object' && center.province !== null ? center.province.GeographyName : center.province}</span>
                </p>
                <p className="exam-center__city">
                  شهر: <span>{typeof center.city === 'object' && center.city !== null ? center.city.GeographyName : center.city}</span>
                </p>
                <p className="exam-center__contract-amount">
                  مبلغ قرارداد: <span>{center.contractAmount}</span>
                </p>
              </div>
                <div className="exam-center__actions">
                <button className="exam-center__edit-btn" onClick={() => handleEditClick(center)}>ویرایش</button>
                <button className="exam-center__delete-btn" onClick={() => handleDeleteClick(center)}>حذف</button>
                </div>
            </div>
          ))
        ) : (
          <p className="exam-center__no-results">هیچ نتیجه‌ای یافت نشد.</p>
        )}
      </div>
      <div className="exam-center__pagination">
        <ReactPaginate
          previousLabel="قبلی"
          nextLabel="بعدی"
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
      {isModalOpen && (
        <ExamCenterModal
          isModalOpen={isModalOpen}
          handleModalClose={handleModalClose}
          handleFormSubmit={handleFormSubmit}
          handleFormChange={handleFormChange}
          newCenter={newCenter}
          isEditMode={isEditMode}
          provinces={provinces}
          cities={filteredCities}
          genders={genders}
          statuses={statuses}
          categories={categories}
        />
      )}
      {isAddSuccessModalOpen && (
        <div className="success-modal">
          مرکز آزمون با موفقیت ثبت شد.
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="delete-modal">
          آیا از حذف این مرکز آزمون مطمئن هستید؟
          <button onClick={handleDeleteConfirm}>بله</button>
          <button onClick={handleDeleteCancel}>خیر</button>
        </div>
      )}
      {isDeleteSuccessModalOpen && (
        <div className="success-modal">
          مرکز آزمون با موفقیت حذف شد.
        </div>
      )}
    </div>
  );
};

export default ExamCenter;