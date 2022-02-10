# SaaS API Samples for Aqua



# Table of Contents

- [Python samples](#python-samples)
- [JavaScript samples](#javascript-samples)
- [Ruby samples](#ruby-samples)

## Python samples

```
cd sample-python
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
