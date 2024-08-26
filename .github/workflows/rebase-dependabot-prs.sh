#!/bin/bash

# Get the repository URL
REPO_URL=$(git config --get remote.origin.url)

# Determine the shell in use
if [ -n "$BASH_VERSION" ]; then
    SHELL_TYPE="bash"
elif [ -n "$ZSH_VERSION" ]; then
    SHELL_TYPE="zsh"
else
    echo "Unsupported shell. Please use bash or zsh."
    exit 1
fi

# Extract the owner and repo from the URL depending on shell type
if [[ $REPO_URL =~ ^https://github.com/([^/]+)/([^/]+)(\.git)?$ ]]; then
    if [ "$SHELL_TYPE" = "bash" ]; then
        OWNER=${BASH_REMATCH[1]}
        REPO=${BASH_REMATCH[2]}
    elif [ "$SHELL_TYPE" = "zsh" ]; then
        OWNER=${match[1]}
        REPO=${match[2]}
    fi
elif [[ $REPO_URL =~ ^git@github.com:([^/]+)/([^/]+)(\.git)?$ ]]; then
    if [ "$SHELL_TYPE" = "bash" ]; then
        OWNER=${BASH_REMATCH[1]}
        REPO=${BASH_REMATCH[2]}
    elif [ "$SHELL_TYPE" = "zsh" ]; then
        OWNER=${match[1]}
        REPO=${match[2]}
    fi
else
    echo "Failed to extract owner and repo from remote URL: $REPO_URL"
    exit 1
fi

# Remove .git suffix if present
REPO=${REPO%.git}

# Ensure the values are correctly extracted
if [ -z "$OWNER" ] || [ -z "$REPO" ]; then
    echo "Failed to extract owner and repo correctly. Owner: $OWNER, Repo: $REPO"
    exit 1
fi

# Define the label to filter PRs
LABEL="dependencies"

# Rebase dependabot PRs with specified label and comment on it
gh pr list \
    --repo "$OWNER/$REPO" \
    --state open \
    --label "$LABEL" \
    --json url \
    --jq '.[] | .url' |
    while read -r URL; do
        echo "Commenting on $URL"
        gh pr comment "$URL" -b "@dependabot rebase"
    done
