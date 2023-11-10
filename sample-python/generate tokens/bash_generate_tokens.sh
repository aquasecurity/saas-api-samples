#!/bin/bash
### Variables ###
export api_key=''
export api_secret=''
export url='https://api.cloudsploit.com'
# https://www.jvt.me/posts/2019/06/13/pretty-printing-jwt-openssl/
function jwt() {
  for part in 2; do
    b64="$(cut -f$part -d. <<< "$1" | tr '_-' '/+')"
    len=${#b64}
    n=$((len % 4))
    if [[ 2 -eq n ]]; then
      b64="${b64}=="
    elif [[ 3 -eq n ]]; then
      b64="${b64}="
    fi
    d="$(openssl enc -base64 -d -A <<< "$b64")"
    echo "$d"
    # don't decode further if this is an encrypted JWT (JWE)
    if [[ 1 -eq part ]] && grep '"enc":' <<< "$d" >/dev/null ; then
        exit 0
    fi
  done
}
function get_token {
  export timestamp=`date -u +%s`"000"
  export path='/v2/tokens'
  export method='POST'
  export payload='{"validity": 240, "allowed_endpoints": ["ANY"], "csp_roles": ["Admin"]}'
  export payload_sig=`echo -e "$payload" | tr -d " "`
  export string="$timestamp""$method""$path""$payload_sig"
  export sig=`echo -n -e "$string" | openssl dgst -sha256 -hmac $api_secret | sed 's/SHA2-256(stdin)= //')`
  export response=`curl -s --request POST \
      --header "content-type: application/json" \
      --header "x-api-key: $api_key" \
      --header "x-signature: $sig" \
      --header "x-timestamp: $timestamp" \
      --data "$payload" \
  "$url""$path"`
  export token=`echo $response | jq -r ".data"`
  echo $token
}
# get_token

function get_license {
  export AUTH_TOKEN=`get_token`
  export timestamp=`date -u +%s`"000"
  export path='/v2/users'
  export method='GET'
  export aqua_tenant_url=`jwt "$AUTH_TOKEN" | jq -r ".csp_metadata.urls.ese_url"`
#   echo $license_url
  export response=`curl -s --request GET \
      --header "content-type: application/json" \
      --header "authorization: Bearer $AUTH_TOKEN" \
  "https://$aqua_tenant_url""/api""$path"`
  echo $response
}

get_license | jq
