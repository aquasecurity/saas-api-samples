# SaaS API Samples for Aqua



# Table of Contents

- [Python samples](#python-samples)
- [JavaScript samples](#javascript-samples)
- [Ruby samples](#ruby-samples)

## Python samples

```
cd sample-python
```

### Using virtual env

Create a virtual environment (if you prefer) and install the libs

```
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt

python3 post_terraform_folder.py | jq
python3 post_yaml_cloudformation_python3.py | jq
python3 realtime_scan_p3.py 
python3 scan_details_p3.py
python3 scan_list_p3_params.py

```

## Javascript samples

```
cd sample-js
```

## Ruby samples

```
cd sample-ruby
```

### Install gems


```
bundle
```

### Add API key and secret

Create `.env` file for local environment variables.

```
cp sample.env .env
```

Edit `.env`.

```
vi .env
```

Update `API_KEY` and `API_SECRET` values.

```
API_KEY=api-key-123
API_SECRET=api-secret-456
```

### Run example

The `tests.rb` example will query all current plugins from the API endpoint and return a JSON object.

```
ruby tests.rb
```
