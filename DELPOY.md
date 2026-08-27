# Cloudflare Pages Deployment & Debugging

canivc.com is deployed via Cloudflare Pages and Pull Requests are given
previews.

However, the deploy logs are only available via the Cloudflare Dashboard or the
Cloudflare API.

Consequently, they do not show up on GitHub when a build fails.

# Checking status from the command line

[scripts/deploy-status.mjs](scripts/deploy-status.mjs) wraps the endpoints
below. Run it from a checked out branch to see that branch's latest deploy
status and logs, without going to the Cloudflare Dashboard:

```sh
CLOUDFLARE_TOKEN=<api-token> npm run deploy:status
```

- `CLOUDFLARE_TOKEN` (required) — a Cloudflare API token with Pages read
  access, sent as `Authorization: Bearer` on every request.
- Matches the deployment for the current git branch and commit; if HEAD
  hasn't been built yet, it falls back to the branch's most recent deployment
  and says so.
- `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_PROJECT_ID` can override the defaults
  below if this is ever reused for another project.

## Logs API Endpoints

All URLs need the following values:
ACCOUNT_ID = '421b5cd79fe829ed9ffea49c38b4be4a'
PROJECT_ID = 'canivc'

A `GET` request to the deployments list is URL...
https://api.cloudflare.com/client/v4/accounts/421b5cd79fe829ed9ffea49c38b4be4a/pages/projects/canivc/deployments

...results in the following payload:

```json
{
  "result": [
    {
      "id": "6e3190c4-22a5-437a-ad0c-a35635789447",
      "short_id": "6e3190c4",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://6e3190c4.canivc-bm1.pages.dev",
      "created_on": "2026-08-27T17:54:53.746009Z",
      "modified_on": "2026-08-27T17:55:38.754515Z",
      "latest_stage": {
        "name": "build",
        "started_on": "2026-08-27T17:54:59.202022Z",
        "ended_on": "2026-08-27T17:55:38.754515Z",
        "status": "failure"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "add-suite-run-scripts",
          "commit_hash": "e7f6445ac1fb2ad89bdaed5fcda89606f7fa3ece",
          "commit_message": "Add scripts to rerun test suites and check status.",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-08-27T17:54:53.931503Z",
          "ended_on": "2026-08-27T17:54:53.93675Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-08-27T17:54:53.93675Z",
          "ended_on": "2026-08-27T17:54:57.040771Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-08-27T17:54:57.040771Z",
          "ended_on": "2026-08-27T17:54:59.202022Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-08-27T17:54:59.202022Z",
          "ended_on": "2026-08-27T17:55:38.754515Z",
          "status": "failure"
        },
        {
          "name": "deploy",
          "started_on": null,
          "ended_on": null,
          "status": "idle"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": null
    },
    {
      "id": "ab5adefe-d7ab-4657-b0d0-da1a523bca96",
      "short_id": "ab5adefe",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://ab5adefe.canivc-bm1.pages.dev",
      "created_on": "2026-08-26T20:37:55.472387Z",
      "modified_on": "2026-08-26T20:38:34.041644Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-08-26T20:38:26.852685Z",
        "ended_on": "2026-08-26T20:38:34.041644Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "local-reports",
          "commit_hash": "fa8e4b44701d23d50d0bee5c73eb29eb1df352c8",
          "commit_message": "Add option to build site from local reports.",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-08-26T20:37:55.663462Z",
          "ended_on": "2026-08-26T20:37:55.667887Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-08-26T20:37:55.667887Z",
          "ended_on": "2026-08-26T20:37:59.945431Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-08-26T20:37:59.945431Z",
          "ended_on": "2026-08-26T20:38:02.243143Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-08-26T20:38:02.243143Z",
          "ended_on": "2026-08-26T20:38:26.852685Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-08-26T20:38:26.852685Z",
          "ended_on": "2026-08-26T20:38:34.041644Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": [
        "https://local-reports.canivc-bm1.pages.dev"
      ],
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "5b5fa37a-a236-4fe8-a6ea-45ea69a13e93",
      "short_id": "5b5fa37a",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "production",
      "url": "https://5b5fa37a.canivc-bm1.pages.dev",
      "created_on": "2026-08-23T17:00:27.369137Z",
      "modified_on": "2026-08-23T17:01:03.490739Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-08-23T17:00:55.343916Z",
        "ended_on": "2026-08-23T17:01:03.490739Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "deploy_hook",
        "metadata": {
          "branch": "main",
          "commit_hash": "c4065f204a7e1ae4034f23eec125e366623d44d1",
          "commit_message": "Update site title from 'Can I Credential?' to 'Can I VC?'",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-08-23T17:00:27.549045Z",
          "ended_on": "2026-08-23T17:00:27.557119Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-08-23T17:00:27.557119Z",
          "ended_on": "2026-08-23T17:00:31.210899Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-08-23T17:00:31.210899Z",
          "ended_on": "2026-08-23T17:00:33.433159Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-08-23T17:00:33.433159Z",
          "ended_on": "2026-08-23T17:00:55.343916Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-08-23T17:00:55.343916Z",
          "ended_on": "2026-08-23T17:01:03.490739Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": [
        "https://canivc.com",
        "https://www.canivc.com"
      ],
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "3e91911c-6fbd-4d17-8ee0-efada4d5e012",
      "short_id": "3e91911c",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "production",
      "url": "https://3e91911c.canivc-bm1.pages.dev",
      "created_on": "2026-08-16T17:00:38.786447Z",
      "modified_on": "2026-08-16T17:01:04.979419Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-08-16T17:00:55.962848Z",
        "ended_on": "2026-08-16T17:01:04.979419Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "deploy_hook",
        "metadata": {
          "branch": "main",
          "commit_hash": "c4065f204a7e1ae4034f23eec125e366623d44d1",
          "commit_message": "Update site title from 'Can I Credential?' to 'Can I VC?'",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-08-16T17:00:38.960781Z",
          "ended_on": "2026-08-16T17:00:38.964685Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-08-16T17:00:38.964685Z",
          "ended_on": "2026-08-16T17:00:41.544143Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-08-16T17:00:41.544143Z",
          "ended_on": "2026-08-16T17:00:42.930923Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-08-16T17:00:42.930923Z",
          "ended_on": "2026-08-16T17:00:55.962848Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-08-16T17:00:55.962848Z",
          "ended_on": "2026-08-16T17:01:04.979419Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "30061a12-750f-43a5-abd4-2cc6c0dc3962",
      "short_id": "30061a12",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "production",
      "url": "https://30061a12.canivc-bm1.pages.dev",
      "created_on": "2026-08-09T17:00:43.731197Z",
      "modified_on": "2026-08-09T17:01:08.046228Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-08-09T17:01:01.455304Z",
        "ended_on": "2026-08-09T17:01:08.046228Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "deploy_hook",
        "metadata": {
          "branch": "main",
          "commit_hash": "c4065f204a7e1ae4034f23eec125e366623d44d1",
          "commit_message": "Update site title from 'Can I Credential?' to 'Can I VC?'",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-08-09T17:00:43.901842Z",
          "ended_on": "2026-08-09T17:00:43.907705Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-08-09T17:00:43.907705Z",
          "ended_on": "2026-08-09T17:00:45.555206Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-08-09T17:00:45.555206Z",
          "ended_on": "2026-08-09T17:00:46.785139Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-08-09T17:00:46.785139Z",
          "ended_on": "2026-08-09T17:01:01.455304Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-08-09T17:01:01.455304Z",
          "ended_on": "2026-08-09T17:01:08.046228Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "b0023fa4-ff83-4de8-b881-78d659404194",
      "short_id": "b0023fa4",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "production",
      "url": "https://b0023fa4.canivc-bm1.pages.dev",
      "created_on": "2026-08-02T17:00:43.393742Z",
      "modified_on": "2026-08-02T17:01:12.943999Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-08-02T17:01:05.483676Z",
        "ended_on": "2026-08-02T17:01:12.943999Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "deploy_hook",
        "metadata": {
          "branch": "main",
          "commit_hash": "c4065f204a7e1ae4034f23eec125e366623d44d1",
          "commit_message": "Update site title from 'Can I Credential?' to 'Can I VC?'",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-08-02T17:00:43.539702Z",
          "ended_on": "2026-08-02T17:00:43.543671Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-08-02T17:00:43.543671Z",
          "ended_on": "2026-08-02T17:00:46.156047Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-08-02T17:00:46.156047Z",
          "ended_on": "2026-08-02T17:00:47.563171Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-08-02T17:00:47.563171Z",
          "ended_on": "2026-08-02T17:01:05.483676Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-08-02T17:01:05.483676Z",
          "ended_on": "2026-08-02T17:01:12.943999Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "9cabc07a-7ef3-43a1-86ce-440e43bda859",
      "short_id": "9cabc07a",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "production",
      "url": "https://9cabc07a.canivc-bm1.pages.dev",
      "created_on": "2026-07-30T19:01:49.816453Z",
      "modified_on": "2026-07-30T19:02:16.120583Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-07-30T19:02:09.792093Z",
        "ended_on": "2026-07-30T19:02:16.120583Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "main",
          "commit_hash": "c4065f204a7e1ae4034f23eec125e366623d44d1",
          "commit_message": "Update site title from 'Can I Credential?' to 'Can I VC?'",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-30T19:01:49.972873Z",
          "ended_on": "2026-07-30T19:01:49.980468Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-30T19:01:49.980468Z",
          "ended_on": "2026-07-30T19:01:53.108195Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-30T19:01:53.108195Z",
          "ended_on": "2026-07-30T19:01:54.549413Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-30T19:01:54.549413Z",
          "ended_on": "2026-07-30T19:02:09.792093Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-07-30T19:02:09.792093Z",
          "ended_on": "2026-07-30T19:02:16.120583Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "39a15d8a-cc8d-4cd7-a24b-1a8cb312edd6",
      "short_id": "39a15d8a",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://39a15d8a.canivc-bm1.pages.dev",
      "created_on": "2026-07-30T19:00:21.774289Z",
      "modified_on": "2026-07-30T19:00:51.410082Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-07-30T19:00:43.194537Z",
        "ended_on": "2026-07-30T19:00:51.410082Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "update-site-title",
          "commit_hash": "59286d42f2f492a297001f1264363cb677b3f9ca",
          "commit_message": "Update site title from 'Can I Credential?' to 'Can I VC?'",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-30T19:00:22.036979Z",
          "ended_on": "2026-07-30T19:00:22.044708Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-30T19:00:22.044708Z",
          "ended_on": "2026-07-30T19:00:25.563196Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-30T19:00:25.563196Z",
          "ended_on": "2026-07-30T19:00:27.422963Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-30T19:00:27.422963Z",
          "ended_on": "2026-07-30T19:00:43.194537Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-07-30T19:00:43.194537Z",
          "ended_on": "2026-07-30T19:00:51.410082Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": [
        "https://update-site-title.canivc-bm1.pages.dev"
      ],
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "cb9950be-e380-4afa-a1fe-537c26ae9a62",
      "short_id": "cb9950be",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "production",
      "url": "https://cb9950be.canivc-bm1.pages.dev",
      "created_on": "2026-07-29T13:42:40.361017Z",
      "modified_on": "2026-07-29T13:43:11.222558Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-07-29T13:43:03.5988Z",
        "ended_on": "2026-07-29T13:43:11.222558Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "main",
          "commit_hash": "4645e04466f888e534e933137dc86556d324e11b",
          "commit_message": "Update README.md",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-29T13:42:40.497958Z",
          "ended_on": "2026-07-29T13:42:40.499791Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-29T13:42:40.499791Z",
          "ended_on": "2026-07-29T13:42:43.291033Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-29T13:42:43.291033Z",
          "ended_on": "2026-07-29T13:42:45.368889Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-29T13:42:45.368889Z",
          "ended_on": "2026-07-29T13:43:03.5988Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-07-29T13:43:03.5988Z",
          "ended_on": "2026-07-29T13:43:11.222558Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "4ba24406-bb16-4720-be25-2a57ed610ca9",
      "short_id": "4ba24406",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://4ba24406.canivc-bm1.pages.dev",
      "created_on": "2026-07-29T13:38:23.083976Z",
      "modified_on": "2026-07-29T13:39:06.455512Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-07-29T13:39:00.16243Z",
        "ended_on": "2026-07-29T13:39:06.455512Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "ianbjacobs-patch-1",
          "commit_hash": "bd636b49d72ad303735b38fca00a702168c0b864",
          "commit_message": "Update README.md",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-29T13:38:23.223008Z",
          "ended_on": "2026-07-29T13:38:23.22494Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-29T13:38:23.22494Z",
          "ended_on": "2026-07-29T13:38:28.77256Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-29T13:38:28.77256Z",
          "ended_on": "2026-07-29T13:38:29.877159Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-29T13:38:29.877159Z",
          "ended_on": "2026-07-29T13:39:00.16243Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-07-29T13:39:00.16243Z",
          "ended_on": "2026-07-29T13:39:06.455512Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": [
        "https://ianbjacobs-patch-1.canivc-bm1.pages.dev"
      ],
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "b9c76304-1eed-453e-88eb-411bb30c0478",
      "short_id": "b9c76304",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://b9c76304.canivc-bm1.pages.dev",
      "created_on": "2026-07-29T13:37:58.080833Z",
      "modified_on": "2026-07-29T13:38:47.745757Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-07-29T13:38:39.039Z",
        "ended_on": "2026-07-29T13:38:47.745757Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "ianbjacobs-patch-1",
          "commit_hash": "5fd38aa56d687e6071f93cf9498f28e7a32c5f6c",
          "commit_message": "Update README.md",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-29T13:37:58.204807Z",
          "ended_on": "2026-07-29T13:37:58.206052Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-29T13:37:58.206052Z",
          "ended_on": "2026-07-29T13:38:02.519807Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-29T13:38:02.519807Z",
          "ended_on": "2026-07-29T13:38:04.880641Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-29T13:38:04.880641Z",
          "ended_on": "2026-07-29T13:38:39.039Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-07-29T13:38:39.039Z",
          "ended_on": "2026-07-29T13:38:47.745757Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "56c0837f-8414-4e4b-bf51-9494e16318d5",
      "short_id": "56c0837f",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://56c0837f.canivc-bm1.pages.dev",
      "created_on": "2026-07-29T13:36:20.218909Z",
      "modified_on": "2026-07-29T13:37:22.968115Z",
      "latest_stage": {
        "name": "build",
        "started_on": "2026-07-29T13:36:24.112948Z",
        "ended_on": "2026-07-29T13:37:22.968115Z",
        "status": "failure"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "add-suite-run-scripts",
          "commit_hash": "e7f6445ac1fb2ad89bdaed5fcda89606f7fa3ece",
          "commit_message": "Add scripts to rerun test suites and check status.",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-29T13:36:20.353076Z",
          "ended_on": "2026-07-29T13:36:20.359149Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-29T13:36:20.359149Z",
          "ended_on": "2026-07-29T13:36:22.781395Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-29T13:36:22.781395Z",
          "ended_on": "2026-07-29T13:36:24.112948Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-29T13:36:24.112948Z",
          "ended_on": "2026-07-29T13:37:22.968115Z",
          "status": "failure"
        },
        {
          "name": "deploy",
          "started_on": null,
          "ended_on": null,
          "status": "idle"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": null
    },
    {
      "id": "76ceaadf-7574-4c34-810e-645a7cbe2e37",
      "short_id": "76ceaadf",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://76ceaadf.canivc-bm1.pages.dev",
      "created_on": "2026-07-29T13:32:30.814156Z",
      "modified_on": "2026-07-29T13:33:16.455077Z",
      "latest_stage": {
        "name": "build",
        "started_on": "2026-07-29T13:32:38.201606Z",
        "ended_on": "2026-07-29T13:33:16.455077Z",
        "status": "failure"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "add-suite-run-scripts",
          "commit_hash": "5dfd70b77f6e6f938d908e965c628262ce860688",
          "commit_message": "Add scripts to rerun test suites and check status.",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-29T13:32:30.966176Z",
          "ended_on": "2026-07-29T13:32:30.96941Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-29T13:32:30.96941Z",
          "ended_on": "2026-07-29T13:32:36.744976Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-29T13:32:36.744976Z",
          "ended_on": "2026-07-29T13:32:38.201606Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-29T13:32:38.201606Z",
          "ended_on": "2026-07-29T13:33:16.455077Z",
          "status": "failure"
        },
        {
          "name": "deploy",
          "started_on": null,
          "ended_on": null,
          "status": "idle"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": null
    },
    {
      "id": "bcd1da4c-3c75-4d29-85b8-d24db9897286",
      "short_id": "bcd1da4c",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "preview",
      "url": "https://bcd1da4c.canivc-bm1.pages.dev",
      "created_on": "2026-07-28T22:14:40.476512Z",
      "modified_on": "2026-07-28T22:15:15.910219Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-07-28T22:15:07.686408Z",
        "ended_on": "2026-07-28T22:15:15.910219Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "github:push",
        "metadata": {
          "branch": "ianbjacobs-patch-1",
          "commit_hash": "d239ab27afcba0ff4eef9351e29bafcc3877b833",
          "commit_message": "Update README.md\n\n* Adjusted name of Project (per discussions)\r\n* Add comment that license may change.",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-28T22:14:40.590723Z",
          "ended_on": "2026-07-28T22:14:40.59626Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-28T22:14:40.59626Z",
          "ended_on": "2026-07-28T22:14:45.052697Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-28T22:14:45.052697Z",
          "ended_on": "2026-07-28T22:14:46.977372Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-28T22:14:46.977372Z",
          "ended_on": "2026-07-28T22:15:07.686408Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-07-28T22:15:07.686408Z",
          "ended_on": "2026-07-28T22:15:15.910219Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    },
    {
      "id": "1b668aff-a182-4ecf-8c79-fbf6da89b564",
      "short_id": "1b668aff",
      "project_id": "7b831db5-905e-45b7-9e64-74e405fe5b3f",
      "project_name": "canivc",
      "environment": "production",
      "url": "https://1b668aff.canivc-bm1.pages.dev",
      "created_on": "2026-07-28T13:49:48.242229Z",
      "modified_on": "2026-07-28T13:50:17.574945Z",
      "latest_stage": {
        "name": "deploy",
        "started_on": "2026-07-28T13:50:10.118925Z",
        "ended_on": "2026-07-28T13:50:17.574945Z",
        "status": "success"
      },
      "deployment_trigger": {
        "type": "ad_hoc",
        "metadata": {
          "branch": "main",
          "commit_hash": "1cc6f0547cb1fef57091aa042e65593f7102deb6",
          "commit_message": "Add CODEOWNERS file.",
          "commit_dirty": false
        }
      },
      "stages": [
        {
          "name": "queued",
          "started_on": "2026-07-28T13:49:48.766769Z",
          "ended_on": "2026-07-28T13:49:48.770899Z",
          "status": "success"
        },
        {
          "name": "initialize",
          "started_on": "2026-07-28T13:49:48.770899Z",
          "ended_on": "2026-07-28T13:49:51.580763Z",
          "status": "success"
        },
        {
          "name": "clone_repo",
          "started_on": "2026-07-28T13:49:51.580763Z",
          "ended_on": "2026-07-28T13:49:53.138056Z",
          "status": "success"
        },
        {
          "name": "build",
          "started_on": "2026-07-28T13:49:53.138056Z",
          "ended_on": "2026-07-28T13:50:10.118925Z",
          "status": "success"
        },
        {
          "name": "deploy",
          "started_on": "2026-07-28T13:50:10.118925Z",
          "ended_on": "2026-07-28T13:50:17.574945Z",
          "status": "success"
        }
      ],
      "build_config": {
        "build_command": "npm run build",
        "destination_dir": "_site",
        "build_caching": null,
        "root_dir": "",
        "web_analytics_tag": null,
        "web_analytics_token": null
      },
      "source": {
        "type": "github",
        "config": {
          "owner": "w3c-oss",
          "repo_name": "canivc",
          "production_branch": "main",
          "pr_comments_enabled": false
        }
      },
      "env_vars": {},
      "compatibility_date": "2026-07-28",
      "compatibility_flags": [],
      "build_image_major_version": 3,
      "usage_model": null,
      "aliases": null,
      "is_skipped": false,
      "production_branch": "main",
      "uses_functions": false
    }
  ],
  "success": true,
  "errors": [],
  "messages": [],
  "result_info": {
    "page": 1,
    "per_page": 25,
    "count": 15,
    "total_count": 15,
    "total_pages": 1
  }
}
```

If the local branch is up-to-date with the PR (and vice-versa), the latest
local git SHA can be found in the `deployment_trigger.metadata.commit_hash`.

So, a developer should be able to find both the status of the current checked
out branch (assuming it's pushed to a PR) and be able to look up the logs for
that build by finding the build ID related to that `commit_hash` and build the
log retrieval URL (as shown below).

# Logs for a specific deployment

The `result.id` can be used with the logs endpoint at a URL like...
ttps://api.cloudflare.com/client/v4/accounts/421b5cd79fe829ed9ffea49c38b4be4a/pages/projects/canivc/deployments/3e91911c-6fbd-4d17-8ee0-efada4d5e012/history/logs

The response of which would be...

```json
{
  "result": {
    "total": 179,
    "includes_container_logs": true,
    "data": [
      {
        "ts": "2026-08-16T17:00:41.5811Z",
        "line": "Cloning repository..."
      },
      {
        "ts": "2026-08-16T17:00:42.394301Z",
        "line": "From https://github.com/w3c-oss/canivc"
      },
      {
        "ts": "2026-08-16T17:00:42.394551Z",
        "line": " * branch            c4065f204a7e1ae4034f23eec125e366623d44d1 -\u003e FETCH_HEAD"
      },
      {
        "ts": "2026-08-16T17:00:42.394599Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:42.414734Z",
        "line": "HEAD is now at c4065f2 Update site title from 'Can I Credential?' to 'Can I VC?'"
      },
      {
        "ts": "2026-08-16T17:00:42.415044Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:42.46358Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:42.463947Z",
        "line": "Using v2 root directory strategy"
      },
      {
        "ts": "2026-08-16T17:00:42.479528Z",
        "line": "Success: Finished cloning repository files"
      },
      {
        "ts": "2026-08-16T17:00:43.862588Z",
        "line": "Checking for configuration in a Wrangler configuration file (BETA)"
      },
      {
        "ts": "2026-08-16T17:00:43.862985Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:44.023933Z",
        "line": "No Wrangler configuration file found. Continuing."
      },
      {
        "ts": "2026-08-16T17:00:44.243008Z",
        "line": "Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0"
      },
      {
        "ts": "2026-08-16T17:00:44.243472Z",
        "line": "Installing project dependencies: npm clean-install --progress=false"
      },
      {
        "ts": "2026-08-16T17:00:47.310319Z",
        "line": "npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead"
      },
      {
        "ts": "2026-08-16T17:00:47.803974Z",
        "line": "npm warn deprecated uuid@8.3.2: uuid@10 and below is no longer supported.  For ESM codebases, update to uuid@latest.  For CommonJS codebases, use uuid@11 (but be aware this version will likely be deprecated in 2028)."
      },
      {
        "ts": "2026-08-16T17:00:50.383147Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:50.383449Z",
        "line": "added 362 packages, and audited 363 packages in 6s"
      },
      {
        "ts": "2026-08-16T17:00:50.383563Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:50.383619Z",
        "line": "98 packages are looking for funding"
      },
      {
        "ts": "2026-08-16T17:00:50.383672Z",
        "line": "  run `npm fund` for details"
      },
      {
        "ts": "2026-08-16T17:00:50.395682Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:50.396153Z",
        "line": "11 vulnerabilities (8 moderate, 3 high)"
      },
      {
        "ts": "2026-08-16T17:00:50.396217Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:50.396266Z",
        "line": "To address issues that do not require attention, run:"
      },
      {
        "ts": "2026-08-16T17:00:50.396317Z",
        "line": "  npm audit fix"
      },
      {
        "ts": "2026-08-16T17:00:50.396361Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:50.396402Z",
        "line": "Some issues need review, and may require choosing"
      },
      {
        "ts": "2026-08-16T17:00:50.396511Z",
        "line": "a different dependency."
      },
      {
        "ts": "2026-08-16T17:00:50.396574Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:50.396613Z",
        "line": "Run `npm audit` for details."
      },
      {
        "ts": "2026-08-16T17:00:50.446935Z",
        "line": "Executing user command: npm run build"
      },
      {
        "ts": "2026-08-16T17:00:50.727217Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:50.727488Z",
        "line": "\u003e canivc@0.0.0 build"
      },
      {
        "ts": "2026-08-16T17:00:50.727603Z",
        "line": "\u003e eleventy"
      },
      {
        "ts": "2026-08-16T17:00:50.727718Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:53.036019Z",
        "line": "[11ty] Writing ./_site/implementations/aca-py/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.037358Z",
        "line": "[11ty] Writing ./_site/issuers/index.html from ./src/issuers.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.038156Z",
        "line": "[11ty] Writing ./_site/index.html from ./src/index.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.038924Z",
        "line": "[11ty] Writing ./_site/implementations/index.html from ./src/implementations/index.liquid"
      },
      {
        "ts": "2026-08-16T17:00:53.039652Z",
        "line": "[11ty] Writing ./_site/verifiers/index.html from ./src/verifiers.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.040392Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.041217Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/basic-conformance/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.042263Z",
        "line": "[11ty] Writing ./_site/reports/index.html from ./src/reports/index.liquid"
      },
      {
        "ts": "2026-08-16T17:00:53.043256Z",
        "line": "[11ty] Writing ./_site/assets/documentation/results/index.html from ./src/assets/documentation/results.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.052983Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.054323Z",
        "line": "[11ty] Writing ./_site/implementations/apicatalog-com/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.055645Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/contexts/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.066032Z",
        "line": "[11ty] Writing ./_site/implementations/credenceid/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.066859Z",
        "line": "[11ty] Writing ./_site/reports/di-ed25519signature2020-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.067741Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/identifiers/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.078974Z",
        "line": "[11ty] Writing ./_site/implementations/danube-tech/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.080386Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.081129Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/types/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.099668Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.101722Z",
        "line": "[11ty] Writing ./_site/implementations/digital-bazaar-inc/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.103043Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/names-and-descriptions/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.111506Z",
        "line": "[11ty] Writing ./_site/reports/did-key-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.11244Z",
        "line": "[11ty] Writing ./_site/implementations/ewf/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.113581Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/issuer/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.122061Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-issuer-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.123274Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/credential-subject/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.124226Z",
        "line": "[11ty] Writing ./_site/implementations/gen-digital/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.13276Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-verifier-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.133738Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/validity-period/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.134606Z",
        "line": "[11ty] Writing ./_site/implementations/grotto-networking/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.140922Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.141843Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/status/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.14257Z",
        "line": "[11ty] Writing ./_site/implementations/kataru-content-vc/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.149395Z",
        "line": "[11ty] Writing ./_site/reports/vc-jose-cose-test-suite/index.html from ./src/reports/reports.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.150484Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/data-schemas/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.151366Z",
        "line": "[11ty] Writing ./_site/implementations/learncard/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.15753Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/verifiable-presentations/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.158598Z",
        "line": "[11ty] Writing ./_site/implementations/makolab/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.163898Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/enveloped-verifiable-credentials/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.164896Z",
        "line": "[11ty] Writing ./_site/implementations/mavennet/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.169439Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/enveloped-verifiable-presentations/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.170268Z",
        "line": "[11ty] Writing ./_site/implementations/netis/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.179616Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/advanced-concepts/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.181027Z",
        "line": "[11ty] Writing ./_site/implementations/opsecid/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.186512Z",
        "line": "[11ty] Writing ./_site/reports/vc2-0-test-suite/suites/algorithms/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.187382Z",
        "line": "[11ty] Writing ./_site/implementations/procivis-one-core/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.19336Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-integrity-ecdsa-rdfc-2019-issuers/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.194861Z",
        "line": "[11ty] Writing ./_site/implementations/spruceid/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.199603Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-integrity-ecdsa-rdfc-2019-verifiers-vc-1-1/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.200687Z",
        "line": "[11ty] Writing ./_site/implementations/tradeverifyd/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.204947Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-integrity-ecdsa-rdfc-2019-verifiers-vc-2-0/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.205842Z",
        "line": "[11ty] Writing ./_site/implementations/trential/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.21012Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-integrity-ecdsa-sd-2023-issuers/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.211258Z",
        "line": "[11ty] Writing ./_site/implementations/trinsic/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.217343Z",
        "line": "[11ty] Writing ./_site/implementations/vc-issuer-mock/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.218393Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-integrity-ecdsa-sd-2023-verifiers-vc-1-1/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.223531Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-integrity-ecdsa-sd-2023-verifiers-vc-2-0/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.224461Z",
        "line": "[11ty] Writing ./_site/implementations/bovine/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.229154Z",
        "line": "[11ty] Writing ./_site/implementations/decentralgabe/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.229803Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-model-verification-methods-multikey/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.235498Z",
        "line": "[11ty] Writing ./_site/implementations/dif/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.236135Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/data-model-proof-representations/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.240588Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-create-proof-ecdsa-jcs-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.241108Z",
        "line": "[11ty] Writing ./_site/implementations/digital-credentials-consortium/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.244986Z",
        "line": "[11ty] Writing ./_site/implementations/gs1-us/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.245459Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-verify-proof-ecdsa-jcs-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.254353Z",
        "line": "[11ty] Writing ./_site/implementations/owf/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.255274Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-transformation-ecdsa-jcs-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.260682Z",
        "line": "[11ty] Writing ./_site/implementations/cheqd/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.261772Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-proof-configuration-ecdsa-jcs-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.266207Z",
        "line": "[11ty] Writing ./_site/implementations/iden3/index.html from ./src/implementations/implementations.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.266867Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-proof-serialization-ecdsa-jcs-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.270876Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-create-proof-ecdsa-rdfc-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.275589Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-verify-proof-ecdsa-rdfc-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.280016Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-transformation-ecdsa-rdfc-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.285454Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-proof-configuration-ecdsa-rdfc-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.291787Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-proof-serialization-ecdsa-rdfc-2019/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.29791Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-create-base-proof-ecdsa-sd-2023/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.303281Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-base-proof-transformation-ecdsa-sd-2023/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.310978Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-base-proof-configuration/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.316674Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-base-proof-serialization-ecdsa-sd-2023/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.323887Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/algorithms-verify-derived-proof-ecdsa-sd-2023/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.327811Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/functions-selective-disclosure/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.331838Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-ecdsa-test-suite/suites/functions-ecdsa-sd-2023/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.335285Z",
        "line": "[11ty] Writing ./_site/reports/di-ed25519signature2020-test-suite/suites/data-integrity-issuer/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.339128Z",
        "line": "[11ty] Writing ./_site/reports/di-ed25519signature2020-test-suite/suites/ed25519signature2020-issuer/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.342553Z",
        "line": "[11ty] Writing ./_site/reports/di-ed25519signature2020-test-suite/suites/data-integrity-verifier/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.345704Z",
        "line": "[11ty] Writing ./_site/reports/di-ed25519signature2020-test-suite/suites/ed25519signature2020-verifier/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.348997Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/data-integrity-eddsa-rdfc-2022-issuers/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.352932Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/data-integrity-eddsa-rdfc-2022-verifiers/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.356679Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-rdfc-2022-data-model-proof-representations/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.359929Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-rdfc-2022-data-model-verification-methods/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.363232Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-jcs-2022-data-model-proof-representations/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.366826Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-jcs-2022-data-model-verification-methods/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.371143Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-jcs-2022-algorithms-transformation/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.374373Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-jcs-2022-algorithms-proof-configuration/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.379284Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-jcs-2022-algorithms-proof-serialization/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.383532Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-rdfc-2022-algorithms-transformation/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.388994Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-rdfc-2022-algorithms-proof-configuration/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.393055Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-eddsa-test-suite/suites/eddsa-rdfc-2022-algorithms-proof-serialization/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.396837Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/suites/data-integrity-bbs-2023-issuers/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.400881Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/suites/bbs-2023-issuers-vc-version-1-1/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.405236Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/suites/bbs-2023-issuers-vc-version-2-0/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.409396Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/suites/data-integrity-bbs-2023-verifiers-vc-1-1/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.413627Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/suites/data-integrity-bbs-2023-verifiers-vc-2-0/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.41758Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/suites/bbs-2023-verifiers-vc-1-1/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.421438Z",
        "line": "[11ty] Writing ./_site/reports/vc-di-bbs-test-suite/suites/bbs-2023-verifiers-vc-2-0/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.426779Z",
        "line": "[11ty] Writing ./_site/reports/did-key-test-suite/suites/did-key-create-operation/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.430181Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-issuer-test-suite/suites/issue-credential-data-integrity/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.434224Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-issuer-test-suite/suites/issue-credential-jwt/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.438064Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-verifier-test-suite/suites/verify-credential-data-integrity/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.443449Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-verifier-test-suite/suites/verify-credential-jwt/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.447023Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-verifier-test-suite/suites/verify-presentation-data-integrity/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.450976Z",
        "line": "[11ty] Writing ./_site/reports/vc-api-verifier-test-suite/suites/verify-presentation-jwt/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.455097Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/suites/data-model-bitstringstatuslist-entry/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.458654Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/suites/data-model-bitstringstatuslist-credential/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.462578Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/suites/algorithm/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.466811Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/suites/algorithm-generate-algorithm/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.470674Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/suites/algorithm-validate-algorithm/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.47612Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/suites/algorithm-bitstring-generation-algorithm/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.481306Z",
        "line": "[11ty] Writing ./_site/reports/vc-bitstring-status-list-test-suite/suites/algorithm-bitstring-expansion-algorithm/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.484675Z",
        "line": "[11ty] Writing ./_site/reports/vc-jose-cose-test-suite/suites/jose-tests/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.488263Z",
        "line": "[11ty] Writing ./_site/reports/vc-jose-cose-test-suite/suites/sd-jwt-tests/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:53.492044Z",
        "line": "[11ty] Writing ./_site/reports/vc-jose-cose-test-suite/suites/cose-tests/index.html from ./src/reports/suites.md (liquid)"
      },
      {
        "ts": "2026-08-16T17:00:54.060669Z",
        "line": "[11ty] Copied 16 Wrote 124 files in 3.00 seconds (24.2ms each, v3.1.6)"
      },
      {
        "ts": "2026-08-16T17:00:54.061802Z",
        "line": "[11ty] Benchmark    365ms  12%     1├ù (Data) `./src/_data/implementations.js`"
      },
      {
        "ts": "2026-08-16T17:00:54.062076Z",
        "line": "[11ty] Benchmark    561ms  19%     1├ù (Data) `./src/_data/results.js`"
      },
      {
        "ts": "2026-08-16T17:00:54.104618Z",
        "line": "Finished"
      },
      {
        "ts": "2026-08-16T17:00:54.620212Z",
        "line": "Checking for configuration in a Wrangler configuration file (BETA)"
      },
      {
        "ts": "2026-08-16T17:00:54.620587Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:00:54.746217Z",
        "line": "No Wrangler configuration file found. Continuing."
      },
      {
        "ts": "2026-08-16T17:00:54.746882Z",
        "line": "Note: No functions dir at /functions found. Skipping."
      },
      {
        "ts": "2026-08-16T17:00:54.747004Z",
        "line": "Validating asset output directory"
      },
      {
        "ts": "2026-08-16T17:00:56.003837Z",
        "line": "Deploying your site to Cloudflare's global network..."
      },
      {
        "ts": "2026-08-16T17:01:00.724251Z",
        "line": "Uploading... (27/280)"
      },
      {
        "ts": "2026-08-16T17:01:01.721691Z",
        "line": "Uploading... (111/280)"
      },
      {
        "ts": "2026-08-16T17:01:01.792348Z",
        "line": "Uploading... (195/280)"
      },
      {
        "ts": "2026-08-16T17:01:01.886544Z",
        "line": "Uploading... (280/280)"
      },
      {
        "ts": "2026-08-16T17:01:01.887051Z",
        "line": "Γ£¿ Success! Uploaded 253 files (27 already uploaded) (1.81 sec)"
      },
      {
        "ts": "2026-08-16T17:01:01.887158Z",
        "line": ""
      },
      {
        "ts": "2026-08-16T17:01:02.56835Z",
        "line": "Γ£¿ Upload complete!"
      },
      {
        "ts": "2026-08-16T17:01:04.060762Z",
        "line": "Success: Assets published!"
      },
      {
        "ts": "2026-08-16T17:01:04.979419Z",
        "line": "Success: Your site was deployed!"
      }
    ]
  },
  "success": true,
  "errors": [],
  "messages": []
}
```
