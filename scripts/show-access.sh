#!/bin/bash
# ===================================
# 访问日志查看工具
# ===================================
#
# 使用方法：
#   ./scripts/show-access.sh           # 查看最近 50 条访问记录
#   ./scripts/show-access.sh -n 100    # 查看最近 100 条
#   ./scripts/show-access.sh --tail    # 实时跟踪访问日志
#   ./scripts/show-access.sh --top     # 统计访问最多的 IP
#   ./scripts/show-access.sh --404     # 只看 404 请求
#
# 依赖：
#   - Python 3（解析 JSON 日志）
#   - logs/caddy/access.log 文件存在
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
LOG_FILE="${REPO_ROOT}/logs/caddy/access.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

usage() {
    echo "访问日志查看工具"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -n <数量>     显示最近 N 条记录（默认 50）"
    echo "  --tail, -f    实时跟踪模式（类似 tail -f）"
    echo "  --top         统计访问最多的 IP（默认 Top 20）"
    echo "  --404         仅显示 404 请求"
    echo "  --error       仅显示 4xx/5xx 错误请求"
    echo "  --path <路径>  过滤指定路径（如 /api/v1）"
    echo "  -h, --help    显示帮助"
    echo ""
    echo "示例:"
    echo "  $0                    # 最近 50 条"
    echo "  $0 -n 100             # 最近 100 条"
    echo "  $0 -f                 # 实时跟踪"
    echo "  $0 --top              # IP 排行"
    echo "  $0 --404              # 只看 404"
    echo "  $0 --path /api/v1     # 只看 API 请求"
}

# 检查日志文件是否存在
check_log() {
    if [ ! -f "$LOG_FILE" ]; then
        echo -e "${RED}[ERROR]${NC} 日志文件不存在: $LOG_FILE"
        echo ""
        echo "请确保："
        echo "  1. Docker 服务已启动: docker-compose -f ./docker/docker-compose.yml up -d"
        echo "  2. Caddy 已运行并产生访问日志"
        echo "  3. docker-compose.yml 中已配置 logs/caddy 卷映射"
        exit 1
    fi
}

# 打印表头
print_header() {
    echo -e "${BOLD}$(printf "%-18s  %-20s  %-6s  %-7s  %s" "IP" "时间" "方法" "状态" "路径")${NC}"
    echo "------------------------------------------------------------------------------------"
}

# Python 解析脚本：显示记录
parse_log() {
    local limit="$1"
    local mode="$2"   # '' = normal, 'tail' = tail mode
    local filter_path="$3"
    local filter_404="$4"
    local filter_error="$5"

    local filter_code=""
    if [ "$filter_404" = "true" ]; then
        filter_code="d['status'] == 404"
    elif [ "$filter_error" = "true" ]; then
        filter_code="d['status'] >= 400"
    fi

    local path_filter=""
    if [ -n "$filter_path" ]; then
        path_filter="and '$filter_path' in d['request']['uri']"
    fi

    python3 << PYEOF
import sys, json

lines = sys.stdin.readlines()
if not lines:
    print("(暂无访问记录)")
    sys.exit(0)

entries = []
for line in lines:
    line = line.strip()
    if not line:
        continue
    try:
        d = json.loads(line)
        ip = d.get('request', {}).get('remote_ip', d.get('request', {}).get('remote_addr', '?'))
        ts_raw = d.get('ts', '')
        # 截取时间到秒
        if ts_raw:
            try:
                # ts format: "2026-06-25T12:34:56.789Z"
                ts = ts_raw[:19].replace('T', ' ')
            except:
                ts = ts_raw[:19]
        else:
            ts = '?'
        method = d.get('request', {}).get('method', '?')
        uri = d.get('request', {}).get('uri', '?')
        status = d.get('status', 0)
        entries.append({'ip': ip, 'ts': ts, 'method': method, 'uri': uri, 'status': status})
    except json.JSONDecodeError:
        pass

filtered = entries
$([ "$filter_code" != "" ] && echo "filtered = [e for e in entries if $filter_code $path_filter]")
$([ -z "$filter_code" ] && [ -n "$filter_path" ] && echo "filtered = [e for e in entries if '$filter_path' in e['uri']]")

# Take last N
filtered = filtered[-$limit:] if len(filtered) > $limit else filtered

for e in filtered:
    color = ''
    if e['status'] >= 500:
        color = '\033[0;31m'  # red
    elif e['status'] >= 400:
        color = '\033[1;33m'  # yellow
    elif e['status'] >= 200:
        color = '\033[0;32m'  # green
    reset = '\033[0m'
    print(f"{e['ip']:<18}  {e['ts']:<20}  {e['method']:<6}  {color}{e['status']:>3}{reset}    {e['uri']}")
PYEOF
}

# Python 解析脚本：TOP IP
show_top_ips() {
    python3 << 'PYEOF'
import sys, json
from collections import Counter

ips = Counter()
lines = sys.stdin.readlines()
for line in lines:
    line = line.strip()
    if not line:
        continue
    try:
        d = json.loads(line)
        ip = d.get('request', {}).get('remote_ip', d.get('request', {}).get('remote_addr', '?'))
        ips[ip] += 1
    except json.JSONDecodeError:
        pass

if not ips:
    print("(暂无访问记录)")
    sys.exit(0)

total = sum(ips.values())
print(f"{'排名':<5} {'IP':<20} {'访问次数':<10} {'占比':<8}")
print("-" * 50)
for idx, (ip, count) in enumerate(ips.most_common(20), 1):
    pct = count / total * 100 if total > 0 else 0
    bar = '█' * max(1, int(pct / 2))
    print(f"{idx:<5} {ip:<20} {count:<10} {pct:5.1f}%  {bar}")
print("-" * 50)
print(f"独立 IP 总数: {len(ips)}  |  总请求数: {total}")
PYEOF
}

# ==================== 主程序 ====================

main() {
    check_log

    local limit=50
    local mode=""
    local filter_path=""
    local filter_404="false"
    local filter_error="false"
    local tail_mode="false"

    while [ $# -gt 0 ]; do
        case "$1" in
            -n)
                shift
                limit="$1"
                shift
                ;;
            --tail|-f)
                tail_mode="true"
                shift
                ;;
            --top)
                mode="top"
                shift
                ;;
            --404)
                filter_404="true"
                shift
                ;;
            --error)
                filter_error="true"
                shift
                ;;
            --path)
                shift
                filter_path="$1"
                shift
                ;;
            -h|--help|help)
                usage
                exit 0
                ;;
            *)
                echo -e "${RED}[ERROR]${NC} 未知参数: $1"
                usage
                exit 1
                ;;
        esac
    done

    if [ "$tail_mode" = "true" ]; then
        echo -e "${CYAN}实时跟踪访问日志 (Ctrl+C 退出)...${NC}"
        echo ""
        print_header
        # Get initial lines count to tail from there
        local init_lines=$(wc -l < "$LOG_FILE" 2>/dev/null || echo 0)
        # Show recent history first
        if [ "$init_lines" -gt 0 ]; then
            tail -n "$limit" "$LOG_FILE" | parse_log "$limit" "" "$filter_path" "$filter_404" "$filter_error"
        fi
        echo -e "${CYAN}--- 等待新请求... ---${NC}"
        exec tail -n 0 -f "$LOG_FILE" | parse_log "999999" "tail" "$filter_path" "$filter_404" "$filter_error"
    elif [ "$mode" = "top" ]; then
        echo -e "${BOLD}=== 访问 IP 排行 (Top 20) ===${NC}"
        echo ""
        cat "$LOG_FILE" | show_top_ips
    else
        local desc="最近 $limit 条"
        [ "$filter_404" = "true" ] && desc="$desc (仅 404)"
        [ "$filter_error" = "true" ] && desc="$desc (仅错误)"
        [ -n "$filter_path" ] && desc="$desc (路径: $filter_path)"
        echo -e "${BOLD}=== $desc ===${NC}"
        echo ""
        print_header
        tail -n "$limit" "$LOG_FILE" | parse_log "$limit" "" "$filter_path" "$filter_404" "$filter_error"
    fi
}

main "$@"
