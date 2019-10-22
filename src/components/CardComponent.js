import React from 'react';
import { useSubscription } from "urql";
import Card from '@material-ui/core/Card';
import { LinearProgress } from '@material-ui/core';
import ListItem from "@material-ui/core/ListItem";
import { useDispatch} from "react-redux";
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

const MetricCard = ({ props }) => {

    const dispatch = useDispatch();

    let metricName = props

    const handlemetricSubscription = (existingData = {}, newData) => {
        if (newData) {
            existingData[newData.newMeasurement.metric] = newData
        }
        return existingData
    }//handlemetricSubscription()

    const [result] = useSubscription({
        query: metricSubscription
    }, handlemetricSubscription)
    
    const { data } = result;
    
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
    }//makeCard()

    return (
        <React.Fragment>
            {makeCard(data[metricName])}
        </React.Fragment>
    )//return
}

export default CardComponent