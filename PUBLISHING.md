# Publishing Guide

This guide explains how to publish the datadome-de-encoder package to npm.

## Prerequisites

1. **npm account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **npm authentication**: Log in to npm on your machine
   ```bash
   npm login
   ```
3. **GitHub repository access**: You need write access to this repository
4. **npm token for CI/CD**: For automated publishing via GitHub Actions

## Manual Publishing

### Step 1: Update Version

Update the version in `package.json` following [Semantic Versioning](https://semver.org/):

```bash
# For patch version (bug fixes): 1.0.0 -> 1.0.1
npm version patch

# For minor version (new features): 1.0.0 -> 1.1.0
npm version minor

# For major version (breaking changes): 1.0.0 -> 2.0.0
npm version major
```

This will:
- Update version in package.json
- Create a git tag
- Commit the changes

### Step 2: Update CHANGELOG.md

Add an entry for the new version in CHANGELOG.md with:
- Version number and date
- List of changes (Added, Changed, Deprecated, Removed, Fixed, Security)

Example:
```markdown
## [1.0.1] - 2025-11-03

### Fixed
- Bug fix description

### Added
- New feature description
```

### Step 3: Validate the Package

Run the validation script to ensure everything is correct:

```bash
npm run validate
```

This will:
- Show what files will be included in the package
- Verify package.json configuration
- Display package metadata

### Step 4: Test the Package

Run the test script to ensure functionality:

```bash
npm test
```

### Step 5: Publish to npm

Publish the package to npm:

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages or first-time publishing.

### Step 6: Push to GitHub

Push the version tag and changes to GitHub:

```bash
git push origin main --tags
```

### Step 7: Create GitHub Release

1. Go to [GitHub Releases](https://github.com/Lumbijumbi/Datadome-de_encoder/releases)
2. Click "Draft a new release"
3. Choose the tag you just created
4. Add release notes (copy from CHANGELOG.md)
5. Publish the release

## Automated Publishing (Recommended)

### Setup

1. **Create npm token**:
   - Go to [npmjs.com](https://www.npmjs.com/)
   - Click on your profile → Access Tokens → Generate New Token
   - Choose "Automation" type
   - Copy the token

2. **Add token to GitHub Secrets**:
   - Go to your repository settings
   - Navigate to Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

### Automatic Publishing on Release

The repository is configured to automatically publish to npm when you create a GitHub release:

1. Update version: `npm version [patch|minor|major]`
2. Update CHANGELOG.md
3. Commit and push changes: `git push origin main --tags`
4. Create a GitHub release for the new tag
5. GitHub Actions will automatically publish to npm

The workflow file is located at `.github/workflows/npm-publish.yml`

### Manual Trigger

You can also manually trigger the publish workflow:

1. Go to Actions tab in GitHub
2. Select "Publish to npm" workflow
3. Click "Run workflow"
4. Optionally specify a version

## Verification

After publishing, verify the package:

1. **Check npm registry**:
   ```bash
   npm view datadome-de-encoder
   ```

2. **Test installation**:
   ```bash
   mkdir test-install
   cd test-install
   npm init -y
   npm install datadome-de-encoder
   node -e "const {DataDomeEncryptor} = require('datadome-de-encoder'); console.log('✓ Package installed successfully');"
   ```

3. **Check npm package page**: Visit [npmjs.com/package/datadome-de-encoder](https://www.npmjs.com/package/datadome-de-encoder)

## Troubleshooting

### Publishing Fails

- **Authentication error**: Run `npm login` again
- **Version already exists**: Increment the version number
- **Permission denied**: Ensure you have publish rights to the package

### Package Not Found After Publishing

- Wait a few minutes for npm CDN to propagate
- Clear npm cache: `npm cache clean --force`
- Try installing with specific version: `npm install datadome-de-encoder@1.0.0`

### Wrong Files in Package

- Check `.npmignore` and `files` field in package.json
- Run `npm pack --dry-run` to preview included files
- Ensure you're not including unnecessary files

## Best Practices

1. **Always test before publishing**: Run `npm test` and `npm run validate`
2. **Follow semantic versioning**: Use appropriate version bumps
3. **Update CHANGELOG.md**: Keep users informed of changes
4. **Create GitHub releases**: Provide release notes for each version
5. **Use provenance**: The workflow includes `--provenance` flag for better security
6. **Test installation**: Install the package in a clean environment after publishing

## Support

For issues with publishing, contact:
- Package author: mxo23 (Discord)
- GitHub Issues: [https://github.com/Lumbijumbi/Datadome-de_encoder/issues](https://github.com/Lumbijumbi/Datadome-de_encoder/issues)
