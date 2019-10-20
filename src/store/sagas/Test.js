import { takeEvery, call } from "redux-saga/effects";
import * as actions from "../actions";
import { toast } from "react-toastify";

function* measurementSelected(action) {
  yield call(toast.error, `Error Received: ${action.error}`);
}

function* watchMeasurementSelection() {
  yield takeEvery(actions.MEASUREMENT_TYPE_SELECT, measurementSelected);
}

export default [watchMeasurementSelection];
 