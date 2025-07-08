import React, { useEffect, useState } from "react";
import DesignerCard from "./DesignerCard";
import { getMasters, deleteMaster } from "../../../../apiService";

const DesignerList = () => {
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        setLoading(true);
        const data = await getMasters();
        setDesigners(data);
        setLoading(false);
      } catch (err) {
        setError("خطا در دریافت لیست طراحان: " + err.message);
        setLoading(false);
      }
    };
    fetchDesigners();
  }, []);

  const handleDeleteClick = async (designer) => {
    if (window.confirm("آیا از حذف این طراح مطمئن هستید؟")) {
      try {
        await deleteMaster(designer.masterId);
        setDesigners((prev) => prev.filter((d) => d.masterId !== designer.masterId));
      } catch (err) {
        alert("خطا در حذف طراح: " + err.message);
      }
    }
  };

  const handleEditClick = (designer) => {
    // اینجا می‌توانید مودال ویرایش را باز کنید یا هر عملکردی که نیاز دارید
    alert("عملیات ویرایش برای طراح: " + designer.firstName + " " + designer.lastName);
  };

  if (loading) return <div>در حال دریافت لیست طراحان...</div>;
  if (error) return <div>{error}</div>;
  if (!designers.length) return <div>طراحی یافت نشد.</div>;

  return (
    <div className="designer-list">
      {designers.map((designer) => (
        <DesignerCard
          key={designer.masterId}
          designer={designer}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ))}
    </div>
  );
};

export default DesignerList; 