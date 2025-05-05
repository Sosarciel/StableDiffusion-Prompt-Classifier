Write-Output 开始删除原dist
Remove-Item -Recurse -Force dist
Write-Output 开始编译
tsc -p tsconfig.cjs.json
tsc-alias -p tsconfig.cjs.json
tsc -p tsconfig.mjs.json
tsc-alias -p tsconfig.mjs.json
tsc-esm-fix --tsconfig "./tsconfig.mjs.json"