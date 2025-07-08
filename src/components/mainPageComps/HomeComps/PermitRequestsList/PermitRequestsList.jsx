import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../AuthContext";
import { FaPlus, FaFilter, FaSortAmountUpAlt } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Tooltip } from "react-tooltip";
import EditRequestModal from "./EditRequestModal/EditRequestModal";
import RejectionReasonModal from "./EditRequestModal/RejectionReasonModal";
import { samplePermits } from "../samplePermits";
import "./PermitRequestsList.scss";
import { useQuery } from "@tanstack/react-query";
import { dataTables } from "../../../../apiService";

const PermitRequestsList = () => {
  const { user } = useAuth();
// $&

  const [requests, setRequests] = useState(() => {
    try {
      return dataTables["requests"];
      const saved = localStorage.getItem("permits");
      return saved ? JSON.parse(saved) : samplePermits;
    } catch (error) {
      console.error("Error parsing permits from localStorage:", error);
      return dataTables["requests"];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    employmentType: "",
    organization: "",
    subOrganization: "",
    status: "",
    scoreRatio: "",
    sort: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [modalData, setModalData] = useState({
    permitNumber: "",
    permitImage: null,
    permitExpirationDate: null,
  });
  const itemsPerPage = 3;

  useEffect(() => {
    //localStorage.setItem("permits", JSON.stringify(requests));
    console.log(
      "Updated permits in localStorage:",
      JSON.stringify(requests, null, 2)
    );
  }, [requests]);

  const resetModalData = () => {
    setModalData({
      permitNumber: "",
      permitImage: null,
      permitExpirationDate: null,
    });
  };


  // فقط اگر وضعیت برابر با در انتظار باشه کاربر باید دکمه ی ویرایش رو ببینه

  const handleEditClick = (request) => {
// $&
  setSelectedRequest({
    ...request,
    isReadOnly: request.status === "تأیید شده",
  });
  setIsModalOpen(true);
  setModalKey((prev) => prev + 1);
};

  const handleAddClick = () => {
    setSelectedRequest(null);
    resetModalData();
    setIsModalOpen(true);
    setModalKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleReasonModalOpen = (reason, requestId) => {
    console.log(
      "Opening RejectionReasonModal with reason:",
      reason,
      "and requestId:",
      requestId
    );
    setSelectedReason(reason || "علت رد درخواست ثبت نشده است");
    setSelectedRequestId(requestId);
    setIsReasonModalOpen(true);
  };

  const handleReasonModalClose = () => {
    setIsReasonModalOpen(false);
    setSelectedReason("");
    setSelectedRequestId(null);
  };

  const handleUpdateRejectionReason = (requestId, newReason) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, rejectionReason: newReason } : req
      )
    );
  };

  const handleUpdateRequest = (updatedRequest) => {
    console.log(
      "Updating request with:",
      JSON.stringify(updatedRequest, null, 2)
    );
    if (updatedRequest.id) {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === updatedRequest.id
            ? {
                ...updatedRequest,
                confirmationDate:
                  updatedRequest.status === "تأیید شده"
                    ? updatedRequest.confirmationDate || req.confirmationDate
                    : "",
                permitNumber: updatedRequest.permitNumber || req.permitNumber,
                permitImage: updatedRequest.permitImage || req.permitImage,
                permitExpirationDate:
                  updatedRequest.permitExpirationDate ||
                  req.permitExpirationDate,
              }
            : req
        )
      );
    } else {
      const newId = requests.length
        ? Math.max(...requests.map((r) => r.id)) + 1
        : 1;
      const newRequestNumber = `PR-${String(newId).padStart(3, "0")}`;
      const newRequest = {
        id: newId,
        number: newRequestNumber,
        type: "request",
        requestNumber: newRequestNumber,
        ...updatedRequest,
        quotaTable: updatedRequest.quotaTable || [
          {
            jobTitle: "",
            province: "",
            city: "",
            location: "",
            free: { female: "0", male: "0", both: "0" },
            quota3: { female: "0", male: "0", both: "0" },
            quota5: { female: "0", male: "0", both: "0" },
            quota25: { female: "0", male: "0", both: "0" },
          },
        ],
        status: updatedRequest.status || "در انتظار",
        rejectionReason: updatedRequest.rejectionReason || "",
        confirmationDate:
          updatedRequest.status === "تأیید شده"
            ? updatedRequest.confirmationDate ||
              new Date().toISOString().split("T")[0]
            : "",
        permitNumber: updatedRequest.permitNumber || modalData.permitNumber,
        permitImage: updatedRequest.permitImage || modalData.permitImage,
        permitExpirationDate:
          updatedRequest.permitExpirationDate || modalData.permitExpirationDate,
      };
      setRequests((prev) => [newRequest, ...prev]);
      setModalData({
        permitNumber: updatedRequest.permitNumber || modalData.permitNumber,
        permitImage: updatedRequest.permitImage || modalData.permitImage,
        permitExpirationDate:
          updatedRequest.permitExpirationDate || modalData.permitExpirationDate,
      });
    }
    setIsModalOpen(false);
    setSelectedRequest(null);
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
      label: "نوع استخدام",
      key: "employmentType",
      options: [
        { value: "", label: "همه" },
        { value: "رسمی", label: "رسمی" },
        { value: "پیمانی", label: "پیمانی" },
        { value: "قراردادی", label: "قراردادی" },
      ],
    },
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        {
          value: "شرکت تولید نیروی برق حرارتی",
          label: "شرکت تولید نیروی برق حرارتی",
        },
        {
          value: "سازمان بهزیستی کشور",
          label: "سازمان بهزیستی کشور",
        },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        // { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
      ],
    },
    {
      label: "دستگاه تابعه",
      key: "subOrganization",
      options: [
        { value: "", label: "همه" },
        { value: "اداره کل تهران", label: "اداره کل تهران" },
        {
          value: "معاونت پیشگیری از معلولیت‌ها",
          label: "معاونت پیشگیری از معلولیت‌ها",
        },
        { value: "شرکت برق منطقه‌ای", label: "شرکت برق منطقه‌ای" },
        { value: "سازمان دانش‌آموزی", label: "سازمان دانش‌آموزی" },
      ],
    },
    {
      label: "وضعیت درخواست",
      key: "status",
      options: [
        { value: "", label: "همه" },
        { value: "در انتظار", label: "در انتظار" },
        { value: "تأیید شده", label: "تایید شده" },
        { value: "رد شده", label: "رد شده" },
      ],
    },
    {
      label: "نسبت امتیاز",
      key: "scoreRatio",
      options: [
        { value: "", label: "همه" },
        { value: "30/70", label: "30/70" },
        { value: "60/40", label: "60/40" },
      ],
    },
  ];
  const filteredRequests = dataTables["requests"]
    .filter((request) =>
      Object.values(request).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((request) => {
      const hireType =
        dataTables["hiretypes"]?.find(
          (ht) => ht.hireTypeId === request.requestHireTypeRef
        )?.hireTypeName || "";
      const org =
        dataTables["executivebodies"]?.find(
          (eb) => eb.executiveBodyId === request.requestExecutiveBodyRef
        )?.executiveBodyName || "";
      const subOrg =
        dataTables["executivebodies"]?.find(
          (eb) =>
            eb.executiveBodyId ===
            dataTables["executivebodies"]?.find(
              (e) => e.executiveBodyId === request.requestExecutiveBodyRef
            )?.executiveBodyParent
        )?.executiveBodyName || "";
      const status =
        dataTables["requeststatuses"]?.find(
          (rs) => rs.requestStatusId === request.requestStatusRef
        )?.requestStatusName || "";
      return (
        (!filters.employmentType || hireType === filters.employmentType) &&
        (!filters.organization || org === filters.organization) &&
        (!filters.subOrganization || subOrg === filters.subOrganization) &&
        (!filters.status || status === filters.status) &&
        (!filters.scoreRatio || request.requestModel === filters.scoreRatio)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "dateAsc")
        return a.requestRegisterDate.localeCompare(b.requestRegisterDate);
      if (filters.sort === "dateDesc")
        return b.requestRegisterDate.localeCompare(a.requestRegisterDate);
      return 0;
    });

  const pageCount = Math.ceil(filteredRequests.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredRequests.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="permit-requests">
      <div className="permit-requests__headerTitle">
        <h2 className="permit-requests__title">ثبت شرایط و تعریف شغل محل‌ها</h2>
        {user?.role === "دستگاه ستادی" && (
          <button className="assign-permit__add-btn" onClick={handleAddClick}>
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="permit-requests__search-container">
        <div className="permit-requests__actions">
          <div className="permit-requests__filter-container">
            <div className="permit-requests__filter">
              <FaFilter className="permit-requests__filter-icon" />
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
          <div className="permit-requests__sort-container">
            <div className="permit-requests__sort">
              <FaSortAmountUpAlt className="permit-requests__sort-icon" />
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
          placeholder="جستجو در درخواست‌ها..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="permit-requests__search-input"
        />
      </div>

      <div className="permit-requests__list">
        {currentItems.length > 0 ? (
          <>
            {currentItems.map((request) => {
              const cStatus =
                dataTables["requeststatuses"]?.find(
                  (c) => c.requestStatusId == request.requestStatusRef
                )?.requestStatusName ||
                request.status ||
                "-";
              const cExecutiveBody =
                dataTables["executivebodies"]?.find(
                  (c) => c.executiveBodyId === request.requestExecutiveBodyRef
                ) || {};
              const cExecutiveParent =
                dataTables["executivebodies"]?.find(
                  (c) =>
                    c.executiveBodyId === cExecutiveBody.executiveBodyParent
                ) || {};
              const cHireType =
                dataTables["hiretypes"]?.find(
                  (c) => c.hireTypeId === request.requestHireTypeRef
                ) || {};
              return (
                <div key={request.requestId} className="permit-requests__item">
                  <div className="permit-requests__details">
                    <div className="permit-requests__header">
                      <p className="permit-requests__headerDetail request-status">
                        شماره درخواست
                        <span>{request.requestCode}</span>
                      </p>
                      <p className="permit-requests__headerDetail request-status">
                        وضعیت درخواست
                        <span>
                          {cStatus}
                          {cStatus === "رد شده" && (
                            <BsInfoCircle
                              className="permit-requests__info-icon"
                              onClick={() =>
                                handleReasonModalOpen(
                                  request.rejectionReason,
                                  request.requestId
                                )
                              }
                              data-tooltip-id="rejection-tooltip"
                              data-tooltip-content="مشاهده علت رد درخواست"
                              data-tooltip-place="top"
                            />
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="permit-requests__body">
                      <div className="permit-requests__dates">
                        <p className="permit-requests__detail">
                          دستگاه:{" "}
                          <span>
                            {cExecutiveParent.executiveBodyName ?? "نامشخص"}
                          </span>
                        </p>
                        <p className="permit-requests__detail">
                          تاریخ ثبت: <span>{request.requestRegisterDate}</span>
                        </p>
                        <p className="permit-requests__detail">
                          دستگاه تابعه:{" "}
                          <span>
                            {cExecutiveParent.executiveBodyName
                              ? cExecutiveBody.executiveBodyName
                              : "-"}
                          </span>
                        </p>
                      </div>
                      <div className="permit-requests__organization">
                        <p className="permit-requests__detail">
                          نوع استخدام: <span>{cHireType.hireTypeName}</span>
                        </p>
                        <p className="permit-requests__detail">
                          نسبت امتیاز: <span>{request.requestModel}</span>
                        </p>
                        <p className="permit-requests__detail">
                          تاریخ اعتبار مجوز: <span>{request.requestDate}</span>
                        </p>
                      </div>
                      <div className="permit-requests__lastBox">
                        <p className="permit-requests__detail">
                          ظرفیت استخدام:{" "}
                          <span>{request.requestHireCapacity} نفر</span>
                        </p>
                        <p className="permit-requests__detail">
                          چند برابر ظرفیت:{" "}
                          <span>{request.requestExtraCapacity} برابر</span>
                        </p>
                        <p className="permit-requests__detail">
                          تاریخ تأیید:{" "}
                          <span>{request.requestConfirmDate || "نامشخص"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="permit-requests__btns">
                    {user?.role === "دستگاه ستادی" &&
                      request.status === "در انتظار" && (
                        <button
                          className="permit-requests__details-btn edit"
                          onClick={() => handleEditClick(request)}
                        >
                          ویرایش
                        </button>
                      )}
                    {user?.role === "کاربر سازمان اداری و استخدامی" && (
                      <button
                        className="permit-requests__details-btn edit"
                        onClick={() => handleEditClick(request)}
                      >
                        بررسی/ ویرایش
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <Tooltip id="rejection-tooltip" />
          </>
        ) : (
          <p>هیچ درخواستی یافت نشد</p>
        )}
      </div>

      <EditRequestModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        request={selectedRequest}
        onUpdate={handleUpdateRequest}
        isEditMode={selectedRequest !== null}
        fromPage="permitRequests"
        initialModalData={modalData}
        resetModalData={resetModalData}
      />

      <RejectionReasonModal
        isOpen={isReasonModalOpen}
        onClose={handleReasonModalClose}
        rejectionReason={selectedReason}
        requestId={selectedRequestId}
        onUpdate={handleUpdateRejectionReason}
      />

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

export default PermitRequestsList;
