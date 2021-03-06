import React, { Component } from "react";
// import Filter from "../components/Sort";
import JobList from "../components/JobList";

export default class Jobs extends Component {
  render() {
    return (
      <div>
        <div className="content">
          <div className="main">
            {/* <Filter></Filter> */}
            <JobList/>
          </div>
        </div>
      </div>
    );
  }
}