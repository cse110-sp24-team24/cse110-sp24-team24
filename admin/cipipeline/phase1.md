# CI/CD Phase 1

## Team Identification

**Team Number:** 24
<br>
**Team Name:** Computer PAWgrammers
<br>
**Team Members:**
Ishaan Kale,
Cynthia Delira,
David Choi,
Eugenie Ren,
Harsh Gurnani,
Jeffrey Lee,
Kiera Navarro,
Sarvesh Mann,
Terence Tan,
Sofia Nguyen,
Geena Limfat

## CI/CD Pipeline Status

### Unit Testing

### E2E Testing
- To ensure that user interactions will work properly in our dev journal, we implemented Puppeteer for our end-to-end testing to ensure that our tests will accurately reflect how users will engage with the application
- For now as we do not have a website set up to test it on, we have some dummy tests set up that represent future features on the dev journal that we will test
- Each future pull request should pass the tests before being merged into main
### Linting and Code Style

### Documentation Generation via automation
- For easy access to documentation for all JS methods so that our team is on the same page, we are attempting to automate generating a site which renders from JSDocs.
- For now, we are able to generate locally, but we would like to have the site update each time there is a merge/push to ```main```.
- We are trying to integrate this automation with Github Actions.
### Code Quality via human review
- Our branch structure is comprised of 3 phases of development for which changes in the code will have to be reviewed at least twice before being pushed to our main branch. Our branches are organized as follows: changes are made in each of the sub-team branches, approved changes in each team move forward into the `develop` branch, and any finalized changes are pushed into the `main` branch.
- We anticipate having 3 sub-teams and thus have set up their respective branches for those sub-teams to work on: `electron-fs`, `api-struct`, `edit-text`.
- To enforce human review, branch protection rules will be implemented in the `main`, `develop`, and sub-team branches to ensure the code is reviewed before merging.
  - For sub-team branches, each team should implement the use of pull requests before merging to their team branch to ensure other members review the code.
  - For the `develop` branch, each pull-request from a sub-team will require approval/review from at least 2 team members not in their sub-team to ensure other members from other than the same team have a chance to review and give feedback.
  - For the main branch, the branch will be protected through pull requests along with requiring approval/review from at least 5 team members when changes are pushed from `develop` to `main`. We only anticipate finalized changes to be pushed to this branch, so we expect this process to only be necessary within the last couple of weeks.
