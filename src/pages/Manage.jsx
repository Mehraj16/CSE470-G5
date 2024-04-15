import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import manage from "../css/manage.module.css";
import { useNavigate } from "react-router-dom";

export default function Manage() {
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);

  const navigation = useNavigate();

  const showEventTemplate = () => {
    navigation("../createevents", { state: mydata });
  };
  const showMyEvents = () => {
    navigation("../adminevents", { state: mydata });
  };
  const showPostTemplate = () => {
    navigation("../createopost", { state: mydata });
  };
  const showMyPosts = () => {
    navigation("../adminposts", { state: mydata });
  };
  const showJobTemplate = () => {
    navigation("../createjob", { state: mydata });
  };
  const showMyJobs = () => {
    navigation("../adminjob", { state: mydata });
  };
  const showRatings = () => {
    navigation("../adminratings", { state: mydata });
  };

  return (
    <div className="App">
      <AdminSidebar />
      <AdminHeader />
      <div className="Content">
        <h3 className={manage.headline}>Events</h3>
        <div className={manage.eventsCreate}>
          <div onClick={showEventTemplate}>
            <p>Create Event</p>
          </div>
          <div onClick={showMyEvents}>
            <p>Manage Events</p>
          </div>
          <div onClick={showRatings}>
            <p>Review</p>
          </div>
        </div>
        <div className={manage.opps}>
          <div style={{flexDirection:'column'}}>
              <div>
                  <h3 className={manage.headline}>Resources</h3>
              </div>
              <div className={manage.jobsCreate}>
                <div onClick={showPostTemplate}>
                  <p>Create Post</p>
                </div>
                <div onClick={showMyPosts}>
                  <p>Manage Posts</p>
                </div>
              </div>
          </div>
          <div style={{flexDirection:'column'}}>
            <div>
                <h3 className={manage.headline} style={{
                  marginLeft: '0',
                }}>Opportunities</h3>
            </div>
          
          <div className={manage.jobsCreate}>
              <div onClick={showJobTemplate}>
                <p>Create Opening</p>
              </div>
              <div onClick={showMyJobs}>
                <p>Manage Jobs</p>
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
