import React, { useState, useMemo, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./QuestionDesignerManagement.scss";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import DesignerControls from "./DesignerControls";
import DesignerCard from "./DesignerCard";
import AddDesignerModal from "./AddDesignerModal";
import AddSuccessModal from "./AddSuccessModal";
import EditDesignerModal from "./EditDesignerModal";
import EditSuccessModal from "./EditSuccessModal";
import DeleteDesignerModal from "./DeleteDesignerModal";
import DeleteSuccessModal from "./DeleteSuccessModal";
import { useAuth } from "../../../../AuthContext";
import { getMasters, addMaster, updateMaster, deleteMaster } from "../../../../apiService";

const QuestionDesignerManagement = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    province: "",
    status: "",
    sort: "date-desc",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [formData, setFormData] = useState({});
  const [newDesigner, setNewDesigner] = useState({
    firstName: "",
    lastName: "",
    province: "",
    address: "",
    status: "",
    mobileNumber: "",
    nationalCode: "",
    idNumber: "",
    contractImage: "",
    contractAmount: "",
    performanceRating: "",
    managerComment: "",
    username: "",
    password: "",
  });
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const itemsPerPage = 12;

  // بررسی وجود داده‌ها
  if (!designers.length) {
    return <div>داده‌های مورد نیاز یافت نشد. لطفاً دوباره تلاش کنید.</div>;
  }

  // نگاشت داده‌های designers به فرمت UI
  const normalizedDesigners = useMemo(() => {
    return designers.map((designer) => {
      return {
        id: designer.masterId || "-",
        firstName: designer.masterFirstName || "-",
        lastName: designer.masterLastName || "-",
        province: designer.masterProvinceRef ? designer.geographyName : "-",
        status: designer.masterIsActive === "Y" ? "فعال" : "غیرفعال",
        address: designer.masterAddress || "-",
        mobileNumber: designer.masterMobile || "-",
        nationalCode: "-",
        idNumber: "-",
        contractImage: "-",
        contractAmount: "-",
        performanceRating: "-",
        managerComment: "-",
        username: "-",
        password: "-",
        createdAt: "-", // غایب
      };
    });
  }, [designers]);

  // گزینه‌های فیلتر
  const provinces = useMemo(() => {
    const provinceList = designers
      .filter((d) => d.geographyParent === null)
      .map((province) => ({
        value: province.geographyName,
        label: province.geographyName,
      }));
    return [{ value: "", label: "همه" }, ...provinceList];
  }, [designers]);

  const statuses = useMemo(() => {
    return [
      { value: "", label: "همه" },
      { value: "فعال", label: "فعال" },
      { value: "غیرفعال", label: "غیرفعال" },
    ];
  }, []);

  const sortOptions = [
    { value: "date-desc", label: "جدیدترین" },
    { value: "date-asc", label: "قدیمی‌ترین" },
  ];

  // فیلتر و مرتب‌سازی
  const filteredDesigners = useMemo(() => {
    let filtered = normalizedDesigners.filter((designer) => {
      const searchMatch =
        searchTerm === "" ||
        `${designer.firstName} ${designer.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const provinceMatch =
        filters.province === "" || designer.province === filters.province;
      const statusMatch =
        filters.status === "" || designer.status === filters.status;
      return searchMatch && provinceMatch && statusMatch;
    });

    return [...filtered].sort((a, b) => {
      // چون createdAt غایبه، از id برای مرتب‌سازی استفاده می‌کنیم
      const idA = a.id !== "-" ? parseInt(a.id) : 0;
      const idB = b.id !== "-" ? parseInt(b.id) : 0;
      return filters.sort === "date-asc" ? idA - idB : idB - idA;
    });
  }, [normalizedDesigners, searchTerm, filters]);

  const pageCount = Math.ceil(filteredDesigners.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDesigners = filteredDesigners.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClick = (designer) => {
    setSelectedDesigner(designer);
    setFormData({
      firstName: designer.firstName,
      lastName: designer.lastName,
      province: designer.province,
      address: designer.address,
      status: designer.status,
      mobileNumber: designer.mobileNumber,
      nationalCode: designer.nationalCode,
      idNumber: designer.idNumber,
      contractImage: designer.contractImage,
      contractAmount: designer.contractAmount,
      performanceRating: designer.performanceRating,
      managerComment: designer.managerComment,
      username: designer.username,
      password: designer.password,
    });
    setActiveModal("edit");
  };

  const handleEditSubmit = async (designerData) => {
    try {
      await updateMaster(designerData);
      setNotification({ message: "طراح با موفقیت ویرایش شد!", type: "success" });
      await fetchDesigners();
      setActiveModal(null);
    } catch (err) {
      setNotification({ message: "خطا در ویرایش طراح: " + err.message, type: "error" });
    }
  };

  const handleDeleteClick = (designer) => {
    setSelectedDesigner(designer);
    setActiveModal("delete");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDesigner || !selectedDesigner.id) return;
    try {
      await deleteMaster(selectedDesigner.id);
      setNotification({ message: "طراح با موفقیت حذف شد!", type: "success" });
      await fetchDesigners();
      setActiveModal(null);
    } catch (err) {
      setNotification({ message: "خطا در حذف طراح: " + err.message, type: "error" });
    }
  };

  const handleAddDesigner = (e) => {
    e.preventDefault();
// $&
    setActiveModal("addSuccess");
    setNewDesigner({
      firstName: "",
      lastName: "",
      province: "",
      address: "",
      status: "",
      mobileNumber: "",
      nationalCode: "",
      idNumber: "",
      contractImage: "",
      contractAmount: "",
      performanceRating: "",
      managerComment: "",
      username: "",
      password: "",
    });
  };

  // Auto-close success modals
  useEffect(() => {
    if (
      activeModal === "addSuccess" ||
      activeModal === "editSuccess" ||
      activeModal === "deleteSuccess"
    ) {
      const timer = setTimeout(() => {
        setActiveModal(null);
        setSelectedDesigner(null);
        setFormData({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeModal]);

  // گرفتن لیست طراحان از API
  const fetchDesigners = async () => {
    try {
      setLoading(true);
      const data = await getMasters();
      setDesigners(data);
      setLoading(false);
    } catch (err) {
      setError("خطا در دریافت داده‌ها: " + err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, []);

  // افزودن طراح
  const handleAddDesignerAPI = async (designerData) => {
    try {
      await addMaster(designerData);
      setNotification({ message: "طراح با موفقیت اضافه شد!", type: "success" });
      await fetchDesigners();
      setActiveModal(null);
    } catch (err) {
      setNotification({ message: "خطا در افزودن طراح: " + err.message, type: "error" });
    }
  };

  return (
    <div className="question-designer-management">
      <div className="question-designer-management__titleWrapper">
        <h2 className="question-designer-management__title">طراح سوال</h2>
        {user?.role === "کاربر سازمان اداری و استخدامی" && (
          <button
            className="assign-permit__add-btn"
            onClick={() => setActiveModal("add")}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="question-designer-management__controls">
        <DesignerControls
          sortOptions={sortOptions}
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
          provinces={provinces}
          statuses={statuses}
        />
      </div>

      <div className="question-designer-management__grid">
        {currentDesigners.length > 0 ? (
          currentDesigners.map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))
        ) : (
          <p className="question-designer-management__no-results">
            هیچ نتیجه‌ای یافت نشد.
          </p>
        )}
      </div>

      <AnimatePresence>
        {activeModal === "add" && (
          <AddDesignerModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            newDesigner={newDesigner}
            setNewDesigner={setNewDesigner}
            onSubmit={handleAddDesignerAPI}
            provinces={provinces}
            statuses={statuses}
          />
        )}
        {activeModal === "addSuccess" && (
          <AddSuccessModal isOpen={true} onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "edit" && (
          <EditDesignerModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            provinces={provinces}
            statuses={statuses}
          />
        )}
        {activeModal === "editSuccess" && (
          <EditSuccessModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "delete" && (
          <DeleteDesignerModal
            isOpen={true}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setActiveModal(null)}
          />
        )}
        {activeModal === "deleteSuccess" && (
          <DeleteSuccessModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>

      {filteredDesigners.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
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

export default QuestionDesignerManagement;
