const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 自動的にVercel環境変数を設定します...\n');

// Get Vercel token from local config
let vercelToken;
try {
    const vercelConfigPath = process.env.VERCEL_TOKEN_PATH ||
        (process.platform === 'win32'
            ? `${process.env.APPDATA}\\.com.vercel.cli\\auth.json`
            : `${process.env.HOME}/.local/share/com.vercel.cli/auth.json`);

    if (fs.existsSync(vercelConfigPath)) {
        const authData = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
        vercelToken = authData.token;
        console.log('✓ Vercel認証トークンを取得しました');
    }
} catch (error) {
    console.log('⚠ ローカル認証ファイルが見つかりません。Vercel CLIで直接設定します。');
}

const envVars = [
    {
        name: 'DATABASE_URL',
        value: 'libsql://yuka-yuka.aws-ap-northeast-1.turso.io'
    },
    {
        name: 'DATABASE_AUTH_TOKEN',
        value: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI0OGE4ZTY2NS01NTEyLTQzYjItODcwNi0xMDJlNWRhYTQ5NjciLCJpYXQiOjE3NzA0Njc3NzMsInJpZCI6IjA5N2FlZWVmLTM5NmQtNDA5Yi1iMTExLTI1YWZkNWQwZGY5ZiJ9.wvaoCyVKtdxyY8TJg6rNdsTuaR4jpOboO7oihvYoSb1iPjp5pdXYDOM5vz7Z2P1VqiYLT0CbqczZWXDeuu1FCg'
    }
];

console.log('\n📝 環境変数をファイルに書き出します...');

// Create temp files without newlines
envVars.forEach((envVar, index) => {
    const filename = `.env.tmp.${envVar.name}`;
    fs.writeFileSync(filename, envVar.value, { encoding: 'utf8', flag: 'w' });
    console.log(`✓ ${filename} を作成`);
});

console.log('\n🚀 Vercel CLIで環境変数を設定します...');

// Try using set instead of add
envVars.forEach((envVar) => {
    try {
        console.log(`\n設定中: ${envVar.name}...`);

        // Use PowerShell to read file and pipe to vercel
        const command = `powershell -Command "Get-Content -Raw .env.tmp.${envVar.name} | npx vercel env add ${envVar.name} production --yes"`;

        const result = execSync(command, {
            encoding: 'utf8',
            stdio: 'pipe',
            input: 'N\n' // Answer "No" to sensitive prompt
        });

        console.log(`✓ ${envVar.name} を追加しました`);
    } catch (error) {
        console.error(`✗ ${envVar.name} の追加に失敗: ${error.message}`);
    }
});

// Clean up temp files
console.log('\n🧹 一時ファイルを削除...');
envVars.forEach((envVar) => {
    const filename = `.env.tmp.${envVar.name}`;
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
        console.log(`✓ ${filename} を削除`);
    }
});

console.log('\n✅ 完了！環境変数の設定状況を確認します...');

try {
    const listResult = execSync('npx vercel env ls', { encoding: 'utf8' });
    console.log(listResult);
} catch (error) {
    console.error('環境変数リストの取得に失敗');
}

console.log('\n🎉 設定完了！次はデプロイメントを実行してください。');
