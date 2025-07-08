import { useState, useCallback, useEffect } from "react";
import { IRAN_PROVINCES } from "./constants";
import {
  getHandler,
  addHandler,
  updateHandler,
  deleteHandler,
} from "../../../apiService";

// نقشه‌برداری عنوان‌های فارسی به نام جدول‌های API

export const useBaseInfoData = () => {
  const sectionTableMap = {
    "وضعیت نظام وظیفه": "dutystatus", // اصلاح به "dutystatus" اگه API اینو بخواد
    "نسبت امتیاز": "examtype",
    "مجری آزمون کتبی": "organizer",
    "مجری ارزیابی تکمیلی": "analyzeorganizer",
    "دستگاه اجرایی": "executivebody",
    "رشته تحصیلی": "field",
    "مکان جغرافیایی": "geography",
    "مقطع تحصیلی": "grade",
    "نوع استخدام": "hiretype",
    شغل: "job",
    "رسته عوامل مجری": "organizeroperatortype",
    سهمیه: "quota",
    مذاهب: "religion",
    "وضعیت گزینش": "selectionstatus",
    "فهرست دانشگاه‌ها": "university",
    "نوع دانشگاه": "universitytype"
  };
//sample
// "وضعیت نظام وظیفه": {
//       title: "وضعیت نظام وظیفه",
//          data: [],
      
//       editData: (editData, action, itemId) =>
//         updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),

//       setData: (newData, action, itemId) =>
//         updateSectionData("وضعیت نظام وظیفه", newData, action, itemId),

//       columns: [
//         { header: "ردیف", key: "Id", render: (item, index) => index + 1 },
//         { header: "شرح", key: "DutyStatusName", type: "text" },
//       ],
//     },
  // تعریف ساختار بخش‌ها
  const initializeSections = () => ({
    "وضعیت نظام وظیفه": {
      title: "وضعیت نظام وظیفه",
         data: [],
      
      editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),

      setData: (newData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", newData, action, itemId),

      columns: [
        { header: "ردیف", key: "Id", render: (item, index) => index + 1 },
        { header: "شرح", key: "DutyStatusName", type: "text" },
      ],
    },
    "نسبت امتیاز": {
      title: "نسبت امتیاز",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("نسبت امتیاز", editData, action, itemId),

      setData: (newData, action, itemId) =>
        updateSectionData("نسبت امتیاز", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "نام", key: "ExamTypeName", type: "text" },
        {
          header: "نسبت امتیاز آزمون کتبی",
          key: "ExamWrittenRatio",
          type: "number",
        },
        {
          header: "نسبت امتیاز ارزیابی تکمیلی",
          key: "ExamAnalyzeRatio",
          type: "number",
        },
      ],
    },
    "مجری آزمون کتبی": {
      title: "مجری آزمون کتبی",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("مجری آزمون کتبی", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "نام", key: "organizerName", type: "text" },
        {
          header: "تاریخ اعتبار مجوز",
          key: "organizerValidationDate",
          type: "date",
          rawValue: (item) => item.organizerValidationDate || "",
        },
        {
          header: "وضعیت",
          key: "organizerIsPermit",
          type: "select",
          options: ["Y", "N"],
          render: (item) =>
            item.organizerIsPermit === "Y" ? "فعال" : "غیرفعال",
        },
      ],
    },
    "مجری ارزیابی تکمیلی": {
      title: "مجری ارزیابی تکمیلی",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("مجری ارزیابی تکمیلی", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "نام", key: "analyzeOrganizerName", type: "text" },
        {
          header: "تاریخ اعتبار مجوز",
          key: "analyzeOrganizerValidationDate",
          type: "date",
          rawValue: (item) => item.analyzeOrganizerValidationDate || "",
        },
        {
          header: "گستره فعالیت",
          key: "analyzeOrganizerArea",
          type: "select",
          options: ["استانی", "منطقه‌ای", "ملی"],
          render: (item) => item.analyzeOrganizerArea || "—",
        },
        {
          header: "استان",
          key: "analyzeOrganizerProvince",
          type: "select",
          options: IRAN_PROVINCES,
          render: (item) => item.analyzeOrganizerProvince || "—",
        },
        {
          header: "نام مدیرعامل",
          key: "analyzeOrganizerCEOName",
          type: "text",
          render: (item) => item.analyzeOrganizerCEOName || "—",
        },
        {
          header: "شماره همراه",
          key: "analyzeOrganizerCEOPhoneNumber",
          type: "text",
          render: (item) => item.analyzeOrganizerCEOPhoneNumber || "—",
        },
        {
          header: "وضعیت",
          key: "analyzeOrganizerIsPermit",
          type: "select",
          options: ["Y", "N"],
          render: (item) =>
            item.analyzeOrganizerIsPermit === "Y" ? "فعال" : "غیرفعال",
        },
      ],
    },
    "دستگاه اجرایی": {
      title: "دستگاه اجرایی",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("دستگاه اجرایی", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عنوان دستگاه", key: "name" },
        { header: "تعداد توابع", key: "subCount" },
        {
          header: "نمایش",
          key: "subDisplay",
          render: (item, index, handleShowSubOrganizations) => (
            <button
              className="ExecutiveBtn"
              onClick={() => handleShowSubOrganizations(item)}
            >
              {item.subDisplay}
            </button>
          ),
        },
      ],
    },
    "رشته تحصیلی": {
      title: "رشته تحصیلی",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("رشته تحصیلی", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عنوان", key: "fieldTitle", type: "text" },
        {
          header: "مقطع",
          key: "fieldGradeRef",
          type: "select",
          options: [
            "دکترای تخصصی",
            "دکترا",
            "کارشناسی ارشد",
            "کارشناسی",
            "کاردانی",
            "دیپلم",
          ],
          render: (item) => {
            const gradeMap = {
              1: "دیپلم",
              2: "کاردانی",
              3: "کارشناسی",
              4: "کارشناسی ارشد",
              5: "دکترا",
              6: "دکترای تخصصی",
            };
            return gradeMap[item.fieldGradeRef] || "—";
          },
        },
      ],
    },
    "مکان جغرافیایی": {
      title: "مکان جغرافیایی",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("مکان جغرافیایی", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "نام", key: "geographyName", type: "text" },
        {
          header: "والد",
          key: "geographyParent",
          type: "text",
          render: (item) => item.geographyParent || "—",
        },
      ],
    },
    "مقطع تحصیلی": {
      title: "مقطع تحصیلی",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("مقطع تحصیلی", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عنوان", key: "ExamTypeName", type: "text" },
               { header: "نسبت کتبی امتحانی", key: "ExamWrittenRatio", type: "text" },
                      { header: "نسبت تحلیل آزمون", key: "ExamAnalyzeRatio", type: "text" },
      ],

      
    },
    "نوع استخدام": {
      title: "نوع استخدام",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("نوع استخدام", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عنوان", key: "hireTypeName", type: "text" },
      ],
    },
    شغل: {
      title: "شغل",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("شغل", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "نام", key: "jobName", type: "text" },
      ],
    },
    "رسته عوامل مجری": {
      title: "رسته عوامل مجری",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("رسته عوامل مجری", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عناوین", key: "organizerOperatorTypeName", type: "text" },
      ],
    },
    سهمیه: {
      title: "سهمیه",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("سهمیه", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عنوان", key: "quotaTitle", type: "text" },
        {
          header: "والد",
          key: "quotaParent",
          type: "text",
          render: (item) => item.quotaParent || "—",
        },
      ],
    },
    مذاهب: {
      title: "مذاهب",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("مذاهب", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "نام", key: "religionName", type: "text" },
      ],
    },
    "وضعیت گزینش": {
      title: "وضعیت گزینش",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("وضعیت گزینش", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عنوان", key: "selectionStatusName", type: "text" },
      ],
    },
    "فهرست دانشگاه‌ها": {
      title: "فهرست دانشگاه‌ها",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("فهرست دانشگاه‌ها", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "عنوان", key: "universityName", type: "text" },
        {
          header: "نوع",
          key: "universityTypeRef",
          type: "select",
          options: [
            "دانشگاه پیام نور",
            "دانشگاه دولتی",
            "دانشگاه جامع علمی کاربردی",
            "دانشگاه غیر دولتی",
            "دانشگاه فنی و حرفه‌ای",
            "دانشگاه آزاد",
            "دانشگاه فرهنگیان",
            "حوزه علمیه",
            "دانشگاه‌های خارج کشور",
          ],
          render: (item) => {
            const typeMap = {
              1: "دانشگاه آزاد",
              2: "دانشگاه دولتی",
            };
            return typeMap[item.universityTypeRef] || "—";
          },
        },
      ],
    },
    "نوع دانشگاه": {
      title: "نوع دانشگاه",
         data: [],
    editData: (editData, action, itemId) =>
        updateSectionData("وضعیت نظام وظیفه", editData, action, itemId),
      setData: (newData, action, itemId) =>
        updateSectionData("نوع دانشگاه", newData, action, itemId),
      columns: [
        { header: "ردیف", key: "index", render: (item, index) => index + 1 },
        { header: "نام", key: "universityTypeName", type: "text" },
      ],
    },
  });
  const [baseInfoSections, setBaseInfoSections] = useState(() =>
    initializeSections()
  );
  const [sectionStatus, setSectionStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRequests, setActiveRequests] = useState({});

  const fetchSectionData = useCallback(async (sectionTitle) => {
    const tableName = sectionTableMap[sectionTitle];
    if (!tableName) {
      console.warn(`جدول برای ${sectionTitle} تعریف نشده است`);
      return [];
    }
    try {
      const data = await getHandler(tableName);
      //console.log(`Data for ${tableName}:`, data);
      return data;
    } catch (err) {
      console.error(`خطا در گرفتن داده‌های ${sectionTitle}:`, err);
      throw err;
    }
  }, []);

  const updateSectionData = useCallback(
    async (sectionTitle, newData, action, itemId) => {
      const tableName = sectionTableMap[sectionTitle];

      if (!tableName) {
        setSectionStatus((prev) => ({
          ...prev,
          [sectionTitle]: {
            loading: false,
            error: `جدول برای ${sectionTitle} تعریف نشده است`,
          },
        }));
        setError(`جدول برای ${sectionTitle} تعریف نشده است`);
        return;
      }
      setSectionStatus((prev) => ({
        ...prev,
        [sectionTitle]: { loading: true, error: null },
      }));
      setLoading(true);
// $&
// $&
// $&
console.log({tableName, itemId, newData})
      try {
        if (action === "add") {
          await addHandler(tableName, newData);
        } else if (action === "edit" && newData.Id) {
          await updateHandler(tableName, newData.Id, newData.body);
        } else if (action === "delete" && itemId) {
          await deleteHandler(tableName, itemId);
        }
        const updatedData = await fetchSectionData(sectionTitle);
        setBaseInfoSections((prev) => ({
          ...prev,
          [sectionTitle]: {
            ...prev[sectionTitle],
            data: updatedData,
          },
        }));
        setSectionStatus((prev) => ({
          ...prev,
          [sectionTitle]: { loading: false, error: null, dataLoaded: true },
        }));
        setLoading(false);
      } catch (err) {
        setSectionStatus((prev) => ({
          ...prev,
          [sectionTitle]: {
            loading: false,
            error: `خطا در آپدیت ${sectionTitle}: ${err.message}`,
          },
        }));
        setError(`خطا در آپدیت ${sectionTitle}: ${err.message}`);
        setLoading(false);
        console.error(err);
      }
    },
    [fetchSectionData]
  );

  const loadSection = useCallback(
    async (sectionTitle) => {
      if (!baseInfoSections[sectionTitle]) {
        console.warn(`بخش ${sectionTitle} وجود ندارد`);
        setError(`بخش ${sectionTitle} وجود ندارد`);
        return;
      }
      if (sectionStatus[sectionTitle]?.dataLoaded) {
        //console.log(`داده‌های ${sectionTitle} قبلاً لود شده‌اند`);
        return;
      }
      if (activeRequests[sectionTitle]) {
        //console.log(`درخواست فعال برای ${sectionTitle} وجود دارد`);
        return;
      }

      setActiveRequests((prev) => ({ ...prev, [sectionTitle]: true }));
      setSectionStatus((prev) => ({
        ...prev,
        [sectionTitle]: { loading: true, error: null, dataLoaded: false },
      }));
      setLoading(true);
      try {
        const data = await fetchSectionData(sectionTitle);
        setBaseInfoSections((prev) => ({
          ...prev,
          [sectionTitle]: {
            ...prev[sectionTitle],
            data,
          },
        }));
        setSectionStatus((prev) => ({
          ...prev,
          [sectionTitle]: { loading: false, error: null, dataLoaded: true },
        }));
        setLoading(false);
      } catch (err) {
        setSectionStatus((prev) => ({
          ...prev,
          [sectionTitle]: {
            loading: false,
            error: `خطا در بارگذاری ${sectionTitle}: ${err.message}`,
            dataLoaded: false,
          },
        }));
        setError(`خطا در بارگذاری ${sectionTitle}: ${err.message}`);
        setLoading(false);
        console.error(err);
      } finally {
        setActiveRequests((prev) => {
          const newRequests = { ...prev };
          delete newRequests[sectionTitle];
          return newRequests;
        });
      }
    },
    [fetchSectionData, activeRequests, baseInfoSections]
  );

  // بارگذاری اولیه داده‌ها فقط برای بخش‌های مورد نیاز
  useEffect(() => {
    const loadInitialSections = async () => {
      setLoading(true);
      setError(null);
      const sectionsToLoad = Object.keys(baseInfoSections).slice(0, 2); // فقط دو بخش اول برای تست
      for (const sectionTitle of sectionsToLoad) {
        await loadSection(sectionTitle);
      }

      setLoading(false);
    };

    loadInitialSections();
  }, []);

  return { baseInfoSections, sectionStatus, loadSection, loading, error };
};
