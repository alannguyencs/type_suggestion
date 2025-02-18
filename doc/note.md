## Activate virtual environment
```
python -m venv ./venv/
source venv/bin/activate
```

# Pre-commit setup
```
pre-commit clean
git add .pre-commit-config.yaml
pre-commit install
pre-commit run --all-files
```

## To export environment variables from a .env file
```
Linux: eval $(grep -v '^#' .env | xargs -d'\n' -n1 echo export)
Mac OS: eval $(grep -v '^#' .env | xargs -0 -L1 echo export)
```

