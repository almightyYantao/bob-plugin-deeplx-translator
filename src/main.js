var lang = require("./lang.js");

function supportLanguages() {
  return lang.supportedLanguages.map(([standardLang]) => standardLang);
}

/**
 * 入口函数
 * @param {*} query
 * @param {*} completion
 */
function translate(query, completion) {
  if ($option.apiMenu == 1) {
    if ($option.key) {
      send(query, "https://api.deeplx.org/" + $option.key + "/translate").then(
        (resp) => {
          if (resp.data.alternatives) {
            alternativesString = resp.data.alternatives.join("\n");
          }
          success(query, [resp.data.data], alternativesString, completion);
        }
      );
    } else {
      completion({
        error: {
          type: "secretKey",
          message: "配置错误 - 请确保您在插件配置中填入了正确的 API Keys",
          addition: "请在插件配置中填写正确的 API Keys",
        },
      });
    }
  } else {
    if ($option.customUrl) {
      send(query, $option.customUrl).then((resp) => {
        if (resp.data.alternatives) {
          alternativesString = resp.data.alternatives.join("\n");
        }
        success(query, [resp.data.data], alternativesString, completion);
      });
    } else {
      completion({
        error: {
          type: "param",
          message: "配置错误 - 你设置了自定义API，但未设置API地址",
          addition: "请在插件配置中填写正确的API地址",
        },
      });
    }
  }
}

/**
 * 发送请求
 * @param {*} query
 * @param {*} url
 * @returns
 */
function send(query, url) {
  return $http.request({
    method: "POST",
    url: url,
    header: {
      "Content-Type": "application/json",
    },
    body: {
      text: query.text,
      source_lang: lang.langMap.get(query.detectFrom),
      target_lang: lang.langMap.get(query.detectTo),
    },
  });
}

/**
 * 最终输出
 * @param {*} query
 * @param {*} result
 * @param {*} alternativesString
 * @param {*} completion
 */
function success(query, result, alternativesString, completion) {
  const resultJson = {
    from: query.detectFrom,
    to: query.detectTo,
    fromParagraphs: [query.text],
    toParagraphs: result,
  };
  if ($option.alternatives == 1) {
    resultJson.toDict = {
      additions: [
        {
          name: "Alternatives",
          value: alternativesString,
        },
      ],
    };
  }
  completion({
    result: resultJson,
  });
}
