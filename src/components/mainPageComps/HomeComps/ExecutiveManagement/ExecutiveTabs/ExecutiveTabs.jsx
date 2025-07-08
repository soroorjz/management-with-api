import React, { useState, useMemo } from "react";
import "./ExecutiveTabs.scss";
import { dataTables } from "../../../../../apiService";

const ExecutiveTabs = ({ executives, onTabChange }) => {
  // بررسی وجود جدول organizers
  if (!dataTables["organizers"]) {
    return <div>داده‌های مجری‌ها یافت نشد.</div>;
  }

  const organizerNames = useMemo(() => {
    const uniqueOrganizerNames = [
      ...new Set(
        executives.map((executive) => {
          const organizer = dataTables["organizers"].find(
            (o) => o.organizerId === executive.organizerRef
          );
          return organizer?.organizerName;
        })
      ),
    ].filter(Boolean); // فقط نام‌های معتبر
    return ["همه", ...uniqueOrganizerNames];
  }, [executives]);

  const [selectedTab, setSelectedTab] = useState("همه");

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="executive-tabs">
      {organizerNames.map((organizer) => (
        <button
          key={organizer}
          className={`executive-tabs__tab ${
            selectedTab === organizer ? "executive-tabs__tab--active" : ""
          }`}
          onClick={() => handleTabChange(organizer)}
        >
          {organizer}
        </button>
      ))}
    </div>
  );
};

export default ExecutiveTabs;
