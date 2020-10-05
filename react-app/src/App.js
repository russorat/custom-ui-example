import React from "react";
import "./styles.css";
import Buckets from './Buckets'
import Dashboards from './Dashboards'
import Tasks from './Tasks'
import Checks from "./Checks";

export default class App extends React.Component {
  render() {
    return (
        <div>
            <Buckets />
            <Dashboards />
            <Tasks />
            <Checks />
        </div>
    );
  }

  
  
}
