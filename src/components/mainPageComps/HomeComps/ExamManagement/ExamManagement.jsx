import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ExamManagement.scss";
import ExamCard from "./ExamCard";
import ExamActions from "./ExamActions";
import ExamTabs from "./ExamTabs/ExamTabs";
import AddExamModal from "./AddExamModal/AddExamModal";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../../../AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHandler,
  addExam,
  updateExam,
  deleteExam,
} from "../../../../apiService";

const persianToLatinDigits = (str) => {
  if (!str) {
    console.warn("persianToLatinDigits: Input string is empty or null");
    return str;
  }
  const persianDigits = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], i);
  }
  return result;
};

const ExamManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [filters, setFilters] = useState({
    organizer: "",
    status: "",
    sort: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeYear, setActiveYear] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const sectionRefs = useRef({});
  const isProgrammaticScroll = useRef(false);

  // Fetch exams, statuses, and organizers
  const {
    data: examsData = [],
    isLoading: isExamsLoading,
    error: examsError,
  } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const start = performance.now();
      const data = await getHandler("exam");
// $&
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const {
    data: statuses = {},
    isLoading: isStatusesLoading,
    error: statusesError,
  } = useQuery({
    queryKey: ["examStatuses"],
    queryFn: async () => {
      const start = performance.now();
      const data = await getHandler("examstatus");
// $&
      return data.reduce((acc, status) => {
        acc[status.examStatusId] = status.examStatusName;
        return acc;
      }, {});
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
    enabled: !!examsData.length, // Fetch only after exams are loaded
  });

  const {
    data: organizers = {},
    isLoading: isOrganizersLoading,
    error: organizersError,
  } = useQuery({
    queryKey: ["examOrganizers"],
    queryFn: async () => {
      const start = performance.now();
      const data = await getHandler("organizer");
// $&
      return data.reduce((acc, organizer) => {
        acc[organizer.organizerId] = organizer.organizerName;
        return acc;
      }, {});
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
    enabled: !!examsData.length, // Fetch only after exams are loaded
  });

  // Normalize exams data (minimal for initial render)
  const normalizedExams = React.useMemo(() => {
    return examsData.map((exam) => ({
      id: exam.examId,
      title: exam.examName,
      organizer: organizers[exam.examOrganizerRef] || "در حال بارگذاری...",
      status: statuses[exam.examStatusRef] || "در حال بارگذاری...",
      startDate: exam.examRegisterStartDate, // Defer persianToLatinDigits to ExamCard
      endDate: exam.examRegisterEndDate,
      extensionDate: exam.examRenewalDate,
      examDate: persianToLatinDigits(exam.examDate) || exam.examDate, // Needed for grouping
      cardReceiptDate: exam.examWithdrawCard,
      cost: exam.examPrice,
      examTime: exam.examTime,
    }));
  }, [examsData, organizers, statuses]);

  // Mutations
  const addExamMutation = useMutation({
    mutationFn: (newExam) => {
      const apiExam = {
        examName: newExam.title,
        examOrganizerRef:
          Object.keys(organizers).find(
            (key) => organizers[key] === newExam.organizer
          ) || 1,
        examStatusRef:
          Object.keys(statuses).find(
            (key) => statuses[key] === newExam.status
          ) || 10,
        examDate: newExam.examDate,
        examTime: newExam.examTime,
        examWithdrawCard: newExam.cardReceiptDate,
        examRegisterStartDate: newExam.startDate,
        examRegisterEndDate: newExam.endDate,
        examRenewalDate: newExam.extensionDate,
        examPrice: newExam.cost,
      };
      return addExam(apiExam);
    },
    onSuccess: (newExam) => {
      queryClient.invalidateQueries(["exams"]);
      setIsAddModalOpen(false);
      setFilters({ organizer: "", status: "", sort: "" });
      setSearchTerm("");
      const newYear = persianToLatinDigits(newExam.examDate.split("/")[0]);
      setActiveYear(Number(newYear));
      setTimeout(() => {
        const section = sectionRefs.current[newYear];
        if (section) {
          isProgrammaticScroll.current = true;
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => {
            isProgrammaticScroll.current = false;
          }, 1000);
        }
      }, 100);
      alert("آزمون جدید با موفقیت اضافه شد!");
    },
    onError: (error) => {
      alert(`خطا در افزودن آزمون: ${error.message}`);
    },
  });

  const updateExamMutation = useMutation({
    mutationFn: ({ examId, examData }) => {
      const apiExam = {
        examName: examData.title,
        examOrganizerRef:
          Object.keys(organizers).find(
            (key) => organizers[key] === examData.organizer
          ) ||
          examData.examOrganizerRef ||
          1,
        examStatusRef:
          Object.keys(statuses).find(
            (key) => statuses[key] === examData.status
          ) ||
          examData.examStatusRef ||
          10,
        examDate: examData.examDate,
        examTime: examData.examTime,
        examWithdrawCard: examData.cardReceiptDate,
        examRegisterStartDate: examData.startDate,
        examRegisterEndDate: examData.endDate,
        examRenewalDate: examData.extensionDate,
        examPrice: examData.cost,
      };
      return updateExam(examId, apiExam);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["exams"]);
      setSelectedExamId(null);
      setEditingField(null);
      alert("آزمون با موفقیت به‌روزرسانی شد!");
    },
    onError: (error) => {
      alert(`خطا در به‌روزرسانی آزمون: ${error.message}`);
    },
  });

  const deleteExamMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries(["exams"]);
      alert("آزمون با موفقیت حذف شد!");
    },
    onError: (error) => {
      alert(`خطا در حذف آزمون: ${error.message}`);
    },
  });

  // Group exams by year (lazy-loaded)
  const groupedExams = React.useMemo(() => {
    if (!examsData.length) return {};
    const result = normalizedExams.reduce((acc, exam) => {
      const year = exam.examDate?.split("/")[0];
      if (year && !acc[year]) acc[year] = [];
      if (year) acc[year].push(exam);
      else
        console.warn(`Skipping exam with invalid year, ID ${exam.id}:`, exam);
      return acc;
    }, {});
// $&
    return result;
  }, [normalizedExams]);

  const currentYear = 1404;
  const years = React.useMemo(() => {
    const result = Object.keys(groupedExams)
      .map(Number)
      .sort((a, b) => b - a)
      .filter((year) => year >= currentYear - 4);
// $&
    return result;
  }, [groupedExams]);

  useEffect(() => {
    if (years.length > 0 && !activeYear) {
// $&
      setActiveYear(years[0]);
    }
  }, [years, activeYear]);

  const handleIntersection = useCallback(
    (entries) => {
      if (isProgrammaticScroll.current) {
// $&
        return;
      }
      let maxRatio = 0;
      let visibleYear = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          visibleYear = Number(entry.target.id.replace("exam-section-", ""));
        }
      });
      if (visibleYear && visibleYear !== activeYear) {
        console.log(
          `IntersectionObserver: Changing activeYear to ${visibleYear}`
        );
        setActiveYear(visibleYear);
      }
    },
    [activeYear]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: "-10% 0px -10% 0px",
    });
    years.forEach((year) => {
      const element = sectionRefs.current[year];
      if (element) {
        observer.observe(element);
// $&
      } else {
        console.warn(`No element found for year ${year} in sectionRefs`);
      }
    });
    return () => {
      years.forEach((year) => {
        const element = sectionRefs.current[year];
        if (element) observer.unobserve(element);
      });
    };
  }, [years, handleIntersection]);

  const handleEditClick = (id) => {
    setSelectedExamId(id);
  };

  const handleCloseOverlay = () => {
    setSelectedExamId(null);
    setEditingField(null);
  };

  const handleFieldChange = (field, value) => {
    const exam = normalizedExams.find((exam) => exam.id === selectedExamId);
    updateExamMutation.mutate({
      examId: selectedExamId,
      examData: { ...exam, [field]: value },
    });
  };

  const handleCostChange = (examId, value) => {
    if (!/^\d*$/.test(value)) return;
    const exam = normalizedExams.find((exam) => exam.id === examId);
    updateExamMutation.mutate({
      examId,
      examData: { ...exam, cost: value },
    });
  };

  const handleTimeChange = (examId, field, value) => {
    if (!/^\d*$/.test(value)) return;
    const numValue = parseInt(value) || 0;
    const exam = normalizedExams.find((exam) => exam.id === examId);
    const [currentHour, currentMinute] = exam.examTime.split(":");
    let newTime;
    if (field === "hour") {
      if (numValue > 23) return;
      newTime = `${value.padStart(2, "0")}:${currentMinute || "00"}`;
    } else if (field === "minute") {
      if (numValue > 59) return;
      newTime = `${currentHour || "00"}:${value.padStart(2, "0")}`;
    }
    updateExamMutation.mutate({
      examId,
      examData: { ...exam, examTime: newTime },
    });
  };

  const handleSaveChanges = () => {
    setSelectedExamId(null);
    setEditingField(null);
  };

  const handleCancelChanges = () => {
    setSelectedExamId(null);
    setEditingField(null);
  };

  const handleDeleteExam = (id) => {
    const confirmDelete = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این آزمون را حذف کنید؟"
    );
    if (!confirmDelete) return;
    deleteExamMutation.mutate(id);
  };

  const handleAddExam = (newExam) => {
    addExamMutation.mutate(newExam);
  };

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  }, []);

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "startDateAsc", label: "تاریخ ثبت‌نام (نزدیک‌ترین)" },
    { value: "startDateDesc", label: "تاریخ ثبت‌نام (دورترین)" },
    { value: "examDateAsc", label: "تاریخ برگزاری (نزدیک‌ترین)" },
    { value: "examDateDesc", label: "تاریخ برگزاری (دورترین)" },
  ];

  const filterConfig = [
    {
      label: "مجری",
      key: "organizer",
      options: [
        { value: "", label: "همه" },
        ...Object.values(organizers).map((name) => ({
          value: name,
          label: name,
        })),
      ],
    },
    {
      label: "وضعیت",
      key: "status",
      options: [
        { value: "", label: "همه" },
        ...Object.values(statuses).map((name) => ({
          value: name,
          label: name,
        })),
      ],
    },
  ];

  const filteredExams = React.useMemo(() => {
    const result = normalizedExams
      .filter((exam) =>
        Object.values(exam).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((exam) =>
        !filters.organizer ? true : exam.organizer === filters.organizer
      )
      .filter((exam) =>
        !filters.status ? true : exam.status === filters.status
      )
      .sort((a, b) => {
        if (filters.sort === "startDateAsc")
          return a.startDate.localeCompare(b.startDate);
        if (filters.sort === "startDateDesc")
          return b.startDate.localeCompare(b.startDate);
        if (filters.sort === "examDateAsc")
          return a.examDate.localeCompare(b.examDate);
        if (filters.sort === "examDateDesc")
          return b.examDate.localeCompare(a.examDate);
        return 0;
      });
// $&
    return result;
  }, [normalizedExams, searchTerm, filters]);

  const filteredGroupedExams = React.useMemo(() => {
    const result = filteredExams.reduce((acc, exam) => {
      const year = exam.examDate?.split("/")[0];
      if (year && !acc[year]) acc[year] = [];
      if (year) acc[year].push(exam);
      return acc;
    }, {});
// $&
    return result;
  }, [filteredExams]);

  // Render only when exams are loaded
  if (isExamsLoading) return <div>در حال بارگذاری...</div>;
  if (examsError)
    return <div>خطا: {examsError.message || "خطا در دریافت آزمون‌ها"}</div>;

  return (
    <div className="exam-management">
      <div className="exam-management__titleWrapper">
        <h2 className="exam-management__title">مدیریت آزمون‌ها</h2>
        {user?.role === "کاربر سازمان اداری و استخدامی" && (
          <button
            className="exam-management__add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <ExamActions
        filters={filters}
        onFilterChange={handleFilterChange}
        filterConfig={filterConfig}
        sortOptions={sortOptions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ExamTabs
        years={years}
        activeYear={activeYear}
        setActiveYear={setActiveYear}
        sectionRefs={sectionRefs}
      />
      <AddExamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExam}
        filterConfig={filterConfig}
      />
      <div className="exam-management__sections">
        {years.map((year) => {
          const examsInYear = filteredGroupedExams[year] || [];
          if (examsInYear.length === 0) {
// $&
            return null;
          }
          console.log(
            `Rendering section for year ${year} with ${examsInYear.length} exams`
          );
          return (
            <div
              key={year}
              id={`exam-section-${year}`}
              className="exam-management__section"
              ref={(el) => {
                sectionRefs.current[year] = el;
                if (el) console.log(`Section ref set for year ${year}`);
              }}
            >
              <h4 className="exam-management__section-title">
                آزمون‌های برگزار شده در {year}
              </h4>
              <div className="exam-management__grid">
                {examsInYear.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    isOverlay={exam.id === selectedExamId}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onEditClick={handleEditClick}
                    onCloseOverlay={handleCloseOverlay}
                    onFieldChange={handleFieldChange}
                    onCostChange={handleCostChange}
                    onTimeChange={handleTimeChange}
                    onSaveChanges={handleSaveChanges}
                    onCancelChanges={handleCancelChanges}
                    onDeleteClick={handleDeleteExam}
                    organizers={organizers} // Pass organizers for dropdown
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {selectedExamId && (
        <div
          className="exam-management__overlay"
          onClick={handleCloseOverlay}
        />
      )}
    </div>
  );
};

export default ExamManagement;
