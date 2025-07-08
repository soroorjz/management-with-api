import React, { useState, useEffect } from "react";
import "./SetExecutor.scss";
import AssignModal from "./AssignModal/AssignModal";
import DetailsModal from "./DetailsModal/DetailsModal";
import moment from "jalali-moment";
import { useAuth } from "../../../../AuthContext";
import { dataTables } from "../../../../apiService";

const SetExecutor = () => {
  const { user } = useAuth();
  const analyzeOrganizerAssigns = dataTables["analyzeorganizerassigns"] || [];
  const exams = dataTables["exams"] || [];
  const analyzeDetails = dataTables["analyzedetails"] || [];
  const jobs = dataTables["jobs"] || [];
  const analyzeOrganizers = dataTables["analyzeorganizers"] || [];

  // لاگ اولیه برای چک کردن داده‌ها
  console.log("dataTables loaded:", {
    analyzeOrganizerAssigns,
    exams,
    analyzeDetails,
    jobs,
    analyzeOrganizers,
  });

  // بررسی وجود داده‌ها
  if (!analyzeOrganizerAssigns.length || !exams.length) {
    console.warn(
      "Missing required data: analyzeOrganizerAssigns or exams empty"
    );
    return <div>داده‌های مورد نیاز یافت نشد. لطفاً دوباره تلاش کنید.</div>;
  }

  const loadFromLocalStorage = () => {
    try {
      const savedAssigned = localStorage.getItem("assignedExams");
      const savedUnassigned = localStorage.getItem("unassignedExams");
      const savedDetails = localStorage.getItem("examDetails");
      const savedJobs = localStorage.getItem("examJobs");

      if (savedAssigned && savedUnassigned && savedDetails && savedJobs) {
        const loadedData = {
          assignedExams: JSON.parse(savedAssigned),
          unassignedExams: JSON.parse(savedUnassigned),
          examDetails: JSON.parse(savedDetails),
          examJobs: JSON.parse(savedJobs),
        };
// $&
        return loadedData;
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }

    // مقداردهی اولیه
    const assignedExams = analyzeOrganizerAssigns
      .filter((assign) => assign.analyzeOrganizerAssignOrganizerRef !== null)
      .map((assign) => {
        const exam = exams.find(
          (e) => e.examId === assign.analyzeOrganizerAssignExamRef
        );
// $&
        return exam ? exam.examName || "-" : "-";
      })
      .filter((name) => name !== "-");
    const unassignedExams = analyzeOrganizerAssigns
      .filter((assign) => assign.analyzeOrganizerAssignOrganizerRef === null)
      .map((assign) => {
        const exam = exams.find(
          (e) => e.examId === assign.analyzeOrganizerAssignExamRef
        );
// $&
        return exam ? exam.examName || "-" : "-";
      })
      .filter((name) => name !== "-");
    const examDetails = analyzeOrganizerAssigns.reduce((acc, assign) => {
      const exam = exams.find(
        (e) => e.examId === assign.analyzeOrganizerAssignExamRef
      );
      if (exam && exam.examName && assign.analyzeOrganizerAssignOrganizerRef) {
        const organizer = analyzeOrganizers.find(
          (org) =>
            org.analyzeOrganizerId === assign.analyzeOrganizerAssignOrganizerRef
        );
        acc[exam.examName] = {
          executor: organizer ? organizer.analyzeOrganizerName : "تعیین نشده",
          file: assign.analyzeOrganizerAssignDocumentationFile || "",
          assignmentDate: assign.analyzeOrganizerAssignDate || "-",
        };
        console.log("Mapped examDetails:", {
          examName: exam.examName,
          details: acc[exam.examName],
        });
      }
      return acc;
    }, {});
    const examJobs = analyzeOrganizerAssigns.reduce((acc, assign) => {
      const exam = exams.find(
        (e) => e.examId === assign.analyzeOrganizerAssignExamRef
      );
      if (exam && exam.examName) {
        const relatedDetails = analyzeDetails.filter(
          (detail) =>
            detail.analyzeDetailExamRef === assign.analyzeOrganizerAssignExamRef
        );
        const mappedJobs = relatedDetails
          .map((detail) => {
            const job = jobs.find(
              (j) => j.jobId === detail.analyzeDetailJobRef
            );
            console.log("Mapping job for exam:", {
              examId: assign.analyzeOrganizerAssignExamRef,
              detail,
              job,
            });
            return job ? { jobName: job.jobName || "-" } : null;
          })
          .filter((job) => job !== null);
        acc[exam.examName] = mappedJobs;
        console.log("Mapped examJobs:", {
          examName: exam.examName,
          jobs: mappedJobs,
        });
      }
      return acc;
    }, {});

    // لاگ‌های دیباگ
// $&
// $&

    const initialData = {
      assignedExams,
      unassignedExams,
      examDetails,
      examJobs,
    };
// $&
    return initialData;
  };

  const initialData = loadFromLocalStorage();
  const [assignedExams, setAssignedExams] = useState(initialData.assignedExams);
  const [unassignedExams, setUnassignedExams] = useState(
    initialData.unassignedExams
  );
  const [examDetails, setExamDetails] = useState(initialData.examDetails);
  const [examJobs, setExamJobs] = useState(initialData.examJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExamForDetails, setSelectedExamForDetails] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("assignedExams", JSON.stringify(assignedExams));
      localStorage.setItem("unassignedExams", JSON.stringify(unassignedExams));
      localStorage.setItem("examDetails", JSON.stringify(examDetails));
      localStorage.setItem("examJobs", JSON.stringify(examJobs));
      console.log("Saved to localStorage:", {
        assignedExams,
        unassignedExams,
        examDetails,
        examJobs,
      });
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [assignedExams, unassignedExams, examDetails, examJobs]);

  const openModal = (exam) => {
    if (!exam) {
      console.error("Attempted to open AssignModal with invalid exam:", exam);
      return;
    }
// $&
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
// $&
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const handleConfirm = (exam, executor, file) => {
// $&
    const currentDate = moment().format("jYYYY/jMM/jDD");
    setUnassignedExams((prev) => prev.filter((e) => e !== exam));
    setAssignedExams((prev) => [...prev, exam]);
    setExamDetails((prev) => ({
      ...prev,
      [exam]: { executor, file, assignmentDate: currentDate },
    }));
    closeModal();
  };

  const openDetailsModal = (exam) => {
    if (!exam) {
      console.error("Attempted to open DetailsModal with invalid exam:", exam);
      return;
    }
    console.log(
      "Opening DetailsModal for exam:",
      exam,
      "Jobs:",
      examJobs[exam]
    );
    setSelectedExamForDetails(exam);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
// $&
    setIsDetailsModalOpen(false);
    setSelectedExamForDetails(null);
  };

  return (
    <div className="set-executor-container">
      <h1 className="set-executor-title">تعیین مجری</h1>
      <p className="set-executor-desc">
        در این صفحه می‌توان برای برگزاری ارزیابی تکمیلی آزمون‌ها، مجری
        برگزارکننده را تعیین نمود.
      </p>
      <div className="set-executor-grid">
        <div className="set-executor-column">
          <h2 className="set-executor-column-title">آزمون‌های فاقد مجری</h2>
          {unassignedExams.length > 0 ? (
            unassignedExams.map((exam, index) => (
              <div key={index} className="set-executor-exam-item">
                <div className="set-executor-column-desc">
                  <span className="set-executor-exam-name">{exam}</span>
                </div>
                {user?.role !== "کاربر سازمان اداری و استخدامی" && (
                  <button
                    className="set-executor-button-assign"
                    onClick={() => openModal(exam)}
                  >
                    تعیین
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>هیچ آزمونی بدون مجری یافت نشد.</p>
          )}
        </div>
        <div className="set-executor-column">
          <h2 className="set-executor-column-title">آزمون‌های دارای مجری</h2>
          {assignedExams.length > 0 ? (
            assignedExams.map((exam, index) => (
              <div key={index} className="set-executor-exam-item">
                <div className="set-executor-column-desc">
                  <span className="set-executor-exam-name">{exam}</span>
                  {examDetails[exam]?.assignmentDate && (
                    <span className="set-executor-exam-date">
                      {examDetails[exam].assignmentDate}
                    </span>
                  )}
                </div>
                <button
                  className="set-executor-button-show"
                  onClick={() => openDetailsModal(exam)}
                >
                  نمایش
                </button>
              </div>
            ))
          ) : (
            <p>هیچ آزمونی با مجری یافت نشد.</p>
          )}
        </div>
      </div>
      {isModalOpen && selectedExam && (
        <AssignModal
          isOpen={isModalOpen}
          onClose={closeModal}
          examName={selectedExam}
          onConfirm={handleConfirm}
          jobs={examJobs[selectedExam] || []}
        />
      )}
      {isDetailsModalOpen && selectedExamForDetails && (
        <DetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          examName={selectedExamForDetails}
          details={examDetails[selectedExamForDetails] || {}}
          jobs={examJobs[selectedExamForDetails] || []}
        />
      )}
    </div>
  );
};

export default SetExecutor;
