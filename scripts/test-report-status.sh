#!/usr/bin/env bash
# Copyright 2026 Digital Bazaar, Inc.
#
# SPDX-License-Identifier: BSD-3-Clause
#
# Reports the status of the most recent "Generate Interop Report" (or
# similarly named) GitHub Actions workflow run for each VC test suite repo,
# via `gh run list`. Use this to check whether the last scheduled (or
# manually triggered, e.g. via rerun-test-reports.sh) run succeeded without
# clicking through the GitHub UI.
#
# Requires: GitHub CLI (`gh`), authenticated. `jq` is used for --json output.
#
# Usage:
#   scripts/test-report-status.sh              # status of all known report suites
#   scripts/test-report-status.sh REPO [REPO…] # status of only the named suite(s)
#   scripts/test-report-status.sh --list        # list known suites and exit
#   scripts/test-report-status.sh --json        # emit raw JSON instead of a table
#
# REPO may be given as the short name (e.g. "vc-di-ecdsa-test-suite") or the
# full "owner/repo" form.

set -euo pipefail

# short-name -> "owner/repo:workflow-file:ref"
declare -A SUITES=(
  [vc-di-ecdsa-test-suite]="w3c/vc-di-ecdsa-test-suite:main.yml:main"
  [vc-di-eddsa-test-suite]="w3c/vc-di-eddsa-test-suite:main.yml:main"
  [vc-di-ed25519signature2020-test-suite]="w3c/vc-di-ed25519signature2020-test-suite:main.yml:main"
  [vc-di-bbs-test-suite]="w3c/vc-di-bbs-test-suite:main.yml:main"
  [vc-bitstring-status-list-test-suite]="w3c/vc-bitstring-status-list-test-suite:main.yml:main"
  [vc-data-model-2.0-test-suite]="w3c/vc-data-model-2.0-test-suite:main.yml:main"
)

usage() {
  grep '^#' "$0" | sed -n '2,$p' | sed 's/^# \{0,1\}//'
}

if ! command -v gh >/dev/null 2>&1; then
  echo "error: GitHub CLI ('gh') is required but not found in PATH" >&2
  exit 1
fi

json_out=0
args=()
for arg in "$@"; do
  case "$arg" in
    --help|-h)
      usage
      exit 0
      ;;
    --list)
      for name in "${!SUITES[@]}"; do
        echo "$name"
      done | sort
      exit 0
      ;;
    --json)
      json_out=1
      ;;
    *)
      args+=("$arg")
      ;;
  esac
done

if [[ "$json_out" -eq 1 ]] && ! command -v jq >/dev/null 2>&1; then
  echo "error: 'jq' is required for --json output but not found in PATH" >&2
  exit 1
fi

# resolve args (or all suites) to a list of short names
targets=()
if [[ ${#args[@]} -eq 0 ]]; then
  targets=("${!SUITES[@]}")
else
  for arg in "${args[@]}"; do
    short="${arg##*/}"
    if [[ -n "${SUITES[$short]:-}" ]]; then
      targets+=("$short")
    else
      echo "error: unknown test suite '$arg' (see --list)" >&2
      exit 1
    fi
  done
fi

# stable ordering
IFS=$'\n' targets=($(sort <<<"${targets[*]}")); unset IFS

run_fields="status,conclusion,createdAt,updatedAt,displayTitle,url,headBranch"

# colors (disabled when not a tty or when emitting JSON)
if [[ -t 1 && "$json_out" -eq 0 ]]; then
  c_green=$'\033[32m'; c_red=$'\033[31m'; c_yellow=$'\033[33m'; c_dim=$'\033[2m'; c_reset=$'\033[0m'
else
  c_green=""; c_red=""; c_yellow=""; c_dim=""; c_reset=""
fi

status=0
json_results=()

for name in "${targets[@]}"; do
  IFS=':' read -r repo workflow ref <<<"${SUITES[$name]}"

  run_json="$(gh run list --repo "$repo" --workflow "$workflow" --branch "$ref" \
    --limit 1 --json "$run_fields" 2>/dev/null || echo '[]')"

  if [[ "$json_out" -eq 1 ]]; then
    entry="$(echo "$run_json" | jq --arg name "$name" --arg repo "$repo" \
      '.[0] // {} | . + {suite: $name, repo: $repo}')"
    json_results+=("$entry")
    continue
  fi

  if [[ "$run_json" == "[]" ]]; then
    echo "${c_yellow}==> $name ($repo)${c_reset}"
    echo "    no runs found"
    status=1
    continue
  fi

  run_status="$(echo "$run_json" | jq -r '.[0].status')"
  conclusion="$(echo "$run_json" | jq -r '.[0].conclusion')"
  updated="$(echo "$run_json" | jq -r '.[0].updatedAt')"
  url="$(echo "$run_json" | jq -r '.[0].url')"

  case "$conclusion" in
    success) color="$c_green"; label="success" ;;
    failure|timed_out|startup_failure) color="$c_red"; label="$conclusion"; status=1 ;;
    cancelled|skipped|neutral|action_required) color="$c_yellow"; label="$conclusion" ;;
    *)
      if [[ "$run_status" == "in_progress" || "$run_status" == "queued" || "$run_status" == "waiting" ]]; then
        color="$c_yellow"; label="$run_status"
      else
        color="$c_dim"; label="${conclusion:-unknown}"
      fi
      ;;
  esac

  echo "${color}==> $name ($repo): $label${c_reset}"
  echo "    updated: $updated"
  echo "    ${c_dim}$url${c_reset}"
done

if [[ "$json_out" -eq 1 ]]; then
  printf '%s\n' "${json_results[@]}" | jq -s '.'
fi

exit "$status"
