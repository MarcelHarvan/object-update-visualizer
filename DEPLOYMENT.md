
# Deploying to GitHub Pages

This project is configured to be deployed to GitHub Pages.

## Automated Deployment

To deploy the project to GitHub Pages:

1. Make sure all your changes are committed to the repository
2. Run the following command:

```bash
npm run build
npx gh-pages -d dist
```

This will:
- Build the project
- Push the contents of the `dist` folder to the `gh-pages` branch of your repository

3. Your site will be available at: `https://craftsman-code.github.io/object-updater-web/`

## Manual Deployment

If you prefer to deploy manually, you can use the provided deploy script:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Troubleshooting

- If you encounter permission issues with the deploy script, make sure it's executable: `chmod +x deploy.sh`
- If you're using Windows, you might need to use Git Bash or WSL to run the deploy script
- Make sure you have the correct repository URL in the deploy script

## Note on Routing

This project uses HashRouter for compatibility with GitHub Pages. This means all your routes will have a `#` in them, for example: `https://craftsman-code.github.io/object-updater-web/#/about`
