---
showHero: true
---

<section class="hero">
  <h1>{{ site.title }}</h1>
  <p>{{ site.description }}</p>
</section>

<div class="grid two">
  <div class="card-box">
    <h2>VC WG Test Suites</h2>
    <ul class="link-list">
      {%- assign wg_specs = results.specsByGroup | where: 'group', 'w3c' -%}
      {%- for report in wg_specs -%}
      <li><a href="/reports/{{ report.shortName | slugify }}">{{ report.title }}</a></li>
      {%- endfor -%}
    </ul>
  </div>
  <div class="card-box">
    <h2>CCG Test Suites</h2>
    <ul class="link-list">
      {%- assign ccg_specs = results.specsByGroup | where: 'group', 'w3c-ccg' -%}
      {%- for report in ccg_specs -%}
      <li><a href="/reports/{{ report.shortName | slugify }}">{{ report.title }}</a></li>
      {%- endfor -%}
    </ul>
  </div>
  <div>
    {%- assign passingIssuers = results.companiesByTestType.Issuer | where_exp: "tests", "tests.passed > 0" -%}
    {%- include "components/ScoreList.html"
      limit: 100
      listTitle: "Issuers"
      buttonLink: "/issuers"
      buttonText: "View all"
      tooltip: "Sorted by most tests passed"
      itemList: passingIssuers -%}
  </div>
  <div>
    {%- assign passingVerifiers = results.companiesByTestType.Verifier | where_exp: "tests", "tests.passed > 0" -%}
    {%- include "components/ScoreList.html"
      limit: 100
      listTitle: "Verifiers"
      buttonText: "View all"
      buttonLink: "/verifiers"
      tooltip: "Sorted by most tests passed"
      itemList: passingVerifiers -%}
  </div>
</div>

<!--
<div class="grid one">
  {% include "components/TestSuiteList.html" %}
</div>
-->
