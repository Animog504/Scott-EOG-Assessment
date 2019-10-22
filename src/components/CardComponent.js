import React from 'react';
import { useSubscription } from "urql";
import Card from '@material-ui/core/Card';
import { LinearProgress } from '@material-ui/core';
import Avatar from "./Avatar";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import { spacing } from '@material-ui/system';
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../store/actions";

const metricSubscription = `
subscription metricSubscription{
	newMeasurement{
  	value
  	metric
    unit
    at
  }
}`;//subscription query

const CardComponent = ({ selectedMetrics }) =>
(
    selectedMetrics.map(metric => <ListItem><MetricCard props={metric} /></ListItem>)
)//CardComponent - maps over metrics and creates MetricCard's

// const timestamp = new Date().getTime() - 30000

const MetricCard = ({ props }) => {

    const dispatch = useDispatch();

    let metricName = props

    const handlemetricSubscription = (existingData = {}, newData) => {
        if (newData) {
            existingData[newData.newMeasurement.metric] = newData
        }
        return existingData
    }

    const [result] = useSubscription({
        query: metricSubscription
    }, handlemetricSubscription)
    
    const { fetching, data, error } = result;
    
    if (!data || !data[metricName]) return <LinearProgress />;

    const makeCard = ({ newMeasurement }) => {
         
        return (
            <div>
                <Card onClick={()=>{
                     dispatch({ type: actions.REMOVE_MEASUREMENT, metric: newMeasurement.metric });
                }}>
                    <h3>{newMeasurement.metric}</h3>
                    <p>{newMeasurement.value} {newMeasurement.unit}</p>
                </Card>
            </div>
        )
    }

    return (
        <React.Fragment>
            {makeCard(data[metricName])}
        </React.Fragment>
    )
}

export default CardComponent