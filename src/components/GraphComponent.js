import React, { useState, useEffect } from 'react';
// import styled from "styled-components"; //cant seem to find this one so commented out for now
import gql from "graphql-tag";
import { useQuery, createClient, Provider } from "urql";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Brush } from 'recharts';
import { LinearProgress } from '@material-ui/core';

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});


const metric = {
  "getData": "oilTemp"
};
// const QUERY = gql`
// query dynamicQuery($getData: String!) {
//   getData: getMultipleMeasurements(input: [{metricName: $getData}])
//       {
//           measurements {
//               ...measurements
//           }
//       }      
// }
//   fragment measurements on Measurement{
//       metric
//       value
//       unit
//       at
//   }
// `;

const maybeBetterQuery = `
query($measurement: String!, $startTime: Timestamp) {
  getMultipleMeasurements(input: [{metricName: $measurement, after: $startTime}]) {
      measurements {
        metric
        value
        unit
        at
      }
    }    
  }
`;

const GraphComponent = (props) => 
  (
    <Provider value={client}>
      <QueryMakingComponentThing props={props} />
    </Provider>
  )



const timestamp = new Date().getTime() - 30000

const QueryMakingComponentThing = ({props}) =>{
  //the code below is an absolute shit storm but works to varying degrees. FUCK!
  // console.log("props.selectedMetrics.length > 0", props.selectedMetrics.length > 0)
  // console.log(timestamp)
  // debugger

  let metricToGet = props.selectedMetrics.length > 0 ? props.selectedMetrics[props.selectedMetrics.length-1] : "tubingPressure"

  // console.log("what our query gonna be?",metricToGet, "what is props?", props)
  const [result] = useQuery({
    query: maybeBetterQuery,
    variables: {
      measurement: metricToGet,
      startTime: timestamp
    }
  });
  const { fetching, data, error } = result;

  //   // const { loading, data } = useQuery(QUERY);
  //   console.log(data)



  if (fetching) return <LinearProgress />;
  //   // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, ...];
    const makeChart = (data) => {
      console.log("makeChart data arg: ", data)
      const ourDataOrSomething = data.getMultipleMeasurements[0].measurements // right now hard-coded grab for data
      console.log("What is this data?:",ourDataOrSomething)
      //gotta map this shit cuz unix timestamps are only readable by sick fucks.
      // metric value unit at

      const fixThisShit = (n) => {
        //gotta map this shit cuz unix timestamps are only readable by sick fucks.
        let getReadableDate = new Date(n)
        let hour = getReadableDate.getHours()
        let minute = `${getReadableDate.getMinutes() < 10 ? "0":""}${getReadableDate.getMinutes()}`
        let seconds = `${getReadableDate.getSeconds() < 10 ? "0":""}${getReadableDate.getSeconds()}`
        // console.log("fix this shit time: ", hour+":"+minute+":"+seconds)
        return `${hour}:${minute}:${seconds}`
      }
      const betterData = ourDataOrSomething.map(measurement => ({
        "metric": measurement.name,
        "value": measurement.value,
        "unit": measurement.unit,
        "at": fixThisShit(measurement.at)
      }))
        if(data != null){
          return(
            <LineChart width={800} height={200} margin={{ top: 5, right: 50, bottom: 5, left: 5 }} data={betterData}>
                <Brush height={10}/>
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="at"/>
                <YAxis dataKey="value"/>
                <Tooltip wrapperStyle={{ width: 150, backgroundColor: '#ccc' }} />
                {/* {
                  data.map((id) => {
                    return (
                      <Line key={`line_${id}`} dataKey={`${id}_value`} />
                    )
                  })
                } */ /*map over ALL THE DATA and make a new Line for each metric*/} 
            </LineChart>)
        }else{
          return <h3>no valid data</h3>
        }
        
    }
    

  //   // console.log(data)
    return(
        <div>
             <h1>Graph Component</h1>
            <div>{makeChart(data)}</div>
    
        </div>
        )
  return "help" // no please, really. help.
       
}

export default GraphComponent