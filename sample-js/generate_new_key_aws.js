var crypto  = require('crypto');
var async   = require('async');
var moment  = require('moment');
var request = require('request');
const AWS   = require('aws-sdk');

// aqua cspm rest api endpoint
var endpoint = 'https://api.cloudsploit.com';

// the apikey and secret from aqua cspm
var key = '<cspm-api-key>';
var secret = '<cspm-api-secret>';

// iam role and policy name to be used
let roleName = 'Aqua-CSPM-Scanner-Role';
let policyName = 'aqua-cspm-supplemental-policy';

// name of the group to add the cloud accounts into. if no group is added, the Default group will be assigned to all cloud accounts.
let groupToAdd;

// list of AWS accounts to onboard, the name of each will be used as the saved name for the cloud account.
let cloudAccounts = {
    'aws_dev' : {
        accessKeyId: '<accesskey-id>',
        secretAccessKey: '<secretaccess-key>'
    },
    'aws_prod' : {
        accessKeyId: '<accesskey-id>',
        secretAccessKey: '<secretaccess-key>'
    },
};



// helper functions
var setRequestOptions = function(path, method, body) {
    let timestamp = (moment.unix(new Date()))/1000;

    let string = timestamp + method + path + body;

    let hmac = crypto.createHmac('sha256', secret);
    hmac.setEncoding('hex');
    hmac.write(string);
    hmac.end();

    let signature = hmac.read();

    let returnOptions = {
        method: method,
        url: endpoint + path,
        headers: {
            'X-API-Key': key,
            'X-Signature': signature,
            'X-Timestamp': timestamp,
            "Content-Type": "application/json"
        }
    };

    if (body.length) {
        returnOptions.body = body;
    }

    return returnOptions;
};
var addNewKey = function(createKeyBody, kcb) {
    let path = '/v2/keys';

    let options = setRequestOptions(path, 'POST', createKeyBody);

    request(options, function(error) {
        if (error) console.log('Error creating cloud account connection', error);
        else console.log("finished creating cloud account connection");
        kcb();
    });
};
var createIAMRolePolcy = function(generatedID, credentials, callback) {
    let iam = new AWS.IAM(credentials);

    let aquaCSPMAssumeRole = {
        "Version": "2008-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::057012691312:role/lambda-cloudsploit-api"
                },
                "Action": "sts:AssumeRole",
                "Condition": {
                    "StringEquals": {
                        "sts:ExternalId": `${generatedID}`
                    },
                    "IpAddress": {
                        "aws:SourceIp": "3.231.74.65/32"
                    }
                }
            },
            {
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::057012691312:role/lambda-cloudsploit-collector"
                },
                "Action": "sts:AssumeRole",
                "Condition": {
                    "StringEquals": {
                        "sts:ExternalId": `${generatedID}`
                    },
                    "IpAddress": {
                        "aws:SourceIp": "3.231.74.65/32"
                    }
                }
            },
            {
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::057012691312:role/lambda-cloudsploit-remediator"
                },
                "Action": "sts:AssumeRole",
                "Condition": {
                    "StringEquals": {
                        "sts:ExternalId": `${generatedID}`
                    },
                    "IpAddress": {
                        "aws:SourceIp": "3.231.74.65/32"
                    }
                }
            },
            {
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::057012691312:role/lambda-cloudsploit-tasks"
                },
                "Action": "sts:AssumeRole",
                "Condition": {
                    "StringEquals": {
                        "sts:ExternalId": `${generatedID}`
                    },
                    "IpAddress": {
                        "aws:SourceIp": "3.231.74.65/32"
                    }
                }
            }
        ]
    };

    let aquaCSPMAssumePolicy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "ses:DescribeActiveReceiptRuleSet",
                    "athena:GetWorkGroup",
                    "logs:DescribeLogGroups",
                    "logs:DescribeMetricFilters",
                    "config:getComplianceDetailsByConfigRule",
                    "elastictranscoder:ListPipelines",
                    "elasticfilesystem:DescribeFileSystems",
                    "servicequotas:ListServiceQuotas",
                    "ssm:ListAssociations",
                    "dlm:GetLifecyclePolicies",
                    "airflow:ListEnvironments",
                    "glue:GetSecurityConfigurations",
                    "devops-guru:ListNotificationChannels",
                    "ec2:GetEbsEncryptionByDefault",
                    "ec2:GetEbsDefaultKmsKeyId",
                    "organizations:ListAccounts",
                    "kendra:ListIndices",
                    "proton:ListEnvironmentTemplates",
                    "qldb:ListLedgers",
                    "airflow:ListEnvironments",
                    "profile:ListDomains",
                    "timestream:DescribeEndpoints",
                    "timestream:ListDatabases",
                    "frauddetector:GetDetectors",
                    "memorydb:DescribeClusters",
                    "kafka:ListClusters",
                    "apprunner:ListServices",
                    "finspace:ListEnvironments",
                    "healthlake:ListFHIRDatastores",
                    "codeartifact:ListDomains",
                    "auditmanager:GetSettings",
                    "appflow:ListFlows",
                    "databrew:ListJobs",
                    "managedblockchain:ListNetworks",
                    "connect:ListInstances",
                    "backup:ListBackupVaults",
                    "backup:DescribeRegionSettings",
                    "backup:getBackupVaultNotifications",
                    "backup:ListBackupPlans",
                    "dlm:GetLifecyclePolicies",
                    "glue:GetSecurityConfigurations",
                    "ssm:describeSessions",
                    "ssm:GetServiceSetting",
                    "ecr:DescribeRegistry",
                    "ecr-public:DescribeRegistries",
                    "kinesisvideo:ListStreams",
                    "wisdom:ListAssistants",
                    "voiceid:ListDomains",
                    "lookoutequipment:ListDatasets",
                    "iotsitewise:DescribeDefaultEncryptionConfiguration",
                    "geo:ListTrackers",
                    "geo:ListGeofenceCollections",
                    "lookoutvision:ListProjects",
                    "lookoutmetrics:ListAnomalyDetectors",
                    "lex:ListBots",
                    "forecast:ListDatasets",
                    "forecast:ListForecastExportJobs",
                    "forecast:DescribeDataset",
                    "lambda:GetFunctionUrlConfig"
                ],
                "Resource": "*"
            }
        ]
    };

    let policyARN;

    let roleArn;

    async.series([
        function(pcb) {
            iam.createPolicy({
                PolicyDocument: JSON.stringify(aquaCSPMAssumePolicy),
                PolicyName: policyName
            }, function(policyErr, policyData) {
                if (policyErr) {
                    console.log(policyErr);
                    return pcb(policyErr);
                }

                if (policyData && policyData.Policy && policyData.Policy.Arn) {
                    policyARN = policyData.Policy.Arn;
                }

                pcb();
            });
        },
        function(rcb) {
            iam.createRole({
                AssumeRolePolicyDocument: JSON.stringify(aquaCSPMAssumeRole),
                RoleName: roleName,
                PermissionsBoundary: `${policyARN}`
            }, function(roleErr, roleData) {
                if (roleErr) {
                    console.log(roleErr);
                    return rcb(roleErr);
                }

                if (roleData && roleData.Role && roleData.Role.Arn) {
                    roleArn = roleData.Role.Arn;
                }

                rcb();
            });
        },
        function(acb) {
            iam.attachRolePolicy({
                PolicyArn: 'arn:aws:iam::aws:policy/SecurityAudit',
                RoleName: roleName
            }, function(attachErr, attachData) {
                if (attachErr) {
                    console.log (attachErr);
                    return acb();
                }

                console.log(attachData);

                acb();
            });
        }
    ], function(err) {
        callback(err, roleArn);
    });
};



let generatedIDArr = [];
let groupId;

async.series([
    // collects the necessary generated id's needed to create the proper connections
    function(gicb) {
        let path = '/v2/generatedids';
        let generatedIdBody = JSON.stringify({count: Object.keys(cloudAccounts).length});

        let options = setRequestOptions(path, 'POST', generatedIdBody);

        request(options, function(error, response, body){
            if (error) return console.log(error);

            let parsedBody = JSON.parse(body);

            generatedIDArr = JSON.parse(JSON.stringify(parsedBody.data));

            gicb();
        });
    },
    // collects the group to assign to the key
    function(gcb) {
        let path = '/v2/groups';
        let options = setRequestOptions(path, 'GET', '');

        request(options, function(error, response, body){
            if (error) return console.log(error);

            let parsedBody = JSON.parse(body);

            let groupArr = JSON.parse(JSON.stringify(parsedBody.data));
            let groupName = groupToAdd || 'Default';

            let foundGroup = groupArr.find(group => { return group.name === groupName; });

            groupId = foundGroup.id;
            gcb();
        });
    },
    // creates a new role and key
    function(icb) {
        async.eachOfLimit(cloudAccounts, 1, function(credentials, keyName, cacb) {
            let generatedIDObj = generatedIDArr.pop();
            let generatedID = generatedIDObj.generated_id;

            createIAMRolePolcy(generatedID, credentials, function(err, iamRole) {
                let keyBody = {
                    role_arn: iamRole,
                    external_id: generatedID,
                    name: keyName,
                    group_id: groupId
                };

                addNewKey(JSON.stringify(keyBody), cacb);
            });
        }, function() {
            icb();
        });
    }
], function() {
    console.log('Finished');
});