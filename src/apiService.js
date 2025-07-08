import { insert } from "@amcharts/amcharts5/.internal/core/util/Array";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

let tokenExpiration = null;
let retryCount = 0;
const maxRetries = 2;

export const fetchToken = async (
  force = false,
  username = "S.JAMEIE",
  password = "1156789"
) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const now = Date.now();
  if (user && user.Token && tokenExpiration > now + 1000 * 30 && !force) {
    //console.log("Using cached token from user:", user.Token);
    return user.Token;
  }

  try {
    //console.log("Fetching new token...");
    const response = await fetch("/api/auth", {
      headers: {
        USERNAME: username,
        PASSWORD: password,
        DEBUG: "true",
        NOCATCH: "true",
      },
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // بررسی وضعیت پاسخ
    if (data.Status !== 200) {
      throw new Error(`API error! status: ${data.Status}`);
    }

    // ذخیره اطلاعات کاربر (شامل توکن) در localStorage
    //console.log("New token fetched:", data.Token);
    localStorage.setItem(
      "user",
      JSON.stringify({ ...data.UserInfo, Token: data.Token })
    );
    tokenExpiration = now + 1000 * 60 * 5; // 5 دقیقه
    return data.Token;
  } catch (err) {
    console.error("Error fetching token:", err);
    throw new Error("خطا در دریافت توکن: " + err.message);
  }
};

api.interceptors.request.use(async (config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  let token = user?.Token;
  if (!token) {
    //console.log("No token found in user, fetching new token...");
    token = await fetchToken();
  }
  //console.log("Adding token to request:", token);
  config.headers["Token"] = token;
  config.headers["Debug"] = true;
  config.headers["NOCATCH"] = true;
  return config;
});

api.interceptors.response.use(
  (response) => {
    retryCount = 0;
    //console.log("Request successful:", response.config.url);
    return response;
  },
  async (error) => {
    console.error("Request failed:", error.response?.status, error.config.url);
    if (error.response?.status === 401 && retryCount < maxRetries) {
      retryCount++;
      //console.log("Retrying request with new token...");
      await fetchToken(true);
      const user = JSON.parse(localStorage.getItem("user"));
      error.config.headers["Token"] = user?.Token;
      return api.request(error.config);
    }
    retryCount = 0;
    throw error;
  }
);

export const getExamStatuses = async () => {
  try {
    const response = await api.get("/examstatus/examstatuses");
    //console.log("getExamStatuses response:", response.data);
    return response.data.reduce((acc, status) => {
      acc[status.examStatusId] = status.examStatusName;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching exam statuses:", error);
    throw new Error("خطا در دریافت وضعیت‌های آزمون: " + error.message);
  }
};

export const getExams = async () => {
  try {
    const response = await api.get("/exam/exams");
    //console.log("getExams response:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw new Error("خطا در دریافت آزمون‌ها: " + error.message);
  }
};

export const getExamById = async (examId) => {
  try {
    //console.log("Fetching exam with ID:", examId);
    const response = await api.get(`/exam/${examId}`);
    //console.log("getExamById response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exam:", error);
    throw new Error("خطا در دریافت اطلاعات آزمون: " + error.message);
  }
};

export const addExam = async (examData) => {
  try {
    const response = await api.post("/exam/exams", examData);
    //console.log("addExam response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding exam:", error);
    throw new Error("خطا در افزودن آزمون: " + error.message);
  }
};

export const updateExam = async (examId, examData) => {
  try {
    const response = await api.put(`/exam/${examId}`, examData);
    //console.log("updateExam response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating exam:", error);
    throw new Error("خطا در به‌روزرسانی آزمون: " + error.message);
  }
};

export const deleteExam = async (examId) => {
  try {
    const response = await api.delete(`/exam/${examId}`);
    //console.log("deleteExam response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting exam:", error);
    throw new Error("خطا در حذف آزمون: " + error.message);
  }
};

export const getEducationLevels = async () => {
  try {
    const response = await api.get("/grade/grades");
    //console.log("getEducationLevels response:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching education levels:", error);
    throw new Error("خطا در دریافت مقاطع تحصیلی: " + error.message);
  }
};

export const getBirthProvinces = async () => {
  try {
    const response = await api.get("/geography/geographies");
    //console.log("getBirthProvinces response:", response.data);
    return response.data.filter((item) => item.geographyParent === null) || [];
  } catch (error) {
    console.error("Error fetching birth provinces:", error);
    throw new Error("خطا در دریافت استان‌ها: " + error.message);
  }
};

export const getQuotas = async () => {
  try {
    const response = await api.get("/quota/quotas");
    //console.log("getQuotas response:", response.data);
    return response.data.filter((quota) => quota.quotaParent === null) || [];
  } catch (error) {
    console.error("Error fetching quotas:", error);
    throw new Error("خطا در دریافت سهمیه‌ها: " + error.message);
  }
};

// Fixed getHandler
export const getHandler = async (tableName) => {
  try {
    const response = await api.get(`/${tableName}/${plural(tableName)}`, {
      headers: {
        UI: true,
        NOCATCH: "true",
      },
    });
    //console.log(`Table Fetched: ${tableName}`);
    //console.log(response.data);
    return response.data || [];
  } catch (error) {
    //console.log(`Error while fetching: ${tableName}`);
    console.error(error);
    throw new Error(`خطا در دریافت جدول: ${error.message}`);
  }
};

// Fixed getbyIDHandler
export const getbyIDHandler = async (tableName, specID) => {
  try {
    const response = await api.get(`/${tableName}/${specID}`);
    //console.log(`Table Fetched: ${tableName}`);
    //console.log(response.data);
    return response.data || [];
  } catch (error) {
    //console.log(`Error while fetching: ${tableName}`);
    console.error(error);
    throw new Error(`خطا در دریافت جدول: ${error.message}`);
  }
};

// Reused plural function
export function plural(word) {
  if (!word) return word;
  const irregulars = {
    person: "people",
    child: "children",
    man: "men",
    woman: "women",
    mouse: "mice",
    goose: "geese",
    foot: "feet",
    tooth: "teeth",
    analyze: "analyzes",
    resultanalyze: "resultanalyzes",
    executeanalyze: "executeanalyzes",
  };
  if (irregulars[word.toLowerCase()]) {
    return irregulars[word.toLowerCase()];
  }
  if (word.match(/y$/i) && !word.match(/[aeiou]y$/i)) {
    return word.replace(/y$/i, "ies");
  }
  if (word.match(/(s|sh|ch|x|z)$/i)) {
    return word + "es";
  }
  return word + "s";
}

export function singular(word) {
  if (!word) return word;
  const irregulars = {
    people: "person",
    children: "child",
    men: "man",
    women: "woman",
    mice: "mouse",
    geese: "goose",
    feet: "foot",
    teeth: "tooth",
    analyzes: "analyze",
    resultanalyzes: "resultanalyze",
    executeanalyzes: "executeanalyze",
  };
  if (irregulars[word.toLowerCase()]) {
    return irregulars[word.toLowerCase()];
  }
  if (word.match(/ies$/i)) {
    return word.replace(/ies$/i, "y");
  }
  if (word.match(/(s|sh|ch|x|z)es$/i)) {
    return word.replace(/es$/i, "");
  }
  if (word.match(/s$/i)) {
    return word.replace(/s$/i, "");
  }
  return word;
}

// ایجاد یک آرایه که در بر دارنده تمامی جداول پایگاه داده است
export let dataTables = {};

// به انتهای فایل API اضافه کنید
export const addHandler = async (tableName, data) => {

// $&
// $&
// $&
// $&
  try {
    let response = await api.post(`/${tableName}`,data);
    //console.log(`addHandler response for ${tableName}:`, response.data);
    let insertPrototype = response.data;
    // data.forEach((val, key) => {
    //   insertPrototype[key] = val;
    // });
    // response = await api.post(`/${tableName}`, insertPrototype);
    return response.data;
  } catch (error) {
    console.error(`Error adding to ${tableName}:`, error);
    throw new Error(`خطا در افزودن به جدول ${tableName}: ${error.message}`);
  }
};

export const updateHandler = async (tableName, id, data) => {
  try {
    console.log(`/${tableName}/${id}`, data)
    const response = await api.put(`/${tableName}/${id}`, data);
    console.log(`updateHandler response for ${tableName}:`, response);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${tableName}:`, error);
    throw new Error(`خطا در به‌روزرسانی جدول ${tableName}: ${error.message}`);
  }
};

export const deleteHandler = async (tableName, id) => {
  try {
    const response = await api.delete(`/${tableName}/${id}`);
    //console.log(`deleteHandler response for ${tableName}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting from ${tableName}:`, error);
    throw new Error(`خطا در حذف از جدول ${tableName}: ${error.message}`);
  }
};

export const firstLoadHandler = async () => {
  try {
    // Check if dataTables exists in localStorage and is valid
    const storedData = window.localStorage.getItem("dataTables");
    if (storedData) {
      try {
        dataTables = JSON.parse(storedData);
      } catch (parseError) {
        console.warn(
          "Invalid JSON in localStorage, resetting dataTables:",
          parseError
        );
        dataTables = {};
      }
    }

    // Fetch model names from API
    const response = await api.get("/gui/frontdata");
// $&

    // Use Promise.all to handle async getHandler calls
    dataTables = response.data.Result;
    // const fetchPromises = response.data.map(async (modelName) => {
    //   const singularName = singular(modelName); // Assuming singular function is imported
    //   dataTables[modelName] = await getHandler(singularName);
    // });

    // // Wait for all getHandler calls to complete
    // await Promise.all(fetchPromises);

    // Save updated dataTables to localStorage
    window.localStorage.setItem("dataTables", JSON.stringify(dataTables));

    // Return the populated dataTables (or response.data if that's the intent)
    return dataTables;
  } catch (error) {
    console.error(`Error while getting models:`, error);
    throw new Error(`خطا در دریافت مدل های پایگاه داده: ${error.message}`);
  }
};

// ================== MASTER API (for Designer CRUD) ==================
const masterApi = axios.create({
  baseURL: "https://neoapi.devrayan.ir/api",
});

// افزودن اینترسپتور برای اضافه کردن توکن به هدر
masterApi.interceptors.request.use(async (config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  let token = user?.Token;
  if (!token) {
    // اگر توکن نبود، از fetchToken استفاده کن (در صورت نیاز)
    // اگر fetchToken برای این دامنه جواب نمی‌دهد، این بخش را حذف کن
    // token = await fetchToken();
  }
  if (token) {
    config.headers["Token"] = token;
  }
  config.headers["Debug"] = true;
  config.headers["NOCATCH"] = true;
  return config;
});

export const getMasters = async () => {
  try {
    const response = await masterApi.get("/master/masters");
    return response.data;
  } catch (error) {
    throw new Error("خطا در دریافت لیست طراحان: " + error.message);
  }
};

export const addMaster = async (data) => {
  try {
    const response = await masterApi.post("/master", data);
    return response.data;
  } catch (error) {
    throw new Error("خطا در افزودن طراح: " + error.message);
  }
};

export const updateMaster = async (data) => {
  try {
    // توجه: API فقط دیتا می‌گیرد و id باید در body باشد
    const response = await masterApi.put("/master", data);
    return response.data;
  } catch (error) {
    throw new Error("خطا در ویرایش طراح: " + error.message);
  }
};

export const deleteMaster = async (id) => {
  try {
    // توجه: API حذف با ارسال id در body یا query انجام می‌شود (بر اساس مستندات)
    const response = await masterApi.delete("/master", { data: { masterId: id } });
    return response.data;
  } catch (error) {
    throw new Error("خطا در حذف طراح: " + error.message);
  }
};
