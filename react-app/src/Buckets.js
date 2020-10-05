import React from "react";
import axios from "axios";
import "./styles.css";
import Sparkline from './Sparkline'

class Buckets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        buckets: []
    };
  }
  
  componentDidMount() {    
    axios.get('/buckets')
        .then((buckets) => {
            this.setState({
                buckets: buckets.data,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
  }

  render() {
    const {buckets} = this.state;
    const bucketList = buckets.map((bucket) => {
        if(bucket.type === 'user') {
            let rp = (bucket.retentionRules.length > 0) ? (bucket.retentionRules[0].everySeconds/60/60/24)+'d' : '∞'
            return <tr key={bucket.id}><td>{bucket.id}</td><td>{bucket.name}</td><td>{rp}</td><td><Sparkline key={bucket.name} bucket={bucket.name}/></td></tr>
        }
        return ''
    })
    return (
        <div>
            <h3>Buckets</h3>
            <table><thead></thead><tbody>{bucketList}</tbody></table>
        </div>
    );
  }
}

export default Buckets;