require 'http'
require 'openssl'
require 'base64'
require 'dotenv/load'

KEY = ENV['API_KEY']
SECRET = ENV['API_SECRET']

uri = 'https://api.cloudsploit.com'
path = '/v2/tests'
url = "#{uri}#{path}"
timestamp = (Time.now.to_f * 1000).to_i
string = "#{timestamp}GET#{path}"

signature = OpenSSL::HMAC.hexdigest('SHA256', SECRET, string)

headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-API-Key': KEY,
  'X-Signature': signature,
  'X-Timestamp': timestamp
}

res = HTTP.headers(headers).get(url).body

puts res.to_s