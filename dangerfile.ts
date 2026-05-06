import { danger, fail, warn } from 'danger'

const pr = danger.github.pr
const modifiedFiles = danger.git.modified_files
const createdFiles = danger.git.created_files
const changedFiles = [...modifiedFiles, ...createdFiles]

const lineChanges = pr.additions + pr.deletions
if (lineChanges > 500) {
  warn(
    `This PR changes ${lineChanges} lines. Consider splitting into smaller PRs for easier review.`
  )
}

const conventionalCommit =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+/
if (!conventionalCommit.test(pr.title)) {
  fail(
    `PR title "${pr.title}" must follow Conventional Commits. Example: "feat(home): add hero section"`
  )
}

const srcChanged = changedFiles.some((f) => f.startsWith('src/'))
const testChanged = changedFiles.some((f) => f.startsWith('tests/'))
if (srcChanged && !testChanged) {
  warn('Source files changed but no test files modified. Please add or update tests.')
}

for (const file of changedFiles) {
  if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.astro')) {
    const fileDiff = await danger.git.diffForFile(file)
    if (fileDiff?.added.includes('console.log')) {
      fail(`console.log found in diff of ${file}. Remove before merging.`)
    }
  }
}
