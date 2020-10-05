import React from "react";
import axios from "axios";
import "./styles.css";

class Dashboards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        dashboards: []
    };
  }
  
  componentDidMount() {    
    axios.get('/dashboards')
        .then((dashboards) => {
            this.setState({
                dashboards: dashboards.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
  }

  render() {
    const {dashboards} = this.state;
    const dashboardsList = dashboards.map((dash) => {
        return <li key={dash.id}>{dash.id} - {dash.name}</li>
    })
    return (
        <div>
            <h3>Dashboards</h3>
            <ul>{dashboardsList}</ul>
        </div>
    );
  }
}

export default Dashboards;