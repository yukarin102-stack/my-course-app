@echo off
setlocal EnableDelayedExpansion

echo Setting DATABASE_URL...
<nul set /p="libsql://yuka-yuka.aws-ap-northeast-1.turso.io" | npx vercel env add DATABASE_URL production

echo.
echo Setting DATABASE_AUTH_TOKEN...
<nul set /p="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI0OGE4ZTY2NS01NTEyLTQzYjItODcwNi0xMDJlNWRhYTQ5NjciLCJpYXQiOjE3NzA0Njc3NzMsInJpZCI6IjA5N2FlZWVmLTM5NmQtNDA5Yi1iMTExLTI1YWZkNWQwZGY5ZiJ9.wvaoCyVKtdxyY8TJg6rNdsTuaR4jpOboO7oihvYoSb1iPjp5pdXYDOM5vz7Z2P1VqiYLT0CbqczZWXDeuu1FCg" | npx vercel env add DATABASE_AUTH_TOKEN production

echo.
echo Done! Checking environment variables...
npx vercel env ls
