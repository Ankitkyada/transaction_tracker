function commonResponse(code, isSuccess, message, payload = null, dataCount = null, res) {
    const response = {
        success: isSuccess,
        message: message,
        code: code,
        data: payload,
        count: dataCount,
    };
    return res.status(code).json(response);
}

module.exports = commonResponse;