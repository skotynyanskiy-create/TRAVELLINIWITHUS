$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$venv = Join-Path $repoRoot '.tools\graphify'
$python = Join-Path $venv 'Scripts\python.exe'
$graphify = Join-Path $venv 'Scripts\graphify.exe'

if (-not (Test-Path -LiteralPath $python)) {
  $launcherArgs = @('-3.12')
  & py @launcherArgs --version *> $null

  if ($LASTEXITCODE -ne 0) {
    $launcherArgs = @('-V:Astral/CPython3.12.13')
    & py @launcherArgs --version *> $null
  }

  if ($LASTEXITCODE -ne 0) {
    throw 'Graphify richiede Python 3.12. Installa Python 3.12 e riesegui npm run graphify:setup.'
  }

  & py @launcherArgs -m venv $venv
}

& $python -m pip install --disable-pip-version-check 'graphifyy==0.9.6'
& $python -m pip check
& $graphify --version
