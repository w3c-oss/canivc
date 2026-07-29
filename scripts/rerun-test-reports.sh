#!/usr/bin/env bash
# Copyright 2026 Digital Bazaar, Inc.
#
# SPDX-License-Identifier: BSD-3-Clause
#
# Triggers a fresh run of the "Generate Interop Report" (or similarly named)
# GitHub Actions workflow for each VC test suite repo, via `gh workflow run`
# (a thin wrapper around POST /repos/{owner}/{repo}/actions/workflows/{id}/dispatches).
# Each of these workflows normally only runs on a weekly schedule; this lets
# you kick off an ad-hoc re-run without clicking through the GitHub UI.
#
# Requires: GitHub CLI (`gh`), authenticated with the `workflow` scope.
#
# Usage:
#   scripts/rerun-test-reports.sh              # rerun all known report suites
#   scripts/rerun-test-reports.sh REPO [REPO…] # rerun only the named suite(s)
#   scripts/rerun-test-reports.sh --list        # list known suites and exit
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

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

if [[ "${1:-}" == "--list" ]]; then
  for name in "${!SUITES[@]}"; do
    echo "$name"
  done | sort
  exit 0
fi

# resolve args (or all suites) to a list of short names
targets=()
if [[ $# -eq 0 ]]; then
  targets=("${!SUITES[@]}")
else
  for arg in "$@"; do
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

status=0
for name in "${targets[@]}"; do
  IFS=':' read -r repo workflow ref <<<"${SUITES[$name]}"
  echo "==> $repo ($workflow @ $ref)"
  if gh workflow run "$workflow" --repo "$repo" --ref "$ref"; then
    echo "    triggered. recent runs:"
    gh run list --repo "$repo" --workflow "$workflow" --limit 1
  else
    echo "    failed to trigger run for $repo" >&2
    status=1
  fi
done

exit "$status"
