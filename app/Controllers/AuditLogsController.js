const { render } = require('ejs');
const commonResponse = require('../../config/CommonResponse');
const axios = require('axios');


class AuditLogsController {

    static async getAuditLogs(req, res) {
     try{

        const response = await axios.get('https://api.cci.devbyopeneyes.com/Audit_logs/get-audit-logs');
        // const response = await axios.get('http://localhost:4500/api/get-users-list');

        if (response.status !== 200) {
            return commonResponse(500, false, 'Failed to fetch audit logs', null, null, res);
        }
        
        return res.render('audit_logs.ejs', { result: response.data.data });

     }catch (error) {
         console.error('Error fetching audit logs:', error);
         return commonResponse(500, false, 'Internal server error', null, null, res);
     }
        
    }
}

module.exports = AuditLogsController;
