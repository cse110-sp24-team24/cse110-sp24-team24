# ADR - CI/CD Pipeline Tools

## Context and Problem Statement

We need a CI/CD pipeline to manage any changes as we build and test code. Before staging any changes to the main branch, we want to evaluate the code against our testing checks in GitHub actions. 
We need to determine which tools to implement in our GitHub actions and CI/CD pipeline.

## Considered Options

* Linting and code style enforcement (may happen in pipeline and/or in editor)
* Code quality via tool  (ex. Codeclimate, Codacy, etc.)
* Code quality via human review (ex. Pull Requests)
* Unit tests via automation (ex. Jest, Tape, Ava, Cypress, Mocha/Chai, etc.)
* Documentation generation via automation (ex. JSDocs)
* Other testing including e2e (end to end) and pixel testing is also possible so you may decide to use an environment that does numerous things.

## Decision Outcome

**Chosen option 1**: Linting and code style enforcement -- ESLint, Prettier, and in pipeline

This is a tool that some team members are familiar with, and this will help us maintain clean coding and proper syntax. 
We will use ESLint and Prettier in our local editors, and in our pipeline via `lint-check.yaml` before pushing code to main.

**Chosen option 2**: Unit Testing via automation -- Jest

We will practice what we learned in the Lab assignments to run Jest tests. This will help us verify that our code is functioning as expected. 
We will run the automated tests during development and before pushing the code to main.

**Chosen option 3**: E2E Testing -- Puppeteer

Same as the chosen option 2, we will practice what we learned in the Lab assignments to run Puppeteer tests. This will help us verify that the front-end of our applications is functioning as expected. 
We will run the automated tests during development and before pushing the code to main.

**Chosen option 4**: Documentation generation via automation -- JSDocs

We will add documentation comments throughout our code, then automatically document our classes, methods, method parameters, etc in an HTML website. 
We will use JSDocs in our local editors, and add status checks to our GitHub actions that will create or update our JSDocs as we push the code to main.

**Chosen option 5**: Code quality via human review -- branch protection and pull requests

We will use branch protection to set requirements for any pushes to the branch, and require that our branch passes the status checks. 
In our pull requests, we will require 2 manual reviews from people not in your direct team before we can merge the changes.
