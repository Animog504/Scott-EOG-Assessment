import React, { useState, useEffect } from 'react';
// import styled from "styled-components"; //cant seem to find this one so commented out for now
import gql from "graphql-tag";
import { useQuery, createClient, Provider, useSubscription } from "urql";
import Card from '@material-ui/core/Card';
import { LinearProgress } from '@material-ui/core';
// import { SubscriptionClient } from 'subscription-transport-ws';



const getLastMeasurement = `
query($metricName: String!){
    getLastKnownMeasurement(metricName: $metricName){
          metric
          value
          unit
          at
   }
  }`;

const animeSubs = `
subscription animeSubs{
	newMeasurement{
  	value
  	metric
    unit
    at
  }
}`;

const CardComponent = ({ selectedMetrics }) =>
    (
        selectedMetrics.map(metric => <MetricCard props={metric} />)
    )

const timestamp = new Date().getTime() - 30000

const MetricCard = ({ props }) => {

    console.log("CC props:", props)
    let metricName = props

    console.log("metricName: ", metricName, "metricValue: "/*,value*/);

    //   const [result] = useQuery({
    //     query: getLastMeasurement,
    //     variables: {
    //         metricName: metricName
    //     }
    //   });
    //   const [result, executeQuery] = useQuery({
    //     query: getLastMeasurement,
    //     variables: { metricName: metricName },
    //     // refetch ever 5seconds:
    //     // pollInterval: 1300,  
    //     // necessary so it updates from network:
    //     requestPolicy: 'cache-and-network',
    //   })

    const handleAnimeSubs = (existingData = {}, newData) => {
        console.log('Existingdata', existingData)
        // console.log('newData',newData)
        console.log("newData Metric:", newData.newMeasurement.metric, " vs. metricName: ", metricName)
        // if(newData.newMeasurement.metric == metricName) 
        if (newData) {
            existingData[newData.newMeasurement.metric] = newData
        }
        return existingData


    }

    const [result] = useSubscription({
        query: animeSubs
    }, handleAnimeSubs)
    console.log("animeSubs result2:", result)

    const { fetching, data, error } = result;
    
    console.log("result: ", result)
    console.log("data: ", data)
    if (!data || !data[metricName]) return <LinearProgress />;

    const makeCard = ({ newMeasurement }) => {

        console.log("data in card:", newMeasurement)

        return (
            // <h2>card</h2>
            <div>
                <Card>
                    <h3>{newMeasurement.metric}</h3>
                    <p>{newMeasurement.value} {newMeasurement.unit}</p>
                </Card>
            </div>
        )
    }


    //   // console.log(data)
    return (
        <React.Fragment>
            {makeCard(data[metricName])}
        </React.Fragment>


    )
    return "help"

}

export default CardComponent