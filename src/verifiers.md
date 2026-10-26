---
title: Verifiers
---
<div class="grid one">
  {%- assign passingVerifiers = results.companiesByTestType.Verifier | where_exp: "tests", "tests.passed > 0" -%}
  {%
    include "components/ScoreList.html"
      limit: 100
      listTitle: "All Verifier Scores"
      tooltip: "Sorted by most tests passed"
      itemList: passingVerifiers
  %}
</div>
