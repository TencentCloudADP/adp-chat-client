# Contributing Guide

Thank you for your interest in and support of the **adp-chat-client** project! We welcome all forms of contribution, including submitting Issues to report problems, proposing feature requests, or submitting code improvements via Pull Requests. Please read the following guide carefully to ensure your contribution can be efficiently reviewed.

## Table of Contents

* [Issue Submission](#issue-submission)
* [Pull Request](#pull-request)

## Issue Submission

If you encounter a bug during use, or have new feature requests or improvement ideas, feel free to let us know by submitting an Issue. Before submitting an Issue, please make sure it meets all of the following conditions:

1. It is a bug report, or a new request/ improvement suggestion
2. The problem or suggestion has not been reported by other users
3. The problem has not been fixed in the latest version

### 🐛 Bug Report Issue

Please provide the following information to help us locate the problem quickly:

1. **Problem Description**: Describe the issue concisely and clearly with details
2. **Runtime Environment**: For example: OS, device type, project version, etc.
3. **Steps to Reproduce**: Provide detailed steps to reproduce the issue
4. **Actual Behavior**: The error/problem you are currently experiencing
5. **Expected Behavior**: The correct behavior you expect
6. **Related Code** (if any): If the issue is caused by specific code, provide the relevant code snippet or error logs
7. **Related Screenshots** (recommended): Provide screenshots related to the issue.
8. **Suggested Approach** (optional): If you have a solution or improvement suggestion, you can include it here

### 📝 Feature Request Issue

Please provide the following information to help us fully assess feasibility and priority:

1. **Current Status**: What’s missing or insufficient in the current functionality
2. **Problem Description**: The inconvenience or limitation caused by the current design
3. **Expected Outcome**: The feature or improved behavior you’d like to see
4. **Suggested Approach** (optional): Technical direction or design ideas

## Pull Request

If you’re contributing code, please submit your changes via a pull request. Before submitting, ensure that:

1. There is no similar open pull request in the Pull Requests list
2. A related Issue exists (for a new feature or a bug fix)

### PR Workflow

### 1. Fork the Repository

Click the `Fork` button on our GitHub main page to create your own copy of the repository.

### 2. Clone the Repository Locally

Clone the forked repository to your local machine:

```bash
$ git clone git@github.com:TencentCloudADP/adp-chat-client.git
```

### 3. Add the Upstream remote

Connect the upstream (original) repository to your local repo:

```bash
$ git remote add upstream git@github.com:TencentCloudADP/adp-chat-client.git
```

### 4. Sync with Upstream

Keep your local repository up to date with the main repository:

```bash
$ git pull --rebase upstream main
```

### 5. Create a Branch

Avoid committing directly to main. Create a feature branch, preferably following the `dev-xxx` naming convention.

```bash
$ git checkout -b <dev-xxx>
```

### 6. Commit Code

This project follows the `Conventional Commits` specification and uses [**Commitizen**](https://commitizen-tools.github.io/commitizen/) to help generate standardized commit messages.

Please use `cz commit` to make commits, and avoid using `git commit` directly.

#### Commitizen Usage Guide

1. Choose an installation method for your environment:

   * Install in the project:

   ```bash
   # Install via pip
   pip install -U commitizen

   # Install via conda
   conda install -c conda-forge commitizen
   ```

   * Global installation:

   ```bash
   # Install via pipx
   pipx install commitizen
   pipx upgrade commitizen

   # Install via uv
   uv tool install commitizen
   uv tool upgrade commitizen

   # Install via Homebrew (macOS)
   brew install commitizen
   ```
2. After `git add`, use:

   ```bash
   $ cz commit
   ```

   > Commitizen will guide you through filling out the commit message according to the repo’s configuration. Please follow the prompts strictly.

#### Conventional Commits Format

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
(BREAKING CHANGE: )<footer>
```

#### Format Explanation

1. `Header`:

   * `<type>`: Commit type:

     * `fix`: Bug fix
     * `feat`: New feature
     * `docs`: Documentation
     * `style`: Code style
     * `refactor`: Refactor, not a fix or feature
     * `perf`: Performance optimization
     * `test`: Tests
     * `build`: Changes to the build system
     * `ci`: Changed to the config files
   * `<scope>`: the area of change, such as a module, component, or file::
     * `client`
     * `server`
     * `deploy`
     * `Makefile`
   * `<subject>`: A concise description of the change
2. `Body`: A detailed description of the motivation, specific changes, and how behavior differs from before.
3. `Footer`:

   * `BREAKING CHANGE`: List all breaking changes
   * `Issue Closing/Linking`: Use `Closes #123` or `Fixes #456` to close related Issues, and `Issue #789` to link to a related Issue

#### Example

```text
feat(server): add user login verification

- add user login API endpoint

Closes #123
```

### 7. Push Code

Push your changes to the remote repository:

```bash
$ git push origin <your-branch-name>
```

### 8. Create a Pull Request

On GitHub, go to your repository, click `New Pull Request`, select the branch you just pushed, and submit a `Pull Request` to the main repository. Make sure your `Pull Request` clearly describes what issue it solves or what new feature it adds, and references the related `Issue`.

### 9. Sync Upstream Updates

If new commits land on the upstream branch after you’ve opened your PR, please rebase your branch to keep a linear history and reduce conflicts:

```bash
# Ensure you are on your branch
$ git checkout <your-branch-name>

# Stay in sync with upstream and rebase
$ git pull --rebase upstream main

# push
$ git push --force-with-lease origin <your-branch-name>
```

Finally, please verify your PR status and confirm that the PR’s `diff` contains only your intended changes.