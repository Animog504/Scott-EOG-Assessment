import React, { useState, useEffect } from 'react';
// import styled from "styled-components"; //cant seem to find this one so commented out for now
import gql from "graphql-tag";
import { useQuery, createClient, Provider } from "urql";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
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

const GraphComponent = () => 
  (
    <Provider value={client}>
      <QueryMakingComponentThing />
    </Provider>
  )

const timestamp = new Date().getTime() - 30000

const QueryMakingComponentThing = () =>{
  console.log(timestamp)

  const [result] = useQuery({
    query: maybeBetterQuery,
    variables: {
      measurement: "oilTemp",
      startTime: timestamp
    }
  });
  const { fetching, data, error } = result;

  //   // const { loading, data } = useQuery(QUERY);
  //   console.log(data)



  if (fetching) return <LinearProgress />;
  //   // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, ...];
    const makeChart = (data) => {
      const ourDataOrSomething = data.getMultipleMeasurements[0].measurements
        if(data != null){
          return(
            <LineChart width={800} height={200} data={ourDataOrSomething}>
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="at"/>
                <YAxis dataKey="value"/>
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
  return "help"
       
}

export default GraphComponent