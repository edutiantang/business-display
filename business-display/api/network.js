export const URLTypes = {
  MINIPROGRAM: 'miniprogram',
};

const baseURL = {
  [URLTypes.MINIPROGRAM]: "https://example.com",
};

export const buildURL = (url, urlType) => `${baseURL[urlType]}${url}`;

export const fetch = (url, options = {}) => {

  const {
    method = 'GET',
    dataType = 'json',
    header = {},
    data = {},
    showLoading = false,
  } = options;

  const sessionId = wx.getStorageSync('sessionId');
  const finalOpts = {
    url: url,
    method: options.method,
    dataType: options.dataType,
    header: Object.assign({}, {
      'SessionId': `${sessionId}`,
    }, options.header),
    data: options.data || null,
  };

  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      // 请求完成
      finalOpts.complete = () => wx.hideLoading();
    }

    // 成功的处理
    finalOpts.success = (response) => {
      if (response.statusCode === 200) {
        if (response.data.code !== 0) {
          wx.showModal({
            content: response.data.message || '由于网络或其它原因导致系统异常，请检查后重试',
            showCancel: false,
            confirmText: '确定'
          })
          reject(response.data);
        }
        resolve(response.data);
      } else if (response.statusCode === 401) {
        GetSessionId().then(() => {
          const sessionId = wx.getStorageSync('sessionId');
          options.header = {
            SessionId: sessionId
          }
          fetch(url, options).then((resp) => resolve(resp))
            .catch((resp) => reject(resp))
        }).catch((resp) => reject(resp))
      } else {
        wx.showModal({
          content: response.data.message || '由于网络或其它原因导致系统异常，请检查后重试',
          showCancel: false,
          confirmText: '确定'
        })
        reject(response.data);
      }

    };

    //失败处理
    finalOpts.fail = (error) => {
      wx.showModal({
        content: '由于网络或其它原因导致系统异常，请检查后重试',
        showCancel: false,
        confirmText: '确定'
      })
      reject(error);
    };

    wx.request(finalOpts);
  });
};

export const GetSessionId = () => {
  const url = buildURL('/login', URLTypes.MINIPROGRAM);
  wx.clearStorageSync('sessionId');
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('code: ' + res.code);
          //发起网络请求
          return fetch(url, {
            method: 'POST',
            showLoading: false,
            data: {
              weixinCode: res.code
            },
          }).then((response) => getSessionIdSuccess(response).then(response => resolve())).catch(error => reject(error));
        } else {
          reject(res)
        }
      },
      fail: function (error) {
        reject(error)
      }
    });
  })
};

function getSessionIdSuccess(response) {
  return new Promise((resolve, reject) => {
    if (response.sessionId) {
      wx.setStorageSync('sessionId', response.sessionId);
      console.log('sessionId: ' + response.sessionId);
      resolve();
    } else {
      wx.clearStorageSync('sessionId');
      reject(response);
    }
  })
}