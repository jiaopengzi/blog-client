# FilePath    : blog-client\pnpm-reinstall.ps1
# Author      : jiaopengzi
# Blog        : https://jiaopengzi.com
# Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
# Description : 清理 pnpm 依赖与缓存后执行强制重装, 默认使用项目内全新 store 以避免全局 store 占用告警.

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    # 可选尝试清理全局 store, 默认关闭以避免 Windows 下的占用告警污染主流程.
    [switch] $TryCleanGlobalStore
)

$ErrorActionPreference = "Stop"

# 无论从哪里调用, 都强制回到脚本目录执行, 避免误删当前终端所在目录的同名路径.
Set-Location -LiteralPath $PSScriptRoot

<#
.SYNOPSIS
按路径删除文件或目录, 不存在时直接跳过.

.DESCRIPTION
统一封装删除逻辑, 让主流程只关心"是否删掉". 删除大目录时临时关闭 PowerShell 进度条, 避免刷屏淹没真正的告警信息.

.PARAMETER Path
要删除的文件或目录绝对路径.

.PARAMETER Label
写入日志的人类可读名称.

.OUTPUTS
System.Boolean. 返回 true 表示删除成功或目标不存在, false 表示删除失败.
#>
function Remove-PathIfExists {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Path,
        [Parameter(Mandatory = $true)]
        [string] $Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        Write-Host "[skip] $Label not found: $Path"
        return $true
    }

    if ($PSCmdlet.ShouldProcess($Path, "Remove $Label")) {
        # 记录调用前的全局进度配置, 结束后必须恢复, 避免污染用户后续终端体验.
        $originalProgressPreference = $global:ProgressPreference
        try {
            # 大量删除文件时 PowerShell 会刷删除进度, 这里静音只保留结果日志.
            $global:ProgressPreference = "SilentlyContinue"
            Remove-Item -LiteralPath $Path -Recurse -Force
            Write-Host "[done] Removed ${Label}: $Path"
            return $true
        }
        catch {
            Write-Warning "Failed to remove ${Label}: $Path"
            Write-Warning $_.Exception.Message
            return $false
        }
        finally {
            $global:ProgressPreference = $originalProgressPreference
        }
    }

    return $true
}

<#
.SYNOPSIS
执行 pnpm 命令并在失败时中断脚本.

.DESCRIPTION
统一封装 pnpm 调用, 让外层流程始终通过同一套 ShouldProcess 和退出码检查执行, 避免某个步骤失败后脚本继续向下运行.

.PARAMETER Display
ShouldProcess 展示给用户的动作描述.

.PARAMETER Arguments
要传给 pnpm 的原始参数数组.

.OUTPUTS
无显式返回值. 当 pnpm 退出码非 0 时抛出异常.
#>
function Invoke-PnpmCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Display,
        [Parameter(Mandatory = $true)]
        [string[]] $Arguments
    )

    $target = "pnpm $($Arguments -join ' ')"
    if ($PSCmdlet.ShouldProcess($target, $Display)) {
        & pnpm @Arguments
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed: $target"
        }
    }
}

# metadata cache 比 store 更轻量, 但同样会影响依赖解析结果, 这里每次都清掉.
$cachePath = (& pnpm cache path).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($cachePath)) {
    throw "Failed to resolve pnpm cache path."
}

# 先移除项目自身产物, 确保后续安装不会复用旧的锁文件和虚拟 store.
Remove-PathIfExists -Path (Join-Path $PSScriptRoot "node_modules") -Label "node_modules" | Out-Null
Remove-PathIfExists -Path (Join-Path $PSScriptRoot "pnpm-lock.yaml") -Label "pnpm lockfile" | Out-Null
Remove-PathIfExists -Path $cachePath -Label "pnpm metadata cache" | Out-Null

# 默认使用项目内独立 store, 这样就算全局 store 被占用, 本次重装也不会被旧缓存干扰.
$fallbackStorePath = Join-Path $PSScriptRoot ".pnpm-store-fresh"
Remove-PathIfExists -Path $fallbackStorePath -Label "fallback pnpm store" | Out-Null

$installArguments = @("install", "--force", "--store-dir", $fallbackStorePath)

if ($TryCleanGlobalStore) {
    # 只有显式要求时才碰全局 store, 因为它在 Windows 上更容易遇到被占用的 CAS 文件.
    $storePath = (& pnpm store path).Trim()
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($storePath)) {
        throw "Failed to resolve pnpm store path."
    }

    $storeRemoved = Remove-PathIfExists -Path $storePath -Label "pnpm store"
    if (-not $storeRemoved) {
        # 全局 store 清不掉不应阻断主目标, 主目标是用一套全新缓存完成本次安装.
        Write-Host "[skip] Global pnpm store cleanup failed, continue with fresh local store: $fallbackStorePath"
    }
}

# 最后统一用 fresh store 强制安装, 把缓存影响收敛到当前项目目录内.
Invoke-PnpmCommand -Display "Force install dependencies" -Arguments $installArguments