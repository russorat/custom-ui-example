import React from "react";
import axios from "axios";
import "./styles.css";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        tasks: []
    };
  }
  
  componentDidMount() {    
    axios.get('/tasks')
        .then((tasks) => {
            this.setState({
                tasks: tasks.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
  }

  render() {
    const {tasks} = this.state;
    const tasksList = tasks.map((task) => {
        return <li key={task.id}>{task.id} - {task.name} - {task.status}</li>
    })
    return (
        <div>
            <h3>Tasks</h3>
            <ul>{tasksList}</ul>
        </div>
    );
  }
}

export default Tasks;