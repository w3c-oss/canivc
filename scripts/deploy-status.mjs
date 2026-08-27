#!/usr/bin/env node
// Reports the Cloudflare Pages build status and logs for the currently
// checked out git branch. See DELPOY.md for the underlying API.
import {execFileSync} from 'node:child_process';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ??
  '421b5cd79fe829ed9ffea49c38b4be4a';
const PROJECT_ID = process.env.CLOUDFLARE_PROJECT_ID ?? 'canivc';
const API_BASE = 'https://api.cloudflare.com/client/v4';

function git(args) {
  return execFileSync('git', args, {encoding: 'utf8'}).trim();
}

async function cloudflareFetch(path, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });
  const body = await response.json();
  if(!response.ok || !body.success) {
    const errors = (body.errors ?? []).map(e => e.message).join('; ');
    throw new Error(
      `Cloudflare API request to ${path} failed: ` +
      `${response.status} ${errors || response.statusText}`);
  }
  return body.result;
}

function printStages(stages) {
  for(const stage of stages) {
    const duration = (stage.started_on && stage.ended_on) ?
      `${((new Date(stage.ended_on) - new Date(stage.started_on)) / 1000)
        .toFixed(1)}s` : '';
    console.log(`  ${stage.name.padEnd(10)} ${stage.status.padEnd(8)} ${
      duration}`);
  }
}

async function main() {
  const token = process.env.CLOUDFLARE_TOKEN;
  if(!token) {
    console.error('Error: CLOUDFLARE_TOKEN environment variable is required.');
    process.exitCode = 1;
    return;
  }

  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const commit = git(['rev-parse', 'HEAD']);

  const deployments = await cloudflareFetch(
    `/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_ID}/deployments`,
    token);

  const forBranch = deployments.filter(
    d => d.deployment_trigger?.metadata?.branch === branch);
  if(forBranch.length === 0) {
    console.error(`No Cloudflare Pages deployments found for branch "${
      branch}".`);
    process.exitCode = 1;
    return;
  }

  const deployment = forBranch.find(
    d => d.deployment_trigger?.metadata?.commit_hash === commit) ??
    forBranch[0];

  if(deployment.deployment_trigger?.metadata?.commit_hash !== commit) {
    console.log(`Note: local HEAD (${commit.slice(0, 7)}) has no matching ` +
      `deployment yet; showing the most recent deployment for "${
        branch}" instead.\n`);
  }

  console.log(`Branch:      ${branch}`);
  console.log(`Commit:      ${
    deployment.deployment_trigger?.metadata?.commit_hash}`);
  console.log(`Deployment:  ${deployment.id}`);
  console.log(`Environment: ${deployment.environment}`);
  console.log(`URL:         ${deployment.url}`);
  console.log(`Status:      ${deployment.latest_stage.status} (${
    deployment.latest_stage.name})`);
  console.log('Stages:');
  printStages(deployment.stages);

  console.log('\nLogs:');
  const logs = await cloudflareFetch(
    `/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_ID}/deployments/${
      deployment.id}/history/logs`,
    token);
  for(const entry of logs.data) {
    console.log(`[${entry.ts}] ${entry.line}`);
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
