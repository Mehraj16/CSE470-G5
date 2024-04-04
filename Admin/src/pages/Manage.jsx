import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import manage from "../css/manage.module.css";
import { useNavigate } from "react-router-dom";
export default function Manage() {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetch("/profile.json");
        if (!profileResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const profileData = await profileResponse.json();
        setProfileData(profileData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, []);

  const navigation = useNavigate();

  const showEventTemplate = () => {
    navigation("../createevents", { state: profileData });
  };
  const showMyEvents = () => {
    navigation("../adminevents", { state: profileData });
  };
  const showPostTemplate = () => {
    navigation("../createopost", { state: profileData });
  };
  const showMyPosts = () => {
    navigation("../adminposts", { state: profileData });
  };
  const showJobTemplate = () => {
    navigation("../createjob", { state: profileData });
  };
  const showMyJobs = () => {
    navigation("../adminjob", { state: profileData });
  };

  return (
    <div className="App">
      <AdminSidebar />
      <AdminHeader profilepic={`/src/assets/${profileData.profileImage}`} />
      <div className="Content">
        <h3 className={manage.headline}>Events</h3>
        <div className={manage.eventsCreate}>
          <div onClick={showEventTemplate}>
            <p>Create Event</p>
          </div>
          <div onClick={showMyEvents}>
            <p>Manage Events</p>
          </div>
          <div onClick={showEventTemplate}>
            <p>Review</p>
          </div>
        </div>
        <div className={manage.opps}>
          <div>
              <h3 className={manage.headline}>Resources</h3>
          </div>
          <div>
              <h3 className={manage.headline} style={{
                marginLeft: '0',
              }}>Opportunities</h3>
          </div>
        </div>
        <div className={manage.jobsCreate}>
          <div onClick={showPostTemplate}>
            <p>Create Post</p>
          </div>
          <div onClick={showMyPosts}>
            <p>Manage Posts</p>
          </div>
            <div onClick={showJobTemplate}>
              <p>Create Opening</p>
            </div>
            <div onClick={showMyJobs}>
              <p>Manage Jobs</p>
            </div>
        </div>
      </div>
    </div>
  );
}
