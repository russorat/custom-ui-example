import React from "react";
import axios from "axios";
import "./styles.css";

class Checks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        checks: []
    };
  }
  
  componentDidMount() {    
    axios.get('/checks')
        .then((checks) => {
            this.setState({
                checks: checks.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
  }

  render() {
    const {checks} = this.state;
    const checksList = checks.map((check) => {
        return <li key={check.id}>{check.id} - {check.name} - {check.status}</li>
    })
    return (
        <div>
            <h3>Checks</h3>
            <ul>{checksList}</ul>
        </div>
    );
  }
}

export default Checks;