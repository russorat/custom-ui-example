import React from "react";
import axios from "axios";
import "./styles.css";
import {Plot, fromFlux, fromRows} from '@influxdata/giraffe'

export default class Sparkline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        records: [],
        config: {
            table: null,
            layers: [{
                type: 'line',
                x: '_stop',
                y: '_value',
                lineWidth: 1,
                interpolation: 'linear',
                fill: ["bucket"]//fills
            }],
            showAxes: false,
            xTicks: [],
            yTicks: [],
            //gridOpacity: 0,
        }
    };
  }
     /*
        declare a member variable to hold the interval ID
        that we can reference later.
     */
     intervalID;

     componentDidMount() {
       this.getData();

       /*
         Now we need to make it run at a specified interval,
         bind the getData() call to `this`, and keep a reference
         to the invterval so we can clear it later.
       */
       this.intervalID = setInterval(this.getData.bind(this), 5000);
     }

     componentWillUnmount() {
       /*
         stop getData() from continuing to run even
         after unmounting this component
       */
       clearInterval(this.intervalID);
     }

     getData = () => {
        axios.get(`/count?bucket=${this.props.bucket}&interval=10s`)
            .then((fieldData) => {
                if(!fieldData.data || !fieldData.data.trim()) {
                    return
                }
                this.setState((prevState) => {
                    //console.log(prevState.config.table)
                    let parsed = fromFlux(fieldData.data)
                    if(parsed) {
                        let newRecord = {}
                        for(let i = 0; i < parsed.table.columnKeys.length; i++) {
                            newRecord[parsed.table.columnKeys[i]] = parsed.table.getColumn(parsed.table.columnKeys[i])[0];
                        }
                        //console.log(newRecord)
                        if(newRecord) {
                            if(prevState.config.table) {
                                //fromRows(records, shema)
                                let newRecords = prevState.records.concat([newRecord]);
                                if(newRecords.length > 50) {
                                    newRecords.shift()
                                }
                                //console.log(newRecords)
                                return {
                                    records: newRecords,
                                    config: {
                                        valueFormatters: prevState.config.valueFormatters,
                                        table: fromRows(newRecords,{"result":"string","table":"number","_stop":"time","_value":"number","bucket":"string"}),
                                        layers: prevState.config.layers,
                                        showAxes: false,
                                        xTicks: [],
                                        yTicks: [],
                                    }
                                }
                            } else {
                                return {
                                    records: [newRecord],
                                    config: {
                                        valueFormatters: { 
                                            "_value": (num) => num.toFixed(2),
                                            "_stop": (t) => new Date(t).toLocaleTimeString()
                                        },
                                        table: parsed.table,
                                        layers: prevState.config.layers,
                                        showAxes: false,
                                        xTicks: [],
                                        yTicks: [],
                                    }
                                }
                            }
                        }
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });
     }

  render() {
    const {config} = this.state;
    return (
        <div id={this.props.bucket} 
            style={{
            width: "calc(20vw - 1px)",
            height: "calc(2vh - 1px)",
            margin: "1px"
            }}
        >
            <Plot config={config} />
        </div>
    );
  }

  
  
}
