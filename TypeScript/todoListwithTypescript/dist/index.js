"use strict";
const btn = document.getElementById('btn'); // type comes from tsconfig lib:[] , default changes depends on target and ! is Non-Null Assertion Operator
const input = document.getElementById('input'); // type assertion
const form = document.querySelector('form'); // if you write element name directly typeScript can recognize correct type without type assertion
form.addEventListener('submit', function (e) {
    e.preventDefault(); // according to context typeScript can determine type of event
});
