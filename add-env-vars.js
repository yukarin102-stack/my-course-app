const fs = require('fs');
const { spawn } = require('child_process');

const envVars = [
    { name: 'DATABASE_URL', value: 'libsql://yuka-yuka.aws-ap-northeast-1.turso.io' },
    { name: 'DATABASE_AUTH_TOKEN', value: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI0OGE4ZTY2NS01NTEyLTQzYjItODcwNi0xMDJlNWRhYTQ5NjciLCJpYXQiOjE3NzA0Njc3NzMsInJpZCI6IjA5N2FlZWVmLTM5NmQtNDA5Yi1iMTExLTI1YWZkNWQwZGY5ZiJ9.wvaoCyVKtdxyY8TJg6rNdsTuaR4jpOboO7oihvYoSb1iPjp5pdXYDOM5vz7Z2P1VqiYLT0CbqczZWXDeuu1FCg' }
];

async function addEnvVar(envVar) {
    return new Promise((resolve, reject) => {
        console.log(`\n設定中: ${envVar.name}...`);

        const child = spawn('npx', ['vercel', 'env', 'add', envVar.name, 'production'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
            process.stdout.write(data);

            // Check for prompts and respond
            if (output.includes('sensitive')) {
                child.stdin.write('N\n');
            }
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
            process.stderr.write(data);
        });

        // Write the value immediately (no newline)
        child.stdin.write(envVar.value);
        child.stdin.write('\n');
        child.stdin.end();

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✓ ${envVar.name} を追加しました`);
                resolve();
            } else {
                console.error(`✗ 失敗: ${envVar.name}`);
                reject(new Error(`Exit code: ${code}`));
            }
        });
    });
}

async function main() {
    console.log('🔧 Vercel環境変数を設定します...\n');

    for (const envVar of envVars) {
        try {
            await addEnvVar(envVar);
            // Wait a bit between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`エラー: ${error.message}`);
        }
    }

    console.log('\n✅ 完了！');
}

main();
