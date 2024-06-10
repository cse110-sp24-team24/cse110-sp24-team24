# ADR - JSDocs Automation in CI/CD Pipeline

## Context and Problem Statement

We want to use [JSDocs](https://jsdoc.app/) to add documentation comments throughout our code, then automatically document our classes, methods, method parameters, etc in an HTML website.
This will help us make documentation current and accessible to everyone on and outside of the team and increases the bus factor.
We need to determine how we will use JSDocs in our CI/CD automation pipeline.

## Considered Options

**JSDocs documentation generation via automation**:

As per the CI/CD assignment and our [previous ADR](./adrs/050924-CICD-Pipeline.md), we wanted to automate JSDocs in our CI/CD pipeline.
We wanted to create a status checks to our GitHub actions that will automatically create or update our JSDocs as we push the code to main.

**Not moving forward with JSDocs automation**:

- There's a lot of setup and complexity that our team is not 100% familiar with
- We would need to setup an SSH deploy key in GitHub Secrets and GitHub Actions. Our team leader Cynthia owns the repo and only she can do this
- We don't feel like this is necessary anymore, as we have other working components to our CI/CD pipeline such as linting/code style enforcement, automated unit testing, etc

**Using JSDocs _locally_**:

We will not automate JSDocs in our pipeline. However, the team has agreed to use JSDocs locally and add JSDocs descriptions and info to our code.
We will add comments on what our functions do and why, specify the data types of our parameters and return value, add a note if we return a null or undefined value, etc.
The team understands that we don't need to adhere to the documentation super tightly, but having documentation will help us understand our code over time a lot easier.

## Decision Outcome

**GitHub Actions JSDoc Automation**:

Our team decided to return to set up JSDoc Automation using the GitHub Actions workflow. Despite [previous ADR](./adrs/051524-JSDocs.md) and our reasoning we found manually creating documentation was work and time that can be saved through the workflow. Using this [reference](https://github.com/marketplace/actions/jsdoc-action), we set up the workflow `JSDocs_automation.yml` which automatically documents our classes, methods, method parameters, etc in an HTML website. This HTML website can be found in the branch `gh-pages`.
