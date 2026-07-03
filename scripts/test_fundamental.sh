#!/bin/bash
CODE="${1:-000783}"

python3 << PYEOF
from data_provider.base import DataFetcherManager
from src.config import get_config
import time

config = get_config()
mgr = DataFetcherManager()

print(f'=== 基本面: ${CODE} ===')
print(f'超时: stage={config.fundamental_stage_timeout_seconds}s fetch={config.fundamental_fetch_timeout_seconds}s')
print()

t0 = time.time()
ctx = mgr.get_fundamental_context('${CODE}')
elapsed = time.time() - t0

print(f'耗时: {elapsed:.1f}s  状态: {ctx.get("status", "?")}')
print()

for m in ['valuation', 'growth', 'earnings', 'institution', 'capital_flow', 'dragon_tiger', 'boards']:
    b = ctx.get(m, {}) if isinstance(ctx, dict) else {}
    s = b.get('status', '?') if isinstance(b, dict) else '?'
    errs = b.get('errors', []) if isinstance(b, dict) else []
    data = b.get('data', {}) if isinstance(b, dict) else {}
    icon = '✅' if s == 'ok' else ('⚠️' if s == 'partial' else '❌')
    extra = ''
    if errs: extra += ' | ' + errs[0][:60]
    keys = [k for k,v in data.items() if v is not None] if data else []
    if keys: extra += ' | ' + ','.join(keys[:3])
    print(f'  {icon} {m:15s} {s:14s}{extra}')
PYEOF
