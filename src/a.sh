versions=$(jq '.versions[].version' appcast.json)
if [ -z "$versions" ]; then
    versions="0.0.0"
fi
max_version=$(echo "$versions" | sort -rV | head -n1)
max_version=$(echo "$max_version" | sed 's/"//g')
# 分割版本号为主、次、修订三个部分
IFS='.' read -r -a version_parts <<<"$max_version"
major="${version_parts[0]}"
minor="${version_parts[1]}"
patch="${version_parts[2]}"

# 增加修订版本号
patch=$((patch + 1))

# 如果修订版本号超过9，则次版本号加一，并将修订版本号重置为0
if [ "$patch" -gt 9 ]; then
    minor=$((minor + 1))
    patch=0
fi

# 拼接新版本号
new_version="$major.$minor.$patch"