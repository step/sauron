import logger from "./logger";

const request = require("request");
import {souron as config} from "../config";

export default function (data, reports) {

    function handleResponse(response) {
        if (response.statusCode === 200) {
            logger.logReportsSent(data.uniqueId);
        } else {
            const error = new Error(`${response.statusCode} - ${response.statusMessage}`);
            logger.logSendingReportsFailed(data.uniqueId, error);
        }
    }

    function handleError(error) {
        logger.logSendingReportsFailed(data.uniqueId, error);
    }

    function generateURL() {
        return `${config.url}/${config.reportsPath}`;
    }

    function postReports() {
        request.post({
            url: generateURL(),
            json: Object.assign(data, {reports: reports})
        }).on('error', handleError).on('response', handleResponse);
    }

    logger.logSendingReports(data.uniqueId);
    postReports();
}