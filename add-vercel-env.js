const https = require('https');

// Get Vercel token from environment
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || 'YOUR_TOKEN_HERE';
const PROJECT_ID = 'prj_xrq4U8EYH3rFSDk2uyNfKA9j4OIo';

const envVars = [
    {
        key: 'DATABASE_URL',
        value: 'libsql://yuka-yuka.aws-ap-northeast-1.turso.io',
        target: ['production', 'preview', 'development']
    },
    {
        key: 'DATABASE_AUTH_TOKEN',
        value: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI0OGE4ZTY2NS01NTEyLTQzYjItODcwNi0xMDJlNWRhYTQ5NjciLCJpYXQiOjE3NzA0Njc3NzMsInJpZCI6IjA5N2FlZWVmLTM5NmQtNDA5Yi1iMTExLTI1YWZkNWQwZGY5ZiJ9.wvaoCyVKtdxyY8TJg6rNdsTuaR4jpOboO7oihvYoSb1iPjp5pdXYDOM5vz7Z2P1VqiYLT0CbqczZWXDeuu1FCg',
        target: ['production', 'preview', 'development']
    }
];

async function addEnvVar(envVar) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            key: envVar.key,
            value: envVar.value,
            target: envVar.target,
            type: 'encrypted'
        });

        const options = {
            hostname: 'api.vercel.com',
            port: 443,
            path: `/v10/projects/${PROJECT_ID}/env`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VERCEL_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    console.log(`✓ Added ${envVar.key}`);
                    resolve();
                } else {
                    console.error(`✗ Failed to add ${envVar.key}: ${res.statusCode}`);
                    console.error(body);
                    reject(new Error(body));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('Adding environment variables to Vercel...\n');

    for (const envVar of envVars) {
        try {
            await addEnvVar(envVar);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }

    console.log('\nDone! Now triggering redeploy...');
}

main();
